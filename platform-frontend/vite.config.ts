import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'favicon.ico'],
      manifest: {
        name: 'EduRural',
        short_name: 'EduRural',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#073B4C',
        icons: [
          { src: '/logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,ico}'], // precache básico
        runtimeCaching: [
          {
            // Lista de guías (para vista offline)
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/guides') && url.searchParams.has('page'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'guides-list',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [200] },
            },
          },

          {
            // Archivos estáticos de guías
            urlPattern: ({ url }) => url.pathname.startsWith('/uploads/guides/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'guides-static',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
      devOptions: { enabled: true }, // pruebas en dev
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7005',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://localhost:7005',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
});
