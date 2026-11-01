import React, { useEffect, useState } from 'react';
import { BarChart2, Calendar, Eye, Users, HardDrive, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatFechaLarga, formatNumero } from '../utils/formatters';
import { serviciosService } from '../services/serviciosService';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EstadisticasServicio } from '../components/EstadisticasServicio';

export const Estadisticas = () => {
  const [domingosAnteriores, setDomingosAnteriores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [reporte, setReporte] = useState(null); // { fecha, estado } | { fecha, sinDetalle } | 'loading'

  useEffect(() => {
    let activo = true;
    serviciosService
      .fetchHistorial()
      .then((res) => {
        if (!activo) return;
        setDomingosAnteriores(res.data);
        setDemo(res.demo);
      })
      .catch((e) => {
        console.error('Error al cargar el historial:', e);
        if (activo) toast.error('No se pudo cargar el historial.');
      })
      .finally(() => activo && setLoading(false));
    return () => {
      activo = false;
    };
  }, []);

  const promedio = Math.round(
    domingosAnteriores.reduce((acc, d) => acc + d.asistencia, 0) /
      (domingosAnteriores.length || 1)
  );

  const verReporte = async (row) => {
    setReporte('loading');
    try {
      const estado = await serviciosService.fetchDetalle(row);
      if (estado) {
        setReporte({ fecha: row.fecha, estado });
      } else {
        setReporte({ fecha: row.fecha, sinDetalle: true, asistencia: row.asistencia });
      }
    } catch (e) {
      console.error('Error al cargar el reporte:', e);
      toast.error('No se pudo cargar el reporte.');
      setReporte(null);
    }
  };

  const cerrarReporte = () => setReporte(null);

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
        {demo && !loading && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"
            title="Datos de ejemplo. Conecta Supabase para ver el historial real."
          >
            <HardDrive className="h-3.5 w-3.5" />
            Datos de ejemplo
          </span>
        )}
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
      {loading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : (
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
                        onClick={() => verReporte(domingo)}
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
      )}

      {/* Modal de Reporte Detallado */}
      {reporte && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={cerrarReporte}
        >
          <div
            className="w-full max-w-5xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra superior del modal (no se imprime) */}
            <div className="no-print flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reporte del servicio
                {reporte !== 'loading' && reporte.fecha && (
                  <span className="font-normal text-slate-300 text-sm">
                    · {formatFechaLarga(reporte.fecha)}
                  </span>
                )}
              </h2>
              <button
                onClick={cerrarReporte}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reporte === 'loading' && (
              <div className="maranatha-card flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-maranatha-blue border-t-transparent" />
              </div>
            )}

            {reporte !== 'loading' && reporte.estado && (
              <EstadisticasServicio
                fecha={reporte.fecha}
                estado={{ ...reporte.estado, setOtrasAreas: () => {} }}
              />
            )}

            {reporte !== 'loading' && reporte.sinDetalle && (
              <div className="maranatha-card text-center py-12">
                <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {formatFechaLarga(reporte.fecha)}
                </h3>
                <p className="text-slate-500 mb-4">
                  Asistencia registrada: <strong>{formatNumero(reporte.asistencia)} personas</strong>
                </p>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Este registro no tiene el desglose detallado guardado. El reporte
                  completo está disponible para los servicios registrados desde la
                  app en «Servicio Dominical».
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
