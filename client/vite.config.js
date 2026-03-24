import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // LAN accessible
    port: 5173,
    https: false // HTTP for now
  }
});