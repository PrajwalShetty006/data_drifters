import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-tabs',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-select',
      'class-variance-authority',
      'lucide-react',
    ],
  },
})
