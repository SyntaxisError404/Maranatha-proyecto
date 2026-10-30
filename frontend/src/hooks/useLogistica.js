import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { mockServidores, salonesConfig } from '../data/mockData';

/**
 * Hook de logística: provee los servidores y salones que necesitan las
 * pantallas de Servicio Dominical, Logística y Salones.
 *
 * - Con Supabase configurado: lee `servidores` y `salones` de la base de datos.
 * - En modo demo (sin Supabase): cae a los datos de `data/mockData.js`, para
 *   que la interfaz siga funcionando sin conexión.
 *
 * Normaliza los servidores a la forma { id, nombre, grupo, funcionDefault }
 * que ya consumen los componentes.
 */
export function useLogistica() {
  const [servidores, setServidores] = useState([]);
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Modo demo: usar datos mock
    if (!isSupabaseConfigured) {
      setServidores(mockServidores);
      setSalones(aplanarSalonesMock());
      setLoading(false);
      return;
    }

    try {
      const [srvRes, salRes] = await Promise.all([
        supabase.from('servidores').select('*').eq('activo', true).order('nombre'),
        supabase.from('salones').select('*').order('orden'),
      ]);
      if (srvRes.error) throw srvRes.error;
      if (salRes.error) throw salRes.error;

      setServidores((srvRes.data || []).map(normalizarServidor));
      setSalones(salRes.data || []);
    } catch (err) {
      console.error('Error al cargar logística; se usan datos demo:', err);
      setError(err);
      // Caída elegante a mock si la red falla
      setServidores(mockServidores);
      setSalones(aplanarSalonesMock());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Servidores agrupados por grupo/equipo: { 'Maternal': [...], 'Almacén': [...] }
  const servidoresPorGrupo = useMemo(() => {
    return servidores.reduce((acc, s) => {
      (acc[s.grupo] ||= []).push(s);
      return acc;
    }, {});
  }, [servidores]);

  // Salones agrupados por sección: { Maternal: [...], Infantil: [...], ... }
  const salonesPorSeccion = useMemo(() => {
    return salones.reduce((acc, s) => {
      (acc[s.seccion] ||= []).push(s);
      return acc;
    }, {});
  }, [salones]);

  return {
    isConfigured: isSupabaseConfigured,
    loading,
    error,
    servidores,
    salones,
    servidoresPorGrupo,
    salonesPorSeccion,
    recargar: cargar,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normaliza una fila de la BD (funcion_default) a la forma del frontend. */
function normalizarServidor(row) {
  return {
    id: String(row.id),
    nombre: row.nombre,
    grupo: row.grupo,
    funcionDefault: row.funcion_default || row.funcionDefault || 'Servidor',
  };
}

/** Convierte el salonesConfig mock ({seccion: [...]}) en una lista plana. */
function aplanarSalonesMock() {
  return Object.entries(salonesConfig).flatMap(([seccion, lista]) =>
    lista.map((s, i) => ({ ...s, seccion, orden: i + 1 }))
  );
}
