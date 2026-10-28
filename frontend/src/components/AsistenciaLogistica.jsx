import React from 'react';
import { UserPlus, X } from 'lucide-react';
import { mockServidores } from '../data/mockData';

export const AsistenciaLogistica = ({ asistencia, setAsistencia, lideres, setLideres }) => {
  const equipos = [
    { id: 'Logística Operativa', nombre: 'Logística Operativa' },
    { id: 'Almacén', nombre: 'Almacén' },
    { id: 'Secretaría', nombre: 'Secretaría' },
    { id: 'Distribución Alimentos', nombre: 'Distribución de Alimentos' },
  ];

  const addServidor = (equipoId, servidorId) => {
    if (!servidorId) return;
    const yaExiste = asistencia.some(a => a.equipo === equipoId && a.servidorId === servidorId);
    if (!yaExiste) {
      setAsistencia(prev => [...prev, { servidorId, equipo: equipoId, asistio: true }]);
    }
  };

  const removeServidor = (equipoId, servidorId) => {
    setAsistencia(prev => prev.filter(a => !(a.equipo === equipoId && a.servidorId === servidorId)));
  };

  const toggleAsistencia = (equipoId, servidorId) => {
    setAsistencia(prev => prev.map(a => 
      (a.equipo === equipoId && a.servidorId === servidorId) ? { ...a, asistio: !a.asistio } : a
    ));
  };

  return (
    <div className="maranatha-card" style={{ marginBottom: '1.5rem', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Logística Kids</h2>
      </div>

      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {equipos.map(equipo => {
          const servidoresDisponibles = mockServidores.filter(s => s.grupo === equipo.id);
          const asistentes = asistencia.filter(a => a.equipo === equipo.id);

          return (
            <div key={equipo.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 800, color: '#1e293b' }}>{equipo.nombre}</span>
              </div>

              <div style={{ padding: '1rem' }}>
                <table className="admin-table" style={{ marginBottom: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Nombre y Apellido</th>
                      <th>Función</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>A/I</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistentes.map(a => {
                      const servidor = mockServidores.find(s => s.id === a.servidorId);
                      return (
                        <tr key={a.servidorId}>
                          <td style={{ fontWeight: 600, color: '#1e293b' }}>{servidor?.nombre || 'Desconocido'}</td>
                          <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{servidor?.funcionDefault || 'Servidor'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => toggleAsistencia(equipo.id, a.servidorId)}
                              style={{ 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '9999px', 
                                fontWeight: 700, 
                                fontSize: '0.8rem',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: a.asistio ? '#dcfce7' : '#fee2e2',
                                color: a.asistio ? '#166534' : '#9f1239'
                              }}
                            >
                              {a.asistio ? 'A' : 'I'}
                            </button>
                          </td>
                          <td>
                            <button className="action-btn" onClick={() => removeServidor(equipo.id, a.servidorId)}>
                              <X style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {asistentes.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '1rem' }}>
                          Sin servidores asignados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Agregar Servidor */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select 
                    className="maranatha-select" 
                    style={{ flex: 1, padding: '0.375rem 1rem' }}
                    id={`select-${equipo.id}`}
                    defaultValue=""
                  >
                    <option value="" disabled>Seleccionar servidor...</option>
                    {servidoresDisponibles.filter(s => !asistentes.some(a => a.servidorId === s.id)).map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                  <button 
                    className="maranatha-btn-primary" 
                    style={{ padding: '0.375rem 1rem' }}
                    onClick={() => {
                      const select = document.getElementById(`select-${equipo.id}`);
                      if (select.value) {
                        addServidor(equipo.id, select.value);
                        select.value = "";
                      }
                    }}
                  >
                    <UserPlus style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>REALIZADO POR:</label>
          <input type="text" className="maranatha-input" style={{ maxWidth: '400px' }} value={lideres.realizado_por || ''} onChange={(e) => setLideres({...lideres, realizado_por: e.target.value})} placeholder="Nombre completo..." />
        </div>
      </div>
    </div>
  );
};
