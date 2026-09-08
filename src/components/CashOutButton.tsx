import React from 'react';
import { ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface CashOutButtonProps {
  currentWinnings: number;
  onCashOut: () => void;
  disabled?: boolean;
}

export const CashOutButton: React.FC<CashOutButtonProps> = ({
  currentWinnings,
  onCashOut,
  disabled = false,
}) => {
  return (
    <button
      onClick={onCashOut}
      disabled={disabled}
      className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-between gap-2 border cursor-pointer font-sans shadow-md ${
        currentWinnings > 0
          ? 'bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#080403] border-[#22C55E] active:scale-[0.99]'
          : 'bg-[#181513] hover:bg-[#1A1715] text-[#9CA3AF] border-[#292524]'
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
