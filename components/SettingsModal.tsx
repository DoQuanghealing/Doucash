import React, { useEffect, useMemo, useState } from 'react';
import { User, Wallet } from '../types';
import { LS_KEYS } from '../constants';
import { X, Settings } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;

  users: User[];
  wallets: Wallet[];

  onSave: (nextUsers: User[], nextWallets: Wallet[]) => void;
  onReset: () => void;
}

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export const SettingsModal: React.FC<Props> = ({
  open,
  onClose,
  users,
  wallets,
  onSave,
  onReset,
}) => {
  const [user1Name, setUser1Name] = useState('');
  const [user2Name, setUser2Name] = useState('');
  const [wallet1Name, setWallet1Name] = useState('');
  const [wallet2Name, setWallet2Name] = useState('');

  // Sync state khi mở modal
  useEffect(() => {
    if (!open) return;

    setUser1Name(users[0]?.name || '');
    setUser2Name(users[1]?.name || '');

    setWallet1Name(wallets[0]?.name || '');
    setWallet2Name(wallets[1]?.name || '');
  }, [open, users, wallets]);

  const canSave = useMemo(() => {
    return (
      normalize(user1Name).length > 0 &&
      normalize(user2Name).length > 0 &&
      normalize(wallet1Name).length > 0 &&
      normalize(wallet2Name).length > 0
    );
  }, [user1Name, user2Name, wallet1Name, wallet2Name]);

  if (!open) return null;

  const handleSave = () => {
    if (!canSave) return;

    const nextUsers: User[] = [
      { ...users[0], name: normalize(user1Name) },
      { ...users[1], name: normalize(user2Name) },
    ];

    const nextWallets: Wallet[] = [
      { ...wallets[0], name: normalize(wallet1Name) },
      { ...wallets[1], name: normalize(wallet2Name) },
    ];

    // Lưu localStorage
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(nextUsers));
    localStorage.setItem(LS_KEYS.WALLETS, JSON.stringify(nextWallets));

    onSave(nextUsers, nextWallets);
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem(LS_KEYS.USERS);
    localStorage.removeItem(LS_KEYS.WALLETS);
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Settings size={18} className="text-primary" />
            <h3 className="text-white font-bold">Cài đặt</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
            aria-label="Đóng"
          >
            <X size={18} className="text-zinc-200" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {/* Users */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Tên người dùng
            </p>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Người 1</label>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-primary/60"
                value={user1Name}
                onChange={(e) => setUser1Name(e.target.value)}
                placeholder="Ví dụ: Anh"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Người 2</label>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-primary/60"
                value={user2Name}
                onChange={(e) => setUser2Name(e.target.value)}
                placeholder="Ví dụ: Vợ"
              />
            </div>
          </div>

          {/* Wallets */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Tên ví
            </p>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Ví người 1</label>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-primary/60"
                value={wallet1Name}
                onChange={(e) => setWallet1Name(e.target.value)}
                placeholder="Ví dụ: Ví Anh"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Ví người 2</label>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-primary/60"
                value={wallet2Name}
                onChange={(e) => setWallet2Name(e.target.value)}
                placeholder="Ví dụ: Ví Vợ"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Gợi ý: đổi tên ví xong nhưng tiêu hoang thì app không cứu được đâu 😄
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-200 rounded-2xl py-3 font-semibold"
              type="button"
            >
              Reset mặc định
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex-1 rounded-2xl py-3 font-semibold ${
                canSave
                  ? 'bg-primary text-white hover:brightness-110'
                  : 'bg-white/10 text-zinc-500 cursor-not-allowed'
              }`}
              type="button"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
