import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   allowedHosts: ['xxx.ngrok-free.app', '049a4ccc8a5d.ngrok-free.app'],
  //   hmr: {
  //     clientPort: 443, // Or 80 for HTTP
  //   },
  // },
})