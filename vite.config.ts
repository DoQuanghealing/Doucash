import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      // Sửa từ './' thành '/ManiCash/' để khớp với tên Repository mới trên GitHub.
      // Lưu ý: ManiCash phải viết đúng hoa thường như trên GitHub.
      base: '/ManiCash/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Đảm bảo GEMINI_API_KEY đã được thiết lập trong GitHub Secrets
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Trỏ chính xác vào thư mục root của dự án
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Tắt tính năng minify nếu bạn muốn dễ dàng debug lỗi màn hình trắng (tùy chọn)
        minify: true,
        // Đảm bảo tệp tin được build ra với đường dẫn tương đối
        emptyOutDir: true,
      }
    };
});
