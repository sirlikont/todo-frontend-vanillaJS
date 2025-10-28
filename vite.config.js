import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/tasks': 'http://demo2.z-bit.ee'
    }
  }
})
