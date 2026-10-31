import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockServidores } from '../data/mockData';

const LOCAL_KEY = 'maranatha:servidores';

// --- Fallback local (modo demo/offline) -----------------------------------
// Persiste en localStorage, sembrando desde mockData la primera vez.
const leerLocal = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const seed = mockServidores.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    grupo: s.grupo,
    funcion: s.funcionDefault || 'Servidor',
  }));
  escribirLocal(seed);
  return seed;
};

const escribirLocal = (lista) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(lista));
  } catch {
    /* ignore */
  }
};

const normalizar = (s) => ({
  id: String(s.id),
  nombre: s.nombre || s.name || '',
  grupo: s.grupo || s.group || '',
  funcion: s.funcion || s.funcionDefault || 'Servidor',
  cedula: s.cedula || '',
});

/**
 * Servicio de datos de servidores. Usa Supabase cuando está configurado;
 * de lo contrario trabaja contra localStorage (modo demo), de modo que la
 * interfaz funciona idéntica en ambos casos.
 */
export const servidoresService = {
  modoLocal: !isSupabaseConfigured,

  async fetchAll() {
    if (!isSupabaseConfigured) {
      return leerLocal().map(normalizar);
    }
    const { data, error } = await supabase
      .from('servidores')
      .select('*')
      .eq('activo', true)
      .order('grupo', { ascending: true })
      .order('nombre', { ascending: true });
    if (error) throw error;
    return (data || []).map(normalizar);
  },

  async create(servidor) {
    if (!isSupabaseConfigured) {
      const lista = leerLocal();
      const nuevoId = String(
        lista.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1
      );
      const nuevo = { id: nuevoId, ...servidor };
      escribirLocal([...lista, nuevo]);
      return normalizar(nuevo);
    }
    const { data, error } = await supabase
      .from('servidores')
      .insert({
        nombre: servidor.nombre,
        grupo: servidor.grupo,
        funcion: servidor.funcion,
        cedula: servidor.cedula || null,
      })
      .select()
      .single();
    if (error) throw error;
    return normalizar(data);
  },

  async update(id, cambios) {
    if (!isSupabaseConfigured) {
      const lista = leerLocal().map((s) =>
        String(s.id) === String(id) ? { ...s, ...cambios } : s
      );
      escribirLocal(lista);
      return normalizar(lista.find((s) => String(s.id) === String(id)));
    }
    const { data, error } = await supabase
      .from('servidores')
      .update({
        nombre: cambios.nombre,
        grupo: cambios.grupo,
        funcion: cambios.funcion,
        cedula: cambios.cedula || null,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return normalizar(data);
  },

  async remove(id) {
    if (!isSupabaseConfigured) {
      escribirLocal(leerLocal().filter((s) => String(s.id) !== String(id)));
      return;
    }
    // Baja lógica para conservar el histórico de asistencia.
    const { error } = await supabase
      .from('servidores')
      .update({ activo: false })
      .eq('id', id);
    if (error) throw error;
  },
};
