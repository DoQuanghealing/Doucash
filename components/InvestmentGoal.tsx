import React, { useState } from 'react';
import { Goal, User, Wallet } from '../types';
import { TrendingUp, Plus, Calendar, Target, Wallet as WalletIcon, X } from 'lucide-react';
import { VI } from '../constants/vi';
import { formatVND } from '../utils/format';
import { StorageService } from '../services/storageService';

interface Props {
  goals: Goal[];
  users: User[];
  wallets: Wallet[];
  onRefresh: () => void;
}

export const InvestmentGoal: React.FC<Props> = ({ goals, users, wallets, onRefresh }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Create Goal State
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  // Deposit State
  const [depositAmount, setDepositAmount] = useState('');
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || '');
  const [depositNote, setDepositNote] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget || !newDeadline) return;

    const newGoal: Goal = {
        id: `g_${Date.now()}`,
        name: newName,
        targetAmount: parseFloat(newTarget.replace(/\./g, '')),
        currentAmount: 0,
        deadline: newDeadline,
        rounds: []
    };

    StorageService.addGoal(newGoal);
    onRefresh();
    setIsCreateOpen(false);
    setNewName('');
    setNewTarget('');
    setNewDeadline('');
  };

  const openDepositModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsDepositOpen(true);
    setSourceWalletId(wallets[0]?.id || '');
    setDepositAmount('');
    setDepositNote('');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !depositAmount || !sourceWalletId) return;

    const amount = parseFloat(depositAmount.replace(/\./g, ''));
    
    // Find active user based on wallet owner (simplification for demo)
    const wallet = wallets.find(w => w.id === sourceWalletId);
    const userId = wallet?.userId || users[0].id;

    const success = StorageService.contributeToGoal(selectedGoalId, sourceWalletId, amount, depositNote, userId);
    
    if (success) {
        onRefresh();
        setIsDepositOpen(false);
    } else {
        alert("Số dư không đủ!");
    }
  };

  const calculateDaysLeft = (deadline: string) => {
      const diff = new Date(deadline).getTime() - new Date().getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getUserName = (id: string) => {
    return users.find(u => u.id === id)?.name || id;
  };

  return (
    <div className="p-6 pt-12 space-y-8 pb-32 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-3xl font-[900] text-foreground tracking-tighter uppercase">MỤC TIÊU</h2>
        <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white px-5 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase shadow-lg neon-glow-primary active:scale-95 transition-all"
        >
            <Plus size={16} strokeWidth={3} />
            <span>TẠO MỚI</span>
        </button>
      </div>

      {goals.length === 0 && (
          <div className="glass-card rounded-[2rem] p-16 text-center border-0">
              <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-foreground/20" />
              </div>
              <p className="text-foreground/40 font-black text-xs uppercase tracking-[0.2em]">{VI.goals.noGoals}</p>
          </div>
      )}

      {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const daysLeft = calculateDaysLeft(goal.deadline);
          
          return (
            <div key={goal.id} className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -mr-16 -mt-16 opacity-30"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg neon-glow-secondary">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-[900] text-foreground leading-tight uppercase tracking-tight">{goal.name}</h3>
                                <div className="flex items-center space-x-2 text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-1">
                                    <Calendar size={12} />
                                    <span>{daysLeft > 0 ? `${daysLeft} NGÀY CÒN LẠI` : `HẠN: ${goal.deadline}`}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => openDepositModal(goal.id)}
                            className="bg-foreground text-background w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all"
                        >
                            <Plus size={22} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest mb-1">Hiện có</p>
                            <span className="text-3xl font-[900] text-secondary tracking-tighter">{formatVND(goal.currentAmount)}</span>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest mb-1">Cần đạt</p>
                             <span className="text-sm font-black text-foreground tracking-tight">{formatVND(goal.targetAmount)}</span>
                        </div>
                    </div>

                    <div className="h-4 bg-foreground/5 rounded-full overflow-hidden mb-8 relative border border-foreground/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-secondary to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${percentage}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground mix-blend-difference uppercase tracking-widest">{percentage}%</span>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-foreground/5">
                        <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">LỊCH SỬ NẠP</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                            {goal.rounds.length === 0 ? (
                                <p className="text-[11px] font-bold text-foreground/20 italic">Chưa có giao dịch nạp.</p>
                            ) : (
                                [...goal.rounds].reverse().map((round) => (
                                    <div key={round.id} className="flex items-center justify-between glass-card bg-foreground/[0.03] p-4 rounded-2xl border-0">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-[800] text-foreground leading-tight uppercase tracking-tight">{round.note}</span>
                                            <span className="text-[9px] text-foreground/40 font-black uppercase tracking-widest mt-0.5">{round.date} • {getUserName(round.contributorId)}</span>
                                        </div>
                                        <span className="font-black text-sm text-secondary tracking-tighter">+{formatVND(round.amount)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
          );
      })}

      {/* CREATE GOAL MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-3xl p-6">
           <div className="glass-card w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 border-0">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-[900] text-foreground tracking-tighter">MỤC TIÊU MỚI</h3>
                   <button onClick={() => setIsCreateOpen(false)} className="p-3 bg-foreground/5 rounded-2xl hover:text-primary transition-colors"><X size={22} /></button>
               </div>
               <form onSubmit={handleCreateGoal} className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Tên mục tiêu</label>
                       <input 
                          type="text" required
                          className="w-full bg-foreground/5 text-foreground font-[800] p-4 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                       />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Số tiền cần đạt</label>
                       <input 
                          type="number" required
                          className="w-full bg-foreground/5 text-secondary text-2xl font-[900] p-4 rounded-2xl focus:ring-2 focus:ring-secondary focus:outline-none"
                          value={newTarget}
                          onChange={(e) => setNewTarget(e.target.value)}
                       />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Ngày hoàn thành</label>
                       <input 
                          type="date" required
                          className="w-full bg-foreground/5 text-foreground font-black p-4 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                       />
                   </div>
                   <button type="submit" className="w-full bg-primary text-white font-[900] py-6 rounded-[2rem] text-[11px] uppercase tracking-[0.3em] shadow-xl neon-glow-primary">
                       LƯU MỤC TIÊU
                   </button>
               </form>
           </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-3xl p-6">
           <div className="glass-card w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 border-0">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-[900] text-foreground tracking-tighter uppercase">Nạp ngân sách</h3>
                   <button onClick={() => setIsDepositOpen(false)} className="p-3 bg-foreground/5 rounded-2xl text-foreground/40"><X size={22} /></button>
               </div>
               <form onSubmit={handleDeposit} className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Ví nguồn</label>
                       <select 
                            value={sourceWalletId}
                            onChange={(e) => setSourceWalletId(e.target.value)}
                            className="w-full bg-foreground/5 text-foreground font-black p-4 rounded-2xl focus:outline-none appearance-none"
                        >
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name} ({formatVND(w.balance)})</option>
                            ))}
                        </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-foreground/30 ml-2 tracking-widest uppercase">Số tiền nạp</label>
                       <input 
                          type="number" required autoFocus
                          className="w-full bg-foreground/5 text-secondary text-3xl font-[900] p-4 rounded-2xl focus:outline-none text-right"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                       />
                   </div>
                   <button type="submit" className="w-full bg-secondary text-white font-[900] py-6 rounded-[2rem] text-[11px] uppercase tracking-[0.3em] shadow-xl neon-glow-secondary">
                       XÁC NHẬN NẠP
                   </button>
               </form>
           </div>
        </div>
      )}
    </div>
  );
};