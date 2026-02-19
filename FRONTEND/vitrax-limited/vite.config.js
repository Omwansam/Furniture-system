import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow external connections
    watch: {
      usePolling: true, // Enable polling for file changes (useful for WSL/Docker)
      interval: 1000, // Polling interval in milliseconds
    },
    hmr: {
      overlay: true, // Show error overlay in browser
    },
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
  },
})
