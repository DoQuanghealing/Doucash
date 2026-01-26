import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      // THAY ĐỔI TẠI ĐÂY: 
      // Nếu link web của bạn là https://ten-user.github.io/ManiCash/
      // Thì base phải là '/ManiCash/' (Phải khớp chính xác tên Repository trên GitHub)
      base: './', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Đồng bộ hóa để code hiểu được cả process.env nếu cần
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
      }
    };
});
