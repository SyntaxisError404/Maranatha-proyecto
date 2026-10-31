/**
 * Utilidades de formato reutilizables para Maranatha Kids.
 * Centraliza el formateo de fechas, nombres, números y cédulas
 * para mantener consistencia en toda la aplicación.
 */

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DIAS = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
];

/**
 * Convierte un valor de fecha (Date, ISO string "YYYY-MM-DD" o timestamp)
 * en un objeto Date válido, interpretando las fechas simples como locales
 * para evitar el desfase de zona horaria de `new Date("YYYY-MM-DD")`.
 */
const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === 'string') {
    const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (soloFecha) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Formatea una fecha a texto largo en español.
 * Ej: "Domingo 08 de junio de 2026"
 */
export const formatFechaLarga = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const dia = DIAS[date.getDay()];
  const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1);
  const num = String(date.getDate()).padStart(2, '0');
  return `${diaCap} ${num} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
};

/**
 * Formatea una fecha a formato corto numérico.
 * Ej: "08/06/2026"
 */
export const formatFechaCorta = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
};

/**
 * Devuelve la fecha en formato ISO simple "YYYY-MM-DD" (local),
 * útil para inputs de tipo date.
 */
export const toISODate = (value = new Date()) => {
  const date = toDate(value) || new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Formatea una hora a "HH:MM" (24h).
 */
export const formatHora = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

/**
 * Obtiene las iniciales (máximo 2) a partir de un nombre completo.
 * Ej: "Juan Carlos Pérez" -> "JP"
 */
export const getIniciales = (nombre) => {
  if (!nombre || typeof nombre !== 'string') return '??';
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '??';
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
};

/**
 * Normaliza un nombre propio: recorta espacios y capitaliza cada palabra.
 * Ej: "  juan  pérez " -> "Juan Pérez"
 */
export const formatNombre = (nombre) => {
  if (!nombre || typeof nombre !== 'string') return '';
  return nombre
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());
};

/**
 * Formatea una cédula venezolana agregando separadores de miles.
 * Acepta prefijo opcional V/E. Ej: "V12345678" -> "V-12.345.678"
 */
export const formatCedula = (cedula) => {
  if (cedula === null || cedula === undefined) return '';
  const raw = String(cedula).toUpperCase().replace(/[^0-9VE]/g, '');
  const prefijo = /^[VE]/.test(raw) ? raw[0] : '';
  const numeros = raw.replace(/[^0-9]/g, '');
  if (!numeros) return prefijo;
  const conPuntos = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return prefijo ? `${prefijo}-${conPuntos}` : conPuntos;
};

/**
 * Formatea un número entero con separadores de miles (es-VE).
 * Ej: 1248 -> "1.248"
 */
export const formatNumero = (valor) => {
  const n = Number(valor);
  if (Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('es-VE').format(n);
};

/**
 * Formatea un porcentaje con un decimal. Ej: 12.5 -> "12,5%"
 */
export const formatPorcentaje = (valor, decimales = 1) => {
  const n = Number(valor);
  if (Number.isNaN(n)) return '0%';
  return `${n.toFixed(decimales).replace('.', ',')}%`;
};

/**
 * Pluraliza una palabra según la cantidad.
 * Ej: pluralizar(1, 'niño') -> "1 niño"; pluralizar(3, 'niño') -> "3 niños"
 */
export const pluralizar = (cantidad, singular, plural = `${singular}s`) => {
  const n = Number(cantidad) || 0;
  return `${formatNumero(n)} ${n === 1 ? singular : plural}`;
};
