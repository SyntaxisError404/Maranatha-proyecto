import React from 'react';
import { Settings, Shield } from 'lucide-react';

export const Configuracion = () => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Configuración</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
          Administra las preferencias del sistema y la seguridad.
        </p>
      </div>

      <div className="maranatha-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <Settings style={{ width: '2rem', height: '2rem', color: '#94a3b8' }} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 0.5rem 0' }}>Módulo en Desarrollo</h3>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6 }}>
          La configuración del sistema estará disponible próximamente. Podrás gestionar usuarios, roles y preferencias generales.
        </p>
      </div>
    </div>
  );
};
