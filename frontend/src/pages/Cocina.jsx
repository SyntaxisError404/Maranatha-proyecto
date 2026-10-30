import React, { useMemo, useState } from 'react';
import { ChefHat, Check, Utensils } from 'lucide-react';
import { useLogistica } from '../hooks/useLogistica';
import { useNinos } from '../hooks/useNinos';

const SECCIONES = ['Maternal', 'Infantil', 'Prejuvenil'];

export const Cocina = () => {
  const { salones, servidoresPorGrupo, loading } = useLogistica();
  const { ninos } = useNinos();
  const [entregado, setEntregado] = useState({});

  // Mapa salon_id -> sección
  const salonASeccion = useMemo(() => {
    return salones.reduce((acc, s) => { acc[s.id] = s.seccion; return acc; }, {});
  }, [salones]);

  // Raciones por sección = niños asignados + servidores de esa sección
  const resumen = useMemo(() => {
    return SECCIONES.map((seccion) => {
      const ninosSeccion = ninos.filter((n) => salonASeccion[n.salon_id] === seccion).length;
      const servidoresSeccion = servidoresPorGrupo[seccion]?.length || 0;
      return {
        seccion,
        ninos: ninosSeccion,
        servidores: servidoresSeccion,
        raciones: ninosSeccion + servidoresSeccion,
      };
    });
  }, [ninos, salonASeccion, servidoresPorGrupo]);

  const totalRaciones = resumen.reduce((acc, r) => acc + r.raciones, 0);

  const toggleEntregado = (seccion) => {
    setEntregado((prev) => ({ ...prev, [seccion]: !prev[seccion] }));
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChefHat style={{ width: '1.75rem', height: '1.75rem', color: '#0a4693' }} />
          Cocina y Raciones
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
          Raciones a preparar por sección (niños + servidores) y control de entrega.
        </p>
      </div>

      {/* Total */}
      <div className="stat-card stat-card-gold" style={{ marginBottom: '1.5rem', maxWidth: '320px' }}>
        <div className="stat-card-label">Total de raciones</div>
        <div className="stat-card-value">{totalRaciones}</div>
        <div className="stat-card-icon">
          <Utensils style={{ width: '4rem', height: '4rem' }} />
        </div>
      </div>

      {loading ? (
        <div className="maranatha-card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Cargando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {resumen.map((r) => {
            const listo = entregado[r.seccion];
            return (
              <div key={r.seccion} className="maranatha-card" style={{ borderLeft: `4px solid ${listo ? '#22c55e' : '#e2e8f0'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{r.seccion}</h2>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a4693' }}>{r.raciones}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                  <span>🧒 {r.ninos} niños</span>
                  <span>🙋 {r.servidores} servidores</span>
                </div>
                <button
                  onClick={() => toggleEntregado(r.seccion)}
                  className={listo ? 'maranatha-btn-success' : 'maranatha-input'}
                  style={{ width: '100%', cursor: 'pointer', fontWeight: 600, textAlign: 'center', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {listo ? <><Check style={{ width: '1rem', height: '1rem' }} /> Entregado</> : 'Marcar como entregado'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>
        Nota: el control de entrega es local por ahora. Se puede persistir en la base de datos
        (tabla de logística de cocina) en una siguiente iteración.
      </p>
    </div>
  );
};
