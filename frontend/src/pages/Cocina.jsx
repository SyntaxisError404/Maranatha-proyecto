import React from 'react';
import { UtensilsCrossed, RefreshCw, Info, Cookie, Users, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogistica } from '../hooks/useLogistica';
import { formatFechaLarga, formatNumero, pluralizar } from '../utils/formatters';

export const Cocina = () => {
  const {
    hayDatos, fecha, raciones, totalMeriendas, totalNinos, totalServidores, recargar,
  } = useLogistica();

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UtensilsCrossed className="h-6 w-6 text-maranatha-blue" />
            Cocina y Logística
          </h1>
          <p className="page-subtitle">
            {hayDatos
              ? `Raciones calculadas del servicio del ${formatFechaLarga(fecha)}.`
              : 'Cálculo de raciones de meriendas por sección.'}
          </p>
        </div>
        <button className="maranatha-btn-primary" onClick={recargar}>
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {!hayDatos && (
        <div className="maranatha-card flex items-start gap-3" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
          <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            No hay un servicio registrado todavía. Registra el conteo de niños en{' '}
            <Link to="/servicio" className="text-maranatha-blue font-semibold underline">
              Servicio Dominical
            </Link>{' '}
            y aquí verás las raciones necesarias por sección.
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-gold">
          <div className="stat-card-label">Total Meriendas</div>
          <div className="stat-card-value">{formatNumero(totalMeriendas)}</div>
          <div className="stat-card-icon">
            <Cookie style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Niños</div>
          <div className="stat-card-value">{formatNumero(totalNinos)}</div>
          <div className="stat-card-icon">
            <Baby style={{ width: '4rem', height: '4rem', color: '#166534' }} />
          </div>
        </div>
        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Servidores</div>
          <div className="stat-card-value">{formatNumero(totalServidores)}</div>
          <div className="stat-card-icon">
            <Users style={{ width: '4rem', height: '4rem', color: '#1e40af' }} />
          </div>
        </div>
      </div>

      {/* Desglose por sección */}
      <div className="maranatha-card overflow-hidden" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 className="text-lg font-bold text-slate-800" style={{ margin: 0 }}>
            Raciones por Sección
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Sección</th>
                <th className="text-center">Niños</th>
                <th className="text-center">Servidores</th>
                <th className="text-right">Meriendas a preparar</th>
              </tr>
            </thead>
            <tbody>
              {raciones.map((r) => (
                <tr key={r.seccion}>
                  <td className="font-semibold text-slate-800">{r.seccion}</td>
                  <td className="text-center text-slate-600">{formatNumero(r.ninos)}</td>
                  <td className="text-center text-slate-600">{formatNumero(r.servidores)}</td>
                  <td className="text-right">
                    <span className="inline-flex items-center gap-1.5 font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-sm">
                      <Cookie className="h-3.5 w-3.5" />
                      {pluralizar(r.meriendas, 'merienda')}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#f8fafc' }}>
                <td className="font-extrabold text-slate-800">TOTAL</td>
                <td className="text-center font-bold text-slate-800">{formatNumero(totalNinos)}</td>
                <td className="text-center font-bold text-slate-800">{formatNumero(totalServidores)}</td>
                <td className="text-right font-extrabold text-orange-700">
                  {pluralizar(totalMeriendas, 'merienda')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        * Se calcula una merienda por cada niño y servidor presente en cada sección.
      </p>
    </div>
  );
};
