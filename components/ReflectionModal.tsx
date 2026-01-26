import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { VI } from '../constants/vi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  category?: string;
  title?: string;
  variant?: 'danger' | 'success';
}

export const ReflectionModal: React.FC<Props> = ({ isOpen, onClose, message, category, title, variant = 'danger' }) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const displayTitle = title || VI.reflection.defaultTitle;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-2xl px-6 animate-in fade-in duration-300">
      <div className={`glass-card w-full max-w-sm rounded-[2.5rem] p-8 border-0 shadow-2xl animate-in zoom-in-95 duration-300 ${isDanger ? 'bg-gradient-to-br from-danger/5 to-background' : 'bg-gradient-to-br from-primary/5 to-background'}`}>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl ${isDanger ? 'bg-danger/10 text-danger shadow-danger/20' : 'bg-primary/10 text-primary shadow-primary/20'}`}>
            {isDanger ? <AlertTriangle size={36} /> : <Sparkles size={36} />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-[900] text-foreground tracking-tighter uppercase">{displayTitle}</h3>
            {category && (
              <p className="text-foreground/40 text-[11px] font-black uppercase tracking-widest">
                {VI.reflection.exceeded} <span className="text-danger">{VI.category[category as keyof typeof VI.category] || category}</span>
              </p>
            )}
          </div>

          <div className="glass-card bg-foreground/[0.03] p-6 rounded-[1.75rem] w-full border-0">
            <p className="text-base italic font-bold text-foreground leading-relaxed">"{message}"</p>
          </div>
          
          <div className="flex w-full gap-3 pt-2">
            {isDanger ? (
              <>
                <button 
                  onClick={onClose}
                  className="flex-1 glass-card bg-foreground/5 text-foreground py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-0 transition-all active:scale-95"
                >
                  {VI.reflection.guilt}
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-danger text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-danger/20 active:scale-95 transition-all"
                >
                  {VI.reflection.yolo}
                </button>
              </>
            ) : (
               <button 
                  onClick={onClose}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  {VI.reflection.received}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};