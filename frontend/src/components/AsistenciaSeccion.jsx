import React from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { mockServidores } from '../data/mockData';

export const AsistenciaSeccion = ({
  titulo,
  grupoFiltro,
  salonesConfig,
  asistencia,
  setAsistencia,
  conteo,
  setConteo,
  lideres,
  setLideres,
  salonesCerrados,
  setSalonesCerrados
}) => {
  // Filtrar servidores disponibles para este grupo
  const servidoresDisponibles = mockServidores.filter(s => s.grupo === grupoFiltro);

  const toggleSalonCerrado = (salonId) => {
    if (salonesCerrados.includes(salonId)) {
      setSalonesCerrados(prev => prev.filter(id => id !== salonId));
    } else {
      setSalonesCerrados(prev => [...prev, salonId]);
    }
  };

  const addServidor = (salonId, servidorId) => {
    if (!servidorId) return;
    const yaExiste = asistencia.some(a => a.salon === salonId && a.servidorId === servidorId);
    if (!yaExiste) {
      // Por defecto asignamos rol 'M' o 'S' (Servidor) dependiendo del grupo
      setAsistencia(prev => [...prev, { servidorId, salon: salonId, rol: 'M' }]);
    }
  };

  const removeServidor = (salonId, servidorId) => {
    setAsistencia(prev => prev.filter(a => !(a.salon === salonId && a.servidorId === servidorId)));
  };

  const updateRol = (salonId, servidorId, nuevoRol) => {
    setAsistencia(prev => prev.map(a => 
      (a.salon === salonId && a.servidorId === servidorId) ? { ...a, rol: nuevoRol } : a
    ));
  };

  const updateConteo = (salonId, campo, valor) => {
    const val = parseInt(valor) || 0;
    setConteo(prev => {
      const existe = prev.find(c => c.salon === salonId);
      if (existe) {
        return prev.map(c => c.salon === salonId ? { ...c, [campo]: val } : c);
      } else {
        return [...prev, { salon: salonId, hembras: 0, varones: 0, [campo]: val }];
      }
    });
  };

  const getConteo = (salonId, campo) => {
    const c = conteo.find(x => x.salon === salonId);
    return c ? c[campo] : '';
  };

  return (
    <div className="maranatha-card" style={{ marginBottom: '1.5rem', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{titulo}</h2>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {salonesConfig.map(salon => {
          const isCerrado = salonesCerrados.includes(salon.id);
          const asistentes = asistencia.filter(a => a.salon === salon.id);

          return (
            <div key={salon.id} style={{ marginBottom: '2rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: isCerrado ? '#fef2f2' : '#f1f5f9', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>{salon.nombre}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, padding: '0.125rem 0.5rem', backgroundColor: '#e2e8f0', borderRadius: '9999px' }}>
                    {salon.clase}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: isCerrado ? '#ef4444' : '#64748b', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isCerrado} 
                      onChange={() => toggleSalonCerrado(salon.id)}
                      style={{ accentColor: '#ef4444' }}
                    />
                    SALÓN CERRADO
                  </label>
                </div>
              </div>

              {!isCerrado && (
                <div style={{ padding: '1rem' }}>
                  {/* Conteo de Niños */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>HEMBRAS</label>
                      <input type="number" min="0" className="maranatha-input" style={{ width: '80px', padding: '0.375rem 0.75rem' }} value={getConteo(salon.id, 'hembras')} onChange={(e) => updateConteo(salon.id, 'hembras', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>VARONES</label>
                      <input type="number" min="0" className="maranatha-input" style={{ width: '80px', padding: '0.375rem 0.75rem' }} value={getConteo(salon.id, 'varones')} onChange={(e) => updateConteo(salon.id, 'varones', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>TOTAL NIÑOS</label>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                        {(getConteo(salon.id, 'hembras') || 0) + (getConteo(salon.id, 'varones') || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Servidores del Salón */}
                  <table className="admin-table" style={{ marginBottom: '1rem' }}>
                    <thead>
                      <tr>
                        <th>Servidor</th>
                        <th style={{ width: '60px', textAlign: 'center' }} title="Maestro/a">M</th>
                        <th style={{ width: '60px', textAlign: 'center' }} title="Auxiliar">A</th>
                        <th style={{ width: '60px', textAlign: 'center' }} title="Colaborador/a">C</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistentes.map(a => {
                        const servidor = mockServidores.find(s => s.id === a.servidorId);
                        return (
                          <tr key={a.servidorId}>
                            <td style={{ fontWeight: 600, color: '#1e293b' }}>{servidor?.nombre || 'Desconocido'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="radio" name={`rol-${salon.id}-${a.servidorId}`} checked={a.rol === 'M'} onChange={() => updateRol(salon.id, a.servidorId, 'M')} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="radio" name={`rol-${salon.id}-${a.servidorId}`} checked={a.rol === 'A'} onChange={() => updateRol(salon.id, a.servidorId, 'A')} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <input type="radio" name={`rol-${salon.id}-${a.servidorId}`} checked={a.rol === 'C'} onChange={() => updateRol(salon.id, a.servidorId, 'C')} />
                            </td>
                            <td>
                              <button className="action-btn" onClick={() => removeServidor(salon.id, a.servidorId)}>
                                <X style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {asistentes.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '1rem' }}>
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
                      id={`select-${salon.id}`}
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
                        const select = document.getElementById(`select-${salon.id}`);
                        if (select.value) {
                          addServidor(salon.id, select.value);
                          select.value = "";
                        }
                      }}
                    >
                      <UserPlus style={{ width: '1rem', height: '1rem' }} /> Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Lideres */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Líderes de Sección</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>CAPITÁN</label>
              <input type="text" className="maranatha-input" value={lideres.capitan || ''} onChange={(e) => setLideres({...lideres, capitan: e.target.value})} placeholder="Nombre..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>MANO DERECHA</label>
              <input type="text" className="maranatha-input" value={lideres.mano_derecha || ''} onChange={(e) => setLideres({...lideres, mano_derecha: e.target.value})} placeholder="Nombre..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>CESTA DE AMOR</label>
              <input type="text" className="maranatha-input" value={lideres.cesta_amor || ''} onChange={(e) => setLideres({...lideres, cesta_amor: e.target.value})} placeholder="Nombre..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
