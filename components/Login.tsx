import React, { useState } from 'react';
import { AuthService } from '../services/firebase';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await AuthService.loginWithGoogle();
    } catch (error) {
      alert("Hệ thống đang bảo trì hoặc chưa cấu hình Firebase. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#020617] overflow-hidden font-['Be_Vietnam_Pro']">
      {/* 1. Hiệu ứng nền Blur (Blobs) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-[340px] relative z-10 flex flex-col items-center">
        
        {/* 2. Phần Header & Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-[#facc15] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.25)] mb-6 animate-pulse">
            <BrandLogo size={48} color="white" />
          </div>
          <h1 className="text-4xl font-[1000] text-white tracking-tighter uppercase leading-none mb-1">
            Manicash
          </h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] opacity-80">
            Quản trị tài chính thông minh
          </p>
        </div>

        {/* 3. Nút Đăng nhập Google (Tối ưu chống vỡ layout) */}
        <div className="w-full space-y-4 mb-10">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-16 bg-white hover:bg-gray-100 text-black font-black rounded-full shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3 text-[13px] uppercase tracking-widest relative overflow-hidden group border-0"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  className="w-5 h-5 object-contain flex-shrink-0" 
                  alt="Google" 
                  style={{ minWidth: '20px' }}
                />
                <span className="mt-0.5">Kết nối với Google</span>
              </>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">
            <Lock size={12} />
            <span>Dữ liệu được bảo mật bởi Firebase</span>
          </div>
        </div>

        {/* 4. Bảng Nguyên lý (Glassmorphism) */}
        <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-7 rounded-[2.5rem] text-left mb-10 shadow-2xl">
          <div className="flex items-center gap-3 text-amber-500 mb-5">
            <ShieldCheck size={20} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-widest">
              4 nguyên lý tài chính
            </span>
          </div>
          <ul className="text-[11px] font-bold text-gray-300 leading-relaxed uppercase tracking-tight space-y-3">
            <li className="flex gap-3">
              <span className="text-amber-500/80">1.</span> 
              <span>Biết được mình dùng tiền thế nào</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/80">2.</span> 
              <span>Tối ưu thu nhập và chi tiêu</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/80">3.</span> 
              <span>Mục tiêu lớn thúc đẩy thu nhập</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/80">4.</span> 
              <span>Kế hoạch tăng thu nhập rõ ràng</span>
            </li>
          </ul>
        </div>

        {/* 5. Footer */}
        <div className="flex flex-col items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-500" />
            <span>App được tạo bởi Đỗ Dương Quang</span>
          </div>
        </div>
      </div>
    </div>
  );
};
