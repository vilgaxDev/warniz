import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Zap, ShieldCheck, ArrowUpRight, Award, DollarSign, Clock, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo?: () => void;
  theme?: 'dark' | 'light';
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemo,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

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
            className={`relative z-10 w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isDark ? 'bg-[#121927] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
              isDark ? 'border-slate-800 bg-[#0b101b]' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0070f3] text-white flex items-center justify-center shadow-md">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    How Polymarket Trivia Works
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Live predictions, speed trivia, and instant M-PESA cashouts
                  </p>
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

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs leading-relaxed custom-scrollbar">
              {/* Interactive Demo Callout Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                isDark
                  ? 'bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border-blue-500/30 text-blue-200'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-xs">
                    Want to test it risk-free? Try our interactive Demo Mode!
                  </span>
                </div>
                {onLaunchDemo && (
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchDemo();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Try Demo</span>
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isDark ? 'bg-[#151d2c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    1. Pick Your Speed & Topic
                  </h4>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Select a prediction speed mode (3 min, 5 min, or 10 min) and enter a category like Football EPL, Tech Safari, or Kenyan News.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isDark ? 'bg-[#151d2c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    2. 12-Second Decision Clock
                  </h4>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Each live question gives you 12 seconds. Consecutive correct answers stack streak multipliers (2x, 3x, up to 5x) for rapid reward growth.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isDark ? 'bg-[#151d2c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    3. Lock In & Cash Out Anytime
                  </h4>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    You do not need to finish every question! Hit the <strong>Lock In & Cash Out</strong> button anytime to secure your accumulated earnings.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isDark ? 'bg-[#151d2c] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    4. Instant M-PESA Payouts
                  </h4>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Withdraw directly to your Safaricom M-PESA wallet with 0% processing fee.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-[#0b101b]' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant STK & B2C Verified</span>
              </div>
              <button
                onClick={onClose}
                className="py-2 px-5 rounded-xl bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                Got It, Let's Play!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
