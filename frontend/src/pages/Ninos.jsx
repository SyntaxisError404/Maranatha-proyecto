import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Plus, Search, Edit2, Trash2, X, QrCode, Printer, Baby, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { useNinos } from '../hooks/useNinos';
import { useLogistica } from '../hooks/useLogistica';

const FORM_VACIO = { nombre: '', genero: 'F', salon_id: '', representante: '', telefono: '', codigo_qr: '' };

export const Ninos = () => {
  const { ninos, loading, crear, actualizar, eliminar, isConfigured } = useNinos();
  const { salones } = useLogistica();

  const [searchTerm, setSearchTerm] = useState('');
  const [salonFilter, setSalonFilter] = useState('Todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_VACIO);
  const [qrNino, setQrNino] = useState(null);

  const nombreSalon = (id) => salones.find((s) => s.id === id)?.nombre || '—';

  const abrirForm = (nino = null) => {
    if (nino) {
      setEditando(nino);
      setFormData({
        nombre: nino.nombre || '',
        genero: nino.genero || 'F',
        salon_id: nino.salon_id || '',
        representante: nino.representante || '',
        telefono: nino.telefono || '',
        codigo_qr: nino.codigo_qr || ''
      });
    } else {
      setEditando(null);
      setFormData(FORM_VACIO);
    }
    setIsFormOpen(true);
  };

  const cerrarForm = () => {
    setIsFormOpen(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    const datos = {
      nombre: formData.nombre.trim(),
      genero: formData.genero,
      salon_id: formData.salon_id || null,
      representante: formData.representante.trim() || null,
      telefono: formData.telefono.trim() || null,
    };

    if (editando) {
      const { error } = await actualizar(editando.id, datos);
      if (error) return toast.error('Error al actualizar: ' + error.message);
      toast.success('Niño actualizado');
    } else {
      const { error } = await crear(datos);
      if (error) return toast.error('Error al crear: ' + error.message);
      toast.success('Niño registrado con su código QR');
    }
    cerrarForm();
  };

  const handleDelete = async (nino) => {
    if (!window.confirm(`¿Eliminar a ${nino.nombre}?`)) return;
    const { error } = await eliminar(nino.id);
    if (error) return toast.error('Error al eliminar: ' + error.message);
    toast.success('Niño eliminado');
  };

  const imprimirQR = (nino) => {
    const canvas = document.getElementById('qr-canvas-print');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('', '_blank', 'width=400,height=520');
    if (!win) return toast.error('Permite las ventanas emergentes para imprimir.');
    win.document.write(`
      <html><head><title>QR ${nino.nombre}</title>
      <style>
        body { font-family: system-ui, sans-serif; text-align:center; padding:32px; color:#0f172a; }
        img { width:260px; height:260px; }
        h1 { font-size:20px; margin:16px 0 4px; }
        p { color:#64748b; margin:2px 0; font-size:14px; }
        .code { font-family:monospace; font-weight:bold; letter-spacing:1px; margin-top:8px; }
      </style></head>
      <body>
        <img src="${dataUrl}" />
        <h1>${nino.nombre}</h1>
        <p>Salón: ${nombreSalon(nino.salon_id)}</p>
        <p class="code">${nino.codigo_qr}</p>
        <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const p = name.trim().split(' ');
    return (p.length >= 2 ? `${p[0][0]}${p[1][0]}` : name.substring(0, 2)).toUpperCase();
  };

  const filtrados = ninos.filter((n) => {
    const coincideBusqueda = n.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideSalon = salonFilter === 'Todos' || n.salon_id === salonFilter;
    return coincideBusqueda && coincideSalon;
  });

  return (
    <div>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Baby style={{ width: '1.75rem', height: '1.75rem', color: '#0a4693' }} />
            Gestión de Niños
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
            Registra a los niños, asígnalos a un salón y genera su código QR.
            {!isConfigured && ' (modo demo: los cambios no se guardan)'}
          </p>
        </div>
        <button className="maranatha-btn-primary" onClick={() => abrirForm()}>
          <Plus style={{ width: '1rem', height: '1rem' }} />
          AGREGAR NIÑO
        </button>
      </div>

      {/* Filtros */}
      <div className="maranatha-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8' }} />
          <input
            type="text"
            className="maranatha-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}>
          <Filter style={{ width: '1.1rem', height: '1.1rem', color: '#94a3b8' }} />
          <select className="maranatha-select" style={{ flex: 1 }} value={salonFilter} onChange={(e) => setSalonFilter(e.target.value)}>
            <option value="Todos">Todos los salones</option>
            {salones.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="maranatha-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Género</th>
                <th>Salón</th>
                <th>Código QR</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Cargando...</td></tr>
              ) : filtrados.length > 0 ? (
                filtrados.map((nino) => (
                  <tr key={nino.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="member-avatar">{getInitials(nino.nombre)}</div>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{nino.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ministry-badge" style={{
                        backgroundColor: nino.genero === 'F' ? '#fce7f3' : '#dbeafe',
                        color: nino.genero === 'F' ? '#9d174d' : '#1e40af'
                      }}>
                        {nino.genero === 'F' ? 'Niña' : 'Niño'}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>{nombreSalon(nino.salon_id)}</td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0a4693' }}>{nino.codigo_qr}</span></td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                        <button className="action-btn" title="Ver QR" onClick={() => setQrNino(nino)}>
                          <QrCode style={{ width: '1rem', height: '1rem', color: '#0a4693' }} />
                        </button>
                        <button className="action-btn" title="Editar" onClick={() => abrirForm(nino)}>
                          <Edit2 style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button className="action-btn" title="Eliminar" onClick={() => handleDelete(nino)}>
                          <Trash2 style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No se encontraron niños.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de formulario */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="modal-overlay" onClick={cerrarForm}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editando ? 'Editar Niño' : 'Nuevo Niño'}
                </h2>
                <button className="action-btn" onClick={cerrarForm} aria-label="Cerrar"><X style={{ width: '1.25rem', height: '1.25rem' }} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Nombre completo *</label>
                  <input type="text" name="nombre" className="maranatha-input" value={formData.nombre} onChange={handleChange} placeholder="Ej. Samuel Pérez" required />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Género</label>
                    <select name="genero" className="maranatha-select" style={{ width: '100%' }} value={formData.genero} onChange={handleChange}>
                      <option value="F">Niña</option>
                      <option value="M">Niño</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Salón</label>
                    <select name="salon_id" className="maranatha-select" style={{ width: '100%' }} value={formData.salon_id} onChange={handleChange}>
                      <option value="">Sin asignar</option>
                      {salones.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Representante</label>
                  <input type="text" name="representante" className="maranatha-input" value={formData.representante} onChange={handleChange} placeholder="Nombre del representante" />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input type="tel" name="telefono" className="maranatha-input" value={formData.telefono} onChange={handleChange} placeholder="0412-0000000" />
                </div>
                {editando && (
                  <div>
                    <label style={labelStyle}>Código QR</label>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0a4693' }}>{formData.codigo_qr}</div>
                  </div>
                )}
                {!editando && (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Se generará un código QR automáticamente al guardar.</p>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="maranatha-input" style={{ flex: 1, cursor: 'pointer', textAlign: 'center', fontWeight: 600 }} onClick={cerrarForm}>Cancelar</button>
                  <button type="submit" className="maranatha-btn-primary" style={{ flex: 1 }}>{editando ? 'Guardar' : 'Agregar'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de código QR */}
      <AnimatePresence>
        {qrNino && (
          <div className="modal-overlay" onClick={() => setQrNino(null)}>
            <motion.div
              className="modal-content"
              style={{ maxWidth: '360px', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: 0 }}>{qrNino.nombre}</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-0.5rem' }}>Salón: {nombreSalon(qrNino.salon_id)}</p>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <QRCodeCanvas id="qr-canvas-print" value={qrNino.codigo_qr} size={220} level="M" marginSize={2} />
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px', color: '#0a4693', marginBottom: '1rem' }}>{qrNino.codigo_qr}</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="maranatha-input" style={{ flex: 1, cursor: 'pointer', textAlign: 'center', fontWeight: 600 }} onClick={() => setQrNino(null)}>Cerrar</button>
                <button className="maranatha-btn-primary" style={{ flex: 1 }} onClick={() => imprimirQR(qrNino)}>
                  <Printer style={{ width: '1rem', height: '1rem' }} /> Imprimir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginBottom: '0.375rem'
};
