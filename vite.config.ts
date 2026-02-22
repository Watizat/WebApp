import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 8056,
      strictPort: true,
      proxy: {
        '/api': { target: 'http://localhost:8056', changeOrigin: true },
      },
    },
  };
});
