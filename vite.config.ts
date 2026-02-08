import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Tải các biến môi trường từ tệp .env
    const env = loadEnv(mode, process.cwd(), '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Đồng bộ hóa các Key cho AI Service
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
        'process.env.VITE_GROQ_API_KEY': JSON.stringify(env.VITE_GROQ_API_KEY),
        
        // Giữ lại để tương thích nếu bạn còn dùng biến cũ trong code
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          // Nên trỏ vào src để import thuận tiện hơn: import { AIService } from '@/services/aiService'
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
