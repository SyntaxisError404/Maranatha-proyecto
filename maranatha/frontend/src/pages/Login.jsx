import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, AlertCircle, Heart } from 'lucide-react';

export const Login = () => {
  const { login, setMockUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir al origen si existe, o al dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message || 'Error al iniciar sesión. Verifica tus datos.');
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  // Acceso Demo para pruebas locales sin conexión a Supabase
  const handleDemoAccess = () => {
    setError(null);
    setMockUser({
      id: 'demo-uuid-12345',
      email: 'coordinador@maranathakids.com',
      user_metadata: {
        full_name: 'Coordinador Kids',
        role: 'admin'
      }
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a4693] via-[#073672] to-slate-900 overflow-hidden relative">
      {/* Círculos decorativos de fondo con colores de Maranatha Kids */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="maranatha-card bg-white/95 backdrop-blur-md border border-white/20 p-8 shadow-2xl relative">
          
          {/* Logo / Cabecera */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center justify-center p-3 bg-blue-50 text-[#0a4693] rounded-2xl mb-4 shadow-sm border border-blue-100">
              <Heart className="w-8 h-8 fill-emerald-500 stroke-emerald-500 animate-pulse" />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Maranatha <span className="text-[#22c55e]">Kids</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Control de Asistencia e Integración Escolar
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-headShake">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                className="maranatha-input"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600" htmlFor="password">
                  Contraseña
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                className="maranatha-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="maranatha-btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/95 px-3 text-slate-400 font-semibold">O prueba la interfaz</span>
            </div>
          </div>

          {/* Botón de Acceso Demo */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="maranatha-btn-success w-full"
          >
            <Sparkles className="w-5 h-5 text-white" />
            Acceso Rápido Demo (Offline)
          </button>

          {/* Footer del Formulario */}
          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            Iglesia Maranatha Venezuela &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};
