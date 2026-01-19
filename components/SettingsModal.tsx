import React, { useState, useEffect } from 'react';
import { User, Wallet } from '../types';
import { VI } from '../constants/vi';
import { X, ShieldCheck, Wallet as WalletIcon, Trash2, AlertTriangle } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  wallets: Wallet[];
  onSave: (updatedUsers: User[], updatedWallets: Wallet[]) => void;
  onReset?: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, users, wallets, onSave, onReset }) => {
  const [userName, setUserName] = useState('');
  const [mainWalletName, setMainWalletName] = useState('');
  const [backupWalletName, setBackupWalletName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (users.length > 0) setUserName(users[0].name);
      
      const w1 = wallets.find(w => w.id === 'w1') || wallets[0];
      const w2 = wallets.find(w => w.id === 'w2') || wallets[1];
      
      if (w1) setMainWalletName(w1.name);
      if (w2) setBackupWalletName(w2.name);
    }
  }, [isOpen, users, wallets]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare Updated Users
    const updatedUsers = [...users];
    if (userName.trim()) {
       updatedUsers[0] = { ...updatedUsers[0], name: userName.trim() };
    }

    // Prepare Updated Wallets
    const updatedWallets = [...wallets];
    
    // Update Main Wallet
    const w1Index = updatedWallets.findIndex(w => w.id === 'w1');
    if (w1Index !== -1 && mainWalletName.trim()) {
        updatedWallets[w1Index] = { ...updatedWallets[w1Index], name: mainWalletName.trim() };
    } else if (wallets.length > 0 && mainWalletName.trim()) {
        updatedWallets[0] = { ...updatedWallets[0], name: mainWalletName.trim() };
    }

    // Update Backup Wallet
    const w2Index = updatedWallets.findIndex(w => w.id === 'w2');
    if (w2Index !== -1 && backupWalletName.trim()) {
        updatedWallets[w2Index] = { ...updatedWallets[w2Index], name: backupWalletName.trim() };
    } else if (wallets.length > 1 && backupWalletName.trim()) {
        updatedWallets[1] = { ...updatedWallets[1], name: backupWalletName.trim() };
    }

    onSave(updatedUsers, updatedWallets);
    onClose();
  };

  const handleReset = () => {
    if (confirm(VI.settings.resetConfirm)) {
        if (onReset) onReset();
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{VI.settings.title}</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* User Profile */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 ml-1">{VI.settings.user1}</label>
            <div className="flex items-center space-x-2">
                <span className="text-2xl">{users[0]?.avatar || '👤'}</span>
                <input
                    type="text"
                    className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-bold text-zinc-400 mb-4">Cấu hình Ví</h3>
              
              <div className="space-y-4">
                  {/* Main Wallet Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">{VI.settings.walletMain}</label>
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-black/30 text-primary">
                            <WalletIcon size={18} />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                            value={mainWalletName}
                            onChange={(e) => setMainWalletName(e.target.value)}
                        />
                    </div>
                  </div>

                  {/* Backup Wallet Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 ml-1">{VI.settings.walletBackup}</label>
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <ShieldCheck size={18} />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none"
                            value={backupWalletName}
                            onChange={(e) => setBackupWalletName(e.target.value)}
                        />
                    </div>
                  </div>
              </div>
          </div>

          <div className="pt-2">
            <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all"
            >
                {VI.settings.save}
            </button>
          </div>
        </form>

        {/* DANGER ZONE */}
        <div className="mt-8 border-t border-white/5 pt-6">
           <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center">
             <AlertTriangle size={16} className="mr-2" />
             {VI.settings.dangerZone}
           </h3>
           <button 
             type="button"
             onClick={handleReset}
             className="w-full border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 font-medium py-3 rounded-xl transition-colors flex items-center justify-center"
           >
               <Trash2 size={18} className="mr-2" />
               {VI.settings.resetData}
           </button>
        </div>
      </div>
    </div>
  );
};