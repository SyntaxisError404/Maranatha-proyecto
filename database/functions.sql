-- ============================================================================
-- Maranatha Kids · Funciones y Triggers (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Ejecutar DESPUÉS de schema.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Mantener actualizado el campo updated_at automáticamente
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplicar el trigger a todas las tablas que tienen updated_at
do $$
declare
  t text;
begin
  foreach t in array array[
    'servidores', 'servicios', 'servicio_detalles'
  ]
  loop
    execute format('drop trigger if exists trg_updated_at on public.%I;', t);
    execute format(
      'create trigger trg_updated_at
         before update on public.%I
         for each row execute function public.set_updated_at();', t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 2. Recalcular los totales de un servicio a partir del conteo de niños
--    y de la asistencia de servidores.
-- ----------------------------------------------------------------------------
create or replace function public.recalcular_totales_servicio(p_servicio_id uuid)
returns void
language plpgsql
as $$
declare
  v_ninos int;
  v_servidores int;
begin
  select coalesce(sum(hembras + varones), 0)
    into v_ninos
    from public.conteo_ninos
   where servicio_id = p_servicio_id
     and cerrado = false;

  select count(*)
    into v_servidores
    from public.asistencia_servidores
   where servicio_id = p_servicio_id
     and asistio = true;

  update public.servicios
     set total_ninos = v_ninos,
         total_servidores = v_servidores,
         updated_at = now()
   where id = p_servicio_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. Trigger: recalcular totales cuando cambia el conteo o la asistencia
-- ----------------------------------------------------------------------------
create or replace function public.trg_recalcular_totales()
returns trigger
language plpgsql
as $$
declare
  v_id uuid;
begin
  v_id := coalesce(new.servicio_id, old.servicio_id);
  if v_id is not null then
    perform public.recalcular_totales_servicio(v_id);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_totales_conteo on public.conteo_ninos;
create trigger trg_totales_conteo
  after insert or update or delete on public.conteo_ninos
  for each row execute function public.trg_recalcular_totales();

drop trigger if exists trg_totales_asistencia on public.asistencia_servidores;
create trigger trg_totales_asistencia
  after insert or update or delete on public.asistencia_servidores
  for each row execute function public.trg_recalcular_totales();
