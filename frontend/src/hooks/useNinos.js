import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

/**
 * Hook CRUD para los niños. Con Supabase lee/escribe la tabla `ninos`; en modo
 * demo mantiene una lista en memoria (sembrada con ejemplos) para que la
 * pantalla funcione sin conexión.
 */
export function useNinos() {
  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setNinos(NINOS_DEMO);
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase.from('ninos').select('*').order('nombre');
      if (err) throw err;
      setNinos(data || []);
    } catch (err) {
      console.error('Error al cargar niños; se usan datos demo:', err);
      setError(err);
      setNinos(NINOS_DEMO);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crear = useCallback(async (datos) => {
    const payload = { ...datos, codigo_qr: datos.codigo_qr || generarCodigoQR() };

    if (!isSupabaseConfigured) {
      const nuevo = { ...payload, id: `demo-${Date.now()}`, activo: true };
      setNinos((prev) => [...prev, nuevo]);
      return { data: nuevo, error: null };
    }

    const { data, error: err } = await supabase.from('ninos').insert(payload).select().single();
    if (!err) setNinos((prev) => [...prev, data]);
    return { data, error: err };
  }, []);

  const actualizar = useCallback(async (id, datos) => {
    if (!isSupabaseConfigured) {
      setNinos((prev) => prev.map((n) => (n.id === id ? { ...n, ...datos } : n)));
      return { error: null };
    }

    const { data, error: err } = await supabase.from('ninos').update(datos).eq('id', id).select().single();
    if (!err) setNinos((prev) => prev.map((n) => (n.id === id ? data : n)));
    return { data, error: err };
  }, []);

  const eliminar = useCallback(async (id) => {
    if (!isSupabaseConfigured) {
      setNinos((prev) => prev.filter((n) => n.id !== id));
      return { error: null };
    }

    const { error: err } = await supabase.from('ninos').delete().eq('id', id);
    if (!err) setNinos((prev) => prev.filter((n) => n.id !== id));
    return { error: err };
  }, []);

  return { isConfigured: isSupabaseConfigured, loading, error, ninos, crear, actualizar, eliminar, recargar: cargar };
}

/** Genera un código QR legible y único: MK-XXXX. */
export function generarCodigoQR() {
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MK-${aleatorio}`;
}

// Datos de ejemplo para el modo demo (coinciden con database/seed.sql)
const NINOS_DEMO = [
  { id: 'demo-1', nombre: 'Samuel Pérez',    genero: 'M', salon_id: 'sala2',   codigo_qr: 'MK-0001', representante: 'Ana Pérez',       telefono: '0412-0000001', activo: true },
  { id: 'demo-2', nombre: 'Valentina López', genero: 'F', salon_id: 'd',       codigo_qr: 'MK-0002', representante: 'Luis López',      telefono: '0414-0000002', activo: true },
  { id: 'demo-3', nombre: 'Mateo Rodríguez', genero: 'M', salon_id: 'f',       codigo_qr: 'MK-0003', representante: 'Carla Rodríguez', telefono: '0416-0000003', activo: true },
  { id: 'demo-4', nombre: 'Isabella Gómez',  genero: 'F', salon_id: 'h',       codigo_qr: 'MK-0004', representante: 'Pedro Gómez',     telefono: '0424-0000004', activo: true },
  { id: 'demo-5', nombre: 'Daniel Suárez',   genero: 'M', salon_id: 'comedor', codigo_qr: 'MK-0005', representante: 'Rosa Suárez',     telefono: '0426-0000005', activo: true },
];
