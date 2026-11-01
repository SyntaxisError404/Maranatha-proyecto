import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calcularTotales } from '../hooks/useAsistencia';

// Datos de ejemplo para cuando no hay ningún servicio registrado (domingos reales).
const EJEMPLO = [
  { id: 'demo-1', fecha: '2026-10-25', asistencia: 345 },
  { id: 'demo-2', fecha: '2026-10-18', asistencia: 312 },
  { id: 'demo-3', fecha: '2026-10-11', asistencia: 328 },
];

/** Lee los servicios guardados localmente (borradores por fecha). */
const leerServiciosLocales = () => {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const m = k && k.match(/^maranatha:servicio:(\d{4}-\d{2}-\d{2})$/);
      if (!m) continue;
      const estado = JSON.parse(localStorage.getItem(k));
      const t = calcularTotales(estado);
      out.push({
        id: `local-${m[1]}`,
        fecha: m[1],
        asistencia: t.totalNinos + t.totalServidores,
        estado,
        origen: 'local',
      });
    }
  } catch {
    /* ignore */
  }
  return out.sort((a, b) => b.fecha.localeCompare(a.fecha));
};

/**
 * Historial de servicios dominicales.
 * - Con Supabase: lee la tabla `servicios`.
 * - Sin Supabase: usa los servicios guardados en el dispositivo, o datos de
 *   ejemplo si aún no hay ninguno.
 */
export const serviciosService = {
  modoLocal: !isSupabaseConfigured,

  async fetchHistorial(limite = 12) {
    if (!isSupabaseConfigured) {
      const locales = leerServiciosLocales();
      if (locales.length > 0) return { data: locales.slice(0, limite), demo: false };
      return { data: EJEMPLO, demo: true };
    }

    const { data, error } = await supabase
      .from('servicios')
      .select('id, fecha, total_ninos, total_servidores')
      .order('fecha', { ascending: false })
      .limit(limite);
    if (error) throw error;

    if (!data || data.length === 0) return { data: EJEMPLO, demo: true };

    const mapeado = data.map((s) => ({
      id: s.id,
      fecha: s.fecha,
      asistencia: (s.total_ninos || 0) + (s.total_servidores || 0),
      origen: 'supabase',
    }));
    return { data: mapeado, demo: false };
  },

  /** Obtiene el detalle (estado completo) de un servicio para el reporte. */
  async fetchDetalle(row) {
    // Servicio local: ya trae su estado.
    if (row.estado) return row.estado;

    // Fila de ejemplo: no hay detalle.
    if (!isSupabaseConfigured || String(row.id).startsWith('demo')) return null;

    const { data, error } = await supabase
      .from('servicio_detalles')
      .select('data')
      .eq('servicio_id', row.id)
      .maybeSingle();
    if (error) throw error;
    return data?.data || null;
  },
};
