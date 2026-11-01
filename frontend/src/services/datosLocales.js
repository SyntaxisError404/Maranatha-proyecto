import { toISODate } from '../utils/formatters';

const PREFIJO = 'maranatha:';

/** Devuelve todas las claves de la app guardadas en localStorage. */
const clavesApp = () => {
  const claves = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIJO)) claves.push(k);
    }
  } catch {
    /* ignore */
  }
  return claves;
};

/** Resume cuánta información local hay guardada. */
export const resumenDatos = () => {
  const claves = clavesApp();
  const borradores = claves.filter((k) => k.startsWith('maranatha:servicio:') && k !== 'maranatha:servicio:last');
  let bytes = 0;
  for (const k of claves) {
    try {
      bytes += (localStorage.getItem(k) || '').length;
    } catch {
      /* ignore */
    }
  }
  return {
    totalClaves: claves.length,
    borradores: borradores.length,
    tieneServidoresLocales: claves.includes('maranatha:servidores'),
    kb: Math.round((bytes / 1024) * 10) / 10,
  };
};

/** Exporta todos los datos de la app a un archivo JSON descargable. */
export const exportarDatos = () => {
  const data = {};
  for (const k of clavesApp()) {
    try {
      data[k] = JSON.parse(localStorage.getItem(k));
    } catch {
      data[k] = localStorage.getItem(k);
    }
  }
  const payload = {
    app: 'Maranatha Kids',
    exportadoEl: new Date().toISOString(),
    datos: data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maranatha-respaldo-${toISODate()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Importa datos desde el contenido de un archivo exportado.
 * Devuelve el número de claves restauradas.
 */
export const importarDatos = (contenido) => {
  const parsed = JSON.parse(contenido);
  const datos = parsed?.datos ?? parsed;
  if (!datos || typeof datos !== 'object') {
    throw new Error('El archivo no tiene un formato válido.');
  }
  let n = 0;
  for (const [k, v] of Object.entries(datos)) {
    if (!k.startsWith(PREFIJO)) continue;
    localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    n += 1;
  }
  return n;
};

/** Borra los borradores de servicios (conserva servidores y preferencias). */
export const borrarBorradores = () => {
  const aBorrar = clavesApp().filter((k) => k.startsWith('maranatha:servicio:'));
  aBorrar.forEach((k) => localStorage.removeItem(k));
  return aBorrar.length;
};

/** Restablece todos los datos locales de la app (servidores, servicios, preferencias). */
export const restablecerTodo = () => {
  clavesApp().forEach((k) => localStorage.removeItem(k));
};
