import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { toISODate } from '../utils/formatters';

const STORAGE_PREFIX = 'maranatha:servicio:';
export const LAST_SERVICIO_KEY = `${STORAGE_PREFIX}last`;

const estadoInicial = () => ({
  asistenciaMaternal: [],
  asistenciaInfantil: [],
  asistenciaPrejuvenil: [],
  asistenciaLogistica: [],
  conteoMaternal: [],
  conteoInfantil: [],
  conteoPrejuvenil: [],
  lideresMaternal: {},
  lideresInfantil: {},
  lideresPrejuvenil: {},
  lideresLogistica: { realizado_por: '' },
  otrasAreas: {
    Ujieres: 0, Seguridad: 0, Protocolo: 0, Sonido: 0,
    Alabanza: 0, Teatro: 0, 'Semillitas ESP': 0, TV: 0,
  },
  salonesCerrados: [],
});

const leerDraft = (fecha) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${fecha}`);
    return raw ? { ...estadoInicial(), ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
};

/**
 * Hook que centraliza el estado del Servicio Dominical:
 * asistencia de servidores, conteo de niños, líderes y otras áreas.
 *
 * - Persiste un borrador en localStorage por fecha (sobrevive recargas).
 * - `guardarServicio` envía los totales a Supabase cuando está configurado;
 *   si no, conserva el borrador local y avisa al llamador.
 */
export const useAsistencia = (fechaInicial = toISODate()) => {
  const [fecha, setFecha] = useState(fechaInicial);
  const [estado, setEstado] = useState(() => leerDraft(fechaInicial) || estadoInicial());
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const primerRender = useRef(true);

  // Al cambiar de fecha, cargar el borrador correspondiente (o uno nuevo).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    setEstado(leerDraft(fecha) || estadoInicial());
    setGuardado(false);
  }, [fecha]);

  // Persistir el borrador en cada cambio.
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${fecha}`, JSON.stringify(estado));
      localStorage.setItem(LAST_SERVICIO_KEY, JSON.stringify({ fecha, estado }));
    } catch {
      /* almacenamiento no disponible (modo privado); se ignora */
    }
  }, [fecha, estado]);

  // Crea un setter individual por clave que además invalida el estado "guardado".
  const makeSetter = useCallback(
    (clave) => (valorOActualizador) => {
      setGuardado(false);
      setEstado((prev) => ({
        ...prev,
        [clave]:
          typeof valorOActualizador === 'function'
            ? valorOActualizador(prev[clave])
            : valorOActualizador,
      }));
    },
    []
  );

  const setters = useMemo(() => {
    const keys = Object.keys(estadoInicial());
    const out = {};
    for (const k of keys) {
      const nombre = `set${k.charAt(0).toUpperCase()}${k.slice(1)}`;
      out[nombre] = makeSetter(k);
    }
    return out;
  }, [makeSetter]);

  // Totales derivados (reutilizables por estadísticas, cocina y salones).
  const totales = useMemo(() => calcularTotales(estado), [estado]);

  const guardarServicio = useCallback(async () => {
    setGuardando(true);
    try {
      if (!isSupabaseConfigured) {
        // Sin backend configurado: el borrador local ya está guardado.
        setGuardado(true);
        return { ok: true, offline: true };
      }

      const { data: servicio, error: errServicio } = await supabase
        .from('servicios')
        .upsert({ fecha, total_ninos: totales.totalNinos, total_servidores: totales.totalServidores }, { onConflict: 'fecha' })
        .select()
        .single();

      if (errServicio) throw errServicio;

      // Guardado del detalle en una tabla JSON (snapshot del servicio).
      const { error: errDetalle } = await supabase
        .from('servicio_detalles')
        .upsert({ servicio_id: servicio.id, data: estado }, { onConflict: 'servicio_id' });

      if (errDetalle) throw errDetalle;

      setGuardado(true);
      return { ok: true, offline: false };
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      return { ok: false, error };
    } finally {
      setGuardando(false);
    }
  }, [fecha, estado, totales]);

  const resetServicio = useCallback(() => {
    setEstado(estadoInicial());
    setGuardado(false);
  }, []);

  return {
    fecha,
    setFecha,
    estado,
    setters,
    totales,
    guardando,
    guardado,
    guardarServicio,
    resetServicio,
  };
};

/**
 * Calcula los totales de niños y servidores a partir del estado del servicio.
 */
export const calcularTotales = (estado) => {
  const sumConteo = (arr = []) =>
    arr.reduce(
      (acc, c) => {
        acc.hembras += Number(c.hembras) || 0;
        acc.varones += Number(c.varones) || 0;
        return acc;
      },
      { hembras: 0, varones: 0 }
    );

  const m = sumConteo(estado.conteoMaternal);
  const i = sumConteo(estado.conteoInfantil);
  const p = sumConteo(estado.conteoPrejuvenil);

  const totalNinos =
    m.hembras + m.varones + i.hembras + i.varones + p.hembras + p.varones;

  const totalServidores =
    (estado.asistenciaMaternal?.length || 0) +
    (estado.asistenciaInfantil?.length || 0) +
    (estado.asistenciaPrejuvenil?.length || 0) +
    (estado.asistenciaLogistica?.filter((a) => a.asistio).length || 0);

  return {
    porSeccion: { Maternal: m, Infantil: i, Prejuvenil: p },
    totalNinos,
    totalServidores,
    ninosMaternal: m.hembras + m.varones,
    ninosInfantil: i.hembras + i.varones,
    ninosPrejuvenil: p.hembras + p.varones,
  };
};
