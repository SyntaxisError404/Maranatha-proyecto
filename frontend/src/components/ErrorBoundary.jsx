import React from 'react';

/**
 * Captura errores de renderizado en el árbol de componentes para evitar
 * que un fallo deje la aplicación en blanco. Muestra una pantalla de
 * recuperación con la opción de reintentar o recargar.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: '#f8fafc',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '1rem',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Algo salió mal
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Ocurrió un error inesperado en la aplicación. Tus datos del servicio
            quedaron guardados localmente. Puedes reintentar o recargar la página.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="maranatha-btn-primary" onClick={this.handleReset}>
              Reintentar
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.75rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                background: '#f1f5f9',
                color: '#334155',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Recargar
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                marginTop: '1.5rem',
                textAlign: 'left',
                fontSize: '0.7rem',
                color: '#b91c1c',
                background: '#fef2f2',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
                maxHeight: '160px',
              }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
