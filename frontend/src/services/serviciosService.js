import { supabase, isSupabaseConfigured } from './supabaseClient';

// Datos de ejemplo para modo demo (domingos reales previos).
const EJEMPLO = [
  { id: 'demo-1', fecha: '2026-10-25', asistencia: 345 },
  { id: 'demo-2', fecha: '2026-10-18', asistencia: 312 },
  { id: 'demo-3', fecha: '2026-10-11', asistencia: 328 },
];

/**
 * Servicio de consulta del historial de servicios dominicales.
 * Lee de Supabase cuando está configurado; si no, o si no hay registros,
 * devuelve datos de ejemplo para que la pantalla no quede vacía.
 */
export const serviciosService = {
  modoLocal: !isSupabaseConfigured,

  async fetchHistorial(limite = 12) {
    if (!isSupabaseConfigured) return { data: EJEMPLO, demo: true };

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
    }));
    return { data: mapeado, demo: false };
  },
};
