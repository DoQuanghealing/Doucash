import React, { ReactNode } from 'react';
import { LayoutDashboard, PlusCircle, PieChart, Target, Sparkles, Plus } from 'lucide-react';
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
    className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 z-10 ${
      active ? 'text-primary' : 'text-foreground/20 hover:text-foreground/40'
    }`}
  >
    <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-primary/10 scale-110' : ''}`}>
      <Icon size={22} strokeWidth={active ? 3 : 2} />
    </div>
    <span className="text-[7px] font-[900] uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onAddTransaction }) => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-safe-top">
        <div className="max-w-md mx-auto min-h-full relative px-2">
            {children}
        </div>
      </main>

      {/* High-Tech Concave Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-[90px] pb-safe-bottom z-[150] pointer-events-none">
        <div className="max-w-md mx-auto h-full relative pointer-events-auto">
          
          {/* SVG Mask Background for Glassmorphism */}
          <div className="absolute inset-0">
            <svg width="100%" height="90" viewBox="0 0 400 90" preserveAspectRatio="none" className="drop-shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
              <path 
                d="M0,20 L155,20 C165,20 170,20 175,25 C185,35 185,65 200,65 C215,65 215,35 225,25 C230,20 235,20 245,20 L400,20 L400,90 L0,90 Z" 
                fill="rgba(var(--surface), 0.6)"
                className="backdrop-blur-3xl"
              />
              {/* Highlight line on top */}
              <path 
                d="M0,20 L155,20 C165,20 170,20 175,25 C185,35 185,65 200,65 C215,65 215,35 225,25 C230,20 235,20 245,20 L400,20" 
                fill="none" 
                stroke="url(#nav-gradient)" 
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <defs>
                <linearGradient id="nav-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#d8b4fe" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Actual Nav Items */}
          <div className="relative h-full grid grid-cols-5 items-center px-4 pt-4">
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
            
            {/* The "Marble" Add Button */}
            <div className="flex items-center justify-center -mt-6">
              <button 
                  onClick={onAddTransaction}
                  className="bg-primary text-white rounded-full p-5 shadow-[0_15px_30px_-5px_rgba(139,92,246,0.6)] transition-all hover:scale-110 active:scale-90 border-[4px] border-background relative overflow-hidden group"
              >
                  {/* Internal glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                  <Plus size={32} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
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
        </div>
      </nav>
    </div>
  );
};