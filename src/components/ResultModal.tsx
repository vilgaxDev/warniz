import React from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Flame,
  Wallet,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface ResultModalProps {
  totalWon: number;
  questionsCorrect: number;
  totalQuestions: number;
  maxStreak: number;
  reason: 'wrong_answer' | 'timeout' | 'cashed_out' | 'completed' | 'wrong' | null;
  categoryName: string;
  onClaimAndContinue: () => void;
  onPlayAgain: () => void;
  theme?: 'dark' | 'light';
  stakeAmount?: number;
  isDemo?: boolean;
  onSignUp?: () => void;
  onShareBettingSlip?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  totalWon,
  questionsCorrect,
  totalQuestions,
  maxStreak,
  reason,
  categoryName,
  onClaimAndContinue,
  onPlayAgain,
  stakeAmount = 0,
  onShareBettingSlip,
}) => {
  const isVictory = reason === 'completed' || reason === 'cashed_out';

  const getTitle = () => {
    switch (reason) {
      case 'cashed_out':
        return 'Cash Out Executed';
      case 'completed':
        return 'Round Completed!';
      case 'timeout':
        return 'Time Limit Reached';
      case 'wrong_answer':
      case 'wrong':
      default:
        return 'Round Settled';
    }
  };

  const getSubtitle = () => {
    switch (reason) {
      case 'cashed_out':
        return `You safely locked in KES ${totalWon.toLocaleString()} in speed trivia earnings.`;
      case 'completed':
        return `Perfect accuracy! All ${totalQuestions} questions answered correctly.`;
      case 'timeout':
        return `Timer ran out on question ${questionsCorrect + 1}.`;
      case 'wrong_answer':
      case 'wrong':
      default:
        return `Arena round settled on question ${questionsCorrect + 1}.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm triv-card p-6 flex flex-col items-center text-center shadow-xl relative"
      >
        {/* Status Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${
          isVictory
            ? 'bg-[var(--success-soft)] border-[var(--success)] text-[var(--success)]'
            : 'bg-[var(--danger-soft)] border-[var(--danger)] text-[var(--danger)]'
        }`}>
          {reason === 'cashed_out' ? (
            <ShieldCheck className="w-6 h-6" />
          ) : isVictory ? (
            <Trophy className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>

        {/* Category Badge */}
        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] mb-2">
          {categoryName}
        </span>

        {/* Title & Subtitle */}
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          {getTitle()}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1 mb-4 leading-relaxed">
          {getSubtitle()}
        </p>

        {/* Earnings Box */}
        <div className="w-full py-3.5 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-0.5">
            Round Winnings
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--success)]">
            KES {totalWon.toLocaleString()}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
            +{totalWon * 10} XP gained
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mb-5 text-center">
          <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Accuracy</div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">
              {questionsCorrect}/{totalQuestions}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Max Streak</div>
            <div className="text-xs font-mono font-bold text-[var(--accent-text)] mt-0.5">
              {maxStreak}x
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Stake</div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-0.5">
              KES {stakeAmount || 0}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={onClaimAndContinue}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            Back to Arenas
          </button>

          {onShareBettingSlip && (
            <button
              type="button"
              onClick={onShareBettingSlip}
              className="w-full py-1.5 px-4 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Result</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
