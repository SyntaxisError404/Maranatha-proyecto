import React from 'react';
import { salonesConfig, otrasAreasConfig } from '../data/mockData';

export const EstadisticasServicio = ({ fecha, estado }) => {
  const {
    asistenciaMaternal, conteoMaternal, lideresMaternal,
    asistenciaInfantil, conteoInfantil, lideresInfantil,
    asistenciaPrejuvenil, conteoPrejuvenil, lideresPrejuvenil,
    asistenciaLogistica, lideresLogistica,
    otrasAreas, setOtrasAreas,
    salonesCerrados
  } = estado;

  // --- Funciones de Cálculo ---
  const getConteoSalon = (salonId, conteoArray) => {
    const c = conteoArray.find(x => x.salon === salonId);
    return {
      hembras: c?.hembras || 0,
      varones: c?.varones || 0,
      total: (c?.hembras || 0) + (c?.varones || 0)
    };
  };

  const getServidoresSalon = (salonId, asistenciaArray) => {
    const asis = asistenciaArray.filter(a => a.salon === salonId);
    return {
      maestras: asis.filter(a => a.rol === 'M').length,
      auxiliares: asis.filter(a => a.rol === 'A').length,
      colaboradores: asis.filter(a => a.rol === 'C').length,
      total: asis.length
    };
  };

  const renderTablaEstadisticas = (titulo, salones, asistencia, conteo) => {
    let totH = 0, totV = 0, totN = 0, totM = 0, totA = 0, totC = 0, totS = 0;

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase' }}>DATOS {titulo}</h3>
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
          <table className="admin-table" style={{ minWidth: '900px' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th>CLASE</th>
                <th>SALÓN</th>
                <th style={{ textAlign: 'center' }}>HEMBRAS</th>
                <th style={{ textAlign: 'center' }}>VARONES</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>TOTAL</th>
                <th style={{ textAlign: 'center' }}>MAESTRAS</th>
                <th style={{ textAlign: 'center' }}>AUXILIARES</th>
                <th style={{ textAlign: 'center' }}>COLABORADORES</th>
                <th style={{ textAlign: 'center' }}>C. EQUIPO</th>
                <th style={{ textAlign: 'center' }}>M.D.</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>TOTAL SERV</th>
                <th style={{ textAlign: 'center' }}>CERRADOS</th>
              </tr>
            </thead>
            <tbody>
              {salones.map(salon => {
                const isCerrado = salonesCerrados.includes(salon.id);
                const n = getConteoSalon(salon.id, conteo);
                const s = getServidoresSalon(salon.id, asistencia);

                if (!isCerrado) {
                  totH += n.hembras; totV += n.varones; totN += n.total;
                  totM += s.maestras; totA += s.auxiliares; totC += s.colaboradores; totS += s.total;
                }

                return (
                  <tr key={salon.id} style={{ opacity: isCerrado ? 0.5 : 1 }}>
                    <td style={{ fontSize: '0.75rem', fontWeight: 700 }}>{salon.clase}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{salon.nombre}</td>
                    <td style={{ textAlign: 'center' }}>{isCerrado ? '' : (n.hembras || '')}</td>
                    <td style={{ textAlign: 'center' }}>{isCerrado ? '' : (n.varones || '')}</td>
                    <td style={{ textAlign: 'center', fontWeight: 800, backgroundColor: '#f8fafc' }}>{isCerrado ? '' : (n.total || '')}</td>
                    <td style={{ textAlign: 'center' }}>{isCerrado ? '' : (s.maestras || '')}</td>
                    <td style={{ textAlign: 'center' }}>{isCerrado ? '' : (s.auxiliares || '')}</td>
                    <td style={{ textAlign: 'center' }}>{isCerrado ? '' : (s.colaboradores || '')}</td>
                    {/* C. Equipo y M.D. vacíos por defecto en salones */}
                    <td style={{ textAlign: 'center' }}></td>
                    <td style={{ textAlign: 'center' }}></td>
                    <td style={{ textAlign: 'center', fontWeight: 800, backgroundColor: '#f8fafc' }}>{isCerrado ? '' : (s.total || '')}</td>
                    <td style={{ textAlign: 'center', color: '#ef4444', fontWeight: 800 }}>{isCerrado ? 'X' : ''}</td>
                  </tr>
                );
              })}
              {/* Fila de Totales */}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800 }}>
                <td colSpan="2">TOTAL</td>
                <td style={{ textAlign: 'center' }}>{totH}</td>
                <td style={{ textAlign: 'center' }}>{totV}</td>
                <td style={{ textAlign: 'center' }}>{totN}</td>
                <td style={{ textAlign: 'center' }}>{totM}</td>
                <td style={{ textAlign: 'center' }}>{totA}</td>
                <td style={{ textAlign: 'center' }}>{totC}</td>
                <td style={{ textAlign: 'center' }}></td>
                <td style={{ textAlign: 'center' }}></td>
                <td style={{ textAlign: 'center' }}>{totS}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Calcular totales globales
  const calcGlobal = () => {
    let global = { H: 0, V: 0, N: 0, M: 0, A: 0, C: 0, CE: 0, TS: 0 };
    
    // Sumar secciones
    [
      { s: salonesConfig.Maternal, a: asistenciaMaternal, c: conteoMaternal },
      { s: salonesConfig.Infantil, a: asistenciaInfantil, c: conteoInfantil },
      { s: salonesConfig.Prejuvenil, a: asistenciaPrejuvenil, c: conteoPrejuvenil }
    ].forEach(({ s, a, c }) => {
      s.forEach(salon => {
        if (!salonesCerrados.includes(salon.id)) {
          const n = getConteoSalon(salon.id, c);
          const srv = getServidoresSalon(salon.id, a);
          global.H += n.hembras; global.V += n.varones; global.N += n.total;
          global.M += srv.maestras; global.A += srv.auxiliares; global.C += srv.colaboradores; global.TS += srv.total;
        }
      });
    });

    // Sumar líderes (asumimos 1 capitan por sección si está lleno)
    const lideres = [lideresMaternal, lideresInfantil, lideresPrejuvenil];
    lideres.forEach(l => {
      if (l.capitan) { global.CE += 1; global.TS += 1; }
      if (l.mano_derecha) { global.TS += 1; }
      if (l.cesta_amor) { global.TS += 1; }
    });

    // Sumar Logística
    const logTotal = asistenciaLogistica.filter(a => a.asistio).length;
    global.TS += logTotal;

    // Sumar Otras Áreas
    const otrasTotal = Object.values(otrasAreas).reduce((a, b) => a + (parseInt(b) || 0), 0);
    global.TS += otrasTotal;

    return { global, logTotal, otrasTotal };
  };

  const totals = calcGlobal();

  return (
    <div className="maranatha-card" style={{ padding: '2rem' }}>
      
      {/* Encabezado del Reporte */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a4693', margin: 0, textTransform: 'uppercase' }}>
          IGLESIA CRISTIANA DE AVIVAMIENTO MARANATHA VENEZUELA
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ fontWeight: 700, color: '#1e293b' }}>ESTADÍSTICAS DOMINGO FECHA: <span style={{ textDecoration: 'underline' }}>{fecha}</span></div>
        </div>
      </div>

      {renderTablaEstadisticas('Maternal', salonesConfig.Maternal, asistenciaMaternal, conteoMaternal)}
      {renderTablaEstadisticas('Infantil', salonesConfig.Infantil, asistenciaInfantil, conteoInfantil)}
      {renderTablaEstadisticas('Prejuvenil y Juvenil', salonesConfig.Prejuvenil, asistenciaPrejuvenil, conteoPrejuvenil)}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '3rem' }}>
        {/* Resumen Global */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase' }}>RESUMEN GLOBAL</h3>
          <table className="admin-table" style={{ border: '1px solid #e2e8f0' }}>
            <thead style={{ backgroundColor: '#0f172a', color: 'white' }}>
              <tr>
                <th>SECCIÓN</th>
                <th style={{ textAlign: 'center' }}>HEMBRAS</th>
                <th style={{ textAlign: 'center' }}>VARONES</th>
                <th style={{ textAlign: 'center' }}>TOTAL NIÑOS</th>
                <th style={{ textAlign: 'center' }}>TOTAL SERV.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>Maternal</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Maternal.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoMaternal).hembras), 0)}</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Maternal.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoMaternal).varones), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Maternal.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoMaternal).total), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Maternal.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getServidoresSalon(s.id, asistenciaMaternal).total), 0) + (lideresMaternal.capitan ? 1 : 0) + (lideresMaternal.mano_derecha ? 1 : 0) + (lideresMaternal.cesta_amor ? 1 : 0)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Infantil</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Infantil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoInfantil).hembras), 0)}</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Infantil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoInfantil).varones), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Infantil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoInfantil).total), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Infantil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getServidoresSalon(s.id, asistenciaInfantil).total), 0) + (lideresInfantil.capitan ? 1 : 0) + (lideresInfantil.mano_derecha ? 1 : 0) + (lideresInfantil.cesta_amor ? 1 : 0)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Prejuvenil</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Prejuvenil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoPrejuvenil).hembras), 0)}</td>
                <td style={{ textAlign: 'center' }}>{salonesConfig.Prejuvenil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoPrejuvenil).varones), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Prejuvenil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getConteoSalon(s.id, conteoPrejuvenil).total), 0)}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{salonesConfig.Prejuvenil.reduce((acc, s) => acc + (salonesCerrados.includes(s.id) ? 0 : getServidoresSalon(s.id, asistenciaPrejuvenil).total), 0) + (lideresPrejuvenil.capitan ? 1 : 0) + (lideresPrejuvenil.mano_derecha ? 1 : 0) + (lideresPrejuvenil.cesta_amor ? 1 : 0)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Logística</td>
                <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>-</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{totals.logTotal}</td>
              </tr>
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800, fontSize: '1.1rem' }}>
                <td>TOTALES</td>
                <td style={{ textAlign: 'center' }}>{totals.global.H}</td>
                <td style={{ textAlign: 'center' }}>{totals.global.V}</td>
                <td style={{ textAlign: 'center', color: '#0a4693' }}>{totals.global.N}</td>
                <td style={{ textAlign: 'center', color: '#0a4693' }}>{totals.global.TS}</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
            <span style={{ fontWeight: 800, color: '#64748b' }}>REALIZADO POR: </span>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', marginLeft: '0.5rem' }}>{lideresLogistica.realizado_por || '_____________________'}</span>
          </div>
        </div>

        {/* Servidores Otras Áreas */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase' }}>SERVIDORES OTRAS ÁREAS</h3>
          <table className="admin-table" style={{ border: '1px solid #e2e8f0' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th>ÁREA</th>
                <th style={{ textAlign: 'center', width: '80px' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {otrasAreasConfig.map(area => (
                <tr key={area}>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{area}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      min="0"
                      className="maranatha-input" 
                      style={{ width: '100%', padding: '0.25rem 0.5rem', textAlign: 'center' }}
                      value={otrasAreas[area] || ''}
                      onChange={(e) => setOtrasAreas({...otrasAreas, [area]: e.target.value})}
                    />
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800 }}>
                <td>TOTAL OTRAS ÁREAS</td>
                <td style={{ textAlign: 'center', fontSize: '1.1rem' }}>{totals.otrasTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Botón para Imprimir */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button 
          className="maranatha-btn-gold" 
          onClick={() => window.print()}
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          IMPRIMIR ESTADÍSTICAS
        </button>
      </div>
    </div>
  );
};
