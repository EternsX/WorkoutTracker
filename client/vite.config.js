import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build' // ✅ change output folder to 'build' so Render can find it
  },
  server: {
    host: true,
    port: 5173,
    https: false
  }
});