import React, { useState, useMemo } from 'react';
import {
  Play, Sparkles, Zap, Trophy, Clock, X, Check, Flame, Shield,
  ArrowRight, Users, Coins, ChevronRight, Compass, Search, Tag,
  Ticket, Gift, AlertCircle, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizCategory, SpeedMode } from '../types';

interface LiveArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId: string;
  selectedSpeedModeId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedModeId: string) => void;
  onStartQuiz: (categoryId: string, speedModeId: string, stakeTier?: string) => void;
  walletBalance?: number;
  theme?: 'dark' | 'light';
}

interface StakeTier {
  id: string;
  name: string;
  entryFeeKsh: number;
  maxWinningsKsh: number;
  multiplier: string;
  badge?: string;
  isPopular?: boolean;
}

interface PromoCodeData {
  code: string;
  title: string;
  discount: number; // Ksh discount or free
  bonusXp: string;
  description: string;
}

const STAKE_TIERS: StakeTier[] = [
  {
    id: 'free',
    name: 'Free Practice',
    entryFeeKsh: 0,
    maxWinningsKsh: 25,
    multiplier: '1x XP',
    badge: 'FREE PLAY',
  },
  {
    id: 'casual_20',
    name: 'Casual Pot',
    entryFeeKsh: 20,
    maxWinningsKsh: 100,
    multiplier: '5x Return',
    badge: 'POPULAR',
    isPopular: true,
  },
  {
    id: 'pro_50',
    name: 'Pro Challenge',
    entryFeeKsh: 50,
    maxWinningsKsh: 300,
    multiplier: '6x Return',
    badge: 'HIGH REWARD',
  },
  {
    id: 'high_100',
    name: 'Grand Championship',
    entryFeeKsh: 100,
    maxWinningsKsh: 1000,
    multiplier: '10x Return',
    badge: 'JACKPOT',
  },
];

const AVAILABLE_PROMOS: Record<string, PromoCodeData> = {
  POLYWIN: {
    code: 'POLYWIN',
    title: 'KSh 50 Free Entry Voucher',
    discount: 50,
    bonusXp: '2x XP',
    description: 'Waives entry fee up to KSh 50 for live arena match',
  },
  KENYA2026: {
    code: 'KENYA2026',
    title: 'Kenya Heritage 2x Boost',
    discount: 20,
    bonusXp: '2.5x XP',
    description: 'Special 2.5x score booster for national topic battles',
  },
  SPEED50: {
    code: 'SPEED50',
    title: '50% Off Match Entry',
    discount: 25,
    bonusXp: '1.5x XP',
    description: 'Half-price ticket for all fast speed mode tournaments',
  },
  VIPARENA: {
    code: 'VIPARENA',
    title: 'VIP Tournament Room Access',
    discount: 100,
    bonusXp: '3x XP',
    description: 'Unlocks exclusive VIP high-roller matchmaking bracket',
  },
};

export const LiveArenaModal: React.FC<LiveArenaModalProps> = ({
  isOpen,
  onClose,
  categories,
  speedModes,
  selectedCategoryId,
  selectedSpeedModeId,
  onSelectCategory,
  onSelectSpeedMode,
  onStartQuiz,
  walletBalance = 1450,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedStakeId, setSelectedStakeId] = useState<string>('casual_20');
  const [activeTab, setActiveTab] = useState<'topics' | 'modes' | 'stakes' | 'promo'>('topics');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeData | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string>('');

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const currentSpeedMode = speedModes.find((s) => s.id === selectedSpeedModeId) || speedModes[0];
  const currentStake = STAKE_TIERS.find((s) => s.id === selectedStakeId) || STAKE_TIERS[1];

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.subtitle && cat.subtitle.toLowerCase().includes(q)) ||
        (cat.badge && cat.badge.toLowerCase().includes(q)) ||
        cat.questions.some((qu) => qu.question.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const handleApplyPromo = (codeToApply?: string) => {
    const raw = (codeToApply || promoInput).trim().toUpperCase();
    if (!raw) {
      setPromoError('Please enter a valid code');
      setPromoSuccessMsg('');
      return;
    }

    if (AVAILABLE_PROMOS[raw]) {
      setAppliedPromo(AVAILABLE_PROMOS[raw]);
      setPromoError('');
      setPromoSuccessMsg(`Code "${raw}" applied! ${AVAILABLE_PROMOS[raw].title}`);
      setPromoInput(raw);
    } else {
      setPromoError('Invalid promo or room code. Try "POLYWIN" or "KENYA2026"');
      setPromoSuccessMsg('');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoSuccessMsg('');
    setPromoError('');
    setPromoInput('');
  };

  const handleLaunch = () => {
    onSelectCategory(selectedCategoryId);
    onSelectSpeedMode(selectedSpeedModeId);
    onStartQuiz(selectedCategoryId, selectedSpeedModeId, selectedStakeId);
    onClose();
  };

  if (!isOpen) return null;

  // Calculate adjusted entry fee
  const effectiveEntryFee = appliedPromo
    ? Math.max(0, currentStake.entryFeeKsh - appliedPromo.discount)
    : currentStake.entryFeeKsh;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
            isDark
              ? 'bg-[#0a0f19] text-slate-100 border-slate-800'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {/* 1. MODAL HEADER */}
          <div className={`px-3.5 py-3 sm:px-4 sm:py-3.5 border-b flex items-center justify-between gap-2.5 ${
            isDark ? 'border-slate-800 bg-[#0d1424]' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-[1.5px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-[#0a0f19] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/30" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className="font-extrabold text-sm sm:text-lg tracking-tight leading-tight truncate">
                    Live Quiz Arena
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider shrink-0">
                    LIVE
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Choose your featured topic, speed mode & promo code
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Live Arena modal"
              className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-200 border-slate-300 text-slate-700 hover:text-black hover:bg-slate-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. TAB NAVIGATOR (Topics, Speed Modes, Stakes, Promo Code) */}
          <div className={`px-2 sm:px-3 pt-2 pb-1.5 border-b grid grid-cols-4 gap-1 sm:gap-1.5 ${
            isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <button
              onClick={() => setActiveTab('topics')}
              className={`py-1.5 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'topics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">1. </span>Topics
              </span>
            </button>

            <button
              onClick={() => setActiveTab('modes')}
              className={`py-1.5 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'modes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">2. </span>Speed
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stakes')}
              className={`py-1.5 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                activeTab === 'stakes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">3. </span>Stakes
              </span>
            </button>

            <button
              onClick={() => setActiveTab('promo')}
              className={`py-1.5 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 relative ${
                activeTab === 'promo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : appliedPromo
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">4. </span>Promo
              </span>
              {appliedPromo && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1" />
              )}
            </button>
          </div>

          {/* 3. MODAL BODY (Scrollable Selection) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh]">
            
            {/* TAB 1: FEATURED TOPICS + SEARCH BAR */}
            {activeTab === 'topics' && (
              <div className="space-y-3">
                {/* STICKY SEARCH INPUT BAR & TOPIC COUNTER */}
                <div className={`sticky -top-4 -mt-4 pt-4 pb-2.5 z-20 backdrop-blur-md space-y-2 border-b ${
                  isDark ? 'bg-[#0a0f19]/95 border-slate-800/80' : 'bg-white/95 border-slate-200/80'
                }`}>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search topics (e.g., Kenya, EPL, Crypto, AI, Politics)..."
                      className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-medium border outline-hidden transition-colors ${
                        isDark
                          ? 'bg-[#121927] border-slate-800 text-slate-100 focus:border-blue-500 placeholder-slate-500'
                          : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-blue-500 placeholder-slate-400'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between px-0.5">
                    <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Featured Topics ({filteredCategories.length})
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-blue-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Tap topic to select</span>
                    </span>
                  </div>
                </div>

                {filteredCategories.length === 0 ? (
                  <div className={`p-6 rounded-xl border text-center space-y-2 ${
                    isDark ? 'bg-[#121927] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Search className="w-6 h-6 mx-auto text-slate-500 opacity-60" />
                    <p className="text-xs font-medium text-slate-400">No topics found matching "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-blue-400 hover:underline font-bold cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredCategories.map((cat) => {
                      const isSelected = cat.id === selectedCategoryId;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex items-center gap-3 ${
                            isSelected
                              ? isDark
                                ? 'bg-[#182338] border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                                : 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30 shadow-md'
                              : isDark
                                ? 'bg-[#121927] border-slate-800 hover:border-slate-700 hover:bg-[#152033]'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          {/* Icon */}
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 ${
                            isDark ? 'bg-[#162033] border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
                          }`}>
                            {cat.icon}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="font-bold text-xs sm:text-sm truncate">
                                {cat.name}
                              </h3>
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              ) : cat.badge ? (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                                  cat.badge === 'LIVE' || cat.badge === 'HOT'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {cat.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className={`text-[11px] truncate mt-0.5 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {cat.subtitle || `${cat.questions.length} Live Questions`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SPEED & DURATION MODES */}
            {activeTab === 'modes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Speed Engine & Timer Format
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    ⚡ 12s per Question
                  </span>
                </div>

                <div className="space-y-2.5">
                  {speedModes.map((mode) => {
                    const isSelected = mode.id === selectedSpeedModeId;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => onSelectSpeedMode(mode.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? isDark
                              ? 'bg-[#182338] border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                              : 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30 shadow-md'
                            : isDark
                              ? 'bg-[#121927] border-slate-800 hover:border-slate-700 hover:bg-[#152033]'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <h3 className="font-bold text-sm">{mode.name}</h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {mode.badge || `${mode.questionsCount} QUESTIONS`}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {mode.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: STAKES & PRIZE POOLS */}
            {activeTab === 'stakes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Prize Pot & Entry Stake Tier
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Wallet: KSh {walletBalance.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STAKE_TIERS.map((tier) => {
                    const isSelected = tier.id === selectedStakeId;
                    const discountedFee = appliedPromo
                      ? Math.max(0, tier.entryFeeKsh - appliedPromo.discount)
                      : tier.entryFeeKsh;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedStakeId(tier.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? isDark
                              ? 'bg-[#182338] border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                              : 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/30 shadow-md'
                            : isDark
                              ? 'bg-[#121927] border-slate-800 hover:border-slate-700 hover:bg-[#152033]'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Coins className="w-4 h-4 text-emerald-400" />
                            <h3 className="font-bold text-xs sm:text-sm">{tier.name}</h3>
                          </div>
                          {tier.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              tier.isPopular
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {tier.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Entry Stake</div>
                            <div className="font-mono text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                              {appliedPromo && tier.entryFeeKsh > 0 ? (
                                <>
                                  <span className="line-through text-slate-500 text-xs">KSh {tier.entryFeeKsh}</span>
                                  <span className="text-emerald-400">{discountedFee === 0 ? 'FREE' : `KSh ${discountedFee}`}</span>
                                </>
                              ) : (
                                <span>{tier.entryFeeKsh === 0 ? 'FREE' : `KSh ${tier.entryFeeKsh}`}</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Win Up To</div>
                            <div className="font-mono text-sm font-extrabold text-emerald-400">
                              KSh {tier.maxWinningsKsh.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: PROMO CODE & TRADE ROOM CODE */}
            {activeTab === 'promo' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Enter Live Promo or Battle Trade Code
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Instant Rewards</span>
                  </span>
                </div>

                {/* Input Box */}
                <div className={`p-3.5 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#121927] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPromo();
                        }}
                        placeholder="ENTER CODE (e.g. POLYWIN)"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border outline-hidden transition-colors ${
                          isDark
                            ? 'bg-[#0a0f19] border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                        }`}
                      />
                    </div>

                    <button
                      onClick={() => handleApplyPromo()}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
                    >
                      Apply Code
                    </button>
                  </div>

                  {/* Feedback Messages */}
                  {promoError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoError}</span>
                    </p>
                  )}

                  {promoSuccessMsg && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs text-emerald-400">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{promoSuccessMsg}</span>
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick-Apply Promo Suggestions */}
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Available Live Promo Codes (Tap to apply)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.values(AVAILABLE_PROMOS).map((promo) => {
                      const isThisApplied = appliedPromo?.code === promo.code;
                      return (
                        <div
                          key={promo.code}
                          onClick={() => handleApplyPromo(promo.code)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isThisApplied
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                              : isDark
                                ? 'bg-[#0f172a] border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-extrabold text-xs text-emerald-400">
                                {promo.code}
                              </span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                {promo.bonusXp}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {promo.description}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            {isThisApplied ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-blue-400 hover:underline">
                                Apply
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* QUICK SELECTION SUMMARY CARD */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{currentCategory.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold truncate">{currentCategory.name}</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentSpeedMode.name.split(' ')[0]} Speed • {currentStake.name}
                    {appliedPromo && (
                      <span className="ml-1 text-emerald-400 font-bold font-mono">
                        ({appliedPromo.code})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {effectiveEntryFee === 0 ? 'Entry Fee' : 'Top Prize'}
                </div>
                <div className="font-mono font-bold text-emerald-400">
                  {effectiveEntryFee === 0 ? 'FREE ENTRY' : `KSh ${currentStake.maxWinningsKsh.toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>

          {/* 4. MODAL BOTTOM ACTIONS & LAUNCH CTA */}
          <div className={`p-4 border-t space-y-2 ${
            isDark ? 'border-slate-800 bg-[#0d1424]' : 'border-slate-100 bg-slate-50'
          }`}>
            <button
              onClick={handleLaunch}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                Enter Live Arena ({currentCategory.name})
                {effectiveEntryFee === 0 ? ' • FREE' : ` • KSh ${effectiveEntryFee}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span>1,420 players active</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Shield className="w-3 h-3" />
                <span>Instant M-Pesa Payouts</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
