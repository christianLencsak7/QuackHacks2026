import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      // manifest is our own public/manifest.json — don't auto-generate one
      manifest: false,
      injectManifest: {
        swSrc: 'src/sw.js',
        swDest: 'dist/sw.js',
      }
    })
  ],
})

