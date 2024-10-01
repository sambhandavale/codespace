import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:4321,
  },
  build: {
    outDir: 'build',  // Set the output directory to 'build'
  },
})
