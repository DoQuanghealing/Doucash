import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { BudgetView } from './components/BudgetView';
import { InvestmentGoal } from './components/InvestmentGoal';
import { Insights } from './components/Insights';
import { ReflectionModal } from './components/ReflectionModal';
import { SettingsModal } from './components/SettingsModal';
import { StorageService } from './services/storageService';
import { GeminiService } from './services/geminiService';
import { 
  Transaction, Wallet, Goal, Category, 
  TransactionType, User, Budget, FixedCost 
} from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);

  const [reflectionData, setReflectionData] = useState<{isOpen: boolean, message: string, category: string}>({
    isOpen: false, message: '', category: ''
  });

  // Sử dụng useCallback để tối ưu hóa việc truyền function vào các components con
  const refreshData = useCallback(() => {
    setWallets(StorageService.getWallets());
    setTransactions(StorageService.getTransactions());
    setGoals(StorageService.getGoals());
    setUsers(StorageService.getUsers());
    setBudgets(StorageService.getBudgets());
    setFixedCosts(StorageService.getFixedCosts());
  }, []);

  useEffect(() => {
    // Khởi tạo hệ thống lưu trữ của Manicash
    StorageService.init();
    refreshData();
    
    // Áp dụng theme (Dark/Light) từ cấu hình người dùng
    const theme = StorageService.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Nếu là người dùng mới hoàn toàn, mở cài đặt để họ đặt tên và tạo ví
    const existingUsers = StorageService.getUsers();
    if (existingUsers.length === 0) {
      setIsSettingsOpen(true);
    }
  }, [refreshData]);

  const handleSaveSettings = (updatedUsers: User[], updatedWallets: Wallet[]) => {
    StorageService.updateUsers(updatedUsers);
    StorageService.updateWallets(updatedWallets);
    refreshData();
  };

  const handleUpdateBudgets = (newBudgets: Budget[]) => {
    StorageService.updateBudgets(newBudgets);
    refreshData();
  };
  
  const handlePayFixedCost = (cost: FixedCost) => {
    const tx: Transaction = {
      id: `tx_fix_${Date.now()}`,
      date: new Date().toISOString(),
      amount: cost.amount,
      type: TransactionType.EXPENSE,
      category: Category.BILLS,
      walletId: wallets[0]?.id || 'default',
      description: `Manicash Auto-Pay: ${cost.title}`,
      timestamp: Date.now()
    };
    
    StorageService.addTransaction(tx);
    
    const nextDate = new Date(cost.nextDueDate);
    nextDate.setMonth(nextDate.getMonth() + (cost.frequencyMonths || 1));
    
    const updatedCost: FixedCost = { 
      ...cost, 
      allocatedAmount: 0, 
      nextDueDate: nextDate.toISOString().split('T')[0] 
    };
    
    StorageService.updateFixedCost(updatedCost);
    refreshData();
  };

  const getSpentByCategory = (category: Category) => {
    const now = new Date();
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.category === category)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddTransaction = async (data: Transaction) => {
    StorageService.addTransaction(data);
    refreshData();
    setIsTxModalOpen(false); // Đóng modal ngay lập tức để cảm giác app nhanh hơn

    // Logic AI: Phản chiếu chi tiêu nếu vượt ngân sách
    if (data.type === TransactionType.EXPENSE) {
      const budget = budgets.find(b => b.category === data.category);
      if (budget) {
        const currentSpent = getSpentByCategory(data.category);
        if (currentSpent > budget.limit) {
          const overage = currentSpent - budget.limit;
          // Gọi Gemini AI để lấy thông điệp "cà khịa" hoặc suy ngẫm
          const message = await GeminiService.generateReflectionPrompt(data.category, overage);
          setReflectionData({ 
            isOpen: true, 
            message, 
            category: data.category 
          });
        }
      }
    }
  };

  const renderContent = () => {
    const commonProps = { users, wallets, onRefresh: refreshData };
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...commonProps} transactions={transactions} onOpenSettings={() => setIsSettingsOpen(true)} />;
      case 'budgets':
        return <BudgetView {...commonProps} budgets={budgets} getSpent={getSpentByCategory} onUpdateBudgets={handleUpdateBudgets} fixedCosts={fixedCosts} onPayFixedCost={handlePayFixedCost} />;
      case 'goals':
        return <InvestmentGoal {...commonProps} goals={goals} />;
      case 'insights':
        return <Insights transactions={transactions} users={users} />;
      default:
        return <Dashboard {...commonProps} transactions={transactions} onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500 font-sans">
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddTransaction={() => setIsTxModalOpen(true)}
      >
        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 pb-20 pt-4">
          {renderContent()}
        </main>

        {/* Modals & Overlays */}
        <TransactionForm 
          isOpen={isTxModalOpen} 
          onClose={() => setIsTxModalOpen(false)} 
          onSubmit={handleAddTransaction} 
          wallets={wallets} 
        />
        
        <ReflectionModal 
          isOpen={reflectionData.isOpen} 
          message={reflectionData.message} 
          category={reflectionData.category} 
          onClose={() => setReflectionData({ ...reflectionData, isOpen: false })} 
        />
        
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          users={users} 
          wallets={wallets} 
          onSave={handleSaveSettings} 
          onRefresh={refreshData} 
        />
      </Layout>
    </div>
  );
}

export default App;
