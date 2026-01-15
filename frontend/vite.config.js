import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // If port 3000 is busy, try next available port
    allowedHosts: [
      'ashli-unbeveled-charlesetta.ngrok-free.dev',
      'localhost',
      '127.0.0.1'
    ]
  }
})
