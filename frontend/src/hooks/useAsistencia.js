import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { salonesConfig } from '../data/mockData';

// Mapa salon_id -> sección (Maternal/Infantil/Prejuvenil), para reconstruir
// el conteo de niños (que en la BD no guarda la sección, solo el salón).
const SALON_A_SECCION = Object.entries(salonesConfig).reduce((acc, [seccion, salones]) => {
  for (const s of salones) acc[s.id] = seccion;
  return acc;
}, {});

/**
 * Hook para el registro del Servicio Dominical y el check-in de niños por QR.
 *
 * Carga y guarda el estado completo de un servicio (asistencia de servidores,
 * conteo de niños, líderes, logística, otras áreas y salones cerrados) en la
 * forma que ya usa la página ServicioDominical, y expone el check-in en vivo.
 *
 * En modo demo (sin Supabase configurado) no hace llamadas de red: devuelve
 * datos vacíos y funciones que avisan en consola, para que la app no se rompa.
 *
 * @param {string} [fecha] Fecha del servicio en formato 'YYYY-MM-DD'.
 */
export function useAsistencia(fecha) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [ninosPresentes, setNinosPresentes] = useState([]);

  // --- Cargar el estado de un servicio por fecha ---------------------------
  const cargarServicio = useCallback(async (fechaServicio) => {
    if (!isSupabaseConfigured) return null;
    const f = fechaServicio || fecha;
    if (!f) return null;

    setLoading(true);
    setError(null);
    try {
      const { data: srv, error: e1 } = await supabase
        .from('servicios')
        .select('*')
        .eq('fecha', f)
        .maybeSingle();
      if (e1) throw e1;

      setServicio(srv || null);
      if (!srv) return null;

      const [asis, conteo, lideres, otras, cerrados] = await Promise.all([
        supabase.from('asistencia_servidores').select('*').eq('servicio_id', srv.id),
        supabase.from('conteo_ninos').select('*').eq('servicio_id', srv.id),
        supabase.from('lideres_seccion').select('*').eq('servicio_id', srv.id),
        supabase.from('otras_areas').select('*').eq('servicio_id', srv.id),
        supabase.from('salones_cerrados').select('*').eq('servicio_id', srv.id),
      ]);

      const firstError = [asis, conteo, lideres, otras, cerrados].find((r) => r.error);
      if (firstError) throw firstError.error;

      return reconstruirEstado(srv, {
        asistencia: asis.data || [],
        conteo: conteo.data || [],
        lideres: lideres.data || [],
        otras: otras.data || [],
        cerrados: cerrados.data || [],
      });
    } catch (err) {
      console.error('Error al cargar el servicio:', err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  // --- Guardar el estado completo de un servicio ---------------------------
  const guardarServicio = useCallback(async (fechaServicio, estado) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase no está configurado (modo demo).') };
    }
    const f = fechaServicio || fecha;
    if (!f) return { error: new Error('Falta la fecha del servicio.') };

    setLoading(true);
    setError(null);
    try {
      // 1. Upsert de la cabecera del servicio (por fecha)
      const { data: srv, error: e1 } = await supabase
        .from('servicios')
        .upsert(
          { fecha: f, realizado_por: estado?.lideresLogistica?.realizado_por || null },
          { onConflict: 'fecha' }
        )
        .select()
        .single();
      if (e1) throw e1;

      const servicioId = srv.id;

      // 2. Reemplazar las filas hijas (borrar y reinsertar)
      const filas = aplanarEstado(servicioId, estado);

      await borrarHijos(servicioId);

      const inserts = [];
      if (filas.asistencia.length) inserts.push(supabase.from('asistencia_servidores').insert(filas.asistencia));
      if (filas.conteo.length) inserts.push(supabase.from('conteo_ninos').insert(filas.conteo));
      if (filas.lideres.length) inserts.push(supabase.from('lideres_seccion').insert(filas.lideres));
      if (filas.otras.length) inserts.push(supabase.from('otras_areas').insert(filas.otras));
      if (filas.cerrados.length) inserts.push(supabase.from('salones_cerrados').insert(filas.cerrados));

      const resultados = await Promise.all(inserts);
      const insertError = resultados.find((r) => r.error);
      if (insertError) throw insertError.error;

      setServicio(srv);
      return { data: srv, error: null };
    } catch (err) {
      console.error('Error al guardar el servicio:', err);
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  // --- Check-in de niños por QR -------------------------------------------
  const registrarEntradaQR = useCallback(async (codigoQr) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase no está configurado (modo demo).') };
    }
    const { data, error: err } = await supabase.rpc('registrar_entrada_qr', {
      p_codigo_qr: codigoQr,
      p_servicio_id: servicio?.id || null,
    });
    if (err) return { error: err };
    await recargarPresentes();
    return { data, error: null };
  }, [servicio]);

  const registrarSalida = useCallback(async (asistenciaId) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase no está configurado (modo demo).') };
    }
    const { data, error: err } = await supabase.rpc('marcar_salida', {
      p_asistencia_id: asistenciaId,
    });
    if (err) return { error: err };
    await recargarPresentes();
    return { data, error: null };
  }, []);

  const recargarPresentes = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data, error: err } = await supabase.from('vw_ninos_presentes').select('*');
    if (!err) setNinosPresentes(data || []);
  }, []);

  // Suscripción en tiempo real al check-in de niños
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    recargarPresentes();

    const canal = supabase
      .channel('asistencia_ninos_cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asistencia_ninos' }, () => {
        recargarPresentes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [recargarPresentes]);

  return {
    isConfigured: isSupabaseConfigured,
    loading,
    error,
    servicio,
    cargarServicio,
    guardarServicio,
    ninosPresentes,
    registrarEntradaQR,
    registrarSalida,
    recargarPresentes,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SECCIONES = ['Maternal', 'Infantil', 'Prejuvenil'];

/** Aplana el estado de la página al formato de filas de la base de datos. */
function aplanarEstado(servicioId, estado = {}) {
  const asistencia = [];
  const conteo = [];
  const lideres = [];
  const otras = [];
  const cerrados = [];

  for (const seccion of SECCIONES) {
    const asis = estado[`asistencia${seccion}`] || [];
    for (const a of asis) {
      asistencia.push({
        servicio_id: servicioId,
        servidor_id: Number(a.servidorId),
        seccion,
        salon_id: a.salon,
        rol: a.rol || null,
        asistio: true,
      });
    }

    const cnt = estado[`conteo${seccion}`] || [];
    for (const c of cnt) {
      conteo.push({
        servicio_id: servicioId,
        salon_id: c.salon,
        hembras: Number(c.hembras) || 0,
        varones: Number(c.varones) || 0,
      });
    }

    const lid = estado[`lideres${seccion}`] || {};
    if (lid.capitan || lid.mano_derecha || lid.cesta_amor) {
      lideres.push({
        servicio_id: servicioId,
        seccion,
        capitan: lid.capitan || null,
        mano_derecha: lid.mano_derecha || null,
        cesta_amor: lid.cesta_amor || null,
      });
    }
  }

  // Logística: salon_id null, seccion = equipo
  for (const a of estado.asistenciaLogistica || []) {
    asistencia.push({
      servicio_id: servicioId,
      servidor_id: Number(a.servidorId),
      seccion: a.equipo,
      salon_id: null,
      rol: null,
      asistio: Boolean(a.asistio),
    });
  }

  // Otras áreas: objeto { area: total }
  for (const [area, total] of Object.entries(estado.otrasAreas || {})) {
    const n = Number(total) || 0;
    if (n > 0) otras.push({ servicio_id: servicioId, area, total: n });
  }

  // Salones cerrados
  for (const salonId of estado.salonesCerrados || []) {
    cerrados.push({ servicio_id: servicioId, salon_id: salonId });
  }

  return { asistencia, conteo, lideres, otras, cerrados };
}

/** Reconstruye el estado de la página desde las filas de la base de datos. */
function reconstruirEstado(srv, filas) {
  const estado = { fecha: srv.fecha };

  for (const seccion of SECCIONES) {
    estado[`asistencia${seccion}`] = filas.asistencia
      .filter((a) => a.seccion === seccion && a.salon_id)
      .map((a) => ({ servidorId: String(a.servidor_id), salon: a.salon_id, rol: a.rol }));

    estado[`conteo${seccion}`] = filas.conteo
      .filter((c) => SALON_A_SECCION[c.salon_id] === seccion)
      .map((c) => ({ salon: c.salon_id, hembras: c.hembras, varones: c.varones }));

    const lid = filas.lideres.find((l) => l.seccion === seccion);
    estado[`lideres${seccion}`] = lid
      ? { capitan: lid.capitan || '', mano_derecha: lid.mano_derecha || '', cesta_amor: lid.cesta_amor || '' }
      : {};
  }

  // Logística: filas con salon_id null
  estado.asistenciaLogistica = filas.asistencia
    .filter((a) => !a.salon_id && SECCIONES.indexOf(a.seccion) === -1)
    .map((a) => ({ servidorId: String(a.servidor_id), equipo: a.seccion, asistio: a.asistio }));

  estado.lideresLogistica = { realizado_por: srv.realizado_por || '' };

  estado.otrasAreas = {};
  for (const o of filas.otras) estado.otrasAreas[o.area] = o.total;

  estado.salonesCerrados = filas.cerrados.map((c) => c.salon_id);

  return estado;
}

/** Borra las filas hijas de un servicio antes de reinsertarlas. */
async function borrarHijos(servicioId) {
  await Promise.all([
    supabase.from('asistencia_servidores').delete().eq('servicio_id', servicioId),
    supabase.from('conteo_ninos').delete().eq('servicio_id', servicioId),
    supabase.from('lideres_seccion').delete().eq('servicio_id', servicioId),
    supabase.from('otras_areas').delete().eq('servicio_id', servicioId),
    supabase.from('salones_cerrados').delete().eq('servicio_id', servicioId),
  ]);
}
