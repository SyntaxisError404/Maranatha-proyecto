import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Indica si la app tiene credenciales reales de Supabase.
// Los módulos (hooks, páginas) lo usan para degradar a modo demo/offline.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Las variables de entorno de Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) no están configuradas. ' +
    'Por favor verifica tu archivo .env local para conectarte con la base de datos de producción.'
  );
}

// Inicialización limpia y robusta del cliente Supabase con valores de respaldo
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
