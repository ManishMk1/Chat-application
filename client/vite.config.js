import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      proxy: {
        '/foo': {
          target: env.VITE_BACKEND_LINK,  // Access the environment variable correctly
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/foo/, ''),
        },
      },
    },
    plugins: [react()],
  };
});
