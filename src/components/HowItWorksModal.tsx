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
            className="relative z-10 w-full max-w-xl rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-[var(--card)] text-[var(--text-primary)] triv-card"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg leading-tight text-[var(--text-primary)]">
                    How TrivQuest Trivia Works
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Speed trivia, streak multipliers, and instant M-PESA cashouts
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs leading-relaxed custom-scrollbar">
              {/* Interactive Demo Callout Banner */}
              <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-between gap-3 text-[var(--text-primary)]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--accent-text)] shrink-0" />
                  <span className="font-semibold text-xs">
                    Want to test it risk-free? Try our interactive Demo Mode!
                  </span>
                </div>
                {onLaunchDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLaunchDemo();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Try Demo</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent-text)] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">
                    1. Pick Your Speed & Topic
                  </h4>
                  <p className="text-[var(--text-secondary)]">
                    Select a trivia speed mode (3 min, 5 min, or 10 min) and enter a category like Football EPL, Tech Safari, or Kenyan News.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">
                    2. 12-Second Decision Clock
                  </h4>
                  <p className="text-[var(--text-secondary)]">
                    Each live question gives you 12 seconds. Consecutive correct answers stack streak multipliers (2x, 3x, up to 5x) for rapid reward growth.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">
                    3. Lock In & Cash Out Anytime
                  </h4>
                  <p className="text-[var(--text-secondary)]">
                    You do not need to finish every question! Hit the <strong>Lock In & Cash Out</strong> button anytime to secure your accumulated earnings.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent-text)] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">
                    4. Instant M-PESA Payouts
                  </h4>
                  <p className="text-[var(--text-secondary)]">
                    Withdraw directly to your Safaricom M-PESA wallet with 0% processing fee.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[var(--success)] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant STK & B2C Verified</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
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
