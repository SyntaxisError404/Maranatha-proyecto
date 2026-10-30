-- ============================================================================
-- Maranatha Kids - Funciones, triggers y vistas
-- ============================================================================
-- Ejecutar DESPUÉS de schema.sql. Es idempotente.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Mantener servicios.updated_at al día
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_servicios_updated_at on servicios;
create trigger trg_servicios_updated_at
  before update on servicios
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Registrar ENTRADA de un niño por su código QR.
-- Devuelve la fila de asistencia creada. Si el QR no existe, lanza excepción.
-- Evita duplicar una entrada abierta (sin salida) para el mismo niño/servicio.
-- ----------------------------------------------------------------------------
create or replace function registrar_entrada_qr(
  p_codigo_qr   text,
  p_servicio_id uuid default null,
  p_registrado_por uuid default null
)
returns asistencia_ninos
language plpgsql
as $$
declare
  v_nino   ninos%rowtype;
  v_fila   asistencia_ninos%rowtype;
begin
  select * into v_nino from ninos where codigo_qr = p_codigo_qr and activo;
  if not found then
    raise exception 'No se encontró un niño activo con el código QR %', p_codigo_qr
      using errcode = 'no_data_found';
  end if;

  -- ¿Ya tiene una entrada abierta para este servicio?
  select * into v_fila
  from asistencia_ninos
  where nino_id = v_nino.id
    and hora_salida is null
    and (p_servicio_id is null or servicio_id is not distinct from p_servicio_id)
  limit 1;

  if found then
    return v_fila;  -- ya está adentro; devolvemos la entrada existente
  end if;

  insert into asistencia_ninos (nino_id, servicio_id, salon_id, registrado_por)
  values (v_nino.id, p_servicio_id, v_nino.salon_id, p_registrado_por)
  returning * into v_fila;

  return v_fila;
end;
$$;

-- ----------------------------------------------------------------------------
-- Registrar SALIDA (egreso) de un niño: cierra su entrada abierta.
-- ----------------------------------------------------------------------------
create or replace function marcar_salida(p_asistencia_id uuid)
returns asistencia_ninos
language plpgsql
as $$
declare
  v_fila asistencia_ninos%rowtype;
begin
  update asistencia_ninos
     set hora_salida = now()
   where id = p_asistencia_id
     and hora_salida is null
  returning * into v_fila;

  if not found then
    raise exception 'No hay una entrada abierta con id %', p_asistencia_id;
  end if;

  return v_fila;
end;
$$;

-- ----------------------------------------------------------------------------
-- VISTA: resumen por servicio (totales de niños y servidores)
-- ----------------------------------------------------------------------------
create or replace view vw_resumen_servicios as
select
  s.id                                        as servicio_id,
  s.fecha,
  coalesce(c.total_hembras, 0)                as total_hembras,
  coalesce(c.total_varones, 0)                as total_varones,
  coalesce(c.total_hembras, 0) + coalesce(c.total_varones, 0) as total_ninos,
  coalesce(a.total_servidores, 0)             as total_servidores
from servicios s
left join (
  select servicio_id,
         sum(hembras) as total_hembras,
         sum(varones) as total_varones
  from conteo_ninos
  group by servicio_id
) c on c.servicio_id = s.id
left join (
  select servicio_id, count(distinct servidor_id) as total_servidores
  from asistencia_servidores
  where asistio
  group by servicio_id
) a on a.servicio_id = s.id;

-- ----------------------------------------------------------------------------
-- VISTA: niños actualmente presentes (entrada sin salida)
-- ----------------------------------------------------------------------------
create or replace view vw_ninos_presentes as
select
  an.id            as asistencia_id,
  an.nino_id,
  n.nombre         as nino_nombre,
  an.salon_id,
  sal.nombre       as salon_nombre,
  an.servicio_id,
  an.hora_entrada
from asistencia_ninos an
join ninos n          on n.id = an.nino_id
left join salones sal on sal.id = an.salon_id
where an.hora_salida is null;
