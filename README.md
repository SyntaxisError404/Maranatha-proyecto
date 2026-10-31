# Maranatha Kids — Portal de Control de Asistencia e Integración Escolar

Sistema de gestión, control de asistencia e integración escolar para la **Iglesia Maranatha Venezuela**. Permite registrar la entrada de los niños a las distintas áreas de aprendizaje mediante escaneo de códigos QR y entrada manual, coordinar la logística de cocina y la distribución de salones, y llevar estadísticas de asistencia por servicio.

---

## Stack Tecnológico

- **Frontend:** React 19 + Vite 6 (PWA instalable, con carga diferida de rutas)
- **Estilos:** TailwindCSS v4 (con tema de marca en `@theme`)
- **Ruteo:** React Router (HashRouter, compatible con GitHub Pages)
- **Backend / BD:** Supabase (PostgreSQL)
- **Pruebas:** Vitest + Testing Library
- **Extras:** `framer-motion`, `lucide-react`, `html5-qrcode`, `sonner`

---

## Guía de Inicio Rápido

### Requisitos Previos
- **Node.js** v18 o superior
- **npm**

### Instalación y Ejecución del Frontend

```bash
# Desde la raíz del repositorio
cd frontend
npm install
```

Configura las variables de entorno duplicando `.env.example` como `.env`:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

> **Modo demo / offline:** si no configuras las credenciales de Supabase, la app muestra una advertencia en consola pero sigue funcionando. Usa el botón **"Acceso Rápido Demo (Offline)"** en el login para explorar la interfaz con datos simulados. En este modo, el Servicio Dominical se guarda en el **almacenamiento local del navegador**.

### Scripts disponibles (desde `frontend/`)

| Script | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el código |
| `npm test` | Ejecuta las pruebas con Vitest |
| `npm run test:watch` | Pruebas en modo observación |

> También puedes usar los mismos scripts desde la raíz del repositorio (`npm run dev`, `npm run build`, etc.), que delegan al frontend.

---

## Base de Datos (Supabase)

Los scripts SQL están en la carpeta [`database/`](database). Ejecútalos en el **SQL Editor** de Supabase, **en este orden**:

1. [`schema.sql`](database/schema.sql) — tablas, vistas, índices y Row Level Security.
2. [`functions.sql`](database/functions.sql) — triggers (`updated_at`) y recálculo automático de totales.
3. [`seed.sql`](database/seed.sql) — datos iniciales: salones y los servidores del ministerio.

Tablas principales: `servidores`, `salones`, `servicios`, `servicio_detalles` (snapshot JSON), `conteo_ninos`, `asistencia_servidores`.

---

## Estructura del Proyecto

```
frontend/src/
├── components/
│   ├── ui/                 → Button, Input, Skeleton (átomos reutilizables)
│   ├── AsistenciaSeccion.jsx
│   ├── AsistenciaLogistica.jsx
│   ├── EstadisticasServicio.jsx
│   ├── Layout.jsx          → Sidebar + topbar (contenedor de rutas protegidas)
│   ├── ProtectedRoute.jsx
│   ├── OfflineBanner.jsx
│   └── QrScanner.jsx
├── context/AuthContext.jsx → sesión Supabase + usuario demo
├── hooks/
│   ├── useAsistencia.js     → estado del servicio + persistencia + guardado
│   ├── useLogistica.js      → cálculo de raciones de cocina
│   └── useDebounce.js
├── pages/
│   ├── Dashboard.jsx        → panel de inicio (accesos rápidos)
│   ├── ServicioDominical.jsx→ registro de asistencia y conteo
│   ├── Servidores.jsx       → CRUD de voluntarios
│   ├── Salones.jsx          → distribución de niños por salón
│   ├── Cocina.jsx           → raciones de meriendas por sección
│   ├── Estadisticas.jsx     → historial de domingos
│   ├── Configuracion.jsx
│   └── Login.jsx
├── services/supabaseClient.js
├── utils/formatters.js      → fechas, nombres, cédulas, números
├── data/mockData.js         → servidores y salones de ejemplo
└── index.css                → tema de marca (@theme) + estilos
```

### Rutas de la aplicación

| Ruta | Página |
| :--- | :--- |
| `/login` | Inicio de sesión |
| `/panel` | Dashboard |
| `/servicio` | Servicio Dominical (registro) |
| `/checkin` | Check-in de servidores por QR |
| `/servidores` | Gestión de servidores |
| `/salones` | Distribución de salones |
| `/cocina` | Cocina y logística |
| `/estadisticas` | Historial de estadísticas |
| `/configuracion` | Configuración |

---

## Guía de Diseño y UI

Para mantener la consistencia estética (todo el sistema usa un **tema claro**):

1. **Usa las variables y utilidades de marca** definidas en el `@theme` de [`index.css`](frontend/src/index.css):
   - `var(--color-maranatha-blue)` / clase `bg-maranatha-blue` / `text-maranatha-blue` (azul oficial)
   - `var(--color-kids-green)` / clase `bg-kids-green` (verde)
   - `bg-slate-50`, `bg-white`, `border-slate-200` para estructuras limpias.
   - **Evita** clases de tema oscuro (`text-white`, `text-gray-300/400`) sobre tarjetas blancas.
2. **Reutiliza las clases de componentes** ya definidas: `.maranatha-card`, `.maranatha-btn-primary`, `.maranatha-input`, `.admin-table`, `.page-header`, `.page-title`, `.stat-card`.
3. **Enfoque Mobile-First:** la asistencia se registra mayormente desde teléfonos de los coordinadores.

---

## Pruebas e Integración Continua

- **Pruebas unitarias/componentes** con Vitest + Testing Library (`npm test`), en archivos `*.test.js(x)` junto al código que prueban.
- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): en cada push y pull request ejecuta `lint`, `test` y `build`.

---

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publica automáticamente en **GitHub Pages** al hacer push a `main`/`master`. Define los *secrets* `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la configuración del repositorio para que el build de producción se conecte a Supabase.

La app es una **PWA instalable** (`vite-plugin-pwa`): se puede "Agregar a la pantalla de inicio" en el teléfono y los recursos quedan cacheados para uso con conexión intermitente.
