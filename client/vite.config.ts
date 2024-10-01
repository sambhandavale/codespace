import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: 'build',  // Output directory for build
    emptyOutDir: true,  // Clear previous build files
  },
});
