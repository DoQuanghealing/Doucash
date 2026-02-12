import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Không cần import CSS thủ công nếu bạn đã dùng CDN Tailwind trong index.html,
// nhưng nếu có file CSS riêng thì hãy import ở đây:
// import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Không tìm thấy phần tử root để khởi chạy Manicash");
}

/** * XỬ LÝ SERVICE WORKER & CẬP NHẬT
 * Việc vô hiệu hóa SW trong môi trường dev là đúng đắn để tránh lỗi origin.
 * Tuy nhiên, ta vẫn giữ khung để hỗ trợ tính năng "Kiểm tra phiên bản" sau này.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Sử dụng đường dẫn tuyệt đối để Vercel không bị lỗi 404
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Manicash SW đã sẵn sàng: ', registration);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Kích hoạt sự kiện để Popup Quản gia báo có bản mới
              window.dispatchEvent(new CustomEvent('app-update-available', { detail: registration }));
            }
          });
        }
      });
    }).catch((error) => {
      console.error('SW registration failed: ', error);
    });
  });
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
