import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Trophy, Flame, Zap, Wallet, ShieldAlert, Sparkles, ChevronRight, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { generateRewardLadder, calculatePotentialWinnings, getStreakMultiplier } from '../data/quizData';

interface QuizEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: QuizCategory;
  speedModes: SpeedMode[];
  selectedSpeedModeId: string;
  onSelectSpeedMode: (speedModeId: string) => void;
  onConfirmStart: (categoryId: string, speedModeId: string, stakeAmount: number) => void;
  walletBalance: number;
  onOpenDeposit?: () => void;
  theme?: 'dark' | 'light';
}

const PRESET_STAKES = [10, 20, 50, 100, 200, 500];

export const QuizEntryModal: React.FC<QuizEntryModalProps> = ({
  isOpen,
  onClose,
  category,
  speedModes,
  selectedSpeedModeId,
  onSelectSpeedMode,
  onConfirmStart,
  walletBalance,
  onOpenDeposit,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [stakeInput, setStakeInput] = useState<string>('20');
  const numericStake = Math.max(0, parseInt(stakeInput, 10) || 0);

  const currentMode = speedModes.find((m) => m.id === selectedSpeedModeId) || speedModes[0];
  const questionsCount = currentMode?.questionsCount || 6;

  // Real-time ladder and maximum payout based on stake
  const ladderSteps = useMemo(() => {
    return generateRewardLadder(numericStake, questionsCount);
  }, [numericStake, questionsCount]);

  const maxPotentialPayout = useMemo(() => {
    return calculatePotentialWinnings(numericStake, questionsCount);
  }, [numericStake, questionsCount]);

  const isBalanceSufficient = walletBalance >= numericStake && numericStake > 0;

  if (!isOpen) return null;

  const handlePresetClick = (amount: number) => {
    setStakeInput(String(amount));
  };

  const handleMaxClick = () => {
    const maxVal = Math.min(1000, Math.max(10, walletBalance));
    setStakeInput(String(maxVal));
  };

  const handleConfirm = () => {
    if (!isBalanceSufficient) return;
    onConfirmStart(category.id, selectedSpeedModeId, numericStake);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-2xl border shadow-2xl overflow-hidden z-10 ${
            isDark ? 'bg-[#0E131E] border-[#222C3E] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Mobile Drag Indicator Bar */}
          <div className="w-full flex justify-center pt-2 pb-0.5 sm:hidden shrink-0">
            <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          </div>

          {/* Header */}
          <div className={`px-4 py-3 sm:p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-[#222C3E] bg-[#121722]' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl border shrink-0 ${
                isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                {category.icon || '🇰🇪'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base sm:text-lg leading-tight">{category.name}</h2>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider ${
                    isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {category.subtitle || 'Configure stake to activate streak multiplier ladder'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-[#182030] text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 no-scrollbar">
            
            {/* Speed Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                1. Select Speed Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {speedModes.map((mode) => {
                  const isSelected = mode.id === selectedSpeedModeId;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onSelectSpeedMode(mode.id)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#1E293B] border-slate-200 text-white ring-1 ring-slate-300 shadow-xs'
                            : 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : isDark
                            ? 'bg-[#121722] border-[#222C3E] text-slate-400 hover:text-slate-200 hover:bg-[#182030]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{mode.name.split(' ')[0]}</div>
                      <div className={`text-[10px] mt-0.5 font-semibold ${
                        isSelected
                          ? isDark ? 'text-slate-300' : 'text-slate-300'
                          : isDark ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        {mode.questionsCount}Q · 12s
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stake Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Enter Stake Amount
                </label>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Balance:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    KSh {walletBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Currency Input Box */}
              <div className={`relative flex items-center rounded-xl border transition-all ${
                !isBalanceSufficient && numericStake > 0
                  ? 'border-rose-500 ring-1 ring-rose-500/40'
                  : isDark
                    ? 'bg-[#121722] border-[#222C3E] focus-within:border-slate-400'
                    : 'bg-slate-50 border-slate-200 focus-within:border-slate-900'
              }`}>
                <div className="pl-3.5 pr-2 font-black text-sm text-slate-400 select-none">
                  KSh
                </div>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={stakeInput}
                  onChange={(e) => setStakeInput(e.target.value)}
                  placeholder="20"
                  className={`w-full py-2.5 sm:py-3 pr-14 text-base sm:text-lg font-black bg-transparent outline-none ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className={`absolute right-2.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#182030] text-slate-300 hover:text-white border border-[#222C3E]'
                      : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-xs'
                  }`}
                >
                  MAX
                </button>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-6 gap-1 sm:gap-1.5 mt-2">
                {PRESET_STAKES.map((amount) => {
                  const isSelected = numericStake === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetClick(amount)}
                      className={`py-1.5 px-0.5 sm:px-1 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? isDark
                            ? 'bg-white text-slate-950 border-white font-black'
                            : 'bg-slate-900 text-white border-slate-900 font-black'
                          : isDark
                            ? 'bg-[#121722] border-[#222C3E] text-slate-300 hover:border-slate-500 hover:bg-[#182030]'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {amount}
                    </button>
                  );
                })}
              </div>

              {/* Low Balance Warning / Deposit Action */}
              {!isBalanceSufficient && numericStake > 0 && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-medium">Stake exceeds balance (KSh {walletBalance})</span>
                  </div>
                  {onOpenDeposit && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDeposit();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Top Up</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Potential Payout & Multiplier Mechanics Card */}
            <div className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
              isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Max Potential Payout</span>
                </span>
                <span className={`text-lg sm:text-xl font-black tracking-tight ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  KSh {maxPotentialPayout.toLocaleString()}
                </span>
              </div>

              {/* High-Contrast Streak Multiplier Banner */}
              <div className={`p-2.5 rounded-xl border flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-[11px] font-bold ${
                isDark
                  ? 'bg-[#0A0E18] border-amber-500/30'
                  : 'bg-amber-50/90 border-amber-200'
              }`}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className={`uppercase font-black tracking-wider text-[11px] ${
                    isDark ? 'text-amber-400' : 'text-amber-900'
                  }`}>
                    STREAK BOOST:
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full xs:w-auto pb-0.5 xs:pb-0 no-scrollbar">
                  {/* 2x Chip */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-black text-[10px] whitespace-nowrap shadow-2xs ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                      : 'bg-amber-100 border-amber-300 text-amber-950'
                  }`}>
                    <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">2x</span>
                    <span>@ 2 Streak</span>
                  </div>

                  {/* 3x Chip */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-black text-[10px] whitespace-nowrap shadow-2xs ${
                    isDark
                      ? 'bg-orange-950/60 border-orange-500/60 text-orange-200'
                      : 'bg-orange-100 border-orange-300 text-orange-950'
                  }`}>
                    <span className="px-1 py-0.2 rounded bg-orange-500 text-white text-[9px] font-black">3x</span>
                    <span>@ 3 Streak</span>
                  </div>

                  {/* 5x Chip */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-black text-[10px] whitespace-nowrap shadow-2xs ${
                    isDark
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-950'
                  }`}>
                    <span className="px-1 py-0.2 rounded bg-emerald-400 text-slate-950 text-[9px] font-black">5x</span>
                    <span>@ 5 Streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRIMARY START ACTION - DIRECTLY AFTER STAKE & POTENTIAL PAYOUT */}
            <div className="space-y-2">
              {isBalanceSufficient ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:brightness-105 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-emerald-300 ring-2 ring-emerald-400/20 animate-blink-play"
                >
                  <Play className="w-5 h-5 fill-slate-950 shrink-0" />
                  <span className="truncate">START QUIZ NOW · KSh {numericStake.toLocaleString()}</span>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeposit?.();
                  }}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 shrink-0" />
                  <span className="truncate">Deposit KSh {(numericStake - walletBalance).toLocaleString()} to Start Quiz</span>
                  <ChevronRight className="w-5 h-5 shrink-0" />
                </button>
              )}

              {/* Real-time Balance Status Indicator */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                isBalanceSufficient
                  ? isDark
                    ? 'bg-emerald-950/25 border-emerald-500/35 text-emerald-300'
                    : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : isDark
                    ? 'bg-rose-950/25 border-rose-500/35 text-rose-300'
                    : 'bg-rose-50/90 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  <Wallet className="w-4 h-4 shrink-0 opacity-80" />
                  <span>Wallet: <strong className="font-black text-sm">KSh {walletBalance.toLocaleString()}</strong></span>
                </div>

                {isBalanceSufficient ? (
                  <div className="flex items-center gap-1 font-black text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Balance Good · Ready to Play</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 font-bold text-[11px] text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Deposit needed to play</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sample Reward Pipeline Preview (Scaled to KSh stake) */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reward Pipeline</span>
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Scaled to KSh {numericStake || 20} stake
                  </div>
                </div>

                {/* Mobile badge indicator */}
                <div className="sm:hidden flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400">
                  <span>Q3 · Q4 · Q5 BOOSTS</span>
                </div>

                {/* Desktop scroll hint */}
                <div className={`hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-[#182030] border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-amber-700 shadow-2xs'
                }`}>
                  <span>Scroll questions</span>
                  <span>→</span>
                </div>
              </div>

              {/* MOBILE PIPELINE: Specifically Questions 3, 4, 5 with 2X, 3X, 5X Odds shown clearly */}
              <div className="grid grid-cols-3 gap-2 sm:hidden pt-0.5">
                {[3, 4, 5].map((qNum) => {
                  const stepIndex = qNum - 1;
                  const step = ladderSteps[stepIndex] || {
                    questionNumber: qNum,
                    rewardKsh: qNum === 3 ? 16 : qNum === 4 ? 30 : 60,
                  };
                  const multiplier = qNum === 3 ? 2 : qNum === 4 ? 3 : 5;
                  const multipliedReward = step.rewardKsh * multiplier;

                  const badgeBg =
                    multiplier === 5
                      ? 'bg-emerald-400 text-slate-950 ring-1 ring-emerald-300'
                      : multiplier === 3
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-400 text-slate-950';

                  const cardStyle =
                    multiplier === 5
                      ? isDark
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                      : multiplier === 3
                      ? isDark
                        ? 'bg-orange-950/20 border-orange-500/50'
                        : 'bg-orange-50/80 border-orange-300 shadow-xs'
                      : isDark
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-amber-50/80 border-amber-300 shadow-xs';

                  return (
                    <div
                      key={qNum}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${cardStyle}`}
                    >
                      {/* Top row: Q number + Odds Pill */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                          isDark ? 'bg-slate-800/80 text-slate-200' : 'bg-slate-200 text-slate-800'
                        }`}>
                          Q{qNum}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight shadow-2xs ${badgeBg}`}>
                          {multiplier}X ODDS
                        </span>
                      </div>

                      {/* Main Multiplied Reward Amount */}
                      <div className={`text-xs xs:text-sm font-black tracking-tight my-1 whitespace-nowrap ${
                        multiplier === 5
                          ? 'text-emerald-400'
                          : multiplier === 3
                          ? 'text-orange-400'
                          : 'text-amber-400'
                      }`}>
                        KSh {multipliedReward.toLocaleString()}
                      </div>

                      {/* Base Reward Subtext */}
                      <div className="text-[8.5px] text-slate-400 font-semibold whitespace-nowrap">
                        Base KSh {step.rewardKsh}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP PIPELINE: Horizontal Question Cards Ribbon */}
              <div className="hidden sm:flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar snap-x snap-mandatory">
                {ladderSteps.slice(0, questionsCount).map((step, idx) => {
                  const mult = getStreakMultiplier(idx);
                  const multipliedReward = step.rewardKsh * mult;

                  return (
                    <div
                      key={step.questionNumber}
                      className={`flex-none w-[105px] p-2.5 rounded-xl border text-center snap-start transition-all shadow-xs ${
                        mult >= 5
                          ? isDark
                            ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                            : 'bg-emerald-50/80 border-emerald-300'
                          : mult >= 2
                            ? isDark
                              ? 'bg-amber-950/20 border-amber-500/40'
                              : 'bg-amber-50/70 border-amber-300'
                            : isDark
                              ? 'bg-[#161D2B] border-[#222C3E]'
                              : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Question Badge & Multiplier Tag */}
                      <div className="flex items-center justify-between text-[10px] font-black mb-1.5">
                        <span className={`px-1.5 py-0.2 rounded ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Q{step.questionNumber}
                        </span>

                        {mult > 1 ? (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight ${
                            mult >= 5
                              ? 'bg-emerald-400 text-slate-950 shadow-2xs'
                              : mult >= 3
                                ? 'bg-orange-500 text-white shadow-2xs'
                                : 'bg-amber-400 text-slate-950 shadow-2xs'
                          }`}>
                            {mult}x Boost
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 opacity-60">1x Base</span>
                        )}
                      </div>

                      {/* Large Clear Reward */}
                      <div className={`text-sm font-black tracking-tight whitespace-nowrap ${
                        mult >= 5
                          ? 'text-emerald-400'
                          : mult >= 2
                            ? 'text-amber-400'
                            : isDark
                              ? 'text-slate-100'
                              : 'text-slate-900'
                      }`}>
                        KSh {multipliedReward.toLocaleString()}
                      </div>

                      {/* Base Reward Subtext */}
                      <div className="text-[9px] text-slate-400 font-semibold mt-1 whitespace-nowrap">
                        {mult > 1 ? `Base KSh ${step.rewardKsh}` : 'Round step'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer CTA - Always Pinned at Bottom */}
          <div className={`p-3.5 sm:p-5 border-t flex items-center gap-2.5 sm:gap-3 shrink-0 shadow-lg ${
            isDark ? 'border-[#222C3E] bg-[#121722]' : 'border-slate-200 bg-slate-50'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`py-3 px-3.5 sm:px-4 rounded-xl border text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'border-[#222C3E] text-slate-400 hover:text-white hover:bg-[#182030]'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isBalanceSufficient}
              className="flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 border border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent animate-blink-play"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span className="truncate">
                {numericStake > 0
                  ? `Start Quiz · KSh ${numericStake.toLocaleString()}`
                  : 'Enter Stake Amount'}
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
