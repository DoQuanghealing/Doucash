import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 1. THÊM DÒNG NÀY: Quan trọng để nhận diện đúng đường dẫn file trên GitHub Pages
      base: './', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // 2. SỬA LẠI ALIAS: Đảm bảo trỏ đúng vào thư mục hiện tại
          '@': path.resolve(__dirname, './'),
        }
      },
      // 3. THÊM CẤU HÌNH BUILD (Tùy chọn nhưng nên có)
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
