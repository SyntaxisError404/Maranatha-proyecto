import React from 'react';
import { BarChart2, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const Estadisticas = () => {
  const previousSundays = [
    { id: 1, date: 'Domingo 08 de Junio 2026', attendance: 345 },
    { id: 2, date: 'Domingo 01 de Junio 2026', attendance: 312 },
    { id: 3, date: 'Domingo 25 de Mayo 2026', attendance: 328 },
  ];

  const handleVerReporte = () => {
    toast.info('Funcionalidad en desarrollo');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-brand-primary" />
            Historial de Estadísticas
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Consulta los registros de asistencia de domingos anteriores.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="maranatha-card overflow-hidden">
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
              {previousSundays.map((sunday) => (
                <tr key={sunday.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-primary/20 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-brand-primary" />
                      </div>
                      <span className="font-medium text-white">{sunday.date}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-gray-300 bg-white/5 px-3 py-1 rounded-full text-sm border border-white/10">
                      {sunday.attendance} personas
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <button 
                        onClick={handleVerReporte}
                        className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg inline-flex items-center gap-2 transition-colors border border-white/10"
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
