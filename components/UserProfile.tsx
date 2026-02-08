import { useAuth } from '@/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="glass-card p-4">
      <p>Xin chào, {user?.displayName || "Cậu chủ"}</p>
      <button onClick={logout} className="text-danger">Đăng xuất</button>
    </div>
  );
};
