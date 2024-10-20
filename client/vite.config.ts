import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
