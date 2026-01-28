import React, { useEffect, useState } from 'react';
import { AuthService } from './services/firebase';
import { Login } from './components/Login'; // Đã sửa: Khớp với tên file Login.tsx
import { Dashboard } from './components/Dashboard'; // Đã sửa: Khớp với tên file Dashboard.tsx

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Theo dõi trạng thái đăng nhập từ Firebase
    const unsubscribe = AuthService.onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafa] dark:bg-[#020617]">
        <div className="animate-pulse text-primary font-bold">Đang khởi động Manicash...</div>
      </div>
    );
  }

  // Phân luồng: Nếu có User thì vào Dashboard, không thì ở Login
  return user ? <Dashboard user={user} /> : <Login />;
}

export default App;
