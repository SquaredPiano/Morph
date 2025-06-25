import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      writeBundle() {
        // Copy manifest.json to dist
        copyFileSync('manifest.json', 'dist/manifest.json')
        
        // Copy popup.html to dist
        copyFileSync('popup.html', 'dist/popup.html')
        
        // Copy welcome page
        copyFileSync('public/welcome.html', 'dist/welcome.html')
        
        // Create icons directory and copy placeholder icons
        mkdirSync('dist/icons', { recursive: true })
        
        // Create simple SVG icons as placeholders
        const iconSizes = [16, 32, 48, 128]
        iconSizes.forEach(size => {
          const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="#2563eb" rx="4"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}">M</text>
          </svg>`
          
          // For now, we'll create a simple text file as placeholder
          // In a real project, you'd want actual PNG icons
          copyFileSync('public/welcome.html', `dist/icons/icon-${size}.png`)
        })
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.tsx'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content/monitorInputs.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 