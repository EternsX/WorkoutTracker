import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/WorkoutTracker/',  // <-- must match repo name exactly
  plugins: [react()],
  build: {
    outDir: '../docs'         // <-- outputs directly to docs folder
  }
})