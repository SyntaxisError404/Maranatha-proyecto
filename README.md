# Maranatha Kids - Portal de Control de Asistencia e Integración Escolar

Este es el repositorio del sistema de gestión, control de asistencia e integración escolar para la **Iglesia Maranatha Venezuela**. La aplicación permite registrar la entrada de los niños a las distintas áreas de aprendizaje mediante escaneo de códigos QR y entrada manual, además de coordinar la logística de cocina y distribución de salones.

---

## Guía de Inicio Rápido

El proyecto está estructurado con la base de datos (scripts SQL de Supabase) y la interfaz de usuario en React.

### Requisitos Previos
* **Node.js** (v18 o superior)
* **npm** o **yarn**

### Instalación y Ejecución del Frontend
1. Ve al directorio del frontend:
   ```bash
   cd maranatha/frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno duplicando el archivo `.env.example` como `.env` e ingresando tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

*Nota: Si no posees las credenciales de Supabase configuradas, la aplicación mostrará una advertencia pero te permitirá usar el botón **"Acceso Rápido Demo (Offline)"** en la pantalla de inicio de sesión para explorar la interfaz con datos simulados.*

---

## Estructura del Proyecto y Guía de Modificación

Para asegurar un desarrollo organizado, a continuación se detallan los archivos del proyecto divididos por su nivel de criticidad.

### Archivos Críticos (NO Modificar sin Coordinación)
Estos archivos contienen la lógica central de la aplicación (Autenticación, Enrutamiento, Estilos de Marca y Componentes UI Core). **Solo modifícalos si necesitas hacer cambios arquitectónicos profundos.**

| Archivo / Carpeta | Descripción | ¿Por qué es crítico? |
| :--- | :--- | :--- |
| [AuthContext.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/context/AuthContext.jsx) | Proveedor global de sesión. | Controla el login con Supabase y proporciona el mock del usuario para desarrollo offline. |
| [ProtectedRoute.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/ProtectedRoute.jsx) | Guardián de rutas privadas. | Evita que usuarios no autenticados accedan a la aplicación. |
| [supabaseClient.js](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/services/supabaseClient.js) | Cliente de Supabase. | Configura la conexión con la base de datos. Si se rompe, se cae la sincronización. |
| [App.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/App.jsx) | Enrutador principal. | Define las rutas principales del sistema (`/login`, `/dashboard`). |
| [index.css](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/index.css) | Estilos de TailwindCSS v4. | Configura los colores de marca corporativa (Azul Maranatha, Verde Kids, etc.) y clases de utilidad premium. |
| [QrScanner.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/QrScanner.jsx) | Escáner QR de cámara. | Implementa la biblioteca `html5-qrcode` con visor y guías animadas optimizadas para móviles. |
| [OfflineBanner.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/OfflineBanner.jsx) | Banner de estado de red. | Detecta si el dispositivo del coordinador pierde la conexión y lo maneja de forma elegante. |
| `src/components/ui/` | [Button.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/ui/Button.jsx), [Input.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/ui/Input.jsx), [Skeleton.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/ui/Skeleton.jsx) | Componentes atómicos comunes. Consúmelos para mantener consistencia de diseño. |

---

### Archivos en Desarrollo / Pendientes (COSAS POR TOCAR E IMPLEMENTAR)
Estos archivos han sido pre-estructurados pero están actualmente vacíos o mockeados. **Son los archivos principales donde debes escribir tu código para avanzar el proyecto.**

#### 1. Backend / Base de Datos (Supabase SQL)
En la carpeta [maranatha/database](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/database):
* **[schema.sql](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/database/schema.sql)** `[VACÍO]`: Aquí debes escribir la estructura de tablas (`ninos`, `asistencia`, `aulas`, `roles_servidores`, etc.).
* **[functions.sql](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/database/functions.sql)** `[VACÍO]`: triggers y funciones Postgres (ej. procedimiento automático para marcar egresos o actualizar estadísticas).
* **[seed.sql](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/database/seed.sql)** `[VACÍO]`: Script de carga de datos iniciales para pruebas.

#### 2. Vistas y Componentes Frontend
En la carpeta [maranatha/frontend/src](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src):
* **[Layout.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/components/Layout.jsx)** `[VACÍO]`: Debe implementarse como el contenedor común (Sidebar/Navbar + Área de Contenido) que se comparta entre todas las páginas protegidas.
* **[Dashboard.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/pages/Dashboard.jsx)** `[COMPLETO CON MOCK]`: Actualmente funciona en memoria. **Debe modificarse** para consumir datos reales de Supabase mediante los hooks.
* **[Cocina.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/pages/Cocina.jsx)** `[VACÍO]`: Interfaz para la logística de preparación y entrega de raciones de comida/refrigerios a las distintas secciones.
* **[Salones.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/pages/Salones.jsx)** `[VACÍO]`: Panel para ver la distribución en tiempo real de los niños según sus grupos pedagógicos (Semillitas, Alegres, Valientes) e interactuar con su ubicación.
* **[Servidores.jsx](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/pages/Servidores.jsx)** `[VACÍO]`: Módulo para la gestión, registro de asistencia y roles del staff de apoyo en el servicio escolar.

#### 3. Lógica y Utilidades (Hooks & Utils)
* **[useAsistencia.js](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/hooks/useAsistencia.js)** `[VACÍO]`: Hook personalizado para manejar suscripciones a cambios en la tabla de asistencia en tiempo real, mutaciones e inserciones.
* **[useLogistica.js](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/hooks/useLogistica.js)** `[VACÍO]`: Hook para la gestión de cocina, inventario de meriendas y asignación de salones.
* **[formatters.js](file:///c:/Users/Uriel/Desktop/maranatha/maranatha/frontend/src/utils/formatters.js)** `[VACÍO]`: Funciones formateadoras reutilizables (ej. formatear RUT/Cédulas, fechas, horas de entrada).

---

## Guía de Diseño y UI Premium

Para mantener la consistencia estética:
1. **Evita colores genéricos:** Utiliza las clases y variables predefinidas en el `@theme` de CSS.
   * `var(--color-maranatha-blue)` o clase `bg-maranatha-blue` (Azul oficial)
   * `var(--color-kids-green)` o clase `bg-kids-green` (Verde alegre)
   * `bg-slate-50`, `bg-white`, `border-slate-150` para estructuras limpias.
2. **Utiliza los componentes de `components/ui/`:** No uses inputs o botones planos; el botón de la UI ya cuenta con micro-animaciones en hover/active y estado de carga (`loading`).
3. **Mantén el enfoque Mobile-First:** Recuerda que la asistencia se escaneará mayormente con teléfonos móviles de los coordinadores.
