import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Trỏ đúng vào file App.tsx cùng thư mục gốc

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Không tìm thấy thẻ root trong index.html");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
