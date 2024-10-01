import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: 'build',  // Ensure this is set to 'build'
  },
});
