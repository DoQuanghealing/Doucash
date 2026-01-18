import React, { ReactNode } from 'react';
import { LayoutDashboard, PlusCircle, PieChart, Target, Sparkles } from 'lucide-react';
import { VI } from '../constants/vi';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction: () => void;
}

const NavItem = ({ id, icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
      active ? 'text-primary' : 'text-zinc-500'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onAddTransaction }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-zinc-100 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-safe-top">
        <div className="max-w-md mx-auto min-h-full relative">
            {children}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-[84px] bg-surface/90 backdrop-blur-md border-t border-white/5 pb-safe-bottom z-50">
        <div className="max-w-md mx-auto h-full grid grid-cols-5 items-center px-2">
          <NavItem 
            id="dashboard" 
            icon={LayoutDashboard} 
            label={VI.nav.dashboard} 
            active={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')} 
          />
          <NavItem 
            id="budgets" 
            icon={PieChart} 
            label={VI.nav.budgets} 
            active={activeTab === 'budgets'} 
            onClick={() => onTabChange('budgets')} 
          />
          
          <div className="flex items-center justify-center -mt-6">
            <button 
                onClick={onAddTransaction}
                className="bg-primary hover:bg-violet-500 text-white rounded-full p-4 shadow-lg shadow-violet-500/30 transition-transform active:scale-95"
            >
                <PlusCircle size={32} />
            </button>
          </div>

          <NavItem 
            id="goals" 
            icon={Target} 
            label={VI.nav.goals} 
            active={activeTab === 'goals'} 
            onClick={() => onTabChange('goals')} 
          />
          <NavItem 
            id="insights" 
            icon={Sparkles} 
            label={VI.nav.insights} 
            active={activeTab === 'insights'} 
            onClick={() => onTabChange('insights')} 
          />
        </div>
      </nav>
    </div>
  );
};