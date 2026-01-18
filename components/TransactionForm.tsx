import React, { useState, useEffect } from 'react';
import { TransactionType, Category, Wallet } from '../types';
import { X } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { ReflectionModal } from './ReflectionModal';
import { VI } from '../constants/vi';
import { formatVnd } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  wallets: Wallet[];
}

export const TransactionForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  wallets,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<string>(Category.FOOD);
  const [walletId, setWalletId] = useState('');
  const [reflectionMsg, setReflectionMsg] = useState<string | null>(null);

  // Custom Category State
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Sync walletId when wallets change
  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  // Load categories on open
  useEffect(() => {
    if (isOpen) {
      setAvailableCategories(StorageService.getCategories());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !walletId) return;

    const parsedAmount = Math.round(Number(amount));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    const data = {
      amount: parsedAmount,
      description,
      type,
      category: type === TransactionType.INCOME ? Category.INCOME : category,
      walletId,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    onSubmit(data);

    // Clear inputs
    setAmount('');
    setDescription('');

    // If it's an expense, try to show a quick reflection before closing
    if (data.type === TransactionType.EXPENSE) {
      const msg = await GeminiService.generateTransactionComment(data);
      if (msg) {
        setReflectionMsg(msg);
        return; // don't close yet
      }
    }

    onClose();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setIsCatModalOpen(true);
    } else {
      setCategory(val);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const existing = availableCategories.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );

    if (existing) {
      setCategory(existing);
    } else {
      const updatedList = StorageService.addCategory(trimmed);
      setAvailableCategories(updatedList);
      setCategory(trimmed);
    }

    setNewCategoryName('');
    setIsCatModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-surface border-t border-white/10 sm:border rounded-t-2xl sm:rounded-2xl p-6 pb-safe-bottom animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {VI.transaction.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl font-bold">
                ₫
              </span>
              <input
                type="number"
                inputMode="numeric"
                step={1000}
                placeholder={VI.transaction.placeholderAmount}
                autoFocus
                className="w-full bg-black/20 text-3xl font-bold text-white pl-10 pr-4 py-4 rounded-xl border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl">
              {(Object.values(TransactionType) as TransactionType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 text-sm font-medium rounded-lg transition-colors ${
                      type === t
                        ? 'bg-surfaceHighlight text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {VI.transaction.types[t] || t}
                  </button>
                )
              )}
            </div>

            {/* Category Selector */}
            {type === TransactionType.EXPENSE && (
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 ml-1">
                  {VI.transaction.category}
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full bg-surfaceHighlight text-white p-3 rounded-xl border border-white/5 focus:outline-none"
                >
                  {availableCategories
                    .filter(
                      (c) =>
                        c !== Category.INCOME &&
                        c !== Category.TRANSFER
                    )
                    .map((c) => (
                      <option key={c} value={c}>
                        {(VI.category as any)[c] || c}
                      </option>
                    ))}
                  <option
                    value="__NEW__"
                    className="font-bold text-primary"
                  >
                    {VI.transaction.addCategory}
                  </option>
                </select>
              </div>
            )}

            {/* Wallet Selector */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 ml-1">
                {VI.transaction.wallet}
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-surfaceHighlight text-white p-3 rounded-xl border border-white/5 focus:outline-none"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatVnd(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 ml-1">
                {VI.transaction.description}
              </label>
              <input
                type="text"
                placeholder={VI.transaction.placeholderDesc}
                className="w-full bg-surfaceHighlight text-white p-3 rounded-xl border border-white/5 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all mt-4"
            >
              {VI.transaction.save}
            </button>
          </form>
        </div>
      </div>

      {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-4">
              {VI.transaction.newCategoryTitle}
            </h3>
            <form onSubmit={handleCreateCategory}>
              <div className="space-y-2 mb-6">
                <label className="text-xs text-zinc-400 ml-1">
                  {VI.transaction.categoryName}
                </label>
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCatModalOpen(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 py-3 rounded-xl font-medium text-zinc-400 bg-white/5 hover:bg-white/10"
                >
                  {VI.transaction.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="flex-1 py-3 rounded-xl font-medium text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {VI.transaction.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reflection Overlay */}
      <ReflectionModal
        isOpen={!!reflectionMsg}
        onClose={() => {
          setReflectionMsg(null);
          onClose();
        }}
        message={reflectionMsg || ''}
        title={VI.reflection.title}
        variant="success"
      />
    </>
  );
};
