import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // No vite.svg reference here, but if your code or index.html references /vite.svg, either remove it from index.html or add a placeholder vite.svg in public/
  server: {
    port: 5174
  }
})