import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const previewHosts = process.env.VITE_PREVIEW_HOSTS
  ? process.env.VITE_PREVIEW_HOSTS.split(',')
  : ['localhost']

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: previewHosts,
  },
})
