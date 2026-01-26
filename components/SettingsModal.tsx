import React, { useState, useEffect } from 'react';
import { User, Wallet } from '../types';
import { VI } from '../constants/vi';
import { X, ShieldCheck, Wallet as WalletIcon, Trash2, AlertTriangle, Banknote, Sun, Moon, RefreshCw, Eraser, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  wallets: Wallet[];
  onSave: (updatedUsers: User[], updatedWallets: Wallet[]) => void;
  onRefresh: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, users, wallets, onSave, onRefresh }) => {
  const [userName, setUserName] = useState('');
  const [mainWalletName, setMainWalletName] = useState('');
  const [mainWalletBalance, setMainWalletBalance] = useState('');
  const [backupWalletName, setBackupWalletName] = useState('');
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  
  // Custom Confirmation Modal State
  const [confirmType, setConfirmType] = useState<'balance' | 'full' | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (users.length > 0) setUserName(users[0].name);
      const w1 = wallets.find(w => w.id === 'w1') || wallets[0];
      const w2 = wallets.find(w => w.id === 'w2') || wallets[1];
      if (w1) { setMainWalletName(w1.name); setMainWalletBalance(String(w1.balance)); }
      if (w2) setBackupWalletName(w2.name);
      setCurrentTheme(StorageService.getTheme());
    }
  }, [isOpen, users, wallets]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUsers = [...users];
    if (userName.trim()) updatedUsers[0] = { ...updatedUsers[0], name: userName.trim() };
    const updatedWallets = JSON.parse(JSON.stringify(wallets));
    const w1Idx = updatedWallets.findIndex((w: Wallet) => w.id === 'w1');
    if (w1Idx !== -1) {
        if (mainWalletName.trim()) updatedWallets[w1Idx].name = mainWalletName.trim();
        if (mainWalletBalance.trim()) updatedWallets[w1Idx].balance = parseFloat(mainWalletBalance) || 0;
    }
    const w2Idx = updatedWallets.findIndex((w: Wallet) => w.id === 'w2');
    if (w2Idx !== -1 && backupWalletName.trim()) updatedWallets[w2Idx].name = backupWalletName.trim();
    onSave(updatedUsers, updatedWallets);
    onClose();
  };

  const executeReset = () => {
    if (confirmType === 'full') {
        StorageService.resetFull();
    } else if (confirmType === 'balance') {
        StorageService.resetBalancesOnly();
    }
    
    // Clear confirmation
    setConfirmType(null);
    
    // Notify parent to refresh state
    onRefresh();
    
    // Close settings
    onClose();
    
    // Small feedback to user
    alert("Dữ liệu đã được cập nhật về trạng thái yêu cầu.");
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    StorageService.setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-3xl px-6 animate-in fade-in duration-300">
        <div className="glass-card w-full max-w-sm rounded-[3rem] border-0 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] overflow-hidden bg-surface">
          
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-8 pb-4 shrink-0 relative z-10 bg-surface/50 backdrop-blur-md">
            <h2 className="text-2xl font-[900] text-foreground tracking-tighter uppercase leading-none">CẤU HÌNH AI</h2>
            <button onClick={onClose} className="p-3 bg-foreground/5 rounded-2xl hover:bg-foreground/10 text-foreground transition-all">
              <X size={22} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4 space-y-10">
            <form onSubmit={handleSave} id="settings-form" className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Danh tính</label>
                <div className="flex items-center space-x-4 bg-foreground/5 p-5 rounded-[1.75rem] border border-foreground/5 shadow-inner">
                    <span className="text-3xl filter drop-shadow-lg">{users[0]?.avatar || '😎'}</span>
                    <input
                        type="text"
                        className="w-full bg-transparent text-foreground font-black focus:outline-none uppercase text-sm tracking-tight"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Giao diện</label>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${currentTheme === 'dark' ? 'bg-primary/10 border-primary/20 shadow-lg' : 'bg-secondary/10 border-secondary/20 shadow-lg'}`}
                  >
                      <div className="flex items-center gap-4">
                          {currentTheme === 'dark' ? <Moon size={22} className="text-primary" /> : <Sun size={22} className="text-secondary" />}
                          <span className="font-black text-foreground uppercase tracking-widest text-[11px]">{currentTheme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}</span>
                      </div>
                      <div className={`w-14 h-7 rounded-full relative transition-all ${currentTheme === 'dark' ? 'bg-primary' : 'bg-secondary'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${currentTheme === 'dark' ? 'left-8' : 'left-1'}`}></div>
                      </div>
                  </button>
              </div>

              <div className="space-y-6 pt-2 border-t border-foreground/5">
                  <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Hệ thống ví</h3>
                  <div className="space-y-4">
                      <div className="bg-foreground/[0.03] p-6 rounded-[2rem] border border-foreground/5 space-y-4 shadow-inner">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Ví giao dịch</label>
                          <input
                              type="text"
                              className="bg-transparent text-foreground font-[900] text-right focus:outline-none text-xs uppercase"
                              value={mainWalletName}
                              onChange={(e) => setMainWalletName(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-4 border-t border-foreground/5 pt-4">
                            <Banknote size={20} className="text-primary opacity-40" />
                            <input
                                type="number"
                                className="w-full bg-transparent text-foreground font-[900] text-2xl focus:outline-none tracking-tighter"
                                value={mainWalletBalance}
                                onChange={(e) => setMainWalletBalance(e.target.value)}
                            />
                        </div>
                      </div>

                      <div className="bg-foreground/[0.03] p-6 rounded-[2rem] border border-foreground/5 shadow-inner flex items-center justify-between">
                        <label className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Ví dự trữ</label>
                        <input
                            type="text"
                            className="bg-transparent text-foreground font-[900] text-right focus:outline-none uppercase text-sm tracking-tight"
                            value={backupWalletName}
                            onChange={(e) => setBackupWalletName(e.target.value)}
                        />
                      </div>
                  </div>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="pt-10 space-y-4 border-t border-foreground/5">
                <h3 className="text-[10px] font-black text-danger uppercase tracking-[0.3em] ml-2">Vùng nguy hiểm</h3>
                
                <div className="grid grid-cols-1 gap-3">
                    <button 
                      type="button"
                      onClick={() => setConfirmType('balance')}
                      className="w-full p-6 bg-amber-500/10 hover:bg-amber-500/20 rounded-[2rem] border border-amber-500/20 transition-all flex items-center gap-4 text-left group"
                    >
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:rotate-12 transition-transform">
                            <Eraser size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Reset số dư & lịch sử</p>
                            <p className="text-[9px] font-bold text-amber-600/60 uppercase mt-1">Giữ lại các mục tiêu & hạn mức</p>
                        </div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setConfirmType('full')}
                      className="w-full p-6 bg-danger/10 hover:bg-danger/20 rounded-[2rem] border border-danger/20 transition-all flex items-center gap-4 text-left group"
                    >
                        <div className="p-3 bg-danger/10 rounded-xl text-danger group-hover:-rotate-12 transition-transform">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-danger uppercase tracking-widest">Xóa sạch toàn bộ</p>
                            <p className="text-[9px] font-bold text-danger/60 uppercase mt-1">Đưa mọi thứ về trạng thái mới</p>
                        </div>
                    </button>
                </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-8 pt-4 bg-surface/50 backdrop-blur-md shrink-0">
              <button
                  type="submit"
                  form="settings-form"
                  className="w-full bg-primary text-white font-[900] py-6 rounded-[2rem] text-[11px] uppercase tracking-[0.4em] shadow-2xl neon-glow-primary active:scale-95 transition-all"
              >
                  CẬP NHẬT THAY ĐỔI
              </button>
          </div>
        </div>
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmType && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-xl px-8 animate-in zoom-in-95 duration-300">
           <div className="glass-card w-full max-w-sm rounded-[2.5rem] p-10 border-2 border-danger/20 shadow-[0_0_100px_rgba(255,0,0,0.2)]">
              <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-danger/10 text-danger rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group">
                    <AlertTriangle size={40} className="animate-pulse" />
                 </div>
                 
                 <div className="space-y-3">
                    <h3 className="text-2xl font-[900] text-foreground tracking-tighter uppercase">XÁC NHẬN XÓA</h3>
                    <p className="text-sm font-bold text-foreground/50 leading-relaxed uppercase tracking-tight">
                        {confirmType === 'full' 
                          ? "Bạn sắp xóa sạch toàn bộ dữ liệu. Mọi thứ sẽ biến mất vĩnh viễn và không thể khôi phục."
                          : "Hành động này sẽ xóa hết số tiền hiện có và lịch sử giao dịch. Các cài đặt ngân sách sẽ được giữ lại."
                        }
                    </p>
                 </div>

                 <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={executeReset}
                      className="w-full py-6 bg-danger text-white rounded-[1.75rem] font-[900] text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
                    >
                        TÔI ĐỒNG Ý XÓA
                    </button>
                    <button 
                      onClick={() => setConfirmType(null)}
                      className="w-full py-5 text-foreground/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-foreground transition-all"
                    >
                        QUAY LẠI
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};