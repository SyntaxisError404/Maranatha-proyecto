import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  DoorOpen,
  Activity
} from 'lucide-react';
import { mockServidores, salonesConfig } from '../data/mockData';

// Métricas derivadas de los datos actuales (mock). Cuando se conecte Supabase,
// estos valores vendrán de los hooks de asistencia/logística.
const totalServidores = mockServidores.length;
const totalGrupos = new Set(mockServidores.map((s) => s.grupo)).size;
const totalSalones = Object.values(salonesConfig).flat().length;

// Variantes de animación para entrada escalonada
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const quickActions = [
  {
    to: '/servicio',
    icon: CalendarDays,
    bg: '#dbeafe',
    color: '#1e40af',
    title: 'Servicio Dominical',
    desc: 'Registrar asistencia y escanear QR'
  },
  {
    to: '/servidores',
    icon: Users,
    bg: '#dcfce7',
    color: '#166534',
    title: 'Servidores',
    desc: 'Gestionar el staff y sus funciones'
  },
  {
    to: '/estadisticas',
    icon: TrendingUp,
    bg: '#fef3c7',
    color: '#92400e',
    title: 'Estadísticas',
    desc: 'Métricas y reportes del servicio'
  }
];

export const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || 'Administrador';

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Banner de bienvenida */}
      <motion.div
        variants={item}
        style={{
          background: 'linear-gradient(135deg, #0a4693 0%, #1e40af 50%, #0f172a 100%)',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <div style={{
            background: '#f59e0b',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginBottom: '1rem'
          }}>
            <Activity style={{ width: '0.75rem', height: '0.75rem' }} />
            Panel de Control
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
            ¡Bienvenido, {userName}!
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, fontWeight: 500, lineHeight: 1.6 }}>
            Coordina la asistencia e integración escolar de Maranatha Kids: registra la entrada de los niños,
            organiza los salones y gestiona a los servidores desde un solo lugar.
          </p>
        </div>
      </motion.div>

      {/* Métricas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <motion.div variants={item} className="stat-card stat-card-dark">
          <div className="stat-card-label">Servidores</div>
          <div className="stat-card-value">{totalServidores}</div>
          <div className="stat-card-icon">
            <Users style={{ width: '4rem', height: '4rem' }} />
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card stat-card-light">
          <div className="stat-card-label">Grupos / Áreas</div>
          <div className="stat-card-value">{totalGrupos}</div>
          <div className="stat-card-icon">
            <LayoutGrid style={{ width: '4rem', height: '4rem' }} />
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card stat-card-gold">
          <div className="stat-card-label">Salones</div>
          <div className="stat-card-value">{totalSalones}</div>
          <div className="stat-card-icon">
            <DoorOpen style={{ width: '4rem', height: '4rem' }} />
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card stat-card-light">
          <div className="stat-card-label">Asistencia Hoy</div>
          <div className="stat-card-value" style={{ color: '#94a3b8' }}>—</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.25rem' }}>
            Requiere conexión a datos
          </div>
          <div className="stat-card-icon">
            <CalendarDays style={{ width: '4rem', height: '4rem' }} />
          </div>
        </motion.div>
      </div>

      {/* Acceso rápido */}
      <motion.h2 variants={item} style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
        Acceso Rápido
      </motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {quickActions.map((action) => (
          <motion.div key={action.to} variants={item} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Link to={action.to} style={{ textDecoration: 'none' }}>
              <div className="maranatha-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon style={{ width: '1.25rem', height: '1.25rem', color: action.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{action.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.125rem' }}>{action.desc}</div>
                  </div>
                </div>
                <ArrowRight style={{ width: '1.25rem', height: '1.25rem', color: '#cbd5e1' }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
