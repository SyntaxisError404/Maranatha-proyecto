import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  UtensilsCrossed,
  ClipboardList,
  Activity,
  Baby,
  QrCode,
} from 'lucide-react';
import { mockServidores, salonesConfig } from '../data/mockData';
import { formatFechaLarga, formatNumero } from '../utils/formatters';

const accesos = [
  {
    to: '/servicio',
    titulo: 'Servicio Dominical',
    descripcion: 'Registrar asistencia y conteo de niños',
    icon: ClipboardList,
    bg: '#dbeafe',
    color: '#1e40af',
  },
  {
    to: '/checkin',
    titulo: 'Check-in QR',
    descripcion: 'Registrar llegada de servidores por QR',
    icon: QrCode,
    bg: '#e0e7ff',
    color: '#4338ca',
  },
  {
    to: '/servidores',
    titulo: 'Servidores',
    descripcion: 'Gestionar voluntarios por grupo y función',
    icon: Users,
    bg: '#dcfce7',
    color: '#166534',
  },
  {
    to: '/salones',
    titulo: 'Salones',
    descripcion: 'Distribución de niños por grupo pedagógico',
    icon: LayoutGrid,
    bg: '#f3e8ff',
    color: '#6b21a8',
  },
  {
    to: '/cocina',
    titulo: 'Cocina y Logística',
    descripcion: 'Raciones de meriendas por sección',
    icon: UtensilsCrossed,
    bg: '#ffedd5',
    color: '#9a3412',
  },
  {
    to: '/estadisticas',
    titulo: 'Estadísticas',
    descripcion: 'Historial de asistencia de domingos',
    icon: TrendingUp,
    bg: '#fef3c7',
    color: '#92400e',
  },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || 'Administrador';

  const stats = useMemo(() => {
    const totalServidores = mockServidores.length;
    const totalSalones = Object.values(salonesConfig).reduce(
      (acc, lista) => acc + lista.length,
      0
    );
    const grupos = new Set(mockServidores.map((s) => s.grupo)).size;
    const capitanes = mockServidores.filter((s) =>
      /capit/i.test(s.funcionDefault || '')
    ).length;
    return { totalServidores, totalSalones, grupos, capitanes };
  }, []);

  return (
    <div>
      {/* Banner de bienvenida */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-glow" />
        <div className="dashboard-welcome-content">
          <span className="dashboard-badge">
            <Activity style={{ width: '0.75rem', height: '0.75rem' }} />
            Panel de Control
          </span>
          <h1 className="dashboard-welcome-title">¡Bienvenido, {userName}!</h1>
          <p className="dashboard-welcome-text">
            Control de asistencia e integración escolar de Maranatha Kids.
            Hoy es {formatFechaLarga(new Date())}.
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card-dark">
          <div className="stat-card-label">Servidores</div>
          <div className="stat-card-value">{formatNumero(stats.totalServidores)}</div>
          <div className="stat-card-icon">
            <Users style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>

        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Grupos / Áreas</div>
          <div className="stat-card-value">{stats.grupos}</div>
          <div className="stat-card-icon">
            <LayoutGrid style={{ width: '4rem', height: '4rem', color: '#1e40af' }} />
          </div>
        </div>

        <div className="stat-card stat-card-light">
          <div className="stat-card-label">Salones Kids</div>
          <div className="stat-card-value">{stats.totalSalones}</div>
          <div className="stat-card-icon">
            <Baby style={{ width: '4rem', height: '4rem', color: '#166534' }} />
          </div>
        </div>

        <div className="stat-card stat-card-gold">
          <div className="stat-card-label">Capitanes</div>
          <div className="stat-card-value">{stats.capitanes}</div>
          <div className="stat-card-icon">
            <CalendarDays style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <h2 className="dashboard-section-title">Acceso Rápido</h2>
      <div className="dashboard-actions-grid">
        {accesos.map((a) => (
          <Link key={a.to} to={a.to} className="dashboard-action-link">
            <div className="maranatha-card dashboard-action-card">
              <div className="dashboard-action-inner">
                <div
                  className="dashboard-action-icon"
                  style={{ background: a.bg, color: a.color }}
                >
                  <a.icon style={{ width: '1.25rem', height: '1.25rem' }} />
                </div>
                <div>
                  <div className="dashboard-action-title">{a.titulo}</div>
                  <div className="dashboard-action-desc">{a.descripcion}</div>
                </div>
              </div>
              <ArrowRight className="dashboard-action-arrow" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
