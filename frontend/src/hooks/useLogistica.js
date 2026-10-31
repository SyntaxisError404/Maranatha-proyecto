import { useCallback, useEffect, useState } from 'react';
import { LAST_SERVICIO_KEY, calcularTotales } from './useAsistencia';
import { salonesConfig } from '../data/mockData';

const leerUltimoServicio = () => {
  try {
    const raw = localStorage.getItem(LAST_SERVICIO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Hook de logística de cocina: calcula las raciones de merienda necesarias
 * por sección a partir del último servicio registrado (niños + servidores).
 *
 * Es una vista derivada; no mantiene estado propio de servidores para evitar
 * duplicar la fuente de verdad del Servicio Dominical.
 */
export const useLogistica = () => {
  const [servicio, setServicio] = useState(() => leerUltimoServicio());

  const recargar = useCallback(() => {
    setServicio(leerUltimoServicio());
  }, []);

  // Mantener sincronizado si otra pestaña actualiza el servicio.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LAST_SERVICIO_KEY) recargar();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [recargar]);

  const estado = servicio?.estado || null;
  const fecha = servicio?.fecha || null;
  const totales = estado ? calcularTotales(estado) : null;

  const secciones = ['Maternal', 'Infantil', 'Prejuvenil'];

  const asistenciaKey = {
    Maternal: 'asistenciaMaternal',
    Infantil: 'asistenciaInfantil',
    Prejuvenil: 'asistenciaPrejuvenil',
  };

  const raciones = secciones.map((seccion) => {
    const ninos = totales?.porSeccion?.[seccion];
    const nNinos = ninos ? ninos.hembras + ninos.varones : 0;
    const nServidores = estado?.[asistenciaKey[seccion]]?.length || 0;
    const nSalones = salonesConfig[seccion]?.length || 0;
    return {
      seccion,
      ninos: nNinos,
      servidores: nServidores,
      salones: nSalones,
      // Una merienda por niño y una por servidor presente.
      meriendas: nNinos + nServidores,
    };
  });

  const totalMeriendas = raciones.reduce((acc, r) => acc + r.meriendas, 0);
  const totalNinos = totales?.totalNinos || 0;
  const totalServidores = raciones.reduce((acc, r) => acc + r.servidores, 0);

  return {
    hayDatos: Boolean(estado),
    fecha,
    raciones,
    totalMeriendas,
    totalNinos,
    totalServidores,
    recargar,
  };
};
