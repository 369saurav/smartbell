import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Simple plugin to copy manifest and icons
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    writeBundle() {
      // Copy manifest.json
      copyFileSync('manifest.json', 'dist/manifest.json')
      
      // Copy icons
      if (!existsSync('dist/icons')) {
        mkdirSync('dist/icons', { recursive: true })
      }
      
      const icons = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png']
      icons.forEach(icon => {
        copyFileSync(`icons/${icon}`, `dist/icons/${icon}`)
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    copyManifest(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
      },
    },
  },
})

