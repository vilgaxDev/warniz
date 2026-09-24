import React from 'react';
import { Check, X } from 'lucide-react';

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
}) => {
  // Determine styles strictly following design tokens
  // DEFAULT: bg surface, border border
  // HOVER: bg surface-hover, border strong-border
  // SELECTED: bg accent-soft, border accent
  // CORRECT: bg success-soft, border success, text success
  // WRONG: bg danger-soft, border danger, text danger

  let stateClasses = 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)]';
  let badgeClasses = 'bg-[var(--surface-active)] border-[var(--border)] text-[var(--text-secondary)]';
  let iconIndicator = null;

  if (isAnswered) {
    if (isSelected) {
      if (isCorrectOption) {
        stateClasses = 'bg-[var(--success-soft)] border-[var(--success)] text-[var(--success)] font-semibold';
        badgeClasses = 'bg-[var(--success)] text-white border-[var(--success)]';
        iconIndicator = <Check className="w-4 h-4 text-[var(--success)] shrink-0 ml-auto" />;
      } else {
        stateClasses = 'bg-[var(--danger-soft)] border-[var(--danger)] text-[var(--danger)] font-semibold animate-shake';
        badgeClasses = 'bg-[var(--danger)] text-white border-[var(--danger)]';
        iconIndicator = <X className="w-4 h-4 text-[var(--danger)] shrink-0 ml-auto" />;
      }
    } else if (isCorrectOption) {
      // Reveal the correct option if the user chose the wrong one
      stateClasses = 'bg-[var(--success-soft)] border-[var(--success)] text-[var(--success)] font-semibold';
      badgeClasses = 'bg-[var(--success)] text-white border-[var(--success)]';
      iconIndicator = <Check className="w-4 h-4 text-[var(--success)] shrink-0 ml-auto" />;
    } else {
      // Unselected remaining options
      stateClasses = 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] opacity-60';
      badgeClasses = 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]';
    }
  } else if (isSelected) {
    stateClasses = 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent-text)] font-semibold';
    badgeClasses = 'bg-[var(--accent)] text-white border-[var(--accent)]';
  }

  return (
    <button
      type="button"
      onClick={() => !isAnswered && onSelect(index)}
      disabled={isAnswered}
      className={`w-full min-h-[50px] sm:min-h-[54px] p-3 rounded-xl border text-left transition-all duration-150 flex items-center gap-3 cursor-pointer disabled:cursor-default select-none ${stateClasses}`}
    >
      {/* Option Key (A, B, C, D) */}
      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${badgeClasses}`}>
        {label}
      </span>

      {/* Option Text */}
      <span className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
        {optionText}
      </span>

      {/* Icon Indicator */}
      {iconIndicator}
    </button>
  );
};
