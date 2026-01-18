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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className={`bg-surface w-full max-w-sm rounded-3xl p-6 border ${isDanger ? 'border-danger/30 shadow-danger/10' : 'border-primary/30 shadow-primary/10'} shadow-2xl animate-in zoom-in-95 duration-200`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDanger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
            {isDanger ? <AlertTriangle size={32} /> : <Sparkles size={32} />}
          </div>
          <h3 className="text-xl font-bold text-white">{displayTitle}</h3>
          {category && (
            <p className="text-zinc-400 text-sm">
              {VI.reflection.exceeded} <span className="text-danger font-semibold">{VI.category[category as keyof typeof VI.category] || category}</span>.
            </p>
          )}
          <div className="bg-white/5 p-4 rounded-xl w-full border border-white/5">
            <p className="text-lg italic font-medium text-zinc-200">"{message}"</p>
          </div>
          
          <div className="flex w-full space-x-2 pt-2">
            {isDanger ? (
              <>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-surfaceHighlight hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {VI.reflection.guilt}
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-danger text-white py-3 rounded-xl font-medium shadow-lg shadow-danger/20"
                >
                  {VI.reflection.yolo}
                </button>
              </>
            ) : (
               <button 
                  onClick={onClose}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20"
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