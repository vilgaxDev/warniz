import React from 'react';
import {
  ShieldCheck,
  Zap,
  Wallet,
  Trophy,
  Gift,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { TrivquestLogo } from './TrivquestLogo';
import { SPEED_MODES } from '../data/quizData';

interface SiteFooterProps {
  onOpenHowItWorks: () => void;
  onOpenLeaderboard: () => void;
  onOpenDailyRewards: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onSelectCategory: (id: string) => void;
  theme?: 'dark' | 'light';
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onOpenHowItWorks,
  onOpenLeaderboard,
  onOpenDailyRewards,
  onOpenDeposit,
  onOpenWithdraw,
  onSelectCategory,
  theme = 'dark',
}) => {
  return (
    <footer className="w-full mt-12 border-t border-[var(--border)] bg-[var(--card)] font-sans text-xs select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-3">
            <TrivquestLogo size="md" theme={theme} />
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Trivquest is Kenya&apos;s fast-paced speed trivia arena. Test your skills across Kenya heritage, sports, tech, finance, and global topics with instant M-PESA mobile money cashouts.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] text-[var(--text-muted)] font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
                <span>Provably Fair</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[var(--accent-text)]" />
                <span>256-Bit SSL</span>
              </span>
              <span>•</span>
              <span>Instant Settlements</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Speed Arenas
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[var(--text-secondary)]">
              {SPEED_MODES.map((mode) => (
                <li key={mode.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(mode.id)}
                    className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-[var(--accent-text)]" />
                    <span>{mode.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenHowItWorks}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5 text-[var(--accent-text)]"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>How Trivquest Works</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Wallet & Rewards */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Wallet & Rewards
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={onOpenDeposit}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Wallet className="w-3 h-3 text-[var(--accent-text)]" />
                  <span>Deposit via M-PESA</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWithdraw}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Wallet className="w-3 h-3 text-[var(--success)]" />
                  <span>Instant Cashout</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDailyRewards}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Gift className="w-3 h-3 text-[var(--warning)]" />
                  <span>Daily Bonus Wheel</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy className="w-3 h-3 text-[var(--accent-text)]" />
                  <span>Leaderboard Rankings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Info */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Responsible Gaming
            </h4>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Trivquest is a skill-based speed trivia arena. Players must be 18+ to stake real funds. Play responsibly.
            </p>
            <div className="pt-2 text-[10px] text-[var(--text-muted)]">
              © {new Date().getFullYear()} Trivquest Kenya. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
