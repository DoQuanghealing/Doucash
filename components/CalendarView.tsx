import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatVND } from '../utils/format';

interface Props {
  transactions: Transaction[];
}

export const CalendarView: React.FC<Props> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDailyData = (day: number) => {
    const targetDateStr = new Date(year, month, day).toDateString();
    const dailyTx = transactions.filter(t => new Date(t.date).toDateString() === targetDateStr);
    const income = dailyTx.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = dailyTx.filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.TRANSFER).reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4 px-2">
        <button onClick={prevMonth} className="p-2 glass-card rounded-full text-foreground/50"><ChevronLeft size={20} /></button>
        <span className="font-black text-sm uppercase tracking-widest text-foreground">Tháng {month + 1} - {year}</span>
        <button onClick={nextMonth} className="p-2 glass-card rounded-full text-foreground/50"><ChevronRight size={20} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
         {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
             <div key={d} className="text-[10px] text-foreground/30 font-black">{d}</div>
         ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`p-${i}`} className="h-16"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const { income, expense } = getDailyData(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            return (
                <div key={day} className={`h-16 rounded-xl flex flex-col items-center justify-between py-2 border transition-all ${isToday ? 'bg-primary border-primary shadow-lg shadow-primary/30' : 'bg-foreground/[0.02] border-foreground/5'}`}>
                    <span className={`text-[10px] font-black ${isToday ? 'text-white' : 'text-foreground/40'}`}>{day}</span>
                    <div className="flex flex-col items-center gap-0.5">
                        {income > 0 && <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-emerald-500'}`}></div>}
                        {expense > 0 && <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-red-500'}`}></div>}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};