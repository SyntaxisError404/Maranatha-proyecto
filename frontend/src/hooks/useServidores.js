import { useCallback, useEffect, useState } from 'react';
import { servidoresService } from '../services/servidoresService';

/**
 * Hook para gestionar los servidores con operaciones CRUD.
 * Carga desde Supabase (o localStorage en modo demo) y expone
 * métodos que devuelven {ok, error} para que la página muestre feedback.
 */
export const useServidores = () => {
  const [servidores, setServidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servidoresService.fetchAll();
      setServidores(data);
    } catch (e) {
      console.error('Error al cargar servidores:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const add = useCallback(async (servidor) => {
    try {
      const nuevo = await servidoresService.create(servidor);
      setServidores((prev) => [...prev, nuevo]);
      return { ok: true };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e };
    }
  }, []);

  const update = useCallback(async (id, cambios) => {
    try {
      const actualizado = await servidoresService.update(id, cambios);
      setServidores((prev) =>
        prev.map((s) => (String(s.id) === String(id) ? actualizado : s))
      );
      return { ok: true };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e };
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await servidoresService.remove(id);
      setServidores((prev) => prev.filter((s) => String(s.id) !== String(id)));
      return { ok: true };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e };
    }
  }, []);

  return {
    servidores,
    loading,
    error,
    modoLocal: servidoresService.modoLocal,
    add,
    update,
    remove,
    recargar: cargar,
  };
};
