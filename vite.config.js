import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 👇 [추가] 외부 접속 허용 (0.0.0.0)
    host: true,
    
    // 👇 [추가] ngrok 같은 터널링 도메인 허용
    // (Vite 버전에 따라 true 또는 ['.ngrok-free.app'] 같은 배열을 넣어야 할 수도 있습니다.)
    // 에러가 났던 allowedHosts가 바로 이겁니다!
    allowedHosts: [
      ".ngrok-free.app" 
    ],

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
