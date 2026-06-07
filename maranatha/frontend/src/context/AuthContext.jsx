import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener la sesión activa actual al montar el componente
    const initializeAuth = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        setSession(activeSession);
        setUser(activeSession?.user ?? null);
      } catch (error) {
        console.error('Error al inicializar la sesión de Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Suscribirse a cambios en el estado de autenticación (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Función asíncrona para inicio de sesión por correo y contraseña
  const login = async (email, password) => {
    if (!navigator.onLine) {
      const offlineError = new Error('No hay conexión a internet. Inicia sesión en modo demo offline o reconéctate.');
      return { data: null, error: offlineError };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      let friendlyMessage = error.message;
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        friendlyMessage = 'No se pudo contactar al servidor. Revisa tu red o intenta de nuevo.';
      }
      return { data: null, error: new Error(friendlyMessage) };
    } finally {
      setLoading(false);
    }
  };

  // Función asíncrona para cerrar sesión
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    login,
    logout,
    // Permite al dashboard o login mockear de forma segura un usuario si no está configurada la base de datos
    setMockUser: (mockUser) => {
      setUser(mockUser);
      setSession({ user: mockUser });
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
