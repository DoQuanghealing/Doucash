import React from 'react';
import { Budget, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { VI } from '../constants/vi';

interface Props {
  budgets: Budget[];
  getSpent: (category: Category) => number;
}

export const BudgetView: React.FC<Props> = ({ budgets, getSpent }) => {
  return (
    <div className="p-4 space-y-6 pt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white">{VI.budget.title}</h2>
        <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">{VI.budget.strictMode}</span>
      </div>
      
      <div className="space-y-5">
        {budgets.map((budget) => {
          const spent = getSpent(budget.category);
          const percentage = Math.min(100, Math.round((spent / budget.limit) * 100));
          const isOver = spent > budget.limit;
          const isWarning = !isOver && percentage >= 70;
          const color = CATEGORY_COLORS[budget.category] || '#ccc';

          return (
            <div key={budget.category} className="bg-surface rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner" style={{ backgroundColor: `${color}20`, color: color }}>
                    {budget.category === Category.FOOD && '🍔'}
                    {budget.category === Category.SHOPPING && '🛍️'}
                    {budget.category === Category.TRANSPORT && '🚗'}
                    {budget.category === Category.ENTERTAINMENT && '🎬'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">{VI.category[budget.category] || budget.category}</h3>
                    <p className="text-xs text-zinc-500">
                      ${spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${isOver ? 'text-danger' : isWarning ? 'text-warning' : 'text-zinc-300'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isOver ? 'bg-danger animate-pulse' : isWarning ? 'bg-warning' : ''}`}
                  style={{ width: `${percentage}%`, backgroundColor: (isOver || isWarning) ? undefined : color }}
                />
              </div>
              
              {isOver && (
                <p className="text-xs text-danger mt-2 flex items-center">
                  ⚠️ {VI.budget.limitExceeded} ${(spent - budget.limit).toFixed(0)}
                </p>
              )}
              {isWarning && (
                <p className="text-xs text-warning mt-2 flex items-center">
                  {VI.budget.warning}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};