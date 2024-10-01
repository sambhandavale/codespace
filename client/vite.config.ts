import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
  },
  build: {
    outDir: 'build',  // This matches the output directory for the production build
    emptyOutDir: true,  // Clear the previous build files
  },  
});
