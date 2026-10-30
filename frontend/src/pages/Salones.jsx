import React, { useMemo } from 'react';
import { DoorOpen, Users, UserCheck } from 'lucide-react';
import { useLogistica } from '../hooks/useLogistica';
import { useNinos } from '../hooks/useNinos';
import { useAsistencia } from '../hooks/useAsistencia';

const HOY = new Date().toISOString().split('T')[0];
const ORDEN_SECCIONES = ['Maternal', 'Infantil', 'Prejuvenil'];

export const Salones = () => {
  const { salonesPorSeccion, loading } = useLogistica();
  const { ninos } = useNinos();
  const { ninosPresentes } = useAsistencia(HOY);

  // Niños asignados por salón
  const asignadosPorSalon = useMemo(() => {
    return ninos.reduce((acc, n) => {
      if (n.salon_id) (acc[n.salon_id] ||= []).push(n);
      return acc;
    }, {});
  }, [ninos]);

  // Niños presentes por salón (en vivo)
  const presentesPorSalon = useMemo(() => {
    return ninosPresentes.reduce((acc, p) => {
      if (p.salon_id) (acc[p.salon_id] ||= []).push(p);
      return acc;
    }, {});
  }, [ninosPresentes]);

  const secciones = Object.keys(salonesPorSeccion).sort(
    (a, b) => ORDEN_SECCIONES.indexOf(a) - ORDEN_SECCIONES.indexOf(b)
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DoorOpen style={{ width: '1.75rem', height: '1.75rem', color: '#0a4693' }} />
          Salones
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
          Distribución de niños por aula: asignados y presentes en el servicio de hoy.
        </p>
      </div>

      {loading ? (
        <div className="maranatha-card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Cargando...</div>
      ) : (
        secciones.map((seccion) => (
          <div key={seccion} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>{seccion}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {salonesPorSeccion[seccion].map((salon) => {
                const asignados = asignadosPorSalon[salon.id]?.length || 0;
                const presentes = presentesPorSalon[salon.id]?.length || 0;
                return (
                  <div key={salon.id} className="maranatha-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem' }}>{salon.nombre}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginTop: '0.125rem' }}>{salon.clase}</div>
                      </div>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.625rem', borderRadius: '9999px',
                        backgroundColor: presentes > 0 ? '#dcfce7' : '#f1f5f9',
                        color: presentes > 0 ? '#166534' : '#94a3b8'
                      }}>
                        {presentes} presentes
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Users style={{ width: '0.9rem', height: '0.9rem' }} /> {asignados} asignados
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        <UserCheck style={{ width: '0.9rem', height: '0.9rem', color: '#22c55e' }} /> {presentes} aquí
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
