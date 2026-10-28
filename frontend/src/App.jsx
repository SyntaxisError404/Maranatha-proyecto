import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Servidores } from "./pages/Servidores";
import { ServicioDominical } from "./pages/ServicioDominical";
import { Estadisticas } from "./pages/Estadisticas";
import { Configuracion } from './pages/Configuracion';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  return (
    <AuthProvider>
      <OfflineBanner />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with Layout */}
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/servidores"
            element={
              <ProtectedRoute>
                <Layout>
                  <Servidores />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicio"
            element={
              <ProtectedRoute>
                <Layout>
                  <ServicioDominical />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/estadisticas"
            element={
              <ProtectedRoute>
                <Layout>
                  <Estadisticas />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Layout>
                  <Configuracion />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/dashboard" element={<Navigate to="/panel" replace />} />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
