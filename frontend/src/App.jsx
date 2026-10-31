import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { OfflineBanner } from './components/OfflineBanner';

// Carga diferida de las páginas para reducir el bundle inicial
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Servidores = lazy(() => import('./pages/Servidores').then((m) => ({ default: m.Servidores })));
const ServicioDominical = lazy(() => import('./pages/ServicioDominical').then((m) => ({ default: m.ServicioDominical })));
const Estadisticas = lazy(() => import('./pages/Estadisticas').then((m) => ({ default: m.Estadisticas })));
const Configuracion = lazy(() => import('./pages/Configuracion').then((m) => ({ default: m.Configuracion })));
const Salones = lazy(() => import('./pages/Salones').then((m) => ({ default: m.Salones })));
const Cocina = lazy(() => import('./pages/Cocina').then((m) => ({ default: m.Cocina })));

const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0a4693] border-t-transparent" />
      <p className="font-medium text-slate-500 animate-pulse">Cargando...</p>
    </div>
  </div>
);

// Envuelve una página protegida con su Layout y el Suspense de carga diferida
const Protected = ({ children }) => (
  <ProtectedRoute>
    <Layout>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
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
            element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            }
          />

          {/* Rutas protegidas */}
          <Route path="/panel" element={<Protected><Dashboard /></Protected>} />
          <Route path="/servidores" element={<Protected><Servidores /></Protected>} />
          <Route path="/servicio" element={<Protected><ServicioDominical /></Protected>} />
          <Route path="/salones" element={<Protected><Salones /></Protected>} />
          <Route path="/cocina" element={<Protected><Cocina /></Protected>} />
          <Route path="/estadisticas" element={<Protected><Estadisticas /></Protected>} />
          <Route path="/configuracion" element={<Protected><Configuracion /></Protected>} />

          {/* Redirecciones */}
          <Route path="/dashboard" element={<Navigate to="/panel" replace />} />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
