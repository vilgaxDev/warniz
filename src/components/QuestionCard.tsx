import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Sparkles, Award, ShieldCheck, Zap, Volume2, VolumeX,
  Flame, TrendingUp, DollarSign, Wallet, CheckCircle2, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { Question, RewardStep } from '../types';
import { QuizTimer } from './QuizTimer';
import { RewardLadder } from './RewardLadder';
import { AnswerOption } from './AnswerOption';
import { CashOutButton } from './CashOutButton';

interface QuestionCardProps {
  categoryName: string;
  categoryIcon: string;
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  timerSeconds: number;
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
  onCashOut: () => void;
  onExitQuiz: () => void;
  theme?: 'dark' | 'light';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  categoryName,
  categoryIcon,
  question,
  currentQuestionIndex,
  totalQuestions,
  timerSeconds,
  selectedOption,
  isAnswered,
  isCorrect,
  accumulatedWinnings,
  streakCount,
  floatingEarnings,
  rewardLadder,
  walletBalance = 5420,
  soundEnabled,
  onToggleSound,
  onSelectOption,
  onCashOut,
  onExitQuiz,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.min(100, Math.max(0, ((currentQuestionIndex + 1) / totalQuestions) * 100));
  const currentReward = rewardLadder[currentQuestionIndex]?.rewardKsh || (currentQuestionIndex + 1) * 3;
  const totalLivePurse = walletBalance + accumulatedWinnings;

  // Local state to show confirmation if user clicks leave
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Animated money pulse effect when accumulatedWinnings changes
  const [isWinningsPulsing, setIsWinningsPulsing] = useState(false);
  useEffect(() => {
    if (accumulatedWinnings > 0) {
      setIsWinningsPulsing(true);
      const timer = setTimeout(() => setIsWinningsPulsing(false), 900);
      return () => clearTimeout(timer);
    }
  }, [accumulatedWinnings]);

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 max-w-3xl mx-auto relative overflow-hidden select-none font-sans transition-colors ${
      isDark ? 'bg-[#0B0E14] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      
      {/* 1. FLOATING MONEY BURST PARTICLES */}
      <div className="fixed inset-x-0 top-16 pointer-events-none z-50 flex justify-center">
        <AnimatePresence>
          {floatingEarnings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.7 }}
              animate={{ opacity: 1, y: -40, scale: 1.15 }}
              exit={{ opacity: 0, y: -90, scale: 0.8 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 text-slate-950 font-black text-xl sm:text-2xl shadow-2xl flex items-center gap-2 border-2 border-white ring-4 ring-emerald-400/40"
            >
              <Sparkles className="w-6 h-6 fill-slate-950 text-slate-950 animate-spin" />
              <span>+KSh {item.amount.toLocaleString()} 💰</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. TOP ARENA STATUS BAR */}
      <header className="w-full space-y-3">
        <div className="flex items-center justify-between gap-2">
          
          {/* Exit Button */}
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-[#182030] border-[#222C3E] text-slate-300 hover:text-white hover:bg-[#222C3E]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>

          {/* Category Chip with Live Pulse Dot */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-extrabold tracking-tight ${
            isDark
              ? 'bg-[#182030] border-[#222C3E] text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-900 shadow-xs'
          }`}>
            <span className="text-base leading-none">{categoryIcon}</span>
            <span className="truncate max-w-[130px] sm:max-w-none">{categoryName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          </div>

          {/* Sound Toggle & Question Counter */}
          <div className="flex items-center gap-2">
            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isDark
                      ? 'bg-[#182030] border-[#222C3E] text-slate-400'
                      : 'bg-white border-slate-200 text-slate-500'
                }`}
                title={soundEnabled ? 'Sound On' : 'Sound Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            <div className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
              isDark
                ? 'bg-[#182030] border-[#222C3E] text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}>
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>
        </div>

        {/* 3. ULTRA-REALISTIC LIVE MONEY HUD & WALLET PURSE */}
        <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all relative overflow-hidden shadow-lg ${
          isDark
            ? 'bg-gradient-to-br from-[#182030] via-[#121722] to-[#0d1424] border-[#222C3E]'
            : 'bg-gradient-to-br from-emerald-50/90 via-white to-green-50/70 border-emerald-200/80 shadow-md'
        }`}>
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10">
            {/* Left: Total Live Purse (Banked + Live Accumulation) */}
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md border ${
                isDark
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-600 text-white border-emerald-500'
              }`}>
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Live Wallet Purse</span>
                  {streakCount > 1 && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 font-extrabold border border-orange-500/30 animate-pulse">
                      <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
                      <span>{streakCount}X STREAK</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={`text-lg sm:text-2xl font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    KSh {totalLivePurse.toLocaleString()}
                  </span>
                  {accumulatedWinnings > 0 && (
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 animate-pulse">
                      (+KSh {accumulatedWinnings.toLocaleString()})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Round Earnings Ticker Pill */}
            <div className="text-right">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Current Question Bounty
              </span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black transition-all ${
                isWinningsPulsing
                  ? 'bg-emerald-500 text-slate-950 border-white ring-2 ring-emerald-400 scale-105 shadow-lg'
                  : isDark
                    ? 'bg-[#121722] border-emerald-500/30 text-emerald-400'
                    : 'bg-white border-emerald-200 text-emerald-700 shadow-xs'
              }`}>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>+KSh {currentReward}</span>
              </div>
            </div>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full mt-3 rounded-full h-1.5 overflow-hidden bg-black/20 border border-white/5">
            <div
              className="bg-gradient-to-r from-[#F55129] to-emerald-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 4. REWARD LADDER STREAK DISPLAY */}
      <div className="my-1 sm:my-2">
        <RewardLadder
          currentQuestionIndex={currentQuestionIndex}
          streakCount={streakCount}
          totalQuestions={totalQuestions}
          rewardLadder={rewardLadder}
        />
      </div>

      {/* 5. CIRCULAR SPEED TIMER & QUESTION ARENA */}
      <main className="w-full flex-1 flex flex-col justify-center my-1 sm:my-2 space-y-3">
        {/* Speed Timer */}
        <div className="flex flex-col items-center justify-center">
          <QuizTimer
            secondsLeft={timerSeconds}
            totalSeconds={12}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Question Text Box */}
        <div className={`w-full p-4 sm:p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#182030] to-[#121722] border-[#222C3E]'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#F55129] mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Question {currentQuestionIndex + 1}</span>
          </span>

          <h2 className={`text-base sm:text-xl font-bold leading-snug tracking-tight max-w-xl mx-auto ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {question.question}
          </h2>

          {/* Feedback Explanation Drawer when Answered */}
          {isAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-xs sm:text-sm font-medium p-3 rounded-xl border text-left w-full flex items-start gap-2.5 ${
                isCorrect
                  ? isDark
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : isDark
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                    : 'bg-rose-50 text-rose-950 border-rose-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              </div>
              <div className="leading-relaxed">
                <strong className="block mb-0.5">{isCorrect ? 'Correct! +KSh ' + currentReward : 'Incorrect Answer'}</strong>
                <span>{question.explanation}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 2-Row / 2-Column Answer Options Grid (A B on Row 1, C D on Row 2; or True / False side-by-side) */}
        <div className="w-full grid grid-cols-2 gap-2 sm:gap-3.5">
          {question.options.map((option, idx) => (
            <AnswerOption
              key={idx}
              index={idx}
              label={optionLabels[idx] || String(idx + 1)}
              optionText={option}
              isSelected={selectedOption === idx}
              isCorrectOption={idx === question.correctIndex}
              isAnswered={isAnswered}
              userSelectedOption={selectedOption}
              onSelect={onSelectOption}
              theme={theme}
            />
          ))}
        </div>
      </main>

      {/* 6. BOTTOM STICKY CASHOUT BAR */}
      <footer className={`w-full mt-2 pt-3 border-t ${
        isDark ? 'border-[#222C3E]' : 'border-slate-200'
      }`}>
        <CashOutButton
          currentWinnings={accumulatedWinnings}
          onCashOut={onCashOut}
          disabled={isAnswered}
        />
      </footer>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative z-10 w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
                isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h3 className="font-extrabold text-base mb-1.5 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span>Leave Current Arena?</span>
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {accumulatedWinnings > 0
                  ? `You have KSh ${accumulatedWinnings.toLocaleString()} in round earnings. Cash out before leaving to keep your rewards, or forfeit.`
                  : 'Leaving will cancel your current question round.'}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs border cursor-pointer ${
                    isDark ? 'bg-[#182030] border-[#222C3E] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Continue Playing
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitQuiz();
                  }}
                  className="flex-1 py-2 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
