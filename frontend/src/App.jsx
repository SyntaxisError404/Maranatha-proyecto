import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { OfflineBanner } from './components/OfflineBanner';

// Carga diferida de cada página: cada una viaja en su propio chunk y solo se
// descarga cuando se visita (clave en móvil, sobre todo el escáner QR).
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const CheckIn = lazy(() => import('./pages/CheckIn').then((m) => ({ default: m.CheckIn })));
const ServicioDominical = lazy(() => import('./pages/ServicioDominical').then((m) => ({ default: m.ServicioDominical })));
const Ninos = lazy(() => import('./pages/Ninos').then((m) => ({ default: m.Ninos })));
const Servidores = lazy(() => import('./pages/Servidores').then((m) => ({ default: m.Servidores })));
const Salones = lazy(() => import('./pages/Salones').then((m) => ({ default: m.Salones })));
const Cocina = lazy(() => import('./pages/Cocina').then((m) => ({ default: m.Cocina })));
const Estadisticas = lazy(() => import('./pages/Estadisticas').then((m) => ({ default: m.Estadisticas })));
const Configuracion = lazy(() => import('./pages/Configuracion').then((m) => ({ default: m.Configuracion })));

// Spinner mientras carga el chunk de una página
const Cargando = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid #0a4693', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Envoltura para rutas privadas: autenticación + layout + suspense del contenido
const Privada = ({ children }) => (
  <ProtectedRoute>
    <Layout>
      <Suspense fallback={<Cargando />}>{children}</Suspense>
    </Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <OfflineBanner />
      <HashRouter>
        <Routes>
          <Route
            path="/login"
            element={<Suspense fallback={<Cargando />}><Login /></Suspense>}
          />

          {/* Rutas protegidas con Layout */}
          <Route path="/panel" element={<Privada><Dashboard /></Privada>} />
          <Route path="/checkin" element={<Privada><CheckIn /></Privada>} />
          <Route path="/servicio" element={<Privada><ServicioDominical /></Privada>} />
          <Route path="/ninos" element={<Privada><Ninos /></Privada>} />
          <Route path="/servidores" element={<Privada><Servidores /></Privada>} />
          <Route path="/salones" element={<Privada><Salones /></Privada>} />
          <Route path="/cocina" element={<Privada><Cocina /></Privada>} />
          <Route path="/estadisticas" element={<Privada><Estadisticas /></Privada>} />
          <Route path="/configuracion" element={<Privada><Configuracion /></Privada>} />

          {/* Redirecciones por defecto */}
          <Route path="/dashboard" element={<Navigate to="/panel" replace />} />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
