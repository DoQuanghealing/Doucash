import { Transaction, Wallet, Goal, TransactionType, Category } from '../types';
import { INITIAL_WALLETS, USERS } from '../constants';

// This service mimics a Google Sheets backend by using LocalStorage with a schema 
// that is easily mappable to 2D arrays (rows/columns).

const KEYS = {
  TRANSACTIONS: 'duocash_transactions',
  WALLETS: 'duocash_wallets',
  GOALS: 'duocash_goals',
  CATEGORIES: 'duocash_categories',
};

export const StorageService = {
  // Initialize default data if empty
  init: () => {
    if (!localStorage.getItem(KEYS.WALLETS)) {
      localStorage.setItem(KEYS.WALLETS, JSON.stringify(INITIAL_WALLETS));
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      // Seed default categories from Enum
      const defaultCats = Object.values(Category);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCats));
    }
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      // Add some dummy transactions
      const dummyTransactions: Transaction[] = [
        { id: 't1', date: new Date().toISOString(), amount: 1500, type: TransactionType.INCOME, category: Category.INCOME, walletId: 'w1', description: 'Paycheck', timestamp: Date.now() },
        { id: 't2', date: new Date().toISOString(), amount: 45, type: TransactionType.EXPENSE, category: Category.FOOD, walletId: 'w1', description: 'Sushi Night', timestamp: Date.now() },
        { id: 't3', date: new Date().toISOString(), amount: 120, type: TransactionType.EXPENSE, category: Category.SHOPPING, walletId: 'w2', description: 'New Sneakers', timestamp: Date.now() },
      ];
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(dummyTransactions));
    }
    if (!localStorage.getItem(KEYS.GOALS)) {
      const initialGoal: Goal = {
        id: 'g1',
        name: 'Dream House Downpayment',
        targetAmount: 50000,
        currentAmount: 12500,
        deadline: '2026-01-01',
        rounds: [
          { id: 'r1', date: '2024-01-15', amount: 5000, contributorId: 'u1', note: 'Bonus' },
          { id: 'r2', date: '2024-02-20', amount: 7500, contributorId: 'u2', note: 'Savings' },
        ]
      };
      localStorage.setItem(KEYS.GOALS, JSON.stringify([initialGoal]));
    }
  },

  getCategories: (): string[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    if (data) return JSON.parse(data);
    return Object.values(Category);
  },

  addCategory: (newCategory: string): string[] => {
    const categories = StorageService.getCategories();
    // Check for duplicates (case insensitive)
    if (!categories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
      categories.push(newCategory.trim());
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    }
    return categories;
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  addTransaction: (tx: Transaction) => {
    const txs = StorageService.getTransactions();
    txs.push(tx); // Append row
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
    
    // Update wallet balance
    const wallets = StorageService.getWallets();
    const wallet = wallets.find(w => w.id === tx.walletId);
    if (wallet) {
      if (tx.type === TransactionType.INCOME) wallet.balance += tx.amount;
      if (tx.type === TransactionType.EXPENSE) wallet.balance -= tx.amount;
      if (tx.type === TransactionType.TRANSFER) {
          wallet.balance -= tx.amount;
      }
      localStorage.setItem(KEYS.WALLETS, JSON.stringify(wallets));
    }
    return wallets; // Return updated wallets
  },

  getWallets: (): Wallet[] => {
    const data = localStorage.getItem(KEYS.WALLETS);
    return data ? JSON.parse(data) : [];
  },

  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },

  updateGoal: (updatedGoal: Goal) => {
    const goals = StorageService.getGoals();
    const index = goals.findIndex(g => g.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
    }
  }
};