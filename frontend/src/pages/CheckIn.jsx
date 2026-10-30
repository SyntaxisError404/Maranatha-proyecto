import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, LogOut, UserCheck, Search } from 'lucide-react';
import { toast } from 'sonner';
import { QrScanner } from '../components/QrScanner';
import { useAsistencia } from '../hooks/useAsistencia';
import { useNinos } from '../hooks/useNinos';
import { useLogistica } from '../hooks/useLogistica';

const HOY = new Date().toISOString().split('T')[0];

export const CheckIn = () => {
  const { isConfigured, ninosPresentes, registrarEntradaQR, registrarSalida } = useAsistencia(HOY);
  const { ninos } = useNinos();
  const { salones } = useLogistica();

  const [scannerAbierto, setScannerAbierto] = useState(false);
  const [codigoManual, setCodigoManual] = useState('');
  const [presentesDemo, setPresentesDemo] = useState([]); // solo modo demo

  const nombreSalon = (id) => salones.find((s) => s.id === id)?.nombre || '—';

  // Lista unificada de presentes (BD o demo)
  const presentes = isConfigured ? ninosPresentes : presentesDemo;

  const procesarCodigo = async (codigo) => {
    const cod = (codigo || '').trim();
    if (!cod) return;

    if (isConfigured) {
      const { data, error } = await registrarEntradaQR(cod);
      if (error) {
        toast.error(error.message?.includes('No se encontró')
          ? 'Código no reconocido'
          : 'Error al registrar: ' + (error.message || ''));
      } else {
        toast.success('Entrada registrada');
      }
      return;
    }

    // --- Modo demo: resolver contra la lista de niños en memoria ---
    const nino = ninos.find((n) => n.codigo_qr === cod);
    if (!nino) {
      toast.error('Código no reconocido');
      return;
    }
    if (presentesDemo.some((p) => p.nino_id === nino.id)) {
      toast.info(`${nino.nombre} ya está presente`);
      return;
    }
    setPresentesDemo((prev) => [
      ...prev,
      {
        asistencia_id: `demo-${Date.now()}`,
        nino_id: nino.id,
        nino_nombre: nino.nombre,
        salon_id: nino.salon_id,
        salon_nombre: nombreSalon(nino.salon_id),
        hora_entrada: new Date().toISOString(),
      },
    ]);
    toast.success(`${nino.nombre} registrado`);
  };

  const handleScanSuccess = async (codigo) => {
    setScannerAbierto(false);
    await procesarCodigo(codigo);
  };

  const handleManual = async (e) => {
    e.preventDefault();
    await procesarCodigo(codigoManual);
    setCodigoManual('');
  };

  const handleSalida = async (item) => {
    if (isConfigured) {
      const { error } = await registrarSalida(item.asistencia_id);
      if (error) return toast.error('Error al registrar salida');
      toast.success('Salida registrada');
    } else {
      setPresentesDemo((prev) => prev.filter((p) => p.asistencia_id !== item.asistencia_id));
      toast.success('Salida registrada');
    }
  };

  const horaCorta = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const nombreNino = (item) => item.nino_nombre || ninos.find((n) => n.id === item.nino_id)?.nombre || 'Niño';

  const iniciales = (name) => {
    if (!name) return '??';
    const p = name.trim().split(' ');
    return (p.length >= 2 ? `${p[0][0]}${p[1][0]}` : name.substring(0, 2)).toUpperCase();
  };

  const totalPresentes = useMemo(() => presentes.length, [presentes]);

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ScanLine style={{ width: '1.75rem', height: '1.75rem', color: '#0a4693' }} />
          Check-in de Niños
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 500 }}>
          Escanea el código QR de cada niño para registrar su entrada.
          {!isConfigured && ' (modo demo: usa los códigos MK-0001…MK-0005 o imprime uno desde Niños)'}
        </p>
      </div>

      {/* Acciones de registro */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Escanear */}
        <div className="maranatha-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Escáner</div>
          <button className="maranatha-btn-primary" style={{ width: '100%', padding: '0.875rem' }} onClick={() => setScannerAbierto(true)}>
            <ScanLine style={{ width: '1.25rem', height: '1.25rem' }} /> Abrir escáner QR
          </button>
          <form onSubmit={handleManual} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#94a3b8' }} />
              <input
                type="text"
                className="maranatha-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Código manual (MK-0001)"
                value={codigoManual}
                onChange={(e) => setCodigoManual(e.target.value)}
              />
            </div>
            <button type="submit" className="maranatha-btn-success" style={{ padding: '0.625rem 1rem' }}>Registrar</button>
          </form>
        </div>

        {/* Contador */}
        <div className="stat-card stat-card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="stat-card-label">Niños presentes ahora</div>
          <div className="stat-card-value">{totalPresentes}</div>
          <div className="stat-card-icon">
            <UserCheck style={{ width: '4rem', height: '4rem' }} />
          </div>
        </div>
      </div>

      {/* Lista de presentes */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Presentes</h2>
      {presentes.length === 0 ? (
        <div className="maranatha-card" style={{ textAlign: 'center', padding: '3rem 2rem', color: '#94a3b8' }}>
          Aún no hay niños registrados. Escanea un código QR para empezar.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          <AnimatePresence>
            {presentes.map((item) => (
              <motion.div
                key={item.asistencia_id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="maranatha-card"
                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}
              >
                <div className="member-avatar">{iniciales(nombreNino(item))}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {nombreNino(item)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {item.salon_nombre || nombreSalon(item.salon_id)} · {horaCorta(item.hora_entrada)}
                  </div>
                </div>
                <button className="maranatha-btn-danger" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }} onClick={() => handleSalida(item)}>
                  <LogOut style={{ width: '0.9rem', height: '0.9rem' }} /> Salida
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Escáner QR */}
      {scannerAbierto && (
        <QrScanner onScanSuccess={handleScanSuccess} onClose={() => setScannerAbierto(false)} />
      )}
    </div>
  );
};
