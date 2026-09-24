import React from 'react';
import { CheckCircle2, XCircle, Check, X } from 'lucide-react';

interface AnswerOptionProps {
  index: number;
  label: string;
  optionText: string;
  isSelected: boolean;
  isCorrectOption: boolean;
  isAnswered: boolean;
  userSelectedOption: number | null;
  onSelect: (index: number) => void;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  index,
  label,
  optionText,
  isSelected,
  isCorrectOption,
  isAnswered,
  userSelectedOption,
  onSelect,
  theme = 'dark',
  isDemo = false,
}) => {
  const isDark = theme === 'dark';
  const isTrueOption = optionText.trim().toLowerCase() === 'true';
  const isFalseOption = optionText.trim().toLowerCase() === 'false';

  // Base Styling
  let buttonStyle = isDark
    ? 'bg-[#182030] border-[#222C3E] text-slate-100 hover:border-slate-400 hover:bg-[#1f2a40]'
    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-xs';
  
  let badgeStyle = isDark
    ? 'bg-[#121722] text-slate-300 border-[#222C3E]'
    : 'bg-slate-100 text-slate-700 border-slate-200';
  
  let optionTextColor = isDark ? 'text-white' : 'text-slate-900';
  let icon = null;

  // Answer Evaluation States
  if (isAnswered) {
    if (isSelected) {
      if (isCorrectOption) {
        buttonStyle = isDark
          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/40 font-bold shadow-lg shadow-emerald-950/50'
          : 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-400/60 font-black shadow-md';
        badgeStyle = isDark
          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
          : 'bg-emerald-600 text-white border-emerald-700 font-black';
        optionTextColor = isDark ? 'text-emerald-300 font-black' : 'text-emerald-950 font-black';
        icon = <CheckCircle2 className={`${isDemo ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' : 'w-4 h-4 sm:w-5 sm:h-5'} shrink-0 ml-auto text-emerald-400`} />;
      } else {
        buttonStyle = isDark
          ? 'bg-rose-500/20 border-rose-500 text-rose-400 ring-2 ring-rose-500/40 font-bold shadow-lg shadow-rose-950/50 animate-shake'
          : 'bg-rose-50 border-rose-600 text-rose-950 ring-2 ring-rose-400/60 font-black shadow-md animate-shake';
        badgeStyle = isDark
          ? 'bg-rose-500 text-white border-rose-400 font-black'
          : 'bg-rose-600 text-white border-rose-700 font-black';
        optionTextColor = isDark ? 'text-rose-300 font-black' : 'text-rose-950 font-black';
        icon = <XCircle className={`${isDemo ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' : 'w-4 h-4 sm:w-5 sm:h-5'} shrink-0 ml-auto text-rose-400`} />;
      }
    } else if (isCorrectOption && userSelectedOption !== null && userSelectedOption !== index) {
      // Reveal correct answer if user got it wrong
      buttonStyle = isDark
        ? 'bg-emerald-500/10 border-emerald-500/80 text-emerald-400 font-semibold ring-1 ring-emerald-500/30'
        : 'bg-emerald-50/90 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-400/40';
      badgeStyle = isDark
        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-black'
        : 'bg-emerald-600 text-white font-black';
      optionTextColor = isDark ? 'text-emerald-300' : 'text-emerald-950';
      icon = <CheckCircle2 className={`${isDemo ? 'w-2.5 h-2.5 sm:w-3 sm:h-3' : 'w-4 h-4 sm:w-5 sm:h-5'} text-emerald-400 shrink-0 ml-auto`} />;
    } else {
      // Other unselected options
      buttonStyle = isDark
        ? 'bg-[#121722]/50 border-[#222C3E]/50 text-slate-500 opacity-40'
        : 'bg-slate-100/60 border-slate-200/60 text-slate-400 opacity-50';
      badgeStyle = isDark
        ? 'bg-[#121722] text-slate-500 border-[#222C3E]/50'
        : 'bg-slate-200 text-slate-400 border-slate-300';
      optionTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
    }
  }

  return (
    <button
      type="button"
      onClick={() => !isAnswered && onSelect(index)}
      disabled={isAnswered}
      className={`w-full ${isDemo ? 'min-h-[36px] sm:min-h-[40px] p-1 sm:p-1.5 rounded-md' : 'min-h-[56px] sm:min-h-[64px] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl'} border text-left transition-all duration-150 flex items-center gap-1 sm:gap-2 group cursor-pointer disabled:cursor-default select-none shadow-xs active:scale-[0.98] ${buttonStyle}`}
    >
      {/* Option Letter Badge (A, B, C, D) or Check for True/False */}
      <span className={`w-4 h-4 sm:w-5 sm:h-5 ${isDemo ? 'rounded-sm' : 'rounded-lg'} border flex items-center justify-center font-mono ${isDemo ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-xs'} font-black shrink-0 transition-colors shadow-2xs ${badgeStyle}`}>
        {isTrueOption ? '✓' : isFalseOption ? '✗' : label}
      </span>

      {/* Option Text */}
      <span className={`flex-1 ${isDemo ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'} font-semibold leading-tight line-clamp-2 tracking-tight ${optionTextColor}`}>
        {optionText}
      </span>

      {/* Status Icon Indicator */}
      {icon && <span className="shrink-0 ml-auto flex items-center justify-center">{icon}</span>}
    </button>
  );
};
