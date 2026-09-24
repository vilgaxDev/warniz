import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Trophy,
  Flame,
  Zap,
  Wallet,
  ShieldAlert,
  ChevronRight,
  PlusCircle,
  Plus,
  ArrowDownToLine,
} from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { generateRewardLadder, calculatePotentialWinnings } from '../data/quizData';
import { paymentSettingsService } from '../services/paymentSettingsService';
import { getCategoryLucideIcon } from './CategoryNav';

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
  onOpenAuth?: () => void;
  isLoggedIn?: boolean;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
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
  onOpenAuth,
  isLoggedIn = true,
  isDemo = false,
}) => {
  const [stakeInput, setStakeInput] = useState<string>('20');
  const [presetStakes, setPresetStakes] = useState<number[]>(PRESET_STAKES);
  const [minBet, setMinBet] = useState<number>(10);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const numericStake = Math.max(0, parseInt(stakeInput, 10) || 0);

  useEffect(() => {
    const loadBetSettings = async () => {
      try {
        const settings = await paymentSettingsService.fetchPaymentSettings();
        if (settings.bet_amounts && settings.bet_amounts.length > 0) {
          setPresetStakes(settings.bet_amounts);
        }
        if (settings.min_bet) {
          setMinBet(settings.min_bet);
        }
      } catch {
        // fallback
      }
    };
    loadBetSettings();
  }, []);

  const currentMode = speedModes.find((m) => m.id === selectedSpeedModeId) || speedModes[0];
  const questionsCount = currentMode?.questionsCount || 6;

  const ladderSteps = useMemo(() => {
    return generateRewardLadder(numericStake, questionsCount);
  }, [numericStake, questionsCount]);

  const maxPotentialPayout = useMemo(() => {
    return calculatePotentialWinnings(numericStake, questionsCount);
  }, [numericStake, questionsCount]);

  const isBalanceSufficient = walletBalance >= numericStake && numericStake > 0;
  const isAboveMinBet = numericStake >= minBet;

  if (!isOpen) return null;

  if (!isLoggedIn && !isDemo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans select-none">
        <div className="triv-card w-full max-w-sm p-6 text-center space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-text)] flex items-center justify-center mx-auto">
            <Wallet className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            Account Required
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Please log in or sign up to stake and participate in live cash trivia arenas.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryLucideIcon(category.id || category.name);

  const handlePresetClick = (amount: number) => {
    setStakeInput(String(amount));
  };

  const handleMaxClick = () => {
    if (walletBalance > 0) {
      setStakeInput(String(Math.floor(walletBalance)));
    }
  };

  const handleConfirm = () => {
    if (isBalanceSufficient && isAboveMinBet) {
      onConfirmStart(category.id, selectedSpeedModeId, numericStake);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="triv-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                  {category.name}
                </h2>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)]">
                  {isDemo ? 'DEMO' : 'LIVE'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                {category.subtitle || 'Configure stake to activate streak multiplier ladder'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {/* 1. Mode selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
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
                    className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent-text)] font-semibold'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{mode.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
                      {mode.questionsCount}Q · {mode.durationSeconds}s
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Stake Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                2. Enter Stake (KES)
              </label>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Wallet className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Balance:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  KES {walletBalance.toLocaleString()}
                </span>
                {onOpenDeposit && !isDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDeposit();
                    }}
                    className="ml-1.5 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    title="Deposit Funds"
                  >
                    <ArrowDownToLine className="w-3 h-3 stroke-[2.5]" />
                    <span>Deposit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="relative flex items-center rounded-xl bg-[var(--surface)] border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
              <span className="pl-3.5 text-xs font-mono font-bold text-[var(--text-muted)] select-none">
                KES
              </span>
              <input
                type="number"
                min={minBet}
                step="5"
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                placeholder="20"
                className="w-full py-2.5 pl-2 pr-14 text-sm font-mono font-bold bg-transparent text-[var(--text-primary)] outline-none"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 px-2 py-1 rounded-md text-[10px] font-bold bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                MAX
              </button>
            </div>

            {/* Preset Stakes */}
            <div className="grid grid-cols-6 gap-1.5 mt-2">
              {presetStakes.map((amount) => {
                const isSelected = numericStake === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresetClick(amount)}
                    className={`py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {amount}
                  </button>
                );
              })}
            </div>

            {/* Insufficient balance message */}
            {!isBalanceSufficient && numericStake > 0 && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-between text-xs">
                <span className="font-semibold">Insufficient balance for KES {numericStake}</span>
                {onOpenDeposit && !isDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDeposit();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Deposit Now</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. Potential Payout Card */}
          <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>Max Potential Payout</span>
              </span>
              <span className="font-mono font-bold text-base text-[var(--success)]">
                KES {maxPotentialPayout.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[var(--border)] text-center text-[10px]">
              <div className="p-1 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block">2 Streak</span>
                <span className="font-mono font-bold text-[var(--accent-text)]">2x Boost</span>
              </div>
              <div className="p-1 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block">3 Streak</span>
                <span className="font-mono font-bold text-[var(--accent-text)]">3x Boost</span>
              </div>
              <div className="p-1 rounded bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[var(--text-muted)] block">5 Streak</span>
                <span className="font-mono font-bold text-[var(--success)]">5x Boost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isBalanceSufficient || !isAboveMinBet}
            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Enter Quiz Arena (KES {numericStake.toLocaleString()})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
