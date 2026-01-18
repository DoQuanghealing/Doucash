import React from 'react';
import { Goal } from '../types';
import { TrendingUp, Plus } from 'lucide-react';
import { VI } from '../constants/vi';

interface Props {
  goals: Goal[];
}

export const InvestmentGoal: React.FC<Props> = ({ goals }) => {
  const goal = goals[0]; // Just showing first goal for demo

  if (!goal) return <div className="p-4 text-center text-zinc-500">{VI.goals.noGoals}</div>;

  const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  return (
    <div className="p-4 pt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{VI.goals.title}</h2>
      </div>

      <div className="bg-surface border border-white/10 rounded-3xl p-6 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <TrendingUp size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                <p className="text-xs text-zinc-400">{VI.goals.target}: ${goal.targetAmount.toLocaleString()} {VI.goals.by} {goal.deadline}</p>
            </div>
          </div>

          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-emerald-400">${goal.currentAmount.toLocaleString()}</span>
            <span className="text-sm font-medium text-zinc-400">{percentage}% {VI.goals.funded}</span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-black/40 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-1/4 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <h4 className="text-sm font-semibold text-zinc-300">{VI.goals.rounds}</h4>
                 <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-zinc-300 flex items-center">
                    <Plus size={12} className="mr-1" /> {VI.goals.addRound}
                 </button>
             </div>
             
             <div className="space-y-3">
                {goal.rounds.map((round) => (
                    <div key={round.id} className="flex items-center relative pl-6 pb-4 last:pb-0 border-l border-emerald-500/20 last:border-0">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-surface"></div>
                        <div className="flex-1 ml-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-white">${round.amount.toLocaleString()}</span>
                                <span className="text-xs text-zinc-500">{round.date}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{round.note} • {round.contributorId === 'u1' ? 'Alex' : 'Sam'}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};