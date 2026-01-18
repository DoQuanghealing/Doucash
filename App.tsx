import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { BudgetView } from './components/BudgetView';
import { InvestmentGoal } from './components/InvestmentGoal';
import { Insights } from './components/Insights';
import { ReflectionModal } from './components/ReflectionModal';
import { StorageService } from './services/storageService';
import { GeminiService } from './services/geminiService';
import { INITIAL_BUDGETS, USERS } from './constants';
import { Transaction, Wallet, Goal, Category, TransactionType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  // Data State
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets] = useState(INITIAL_BUDGETS); // Static config for now

  // Logic State
  const [reflectionData, setReflectionData] = useState<{isOpen: boolean, message: string, category: string}>({
    isOpen: false, message: '', category: ''
  });

  useEffect(() => {
    StorageService.init();
    refreshData();
  }, []);

  const refreshData = () => {
    setWallets(StorageService.getWallets());
    setTransactions(StorageService.getTransactions());
    setGoals(StorageService.getGoals());
  };

  const getSpentByCategory = (category: Category) => {
    // Filter for current month expense transactions
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
    // Save locally
    StorageService.addTransaction(data);
    refreshData();
    // Note: We do NOT close the modal here anymore to allow the form to show post-submit reflection
    // setIsTxModalOpen(false); 

    // Check Budget Logic
    if (data.type === TransactionType.EXPENSE) {
        const budget = budgets.find(b => b.category === data.category);
        if (budget) {
            const currentSpent = getSpentByCategory(data.category); // Note: this calculates based on state which might be stale by 1 tick, but okay for demo, ideally pass updated txs
            // Re-calculate with new tx amount for accuracy
            const newTotal = currentSpent + data.amount; 
            
            if (newTotal > budget.limit) {
                const overage = newTotal - budget.limit;
                // Generate AI reflection
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
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard wallets={wallets} transactions={transactions} />;
      case 'budgets':
        return <BudgetView budgets={budgets} getSpent={getSpentByCategory} />;
      case 'goals':
        return <InvestmentGoal goals={goals} />;
      case 'insights':
        return <Insights transactions={transactions} users={USERS} />;
      default:
        return <Dashboard wallets={wallets} transactions={transactions} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onAddTransaction={() => setIsTxModalOpen(true)}
    >
      {renderContent()}

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
    </Layout>
  );
}

export default App;