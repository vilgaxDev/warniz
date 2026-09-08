import React from 'react';
import { ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface CashOutButtonProps {
  currentWinnings: number;
  onCashOut: () => void;
  disabled?: boolean;
  theme?: 'dark' | 'light';
}

export const CashOutButton: React.FC<CashOutButtonProps> = ({
  currentWinnings,
  onCashOut,
  disabled = false,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onCashOut}
      disabled={disabled}
      className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 border cursor-pointer font-sans shadow-md ${
        currentWinnings > 0
          ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 border-[#10B981] active:scale-[0.99]'
          : isDark
          ? 'bg-[#121722] hover:bg-[#182030] text-slate-400 border-[#222C3E]'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 shrink-0" />
        <span className="tracking-tight uppercase font-semibold">
          {currentWinnings > 0 ? 'Lock In & Cash Out' : 'Cashout Preview'}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="font-bold text-sm sm:text-base">KSh {currentWinnings.toLocaleString()}</span>
        <ShieldCheck className="w-4 h-4 shrink-0 opacity-90" />
      </div>
    </button>
  );
};
