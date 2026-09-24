import React from 'react';
import { ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface CashOutButtonProps {
  currentWinnings: number;
  onCashOut: () => void;
  disabled?: boolean;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
  cashoutEnabled?: boolean;
}

export const CashOutButton: React.FC<CashOutButtonProps> = ({
  currentWinnings,
  onCashOut,
  disabled = false,
  theme = 'dark',
  isDemo = false,
  cashoutEnabled = false, // Default to disabled
}) => {
  const isDark = theme === 'dark';
  const isUnavailable = !cashoutEnabled || currentWinnings <= 0 || disabled;

  return (
    <button
      onClick={onCashOut}
      disabled={isUnavailable}
      className={`mx-auto w-auto max-w-xs relative ${isDemo ? 'py-2 px-3 rounded-lg text-[10px] sm:text-xs' : 'py-2.5 px-4 rounded-xl text-xs sm:text-sm'} font-semibold transition-all flex items-center justify-center gap-2 border cursor-pointer font-sans shadow-md ${
        currentWinnings > 0
          ? 'bg-[#10B981] hover:bg-emerald-400 text-slate-950 border-[#10B981] active:scale-[0.99]'
          : isDark
          ? 'bg-[#121722] text-slate-500 border-[#222C3E]'
          : 'bg-slate-100 text-slate-500 border-slate-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="flex items-center gap-1.5">
        <DollarSign className={`${isDemo ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' : 'w-3.5 h-3.5'} shrink-0`} />
        <span className="tracking-tight uppercase font-semibold">
          {!cashoutEnabled ? 'Disabled' : (currentWinnings > 0 ? 'Cash Out' : 'Not Available')}
        </span>
      </div>

      <div className="flex items-center gap-1 text-[10px] sm:text-xs">
        <span className={`font-bold ${isDemo ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>KES {currentWinnings.toLocaleString()}</span>
        {cashoutEnabled && currentWinnings > 0 && <ShieldCheck className={`${isDemo ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' : 'w-3.5 h-3.5'} shrink-0 opacity-90`} />}
      </div>
    </button>
  );
};
