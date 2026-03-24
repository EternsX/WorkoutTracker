import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/WorkoutTracker/',
  plugins: [react()],
  build: {
    outDir: '../docs'  // <-- build directly into docs/
  }
})