import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // ส่งต่อคำขอ /api ไปยัง Backend (dotnet run ตาม launchSettings)
      '/api': {
        target: 'http://localhost:5139',
        changeOrigin: true
      }
    }
  }
})
