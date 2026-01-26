import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file dựa trên mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Nếu deploy lên GitHub Pages theo dạng username.github.io/repo-name/ 
    // thì hãy thay '/' bằng '/tên-repo-của-bạn/'
    base: '/', 

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    define: {
      // Sử dụng cách này để truy cập trong code qua process.env hoặc import.meta.env
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // Trỏ @ vào thư mục root (như cấu hình cũ của bạn)
        '@': path.resolve(__dirname, './'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      // Tối ưu hóa việc chia nhỏ file để load nhanh hơn
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
