import { describe, it, expect } from 'vitest';
import {
  formatFechaLarga,
  formatFechaCorta,
  toISODate,
  getIniciales,
  formatNombre,
  formatCedula,
  formatNumero,
  formatPorcentaje,
  pluralizar,
} from './formatters';

describe('formatters', () => {
  it('formatFechaLarga devuelve texto largo en español', () => {
    // 2026-10-25 fue domingo
    expect(formatFechaLarga('2026-10-25')).toBe('Domingo 25 de octubre de 2026');
  });

  it('formatFechaLarga maneja valores vacíos', () => {
    expect(formatFechaLarga('')).toBe('');
    expect(formatFechaLarga(null)).toBe('');
  });

  it('formatFechaCorta usa dd/mm/yyyy', () => {
    expect(formatFechaCorta('2026-01-05')).toBe('05/01/2026');
  });

  it('toISODate produce YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 2, 9))).toBe('2026-03-09');
  });

  it('getIniciales toma máximo dos iniciales', () => {
    expect(getIniciales('Juan Carlos Pérez')).toBe('JP');
    expect(getIniciales('Rosmary')).toBe('RO');
    expect(getIniciales('')).toBe('??');
  });

  it('formatNombre normaliza y capitaliza', () => {
    expect(formatNombre('  juan   pérez ')).toBe('Juan Pérez');
  });

  it('formatCedula agrega separadores y prefijo', () => {
    expect(formatCedula('V12345678')).toBe('V-12.345.678');
    expect(formatCedula('12345678')).toBe('12.345.678');
  });

  it('formatNumero usa separador de miles', () => {
    expect(formatNumero(1248)).toBe('1.248');
    expect(formatNumero('abc')).toBe('0');
  });

  it('formatPorcentaje usa coma decimal', () => {
    expect(formatPorcentaje(12.5)).toBe('12,5%');
  });

  it('pluralizar concuerda en número', () => {
    expect(pluralizar(1, 'niño')).toBe('1 niño');
    expect(pluralizar(3, 'niño')).toBe('3 niños');
    expect(pluralizar(2, 'merienda')).toBe('2 meriendas');
  });
});
