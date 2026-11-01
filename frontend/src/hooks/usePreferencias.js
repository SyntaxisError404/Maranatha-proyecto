import { useCallback, useEffect, useState } from 'react';
import { getPreferencias, setPreferencias, PREFS_EVENT } from '../services/preferencias';

/**
 * Hook reactivo para las preferencias de la aplicación.
 * Se mantiene sincronizado entre componentes y pestañas.
 */
export const usePreferencias = () => {
  const [prefs, setPrefs] = useState(getPreferencias);

  useEffect(() => {
    const refrescar = () => setPrefs(getPreferencias());
    window.addEventListener(PREFS_EVENT, refrescar);
    window.addEventListener('storage', refrescar);
    return () => {
      window.removeEventListener(PREFS_EVENT, refrescar);
      window.removeEventListener('storage', refrescar);
    };
  }, []);

  const actualizar = useCallback((cambios) => {
    const next = { ...getPreferencias(), ...cambios };
    setPreferencias(next);
    setPrefs(next);
  }, []);

  return { prefs, actualizar };
};
