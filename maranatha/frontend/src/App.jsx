import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  return (
    <AuthProvider>
      <OfflineBanner />
      <BrowserRouter>
        <Routes>
          {/* Ruta pública para inicio de sesión */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta privada protegida por el guardián */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección por defecto al panel principal */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
