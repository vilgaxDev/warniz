import React from 'react';
import {
  ShieldCheck,
  Zap,
  Wallet,
  Trophy,
  Gift,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { TrivquestIcon } from './TrivquestLogo';
import { QUIZ_CATEGORIES, SPEED_MODES } from '../data/quizData';

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
  const isDark = theme === 'dark';

  return (
    <footer
      className={`w-full mt-12 sm:mt-16 border-t font-sans transition-colors ${
        isDark ? 'bg-[#090D15] border-[#1E2638] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* MAIN FOOTER DIRECTORY (4-COLUMN GRID) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-xl border ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                <TrivquestIcon size={26} />
              </div>
              <span className="font-black text-xl tracking-tight leading-none">
                <span className={isDark ? 'text-white' : 'text-slate-950'}>TRIV</span>
                <span className="text-emerald-500 ml-0.5">QUEST</span>
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Trivquest is Kenya&apos;s high-speed trivia arena. Challenge yourself across football, Kenyan history, tech, and general facts with a 12-second clock and instant M-PESA cashout ladder.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Provably Fair</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Lock className="w-3 h-3" />
                <span>256-bit Encrypted</span>
              </span>
            </div>
          </div>

          {/* Col 2: Speed Arenas */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Speed Arenas
            </h4>
            <ul className="space-y-2 text-xs">
              {SPEED_MODES.map((mode) => (
                <li key={mode.id}>
                  <button
                    onClick={() => onSelectCategory(mode.id)}
                    className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer text-left ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{mode.name} ({mode.questionsCount} Qs • 12s clock)</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenHowItWorks}
                  className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <ChevronRight className="w-3 h-3" />
                  <span>Decision Clock Rules</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Popular Topics
            </h4>
            <ul className="space-y-2 text-xs">
              {QUIZ_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Banking & Navigation */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Banking & Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDeposit}
                  className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Wallet className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>M-PESA Deposit (from KES 10)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWithdraw}
                  className={`hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Wallet className="w-3 h-3 text-red-500 shrink-0" />
                  <span>M-PESA Cashout (from KES 50)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLeaderboard}
                  className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Leaderboard Standings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDailyRewards}
                  className={`hover:text-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Gift className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>Daily Streak Rewards</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. COPYRIGHT STRIP */}
        <div
          className={`mt-10 pt-6 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'border-[#1E2638] text-slate-500' : 'border-slate-200 text-slate-500'
          }`}
        >
          <p>© 2026 Trivquest Kenya. All rights reserved. Speed Trivia & Real Money Cashout Engine.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenHowItWorks} className="hover:text-emerald-500 cursor-pointer">
              Rules & Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
