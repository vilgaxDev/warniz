import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
  Clock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Question, RewardStep } from '../types';
import { AnswerOption } from './AnswerOption';
import { DifficultyBadge } from './DifficultyBadge';
import { getCategoryLucideIcon } from './CategoryNav';

interface QuestionCardProps {
  categoryName: string;
  categoryIcon?: string;
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  roundTimerSeconds: number;
  totalRoundSeconds: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  accumulatedWinnings: number;
  streakCount: number;
  floatingEarnings: { id: string | number; amount: number }[];
  rewardLadder: RewardStep[];
  walletBalance?: number;
  soundEnabled: boolean;
  onToggleSound?: () => void;
  onSelectOption: (optionIndex: number) => void;
  onCashOut?: () => void;
  onExitQuiz: () => void;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
  cashoutEnabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  categoryName,
  question,
  currentQuestionIndex,
  totalQuestions,
  roundTimerSeconds,
  totalRoundSeconds,
  selectedOption,
  isAnswered,
  isCorrect,
  accumulatedWinnings,
  streakCount,
  floatingEarnings,
  rewardLadder,
  walletBalance = 0,
  soundEnabled,
  onToggleSound,
  onSelectOption,
  onExitQuiz,
}) => {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, question?.options?.length || 4);
  const progressPercent = Math.min(100, Math.max(0, ((currentQuestionIndex + 1) / totalQuestions) * 100));
  const baseReward = rewardLadder[currentQuestionIndex]?.rewardKsh || (currentQuestionIndex + 1) * 25;
  const CategoryIcon = getCategoryLucideIcon(categoryName);

  // Difficulty calculation
  const difficulty = question?.difficulty || (
    currentQuestionIndex < 3 ? 'EASY' : currentQuestionIndex < 6 ? 'MEDIUM' : 'HARD'
  );

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Floating reward particle
  const [pulseWinnings, setPulseWinnings] = useState(false);
  useEffect(() => {
    if (accumulatedWinnings > 0) {
      setPulseWinnings(true);
      const timer = setTimeout(() => setPulseWinnings(false), 800);
      return () => clearTimeout(timer);
    }
  }, [accumulatedWinnings]);

  return (
    <div className="min-h-[85vh] w-full max-w-2xl mx-auto px-4 py-6 flex flex-col justify-center select-none font-sans">
      {/* Floating Earnings Notification */}
      <div className="fixed inset-x-0 top-16 pointer-events-none z-50 flex justify-center">
        <AnimatePresence>
          {floatingEarnings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -40, scale: 1.1 }}
              exit={{ opacity: 0, y: -80, scale: 0.9 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border-strong)] text-[var(--success)] font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span>+KES {item.amount.toLocaleString()} ({item.amount * 10} XP)</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOP HEADER CONTROLS */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Arena</span>
        </button>

        <div className="flex items-center gap-3">
          {/* XP & Current Streak */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-muted)]">Streak:</span>
            <span className="font-mono font-semibold text-[var(--accent-text)]">{streakCount}x</span>
          </div>

          <div className="h-3 w-[1px] bg-[var(--border)]" />

          {/* Wallet / Round Purse */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--success)]">
            <Trophy className="w-3.5 h-3.5" />
            <span>KES {accumulatedWinnings.toLocaleString()}</span>
          </div>

          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* MAIN NEUTRAL QUESTION CARD */}
      <div className="triv-card p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Progress Bar (Thin, Minimal) */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[var(--surface)]">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header: Category & Difficulty Badge */}
        <div className="flex items-center justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)]">
              <CategoryIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {categoryName}
            </span>
          </div>

          <DifficultyBadge difficulty={difficulty} />
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug tracking-tight mb-6">
          {question?.question}
        </h2>

        {/* 4 Answer Options */}
        <div className="space-y-2.5 mb-6">
          {question?.options?.map((opt, idx) => (
            <AnswerOption
              key={idx}
              index={idx}
              label={optionLabels[idx] || String(idx + 1)}
              optionText={opt}
              isSelected={selectedOption === idx}
              isCorrectOption={question.correctIndex !== undefined ? question.correctIndex === idx : question.correctAnswerIndex === idx}
              isAnswered={isAnswered}
              userSelectedOption={selectedOption}
              onSelect={onSelectOption}
            />
          ))}
        </div>

        {/* Card Footer: Timer and Question Progress */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs">
          {/* Round Timer */}
          <div className="flex items-center gap-1.5 font-mono tabular-nums font-semibold">
            <Clock className={`w-4 h-4 ${roundTimerSeconds <= 3 ? 'text-[var(--danger)] animate-pulse' : 'text-[var(--text-secondary)]'}`} />
            <span className={roundTimerSeconds <= 3 ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}>
              {roundTimerSeconds}s
            </span>
            <span className="text-[var(--text-muted)] font-normal text-[11px]">remaining</span>
          </div>

          {/* Question Index Info & Reward */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[var(--text-muted)]">
              +{baseReward * 10} XP
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="triv-card p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Exit Active Round?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If you leave now, this round will conclude with any current locked winnings credited.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors cursor-pointer"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitQuiz();
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[var(--danger)] text-white hover:opacity-90 rounded-lg transition-colors cursor-pointer"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
