import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Baby,
  ScanLine,
  DoorOpen,
  ChefHat,
  CalendarDays,
  Settings,
  LogOut,
  Search,
  TrendingUp,
  Bell,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { to: '/panel', label: 'Panel', icon: LayoutDashboard },
  { to: '/checkin', label: 'Check-in', icon: ScanLine },
  { to: '/servicio', label: 'Servicio Dominical', icon: CalendarDays },
  { to: '/ninos', label: 'Niños', icon: Baby },
  { to: '/salones', label: 'Salones', icon: DoorOpen },
  { to: '/cocina', label: 'Cocina', icon: ChefHat },
  { to: '/servidores', label: 'Servidores', icon: Users },
  { to: '/estadisticas', label: 'Estadísticas', icon: TrendingUp },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || 'Admin User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    const result = await logout();
    if (!result?.error) {
      toast.success('Sesión cerrada. ¡Hasta pronto!');
      navigate('/login');
    } else {
      toast.error('Error al cerrar sesión.');
    }
  };

  return (
    <div className="app-layout">
      {/* Overlay móvil */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Barra lateral */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>Maranatha</h2>
          <span>Venezuela</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button className="sidebar-link" onClick={handleLogout}>
            <LogOut />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Barra superior */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Botón menú móvil */}
            <button
              className="action-btn"
              style={{ display: 'none' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              id="mobile-menu-btn"
              aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <style>{`
              @media (max-width: 768px) {
                #mobile-menu-btn { display: flex !important; }
              }
            `}</style>

            <div className="topbar-search">
              <Search style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
              <input type="text" placeholder="Búsqueda global..." aria-label="Búsqueda global" />
            </div>
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon-btn" aria-label="Notificaciones">
              <Bell style={{ width: '1rem', height: '1rem' }} />
            </button>
            <button className="topbar-icon-btn" aria-label="Ayuda">
              <HelpCircle style={{ width: '1rem', height: '1rem' }} />
            </button>

            <div className="topbar-profile">
              <div className="topbar-avatar">
                {userInitials}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                  {userName}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Super Administrador
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};
