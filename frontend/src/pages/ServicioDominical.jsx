import React, { useState } from 'react';
import {
  CalendarDays, Save, Baby, Users, UserCheck, ClipboardList, BarChart3, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { AsistenciaSeccion } from '../components/AsistenciaSeccion';
import { AsistenciaLogistica } from '../components/AsistenciaLogistica';
import { EstadisticasServicio } from '../components/EstadisticasServicio';
import { salonesConfig } from '../data/mockData';
import { useAsistencia } from '../hooks/useAsistencia';

const TABS = [
  { id: 'maternal', label: 'Maternal', icon: Baby },
  { id: 'infantil', label: 'Infantil', icon: Users },
  { id: 'prejuvenil', label: 'Prejuvenil', icon: UserCheck },
  { id: 'logistica', label: 'Logística', icon: ClipboardList },
  { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
];

export const ServicioDominical = () => {
  const [activeTab, setActiveTab] = useState('maternal');
  const {
    fecha, setFecha, estado, setters, guardando, guardado, guardarServicio,
  } = useAsistencia();

  const handleSave = async () => {
    const res = await guardarServicio();
    if (res.ok) {
      toast.success(
        res.offline
          ? 'Servicio guardado localmente (modo demo/offline).'
          : 'Servicio guardado exitosamente en la nube.'
      );
    } else {
      toast.error('No se pudo guardar el servicio. Tus datos quedaron en el borrador local.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Servicio Dominical
            {guardado && (
              <span
                style={{
                  fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534',
                  padding: '0.25rem 0.5rem', borderRadius: '9999px',
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                }}
              >
                <CheckCircle2 style={{ width: '0.8rem', height: '0.8rem' }} /> GUARDADO
              </span>
            )}
          </h1>
          <p className="page-subtitle">
            Registra la asistencia de servidores y conteo de niños.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <CalendarDays style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b' }} />
            <input
              type="date"
              className="maranatha-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '180px' }}
            />
          </div>
          <button className="maranatha-btn-primary" onClick={handleSave} disabled={guardando}>
            <Save style={{ width: '1rem', height: '1rem' }} />
            {guardando ? 'GUARDANDO...' : 'GUARDAR REGISTRO'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? '#0a4693' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(10, 70, 147, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
              border: activeTab !== tab.id ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <tab.icon style={{ width: '1.1rem', height: '1.1rem' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {activeTab === 'maternal' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Maternal'"
            grupoFiltro="Maternal"
            salonesConfig={salonesConfig.Maternal}
            asistencia={estado.asistenciaMaternal}
            setAsistencia={setters.setAsistenciaMaternal}
            conteo={estado.conteoMaternal}
            setConteo={setters.setConteoMaternal}
            lideres={estado.lideresMaternal}
            setLideres={setters.setLideresMaternal}
            salonesCerrados={estado.salonesCerrados}
            setSalonesCerrados={setters.setSalonesCerrados}
          />
        )}

        {activeTab === 'infantil' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Infantil'"
            grupoFiltro="Infantil"
            salonesConfig={salonesConfig.Infantil}
            asistencia={estado.asistenciaInfantil}
            setAsistencia={setters.setAsistenciaInfantil}
            conteo={estado.conteoInfantil}
            setConteo={setters.setConteoInfantil}
            lideres={estado.lideresInfantil}
            setLideres={setters.setLideresInfantil}
            salonesCerrados={estado.salonesCerrados}
            setSalonesCerrados={setters.setSalonesCerrados}
          />
        )}

        {activeTab === 'prejuvenil' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Prejuvenil'"
            grupoFiltro="Prejuvenil"
            salonesConfig={salonesConfig.Prejuvenil}
            asistencia={estado.asistenciaPrejuvenil}
            setAsistencia={setters.setAsistenciaPrejuvenil}
            conteo={estado.conteoPrejuvenil}
            setConteo={setters.setConteoPrejuvenil}
            lideres={estado.lideresPrejuvenil}
            setLideres={setters.setLideresPrejuvenil}
            salonesCerrados={estado.salonesCerrados}
            setSalonesCerrados={setters.setSalonesCerrados}
          />
        )}

        {activeTab === 'logistica' && (
          <AsistenciaLogistica
            asistencia={estado.asistenciaLogistica}
            setAsistencia={setters.setAsistenciaLogistica}
            lideres={estado.lideresLogistica}
            setLideres={setters.setLideresLogistica}
          />
        )}

        {activeTab === 'estadisticas' && (
          <EstadisticasServicio
            fecha={fecha}
            estado={{
              asistenciaMaternal: estado.asistenciaMaternal,
              conteoMaternal: estado.conteoMaternal,
              lideresMaternal: estado.lideresMaternal,
              asistenciaInfantil: estado.asistenciaInfantil,
              conteoInfantil: estado.conteoInfantil,
              lideresInfantil: estado.lideresInfantil,
              asistenciaPrejuvenil: estado.asistenciaPrejuvenil,
              conteoPrejuvenil: estado.conteoPrejuvenil,
              lideresPrejuvenil: estado.lideresPrejuvenil,
              asistenciaLogistica: estado.asistenciaLogistica,
              lideresLogistica: estado.lideresLogistica,
              otrasAreas: estado.otrasAreas,
              setOtrasAreas: setters.setOtrasAreas,
              salonesCerrados: estado.salonesCerrados,
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
