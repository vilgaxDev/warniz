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
import { getStreakMultiplier } from '../data/quizData';

interface QuestionCardProps {
  categoryName: string;
  categoryIcon: string;
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
  onCashOut: () => void;
  onExitQuiz: () => void;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
  cashoutEnabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  categoryName,
  categoryIcon,
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
  walletBalance = 5420,
  soundEnabled,
  onToggleSound,
  onSelectOption,
  onCashOut,
  onExitQuiz,
  theme = 'dark',
  isDemo = false,
  cashoutEnabled = false,
}) => {
  const isDark = theme === 'dark';
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, question.options.length);
  const progressPercent = Math.min(100, Math.max(0, ((currentQuestionIndex + 1) / totalQuestions) * 100));
  const currentStreakMultiplier = getStreakMultiplier(streakCount);
  const baseReward = rewardLadder[currentQuestionIndex]?.rewardKsh || (currentQuestionIndex + 1) * 3;
  const currentReward = Math.round(baseReward * currentStreakMultiplier);
  const totalLivePurse = walletBalance + accumulatedWinnings;

  // Local state to show confirmation if user clicks leave (only for non-demo mode)
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Handle exit based on demo mode
  const handleExitClick = () => {
    if (isDemo) {
      onExitQuiz(); // Let parent handle exit confirmation for demo
    } else {
      setShowExitConfirm(true); // Show internal confirmation for regular mode
    }
  };

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
    <div className={`h-screen w-full flex flex-col p-0 max-w-4xl mx-auto relative overflow-hidden select-none font-sans transition-colors ${
      isDark ? 'bg-[#0B0E14] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>

      {/* 1. FLOATING MONEY BURST PARTICLES - Enhanced */}
      <div className="fixed inset-x-0 top-20 pointer-events-none z-50 flex justify-center">
        <AnimatePresence>
          {floatingEarnings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, y: -80, scale: 1.3, rotate: 5 }}
              exit={{ opacity: 0, y: -150, scale: 0.9, rotate: -5 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="px-6 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-2xl sm:text-3xl shadow-2xl flex items-center gap-3 border-2 border-emerald-300/50 backdrop-blur-sm"
            >
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="drop-shadow-lg">+KSh {item.amount.toLocaleString()}</span>
              <Zap className="w-6 h-6 text-yellow-300" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. TOP ARENA STATUS BAR - Better spacing and centering */}
      <header className="w-full space-y-3 sm:space-y-4 py-3 sm:py-4 px-2 sm:px-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">

          {/* Exit Button - Bigger */}
          <button
            type="button"
            onClick={handleExitClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm ${
              isDark
                ? 'bg-[#182030] border-[#222C3E] text-slate-300 hover:text-white hover:bg-[#222C3E]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          {/* Category Chip with Live Pulse Dot - Bigger and centered */}
          <div className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-extrabold tracking-tight max-w-md mx-auto ${
            isDark
              ? 'bg-[#182030] border-[#222C3E] text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <span className="text-lg sm:text-xl leading-none">{categoryIcon}</span>
            <span className="truncate">{categoryName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          </div>

          {/* Sound Toggle & Question Counter - Bigger */}
          <div className="flex items-center gap-2">
            {onToggleSound && (
              <button
                type="button"
                onClick={onToggleSound}
                className={`p-2 rounded-xl border text-xs sm:text-sm transition-colors cursor-pointer ${
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

            <div className={`text-xs sm:text-sm font-black px-3 py-2 rounded-xl border ${
              isDark
                ? 'bg-[#182030] border-[#222C3E] text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              {currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>
        </div>

        {/* 3. LIVE WALLET PURSE HUD - Bigger and better spacing */}
        <div className={`p-3 sm:p-4 rounded-xl border transition-all relative overflow-hidden ${
          isDark
            ? 'bg-[#121722] border-[#222C3E]'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
            {/* Left: Total Live Purse (Banked + Live Accumulation) - Bigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base shrink-0 shadow-lg border ${
                isDark
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-600 text-white border-emerald-500'
              }`}>
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Wallet</span>
                  {streakCount > 1 && (
                    <span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 animate-pulse">
                      <Flame className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                      <span>{streakCount}X</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className={`text-sm sm:text-base md:text-lg font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    KSh {totalLivePurse.toLocaleString()}
                  </span>
                  {accumulatedWinnings > 0 && (
                    <span className="text-[10px] sm:text-xs md:text-sm font-extrabold text-emerald-400 animate-pulse">
                      (+{accumulatedWinnings.toLocaleString()})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Round Earnings Ticker Pill - Bigger */}
            <div className="text-right">
              <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm md:text-base font-black transition-all ${
                isWinningsPulsing
                  ? 'bg-emerald-500 text-slate-950 border-white ring-2 ring-emerald-400 scale-105 shadow-lg'
                  : isDark
                    ? 'bg-[#121722] border-emerald-500/30 text-emerald-400'
                    : 'bg-white border-emerald-200 text-emerald-700 shadow-sm'
              }`}>
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span>+{currentReward}</span>
                {currentStreakMultiplier > 1 && (
                  <span className="ml-0.5 px-0.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-500/40">
                    {currentStreakMultiplier}X
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar - Bigger and more visible */}
          <div className="w-full mt-2 sm:mt-3 rounded-full h-1.5 sm:h-2 overflow-hidden bg-black/20 border border-white/5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 4. REWARD LADDER STREAK DISPLAY - Hide in demo mode to save space */}
      {!isDemo && (
        <div className="my-1 sm:my-2">
          <RewardLadder
            currentQuestionIndex={currentQuestionIndex}
            streakCount={streakCount}
            totalQuestions={totalQuestions}
            rewardLadder={rewardLadder}
            theme={theme}
          />
        </div>
      )}

      {/* 5. SINGLE ROUND TIMER */}
      <div className="flex flex-col items-center justify-center py-1">
        <QuizTimer
          roundSecondsLeft={roundTimerSeconds}
          totalRoundSeconds={totalRoundSeconds}
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
          soundEnabled={soundEnabled}
          theme={theme}
          isDemo={isDemo}
        />
      </div>

      {/* 6. QUESTION ARENA - Enhanced and centered */}
      <main className="w-full flex flex-col justify-center items-center my-2 sm:my-4 space-y-0 px-2 sm:px-4">
        {/* Question Text Box - Bigger and more prominent */}
        <div className={`w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center text-center shadow-2xl transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#121722] to-[#0B0E14] border-[#222C3E] ring-1 ring-[#222C3E]/50'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-xl ring-1 ring-slate-200/50'
        }`}>
          <span className={`text-[10px] sm:text-[12px] md:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </span>

          <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-black leading-tight tracking-tight max-w-2xl mx-auto ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {question.question}
          </h2>

          {/* Feedback Explanation Drawer when Answered */}
          {isAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-[10px] font-medium p-1.5 rounded-lg border text-left w-full flex items-start gap-1.5 ${
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
                {isCorrect ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <AlertCircle className="w-2.5 h-2.5 text-rose-400" />}
              </div>
              <div className="leading-relaxed">
                <strong className="block mb-0.5 text-[10px]">{isCorrect ? 'Correct! +KSh ' + currentReward : 'Incorrect'}</strong>
                <span className="text-[10px]">{question.explanation}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dynamic Answer Options Grid - Adjusts based on number of options */}
        <div className={`w-full max-w-3xl grid gap-2 sm:gap-3 md:gap-4 ${
          question.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
          question.options.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          question.options.length === 4 ? 'grid-cols-2' :
          'grid-cols-1 sm:grid-cols-2'
        }`}>
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
              isDemo={isDemo}
            />
          ))}
        </div>
      </main>

      {/* 6. BOTTOM STICKY CASHOUT BAR */}
      <footer className={`w-full mt-0 pt-4 pb-4 border-t flex justify-center ${
        isDark ? 'border-[#222C3E]' : 'border-slate-200'
      }`}>
        <CashOutButton
          currentWinnings={accumulatedWinnings}
          onCashOut={onCashOut}
          disabled={isAnswered}
          theme={theme}
          isDemo={isDemo}
          cashoutEnabled={cashoutEnabled}
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
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>Cannot Exit Quiz</span>
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                You must complete the quiz round once started. Your stake is locked in and you cannot exit without forfeiting your bet. Keep playing to win!
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs`}
                >
                  Continue Playing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
