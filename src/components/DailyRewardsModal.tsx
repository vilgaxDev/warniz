import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, CheckCircle2, Flame, ArrowRight } from 'lucide-react';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: (amount: number) => void;
  streak: number;
  theme?: 'dark' | 'light';
}

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({
  isOpen,
  onClose,
  onClaimReward,
  streak,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [hasClaimed, setHasClaimed] = useState(false);

  const days = [
    { day: 1, reward: 5, label: 'Day 1', icon: '🎁', claimed: true },
    { day: 2, reward: 10, label: 'Day 2', icon: '⚡', claimed: true },
    { day: 3, reward: 25, label: 'Day 3', icon: '🔥', claimed: false, current: true },
    { day: 4, reward: 50, label: 'Day 4', icon: '⭐', claimed: false },
    { day: 5, reward: 100, label: 'Day 5', icon: '💎', claimed: false },
    { day: 6, reward: 250, label: 'Day 6', icon: '🏆', claimed: false },
    { day: 7, reward: 500, label: 'Day 7', icon: '👑', claimed: false, mystery: true },
  ];

  const handleClaim = () => {
    if (!hasClaimed) {
      setHasClaimed(true);
      onClaimReward(25);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
              isDark ? 'border-slate-800/80 bg-[#0c131f]/70' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg leading-tight ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>Daily Streak Bonus</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Claim free KSh every 24 hours to boost your bankroll</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Streak Status Banner */}
            <div className="p-4 sm:p-5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold mb-4">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{streak} Day Login Streak</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((item) => (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center relative transition-all ${
                      item.current
                        ? isDark
                          ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/50 scale-105 text-white'
                          : 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 scale-105 text-emerald-950'
                        : item.claimed
                        ? isDark
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isDark
                          ? 'bg-[#151d2c] border-slate-800 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                    <span className="text-xl my-1">{item.icon}</span>
                    <span className={`text-xs font-extrabold ${
                      item.current ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : item.claimed ? 'text-emerald-500' : ''
                    }`}>
                      +KSh {item.reward}
                    </span>

                    {item.claimed && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800/80 bg-[#0c131f]/70' : 'border-slate-100 bg-slate-50'
            }`}>
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Resets every night at 00:00 EAT
              </span>

              <button
                onClick={handleClaim}
                disabled={hasClaimed}
                className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                  hasClaimed
                    ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-600/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{hasClaimed ? 'Claimed for Today' : 'Claim +KSh 25'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
