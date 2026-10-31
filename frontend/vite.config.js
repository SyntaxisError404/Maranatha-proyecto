import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Maranatha Kids - Control de Asistencia',
        short_name: 'Maranatha Kids',
        description:
          'Control de asistencia e integración escolar de la Iglesia Maranatha Venezuela.',
        lang: 'es',
        theme_color: '#0a4693',
        background_color: '#0a4693',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Separa dependencias grandes en chunks propios para mejor cacheo
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          qr: ['html5-qrcode'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
