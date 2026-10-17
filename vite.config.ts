import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // דפדפן מדומה, כדי שאפשר יהיה לצייר רכיבים בבדיקות
    setupFiles: './src/test/setup.ts',
  },
})
