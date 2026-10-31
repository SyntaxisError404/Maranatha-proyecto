import React, { useEffect, useState } from 'react';
import { LayoutGrid, Baby, Users, Lock, RefreshCw, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { salonesConfig } from '../data/mockData';
import { LAST_SERVICIO_KEY } from '../hooks/useAsistencia';
import { formatFechaLarga } from '../utils/formatters';

const leerUltimoServicio = () => {
  try {
    const raw = localStorage.getItem(LAST_SERVICIO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const SECCIONES = [
  { key: 'Maternal', conteoKey: 'conteoMaternal', asisKey: 'asistenciaMaternal', icon: Baby, color: '#166534', bg: '#dcfce7' },
  { key: 'Infantil', conteoKey: 'conteoInfantil', asisKey: 'asistenciaInfantil', icon: Users, color: '#6b21a8', bg: '#f3e8ff' },
  { key: 'Prejuvenil', conteoKey: 'conteoPrejuvenil', asisKey: 'asistenciaPrejuvenil', icon: Users, color: '#1e40af', bg: '#dbeafe' },
];

export const Salones = () => {
  const [servicio, setServicio] = useState(() => leerUltimoServicio());

  const recargar = () => setServicio(leerUltimoServicio());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LAST_SERVICIO_KEY) recargar();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const estado = servicio?.estado;

  const getSalonData = (seccion, salonId) => {
    const conteo = estado?.[seccion.conteoKey]?.find((c) => c.salon === salonId);
    const hembras = Number(conteo?.hembras) || 0;
    const varones = Number(conteo?.varones) || 0;
    const servidores = estado?.[seccion.asisKey]?.filter((a) => a.salon === salonId) || [];
    const cerrado = estado?.salonesCerrados?.includes(salonId) || false;
    return { hembras, varones, total: hembras + varones, servidores, cerrado };
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <LayoutGrid className="h-6 w-6 text-maranatha-blue" />
            Distribución de Salones
          </h1>
          <p className="page-subtitle">
            {estado
              ? `Basado en el registro del ${formatFechaLarga(servicio.fecha)}.`
              : 'Distribución de niños por grupo pedagógico.'}
          </p>
        </div>
        <button className="maranatha-btn-primary" onClick={recargar}>
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {!estado && (
        <div className="maranatha-card flex items-start gap-3" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <Info className="h-5 w-5 text-maranatha-blue shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            Aún no hay un servicio registrado. Ve a{' '}
            <Link to="/servicio" className="text-maranatha-blue font-semibold underline">
              Servicio Dominical
            </Link>{' '}
            para registrar el conteo de niños y verás aquí la distribución en tiempo real.
          </div>
        </div>
      )}

      {SECCIONES.map((seccion) => {
        const salones = salonesConfig[seccion.key] || [];
        return (
          <div key={seccion.key}>
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center rounded-lg"
                style={{ width: '2rem', height: '2rem', background: seccion.bg, color: seccion.color }}
              >
                <seccion.icon className="h-4 w-4" />
              </span>
              {seccion.key}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              {salones.map((salon) => {
                const d = getSalonData(seccion, salon.id);
                return (
                  <div
                    key={salon.id}
                    className="maranatha-card"
                    style={{ opacity: d.cerrado ? 0.65 : 1, borderColor: d.cerrado ? '#fecaca' : undefined }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">{salon.nombre}</span>
                      {d.cerrado ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                          <Lock className="h-3 w-3" /> Cerrado
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {salon.clase}
                        </span>
                      )}
                    </div>

                    {!d.cerrado && (
                      <>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-extrabold text-maranatha-blue">{d.total}</span>
                          <span className="text-xs text-slate-500 font-medium">niños</span>
                        </div>
                        <div className="flex gap-3 text-xs text-slate-500 mb-2">
                          <span>♀ {d.hembras} hembras</span>
                          <span>♂ {d.varones} varones</span>
                        </div>
                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">
                          <Users className="h-3 w-3 inline mr-1" />
                          {d.servidores.length} servidor{d.servidores.length === 1 ? '' : 'es'}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
