import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La variable VITE_BASE_URL est injectée automatiquement par GitHub Actions.
// En local (npm run dev), la base est '/' par défaut.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          react: ['react', 'react-dom']
        }
      }
    }
  }
})
