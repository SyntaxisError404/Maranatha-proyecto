const KEY = 'maranatha:preferencias';
const EVENTO = 'maranatha:preferencias-change';

export const PREFS_DEFAULT = {
  congregacion: 'Iglesia Cristiana de Avivamiento Maranatha Venezuela',
  responsable: '',
  confirmarEliminar: true,
};

/** Lee las preferencias combinadas con los valores por defecto. */
export const getPreferencias = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...PREFS_DEFAULT, ...JSON.parse(raw) } : { ...PREFS_DEFAULT };
  } catch {
    return { ...PREFS_DEFAULT };
  }
};

/** Guarda las preferencias y notifica a los componentes suscritos. */
export const setPreferencias = (prefs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: prefs }));
  } catch {
    /* almacenamiento no disponible */
  }
};

export const PREFS_EVENT = EVENTO;
