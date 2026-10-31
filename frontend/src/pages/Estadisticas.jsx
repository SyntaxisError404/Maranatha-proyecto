import React from 'react';
import { BarChart2, Calendar, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';
import { formatFechaLarga, formatNumero } from '../utils/formatters';

export const Estadisticas = () => {
  // Datos de ejemplo de domingos anteriores (se sustituirán por datos de Supabase)
  const domingosAnteriores = [
    { id: 1, fecha: '2026-06-08', asistencia: 345 },
    { id: 2, fecha: '2026-06-01', asistencia: 312 },
    { id: 3, fecha: '2026-05-25', asistencia: 328 },
  ];

  const promedio = Math.round(
    domingosAnteriores.reduce((acc, d) => acc + d.asistencia, 0) /
      (domingosAnteriores.length || 1)
  );

  const handleVerReporte = () => {
    toast.info('El reporte detallado estará disponible próximamente.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart2 className="h-6 w-6 text-maranatha-blue" />
            Historial de Estadísticas
          </h1>
          <p className="page-subtitle">
            Consulta los registros de asistencia de domingos anteriores.
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-dark">
          <div className="stat-card-label">Promedio de Asistencia</div>
          <div className="stat-card-value">{formatNumero(promedio)}</div>
          <div className="stat-card-icon">
            <Users style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Domingos Registrados</div>
          <div className="stat-card-value">{domingosAnteriores.length}</div>
          <div className="stat-card-icon">
            <Calendar style={{ width: '4rem', height: '4rem', color: '#1e40af' }} />
          </div>
        </div>
        <div className="stat-card stat-card-gold">
          <div className="stat-card-label">Último Domingo</div>
          <div className="stat-card-value">
            {formatNumero(domingosAnteriores[0]?.asistencia ?? 0)}
          </div>
          <div className="stat-card-icon">
            <BarChart2 style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="maranatha-card overflow-hidden" style={{ padding: 0 }}>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th className="text-left">Fecha del Servicio</th>
                <th className="text-center">Asistencia Registrada</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {domingosAnteriores.map((domingo) => (
                <tr key={domingo.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-maranatha-blue" />
                      </div>
                      <span className="font-medium text-slate-800">
                        {formatFechaLarga(domingo.fecha)}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm border border-slate-200">
                      {formatNumero(domingo.asistencia)} personas
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <button
                        onClick={handleVerReporte}
                        className="px-3 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg inline-flex items-center gap-2 transition-colors border border-slate-200"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Reporte
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
