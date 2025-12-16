import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    fs: {
      // 동적 이미지 경로를 미리 분석하지 않도록 설정
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // CSS 분석 시 동적 경로 무시
  css: {
    devSourcemap: true,
  },
})
