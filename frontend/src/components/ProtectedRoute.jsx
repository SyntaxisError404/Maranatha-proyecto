import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner animado usando variables de color oficiales */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0a4693] border-t-transparent"></div>
          <p className="font-display font-medium text-slate-500 animate-pulse text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirige al login de manera elegante guardando la ubicación previa
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
