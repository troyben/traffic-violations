import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 4096, // 4kb
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'], // Add your major dependencies
          'fonts': ['vfonts/Roboto.css']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['vfonts'] // Exclude vfonts from optimization
  }
})
