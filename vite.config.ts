import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load tất cả biến môi trường từ .env hoặc GitHub Secrets/Vercel
  // Tham số thứ 3 là '' để load tất cả biến mà không cần lọc tiền tố VITE_ trong lúc build config
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Đảm bảo đường dẫn tương đối để không lỗi asset khi deploy
    base: './', 

    plugins: [react()],

    define: {
      // Ép kiểu các biến quan trọng thành chuỗi để tránh lỗi 'undefined' trong code
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      
      // Hỗ trợ các thư viện yêu cầu truy cập process.env trực tiếp
      'process.env': env,
    },

    resolve: {
      alias: {
        // Cấu hình Alias @ trỏ về thư mục gốc để import file chuẩn xác
        '@': path.resolve(__dirname, './'),
      },
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Xóa bản build cũ trước khi tạo bản mới
      emptyOutDir: true,
      // Tắt sourcemap để bảo mật code và giảm dung lượng bản build
      sourcemap: false,
      // Đảm bảo quá trình build không bị dừng bởi các lỗi cảnh báo nhỏ
      chunkSizeWarningLimit: 1000,
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
