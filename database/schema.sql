-- ============================================================================
-- Maranatha Kids · Esquema de Base de Datos (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Estructura para el control de asistencia e integración escolar.
-- Ejecutar en el editor SQL de Supabase. Idempotente (usa IF NOT EXISTS).
-- ============================================================================

-- Extensión para generar UUIDs
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. SERVIDORES (voluntarios / staff)
-- ----------------------------------------------------------------------------
create table if not exists public.servidores (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  grupo       text not null,          -- Maternal, Infantil, Prejuvenil, Logística Operativa, etc.
  funcion     text not null default 'Servidor',  -- Capitán, Mano Derecha, Servidor, etc.
  cedula      text,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_servidores_grupo on public.servidores (grupo);
create index if not exists idx_servidores_activo on public.servidores (activo);

-- ----------------------------------------------------------------------------
-- 2. SALONES (aulas por grupo pedagógico)
-- ----------------------------------------------------------------------------
create table if not exists public.salones (
  id          text primary key,       -- 'cuna', 'sala1', 'f', 'comedor', etc.
  seccion     text not null,          -- Maternal, Infantil, Prejuvenil
  nombre      text not null,          -- 'Cuna y Gateo', 'Sala 1', ...
  clase       text,                   -- '1 AÑO', '5 AÑOS', 'RECEPCION', ...
  orden       int not null default 0
);

create index if not exists idx_salones_seccion on public.salones (seccion);

-- ----------------------------------------------------------------------------
-- 3. SERVICIOS (un registro por domingo / fecha de servicio)
-- ----------------------------------------------------------------------------
create table if not exists public.servicios (
  id                uuid primary key default gen_random_uuid(),
  fecha             date not null unique,
  total_ninos       int not null default 0,
  total_servidores  int not null default 0,
  realizado_por     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_servicios_fecha on public.servicios (fecha desc);

-- ----------------------------------------------------------------------------
-- 4. SERVICIO_DETALLES (snapshot JSON del estado completo del servicio)
--    Lo usa el hook useAsistencia para guardar/recuperar el borrador completo.
-- ----------------------------------------------------------------------------
create table if not exists public.servicio_detalles (
  servicio_id  uuid primary key references public.servicios (id) on delete cascade,
  data         jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. CONTEO_NINOS (conteo normalizado por salón, para reportería)
-- ----------------------------------------------------------------------------
create table if not exists public.conteo_ninos (
  id           uuid primary key default gen_random_uuid(),
  servicio_id  uuid not null references public.servicios (id) on delete cascade,
  salon_id     text not null,
  hembras      int not null default 0,
  varones      int not null default 0,
  cerrado      boolean not null default false,
  unique (servicio_id, salon_id)
);

create index if not exists idx_conteo_servicio on public.conteo_ninos (servicio_id);

-- ----------------------------------------------------------------------------
-- 6. ASISTENCIA_SERVIDORES (asistencia normalizada por servicio)
-- ----------------------------------------------------------------------------
create table if not exists public.asistencia_servidores (
  id           uuid primary key default gen_random_uuid(),
  servicio_id  uuid not null references public.servicios (id) on delete cascade,
  servidor_id  uuid references public.servidores (id) on delete set null,
  salon_id     text,                  -- salón (Kids) o null si es equipo de logística
  equipo       text,                  -- equipo de logística o null
  rol          text,                  -- 'M' (Maestro), 'A' (Auxiliar), 'C' (Colaborador)
  asistio      boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_asistencia_servicio on public.asistencia_servidores (servicio_id);
create index if not exists idx_asistencia_servidor on public.asistencia_servidores (servidor_id);

-- ----------------------------------------------------------------------------
-- 7. VISTA de resumen por servicio (para estadísticas)
-- ----------------------------------------------------------------------------
create or replace view public.v_resumen_servicios as
select
  s.id,
  s.fecha,
  s.total_ninos,
  s.total_servidores,
  coalesce(sum(c.hembras), 0) as total_hembras,
  coalesce(sum(c.varones), 0) as total_varones
from public.servicios s
left join public.conteo_ninos c on c.servicio_id = s.id
group by s.id, s.fecha, s.total_ninos, s.total_servidores
order by s.fecha desc;

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY
--    Herramienta interna: cualquier usuario autenticado puede leer/escribir.
--    Ajusta estas políticas si necesitas roles más granulares.
-- ----------------------------------------------------------------------------
alter table public.servidores            enable row level security;
alter table public.salones               enable row level security;
alter table public.servicios             enable row level security;
alter table public.servicio_detalles     enable row level security;
alter table public.conteo_ninos          enable row level security;
alter table public.asistencia_servidores enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'servidores', 'salones', 'servicios',
    'servicio_detalles', 'conteo_ninos', 'asistencia_servidores'
  ]
  loop
    execute format(
      'drop policy if exists "auth_all_%1$s" on public.%1$s;', t
    );
    execute format(
      'create policy "auth_all_%1$s" on public.%1$s
         for all to authenticated using (true) with check (true);', t
    );
  end loop;
end $$;
