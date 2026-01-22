import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const previewHosts = env.VITE_PREVIEW_HOSTS
    ? env.VITE_PREVIEW_HOSTS.split(',')
    : ['localhost']

  return {
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
  }
})
