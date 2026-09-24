import React from 'react';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY HARD' | 'EXPERT' | string;

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
  theme?: 'dark' | 'light';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className = '',
}) => {
  const norm = (difficulty || 'MEDIUM').toUpperCase().trim();

  // Restrained, subtle badge styling according to design system
  const getBadgeStyle = () => {
    switch (norm) {
      case 'EASY':
        return 'text-[var(--success)] bg-[var(--success-soft)] border-[var(--border)]';
      case 'MEDIUM':
        return 'text-[var(--accent-text)] bg-[var(--accent-soft)] border-[var(--border)]';
      case 'HARD':
        return 'text-[var(--warning)] bg-[var(--warning-soft)] border-[var(--border)]';
      case 'VERY HARD':
      case 'EXPERT':
        return 'text-[var(--danger)] bg-[var(--danger-soft)] border-[var(--border)]';
      default:
        return 'text-[var(--text-secondary)] bg-[var(--surface)] border-[var(--border)]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${getBadgeStyle()} ${className}`}
    >
      {norm}
    </span>
  );
};
