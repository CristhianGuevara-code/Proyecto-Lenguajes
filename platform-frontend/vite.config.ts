import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // si 5173 está ocupado, falla en lugar de moverse a otra url
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
});
