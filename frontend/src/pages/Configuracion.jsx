import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Wifi, WifiOff, Save, Settings as SettingsIcon, SlidersHorizontal,
  Database, Download, Upload, Trash2, RotateCcw, Info, Smartphone, RefreshCw, Github, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';
import { usePreferencias } from '../hooks/usePreferencias';
import { getIniciales } from '../utils/formatters';
import {
  resumenDatos, exportarDatos, importarDatos, borrarBorradores, restablecerTodo,
} from '../services/datosLocales';

const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';
const REPO_URL = 'https://github.com/SyntaxisError404/Maranatha-proyecto';
const DEMO_ID = 'demo-uuid-12345';

const Seccion = ({ icon: Icon, titulo, descripcion, children }) => (
  <div className="maranatha-card">
    <div className="flex items-start gap-3 mb-4">
      <span className="inline-flex items-center justify-center rounded-xl bg-blue-50 text-maranatha-blue shrink-0" style={{ width: '2.5rem', height: '2.5rem' }}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
        {descripcion && <p className="text-sm text-slate-500">{descripcion}</p>}
      </div>
    </div>
    {children}
  </div>
);

export const Configuracion = () => {
  const { user, logout, setMockUser } = useAuth();
  const { prefs, actualizar } = usePreferencias();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [nombre, setNombre] = useState(user?.user_metadata?.full_name || '');
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [resumen, setResumen] = useState(resumenDatos());
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [instalada, setInstalada] = useState(false);

  const email = user?.email || '—';
  const rol = user?.user_metadata?.role || 'Coordinador';
  const esDemo = !isSupabaseConfigured || user?.id === DEMO_ID;

  const refrescarResumen = () => setResumen(resumenDatos());

  // Captura del evento de instalación PWA
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalada(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if (window.matchMedia?.('(display-mode: standalone)').matches) setInstalada(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // --- Cuenta ---
  const guardarNombre = async () => {
    const nuevo = nombre.trim();
    if (!nuevo) {
      toast.error('El nombre no puede estar vacío.');
      return;
    }
    setGuardandoNombre(true);
    try {
      if (isSupabaseConfigured && user?.id && user.id !== DEMO_ID) {
        const { error } = await supabase.auth.updateUser({ data: { full_name: nuevo } });
        if (error) throw error;
      } else {
        setMockUser({
          ...user,
          id: user?.id || DEMO_ID,
          user_metadata: { ...user?.user_metadata, full_name: nuevo },
        });
      }
      toast.success('Nombre actualizado.');
    } catch (e) {
      console.error(e);
      toast.error('No se pudo actualizar el nombre.');
    } finally {
      setGuardandoNombre(false);
    }
  };

  const handleLogout = async () => {
    const res = await logout();
    if (!res?.error) {
      toast.success('Sesión cerrada. ¡Hasta pronto!');
      navigate('/login');
    } else {
      toast.error('Error al cerrar sesión.');
    }
  };

  // --- Datos locales ---
  const handleImportar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const texto = await file.text();
      const n = importarDatos(texto);
      refrescarResumen();
      toast.success(`Respaldo importado (${n} elementos). Recarga para ver los cambios.`);
    } catch (err) {
      console.error(err);
      toast.error('Archivo inválido. Usa un respaldo exportado por esta app.');
    } finally {
      e.target.value = '';
    }
  };

  const handleBorrarBorradores = () => {
    if (!window.confirm('¿Borrar todos los borradores de servicios guardados localmente?')) return;
    const n = borrarBorradores();
    refrescarResumen();
    toast.success(`${n} borrador(es) eliminado(s).`);
  };

  const handleRestablecer = () => {
    if (!window.confirm('Esto borrará TODOS los datos locales (servidores, servicios y preferencias). ¿Continuar?')) return;
    restablecerTodo();
    refrescarResumen();
    toast.success('Datos locales restablecidos. Recarga la aplicación.');
  };

  // --- App ---
  const instalar = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') toast.success('¡Aplicación instalada!');
    setDeferredPrompt(null);
  };

  const buscarActualizaciones = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update();
      }
      toast.info('Buscando actualizaciones… la app se recargará.');
      setTimeout(() => window.location.reload(), 800);
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <SettingsIcon className="h-6 w-6 text-maranatha-blue" />
            Configuración
          </h1>
          <p className="page-subtitle">Administra tu cuenta, preferencias y datos del sistema.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>

        {/* ===== CUENTA ===== */}
        <Seccion icon={User} titulo="Cuenta y sesión" descripcion="Tu perfil y estado de conexión.">
          <div className="flex items-center gap-3 mb-4">
            <div className="topbar-avatar" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
              {getIniciales(nombre || 'Usuario')}
            </div>
            <div>
              <div className="font-bold text-slate-800">{nombre || 'Usuario'}</div>
              <div className="text-sm text-slate-500">{email}</div>
              <span className="inline-block mt-1 text-xs font-semibold text-maranatha-blue bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                {rol}
              </span>
            </div>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Nombre para mostrar
          </label>
          <div className="flex gap-2 mb-4">
            <input
              className="maranatha-input flex-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
            <button className="maranatha-btn-primary" onClick={guardarNombre} disabled={guardandoNombre}>
              <Save className="h-4 w-4" />
              {guardandoNombre ? '...' : 'Guardar'}
            </button>
          </div>

          <div className={`flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2.5 mb-4 ${esDemo ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {esDemo ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            {esDemo ? 'Modo demo (datos en este dispositivo)' : 'Conectado a Supabase'}
          </div>

          <button className="maranatha-btn-danger w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </Seccion>

        {/* ===== PREFERENCIAS ===== */}
        <Seccion icon={SlidersHorizontal} titulo="Preferencias" descripcion="Se aplican en reportes y en la app.">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Nombre de la congregación
          </label>
          <input
            className="maranatha-input w-full mb-4"
            value={prefs.congregacion}
            onChange={(e) => actualizar({ congregacion: e.target.value })}
            placeholder="Nombre de la iglesia"
          />

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Responsable por defecto
          </label>
          <input
            className="maranatha-input w-full mb-4"
            value={prefs.responsable}
            onChange={(e) => actualizar({ responsable: e.target.value })}
            placeholder="Nombre del coordinador"
          />

          <label className="flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50 rounded-xl px-3 py-3">
            <span className="text-sm font-medium text-slate-700">Confirmar antes de eliminar</span>
            <input
              type="checkbox"
              checked={prefs.confirmarEliminar}
              onChange={(e) => actualizar({ confirmarEliminar: e.target.checked })}
              style={{ width: '1.15rem', height: '1.15rem', accentColor: '#0a4693' }}
            />
          </label>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Check className="h-3 w-3 text-kids-green" /> Los cambios se guardan automáticamente.
          </p>
        </Seccion>

        {/* ===== DATOS LOCALES ===== */}
        <Seccion icon={Database} titulo="Datos locales" descripcion="Respaldo y limpieza de la información del navegador.">
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-extrabold text-slate-800">{resumen.borradores}</div>
              <div className="text-xs text-slate-500">Borradores</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-extrabold text-slate-800">{resumen.tieneServidoresLocales ? 'Sí' : 'No'}</div>
              <div className="text-xs text-slate-500">Servidores</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-extrabold text-slate-800">{resumen.kb}</div>
              <div className="text-xs text-slate-500">KB usados</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="maranatha-btn-primary w-full" onClick={exportarDatos}>
              <Download className="h-4 w-4" /> Exportar respaldo (JSON)
            </button>
            <button className="maranatha-btn-success w-full" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Importar respaldo
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImportar} hidden />
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={handleBorrarBorradores}
            >
              <Trash2 className="h-4 w-4" /> Borrar borradores
            </button>
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              onClick={handleRestablecer}
            >
              <RotateCcw className="h-4 w-4" /> Restablecer todo
            </button>
          </div>
        </Seccion>

        {/* ===== ACERCA DE ===== */}
        <Seccion icon={Info} titulo="Acerca de" descripcion="Información de la aplicación.">
          <dl className="text-sm mb-4 divide-y divide-slate-100">
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Aplicación</dt>
              <dd className="font-semibold text-slate-800">Maranatha Kids</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Versión</dt>
              <dd className="font-semibold text-slate-800">v{APP_VERSION}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Instalación (PWA)</dt>
              <dd className="font-semibold text-slate-800">{instalada ? 'Instalada' : 'Navegador'}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2">
            {!instalada && (
              <button
                className="maranatha-btn-primary w-full disabled:opacity-50"
                onClick={instalar}
                disabled={!deferredPrompt}
                title={deferredPrompt ? '' : 'Usa el menú del navegador si el botón está deshabilitado.'}
              >
                <Smartphone className="h-4 w-4" /> Instalar app
              </button>
            )}
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={buscarActualizaciones}
            >
              <RefreshCw className="h-4 w-4" /> Buscar actualizaciones
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors no-underline"
            >
              <Github className="h-4 w-4" /> Repositorio del proyecto
            </a>
          </div>
        </Seccion>
      </div>
    </div>
  );
};
