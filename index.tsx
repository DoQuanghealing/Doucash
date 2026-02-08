import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Đảm bảo CSS Tailwind được nạp (nếu bạn dùng file css riêng)
// import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
    // Ghi log chi tiết hơn để dễ debug trên Vercel nếu có lỗi mount
    console.error("[Manicash] Lỗi: Không tìm thấy phần tử 'root' trong index.html.");
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* Lưu ý: Bạn đã bọc AuthProvider trong App.tsx chưa? 
      Nếu chưa, bạn có thể bọc trực tiếp tại đây để quản lý 
      trạng thái "Cậu chủ/Cô chủ" toàn cục.
    */}
    <App />
  </React.StrictMode>
);
