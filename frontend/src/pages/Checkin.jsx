import React, { useState, lazy, Suspense } from 'react';
import { QrCode, ScanLine, UserCheck, Clock, Keyboard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useServidores } from '../hooks/useServidores';
import { getIniciales, formatHora } from '../utils/formatters';

// El escáner carga la cámara (html5-qrcode); lo diferimos hasta abrirlo.
const QrScanner = lazy(() =>
  import('../components/QrScanner').then((m) => ({ default: m.QrScanner }))
);

/**
 * Busca un servidor a partir del texto decodificado de un QR.
 * Acepta: el id directo, un JSON {"id": "..."} o el nombre del servidor.
 */
const resolverServidor = (texto, servidores) => {
  if (!texto) return null;
  let valor = String(texto).trim();

  // Intentar parsear JSON {id|nombre}
  try {
    const obj = JSON.parse(valor);
    if (obj && (obj.id || obj.nombre)) valor = String(obj.id || obj.nombre).trim();
  } catch {
    /* no era JSON, se usa el texto tal cual */
  }

  // Formato "servidor:<id>"
  const m = valor.match(/^servidor:(.+)$/i);
  if (m) valor = m[1].trim();

  const porId = servidores.find((s) => String(s.id) === valor);
  if (porId) return porId;

  const lower = valor.toLowerCase();
  return servidores.find((s) => (s.nombre || '').toLowerCase() === lower)
    || servidores.find((s) => (s.nombre || '').toLowerCase().includes(lower) && lower.length >= 3)
    || null;
};

export const Checkin = () => {
  const { servidores, loading } = useServidores();
  const [scannerAbierto, setScannerAbierto] = useState(false);
  const [manual, setManual] = useState('');
  const [llegadas, setLlegadas] = useState([]);

  const registrar = (texto) => {
    const servidor = resolverServidor(texto, servidores);
    if (!servidor) {
      toast.error(`No se encontró ningún servidor para "${texto}".`);
      return false;
    }
    if (llegadas.some((l) => String(l.id) === String(servidor.id))) {
      toast.info(`${servidor.nombre} ya registró su llegada.`);
      return false;
    }
    setLlegadas((prev) => [
      { ...servidor, hora: new Date().toISOString() },
      ...prev,
    ]);
    toast.success(`¡Bienvenido, ${servidor.nombre}!`);
    return true;
  };

  const handleScanSuccess = (texto) => {
    registrar(texto);
    // El escáner permanece abierto para registrar varias llegadas seguidas.
  };

  const handleManual = (e) => {
    e.preventDefault();
    if (!manual.trim()) return;
    if (registrar(manual)) setManual('');
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <QrCode className="h-6 w-6 text-maranatha-blue" />
            Check-in QR
          </h1>
          <p className="page-subtitle">
            Registra la llegada de servidores escaneando su código QR.
          </p>
        </div>
        <button className="maranatha-btn-primary" onClick={() => setScannerAbierto(true)}>
          <ScanLine className="h-4 w-4" />
          ABRIR ESCÁNER
        </button>
      </div>

      {/* Entrada manual (respaldo sin cámara) */}
      <div className="maranatha-card">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          <Keyboard className="h-4 w-4" />
          Registro manual
        </label>
        <form onSubmit={handleManual} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="maranatha-input flex-1"
            placeholder="Código, id o nombre del servidor..."
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            list="servidores-list"
          />
          <datalist id="servidores-list">
            {servidores.map((s) => (
              <option key={s.id} value={s.nombre} />
            ))}
          </datalist>
          <button type="submit" className="maranatha-btn-success" disabled={loading}>
            <UserCheck className="h-4 w-4" />
            Registrar llegada
          </button>
        </form>
      </div>

      {/* Lista de llegadas */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-kids-green" />
          Llegadas registradas ({llegadas.length})
        </h2>

        {llegadas.length === 0 ? (
          <div className="maranatha-card text-center py-10 text-slate-400">
            <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-40" />
            Aún no hay llegadas. Escanea un código o usa el registro manual.
          </div>
        ) : (
          <div className="maranatha-card overflow-hidden" style={{ padding: 0 }}>
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Servidor</th>
                  <th>Grupo</th>
                  <th className="text-right">Hora</th>
                </tr>
              </thead>
              <tbody>
                {llegadas.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="member-avatar">{getIniciales(l.nombre)}</div>
                        <span className="font-medium text-slate-800">{l.nombre}</span>
                      </div>
                    </td>
                    <td className="text-slate-600">{l.grupo}</td>
                    <td className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {formatHora(l.hora)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {scannerAbierto && (
        <Suspense fallback={null}>
          <QrScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setScannerAbierto(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
