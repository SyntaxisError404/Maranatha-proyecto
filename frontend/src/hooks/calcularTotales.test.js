import { describe, it, expect } from 'vitest';
import { calcularTotales } from './useAsistencia';

describe('calcularTotales', () => {
  it('suma niños por sección y servidores presentes', () => {
    const estado = {
      conteoMaternal: [
        { salon: 'cuna', hembras: 5, varones: 3 },
        { salon: 'sala1', hembras: 2, varones: 4 },
      ],
      conteoInfantil: [{ salon: 'f', hembras: 10, varones: 10 }],
      conteoPrejuvenil: [],
      asistenciaMaternal: [{ servidorId: '1' }, { servidorId: '2' }],
      asistenciaInfantil: [{ servidorId: '14' }],
      asistenciaPrejuvenil: [],
      asistenciaLogistica: [
        { servidorId: '37', asistio: true },
        { servidorId: '38', asistio: false },
      ],
    };

    const t = calcularTotales(estado);

    expect(t.ninosMaternal).toBe(14); // 5+3 + 2+4
    expect(t.ninosInfantil).toBe(20);
    expect(t.ninosPrejuvenil).toBe(0);
    expect(t.totalNinos).toBe(34);
    // 2 (maternal) + 1 (infantil) + 0 (prejuvenil) + 1 (logística presente)
    expect(t.totalServidores).toBe(4);
    expect(t.porSeccion.Maternal).toEqual({ hembras: 7, varones: 7 });
  });

  it('maneja un estado vacío sin fallar', () => {
    const t = calcularTotales({});
    expect(t.totalNinos).toBe(0);
    expect(t.totalServidores).toBe(0);
  });

  it('ignora valores no numéricos en el conteo', () => {
    const t = calcularTotales({
      conteoMaternal: [{ salon: 'cuna', hembras: 'x', varones: 3 }],
    });
    expect(t.ninosMaternal).toBe(3);
  });
});
