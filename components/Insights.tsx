import React, { useEffect, useState } from 'react';
import { Transaction, User } from '../types';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Award } from 'lucide-react';
import { VI } from '../constants/vi';

interface Props {
  transactions: Transaction[];
  users: User[];
}

export const Insights: React.FC<Props> = ({ transactions, users }) => {
  const [insight, setInsight] = useState<string>(VI.insights.analyzing);
  const [badge, setBadge] = useState<{title: string, description: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [newInsight, newBadge] = await Promise.all([
        GeminiService.generateWeeklyInsight(transactions, users),
        GeminiService.generateBadge(transactions)
      ]);
      setInsight(newInsight);
      setBadge(newBadge);
      setLoading(false);
    };

    // Only fetch if we have transactions to avoid spamming API on empty init
    if (transactions.length > 0) {
        fetchData();
    }
  }, [transactions.length]); // Dependency on length so it updates when new tx added

  return (
    <div className="p-4 pt-8 space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Sparkles className="mr-2 text-primary" />
        {VI.insights.title}
      </h2>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-surface border border-indigo-500/20 rounded-3xl p-6 shadow-lg">
        <p className="text-zinc-200 leading-relaxed font-medium">
            {loading ? <span className="animate-pulse">{VI.insights.judging}</span> : insight}
        </p>
        <div className="mt-4 flex items-center text-xs text-indigo-400">
            <Sparkles size={12} className="mr-1" />
            {VI.insights.generatedBy}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mt-8">{VI.insights.achievements}</h3>
      
      {/* Badge */}
      <div className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Award size={32} className="text-white" />
        </div>
        <div>
            {loading ? (
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-3 w-48 bg-white/10 rounded animate-pulse"></div>
                </div>
            ) : (
                <>
                    <h4 className="text-lg font-bold text-white">{badge?.title || VI.insights.budgetBeginner}</h4>
                    <p className="text-sm text-zinc-400">{badge?.description || VI.insights.startSpending}</p>
                </>
            )}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface h-32 rounded-3xl border border-white/5 p-4 flex flex-col justify-end">
             <div className="flex items-end space-x-1 h-16">
                 <div className="w-1/4 bg-primary/30 h-[40%] rounded-t-sm"></div>
                 <div className="w-1/4 bg-primary/50 h-[70%] rounded-t-sm"></div>
                 <div className="w-1/4 bg-primary/80 h-[50%] rounded-t-sm"></div>
                 <div className="w-1/4 bg-primary h-[90%] rounded-t-sm"></div>
             </div>
             <p className="text-xs text-zinc-500 mt-2">{VI.insights.spendingTrend}</p>
        </div>
        <div className="bg-surface h-32 rounded-3xl border border-white/5 p-4 flex flex-col justify-center items-center relative">
             <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xs font-bold text-zinc-300">{VI.insights.savings}</span>
             </div>
        </div>
      </div>
    </div>
  );
};