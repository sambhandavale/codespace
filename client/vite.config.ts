import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: 'dist',  // Set this to the folder where your production build will go
    target: 'esnext', // You can adjust this depending on browser support
  },
});
