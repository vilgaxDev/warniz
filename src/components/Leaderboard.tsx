import React from 'react';
import { Trophy, Flame, ArrowUpRight, TrendingUp, Sparkles, Medal } from 'lucide-react';

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  winningsKsh: number;
  streak: number;
  isCurrentUser?: boolean;
}

const DEMO_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Kiprono M.', avatar: '🇰🇪', winningsKsh: 14200, streak: 8 },
  { rank: 2, name: 'Wanjiku K.', avatar: '🏆', winningsKsh: 11800, streak: 6 },
  { rank: 3, name: 'Otieno O.', avatar: '⚡', winningsKsh: 9500, streak: 5 },
  { rank: 4, name: 'Amina S.', avatar: '🌟', winningsKsh: 7200, streak: 4 },
  { rank: 5, name: 'Kamau J.', avatar: '🔥', winningsKsh: 5900, streak: 3 },
];

interface LeaderboardProps {
  currentUserWinnings?: number;
  currentUserStreak?: number;
  theme?: 'dark' | 'light';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserWinnings = 1450,
  currentUserStreak = 3,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border transition-colors flex flex-col justify-between space-y-4 font-sans ${
      isDark ? 'bg-[#080d14] black-net border-emerald-950/60' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      {/* Leaderboard Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${
            isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className={`font-bold text-sm sm:text-base leading-tight ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Leaderboard
            </h3>
            <p className={`text-[11px] font-medium tracking-tight ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Top Daily Profit Earners
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Live Standings
        </span>
      </div>

      {/* Leaderboard Ranks List */}
      <div className="space-y-2 flex-1">
        {DEMO_LEADERBOARD.map((user) => {
          let rankBadge = null;
          if (user.rank === 1) {
            rankBadge = <span className="text-amber-400 font-extrabold text-xs">#1</span>;
          } else if (user.rank === 2) {
            rankBadge = <span className={`font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>#2</span>;
          } else if (user.rank === 3) {
            rankBadge = <span className="text-amber-600 font-bold text-xs">#3</span>;
          } else {
            rankBadge = <span className={`font-medium text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>#{user.rank}</span>;
          }

          return (
            <div
              key={user.rank}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                user.rank === 1
                  ? isDark
                    ? 'bg-[#182338] border-amber-500/30 ring-1 ring-amber-500/20'
                    : 'bg-amber-50/80 border-amber-300'
                  : isDark
                    ? 'bg-[#151d2c] border-slate-800/80 hover:bg-[#182234]'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 text-center shrink-0">{rankBadge}</div>
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                  isDark ? 'bg-[#182338] border-slate-700/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {user.avatar}
                </div>
                <div className="truncate">
                  <div className={`font-semibold text-xs sm:text-sm truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{user.streak} Streak</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-extrabold text-xs sm:text-sm text-emerald-400">
                  +KSh {user.winningsKsh.toLocaleString()}
                </div>
                <div className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Cashed Out
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Standing Footer Card */}
      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
        isDark
          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
          : 'bg-emerald-50 border-emerald-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            YOU
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm leading-tight">
              Your Position (#12)
            </div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Top 8% of all players
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
            KSh {currentUserWinnings.toLocaleString()}
          </div>
          <div className="text-[10px] font-medium text-slate-400">
            Current Tier
          </div>
        </div>
      </div>
    </div>
  );
};
