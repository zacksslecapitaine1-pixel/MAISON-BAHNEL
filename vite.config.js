import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_URL est injectée par GitHub Actions ('/' pour le domaine personnalisé).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } }
  }
})
