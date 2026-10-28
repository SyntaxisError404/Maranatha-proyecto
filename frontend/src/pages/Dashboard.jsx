import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  UserPlus,
  DollarSign,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || 'Administrador';

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a4693 0%, #1e40af 50%, #0f172a 100%)',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
            Gestiona la congregación de Maranatha Venezuela desde aquí. Accede a miembros, eventos, finanzas y más.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card stat-card-dark">
          <div className="stat-card-label">Total Miembros</div>
          <div className="stat-card-value">1,248</div>
          <div className="stat-card-icon">
            <Users style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>

        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Eventos Este Mes</div>
          <div className="stat-card-value">8</div>
          <div className="stat-card-icon">
            <CalendarDays style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>

        <div className="stat-card stat-card-gold">
          <div className="stat-card-label">Crecimiento</div>
          <div className="stat-card-value">12.5%</div>
          <div className="stat-card-icon">
            <TrendingUp style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>

        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Ingresos del Mes</div>
          <div className="stat-card-value">$4,250</div>
          <div className="stat-card-icon">
            <DollarSign style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Acceso Rápido</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Link to="/miembros" style={{ textDecoration: 'none' }}>
          <div className="maranatha-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: '#1e40af' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Gestión de Miembros</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.125rem' }}>Registrar, buscar y administrar</div>
              </div>
            </div>
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem', color: '#cbd5e1' }} />
          </div>
        </Link>

        <Link to="/eventos" style={{ textDecoration: 'none' }}>
          <div className="maranatha-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays style={{ width: '1.25rem', height: '1.25rem', color: '#166534' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Eventos</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.125rem' }}>Próximos servicios y actividades</div>
              </div>
            </div>
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem', color: '#cbd5e1' }} />
          </div>
        </Link>

        <Link to="/finanzas" style={{ textDecoration: 'none' }}>
          <div className="maranatha-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#92400e' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Finanzas</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.125rem' }}>Diezmos, ofrendas y reportes</div>
              </div>
            </div>
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem', color: '#cbd5e1' }} />
          </div>
        </Link>
      </div>
    </div>
  );
};
