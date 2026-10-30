import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Save, 
  Baby, 
  Users, 
  UserCheck, 
  ClipboardList, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { AsistenciaSeccion } from '../components/AsistenciaSeccion';
import { AsistenciaLogistica } from '../components/AsistenciaLogistica';
import { EstadisticasServicio } from '../components/EstadisticasServicio';
import { salonesConfig } from '../data/mockData';
import { useAsistencia } from '../hooks/useAsistencia';

const OTRAS_AREAS_DEFAULT = {
  Ujieres: 0, Seguridad: 0, Protocolo: 0, Sonido: 0,
  Alabanza: 0, Teatro: 0, 'Semillitas ESP': 0, TV: 0
};

export const ServicioDominical = () => {
  const [activeTab, setActiveTab] = useState('maternal');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [guardado, setGuardado] = useState(false);

  // --- ESTADO GLOBAL DEL SERVICIO ---
  // Asistencias: { servidorId, salon/equipo, rol (M/A/C) o asistio (A/I) }
  const [asistenciaMaternal, setAsistenciaMaternal] = useState([]);
  const [asistenciaInfantil, setAsistenciaInfantil] = useState([]);
  const [asistenciaPrejuvenil, setAsistenciaPrejuvenil] = useState([]);
  const [asistenciaLogistica, setAsistenciaLogistica] = useState([]);
  
  // Otras Areas: solo totales { area, ujieres, seguridad, protocolo, etc }
  const [otrasAreas, setOtrasAreas] = useState(OTRAS_AREAS_DEFAULT);

  // Conteo Niños: { salon, hembras, varones }
  const [conteoMaternal, setConteoMaternal] = useState([]);
  const [conteoInfantil, setConteoInfantil] = useState([]);
  const [conteoPrejuvenil, setConteoPrejuvenil] = useState([]);

  // Lideres: { capitan, mano_derecha, cesta_amor }
  const [lideresMaternal, setLideresMaternal] = useState({});
  const [lideresInfantil, setLideresInfantil] = useState({});
  const [lideresPrejuvenil, setLideresPrejuvenil] = useState({});
  const [lideresLogistica, setLideresLogistica] = useState({ realizado_por: '' });

  // Salones Cerrados (lista de IDs)
  const [salonesCerrados, setSalonesCerrados] = useState([]);

  // Hook de asistencia: persistencia en Supabase (o modo demo si no está configurado)
  const { guardarServicio, cargarServicio, loading: guardando, isConfigured } = useAsistencia(fecha);

  // Reúne todo el estado del servicio en un solo objeto
  const construirEstado = () => ({
    asistenciaMaternal, conteoMaternal, lideresMaternal,
    asistenciaInfantil, conteoInfantil, lideresInfantil,
    asistenciaPrejuvenil, conteoPrejuvenil, lideresPrejuvenil,
    asistenciaLogistica, lideresLogistica,
    otrasAreas, salonesCerrados
  });

  // Cargar el servicio guardado al cambiar la fecha (solo si hay BD)
  useEffect(() => {
    if (!isConfigured) return;
    let cancelado = false;

    (async () => {
      const estado = await cargarServicio(fecha);
      if (cancelado) return;

      // Reiniciar al estado del servicio cargado (o vacío si no existe)
      setAsistenciaMaternal(estado?.asistenciaMaternal || []);
      setConteoMaternal(estado?.conteoMaternal || []);
      setLideresMaternal(estado?.lideresMaternal || {});
      setAsistenciaInfantil(estado?.asistenciaInfantil || []);
      setConteoInfantil(estado?.conteoInfantil || []);
      setLideresInfantil(estado?.lideresInfantil || {});
      setAsistenciaPrejuvenil(estado?.asistenciaPrejuvenil || []);
      setConteoPrejuvenil(estado?.conteoPrejuvenil || []);
      setLideresPrejuvenil(estado?.lideresPrejuvenil || {});
      setAsistenciaLogistica(estado?.asistenciaLogistica || []);
      setLideresLogistica(estado?.lideresLogistica || { realizado_por: '' });
      setOtrasAreas({ ...OTRAS_AREAS_DEFAULT, ...(estado?.otrasAreas || {}) });
      setSalonesCerrados(estado?.salonesCerrados || []);
      setGuardado(Boolean(estado));
    })();

    return () => { cancelado = true; };
  }, [fecha, isConfigured, cargarServicio]);

  const handleSave = async () => {
    if (!isConfigured) {
      setGuardado(true);
      toast.success('Servicio guardado (modo demo, sin base de datos).');
      return;
    }
    const { error } = await guardarServicio(fecha, construirEstado());
    if (error) {
      toast.error('Error al guardar: ' + (error.message || 'intenta de nuevo.'));
    } else {
      setGuardado(true);
      toast.success('Servicio guardado exitosamente');
    }
  };

  const tabs = [
    { id: 'maternal', label: 'Maternal', icon: Baby },
    { id: 'infantil', label: 'Infantil', icon: Users },
    { id: 'prejuvenil', label: 'Prejuvenil', icon: UserCheck },
    { id: 'logistica', label: 'Logística', icon: ClipboardList },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Servicio Dominical
            {guardado && <span style={{ fontSize: '0.7rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 style={{ width: '0.8rem', height: '0.8rem' }}/> GUARDADO</span>}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
            Registra la asistencia de servidores y conteo de niños.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <CalendarDays style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748b' }} />
            <input 
              type="date" 
              className="maranatha-input" 
              value={fecha}
              onChange={(e) => {setFecha(e.target.value); setGuardado(false);}}
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? '#0a4693' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(10, 70, 147, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
              border: activeTab !== tab.id ? '1px solid #e2e8f0' : 'none'
            }}
          >
            <tab.icon style={{ width: '1.1rem', height: '1.1rem' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {activeTab === 'maternal' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Maternal'"
            grupoFiltro="Maternal"
            salonesConfig={salonesConfig.Maternal}
            asistencia={asistenciaMaternal}
            setAsistencia={setAsistenciaMaternal}
            conteo={conteoMaternal}
            setConteo={setConteoMaternal}
            lideres={lideresMaternal}
            setLideres={setLideresMaternal}
            salonesCerrados={salonesCerrados}
            setSalonesCerrados={setSalonesCerrados}
          />
        )}

        {activeTab === 'infantil' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Infantil'"
            grupoFiltro="Infantil"
            salonesConfig={salonesConfig.Infantil}
            asistencia={asistenciaInfantil}
            setAsistencia={setAsistenciaInfantil}
            conteo={conteoInfantil}
            setConteo={setConteoInfantil}
            lideres={lideresInfantil}
            setLideres={setLideresInfantil}
            salonesCerrados={salonesCerrados}
            setSalonesCerrados={setSalonesCerrados}
          />
        )}

        {activeTab === 'prejuvenil' && (
          <AsistenciaSeccion
            titulo="Asistencia Servidores Maranatha Kids 'Prejuvenil'"
            grupoFiltro="Prejuvenil"
            salonesConfig={salonesConfig.Prejuvenil}
            asistencia={asistenciaPrejuvenil}
            setAsistencia={setAsistenciaPrejuvenil}
            conteo={conteoPrejuvenil}
            setConteo={setConteoPrejuvenil}
            lideres={lideresPrejuvenil}
            setLideres={setLideresPrejuvenil}
            salonesCerrados={salonesCerrados}
            setSalonesCerrados={setSalonesCerrados}
          />
        )}

        {activeTab === 'logistica' && (
          <AsistenciaLogistica
            asistencia={asistenciaLogistica}
            setAsistencia={setAsistenciaLogistica}
            lideres={lideresLogistica}
            setLideres={setLideresLogistica}
          />
        )}

        {activeTab === 'estadisticas' && (
          <EstadisticasServicio
            fecha={fecha}
            estado={{
              asistenciaMaternal, conteoMaternal, lideresMaternal,
              asistenciaInfantil, conteoInfantil, lideresInfantil,
              asistenciaPrejuvenil, conteoPrejuvenil, lideresPrejuvenil,
              asistenciaLogistica, lideresLogistica,
              otrasAreas, setOtrasAreas,
              salonesCerrados
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
