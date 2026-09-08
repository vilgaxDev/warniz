import React, { useState } from 'react';
import {
  Trophy, Medal, Flame, Search, X, TrendingUp, Sparkles, Zap, ArrowUpRight,
  Shield, Check, User, Crown, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ExtendedLeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  winningsKsh: number;
  streak: number;
  winRate: string;
  categorySpecialty: string;
  change: 'up' | 'down' | 'same';
  changeAmount: number;
  badge?: string;
}

const ALL_LEADERBOARD_DATA: Record<'daily' | 'weekly' | 'alltime', ExtendedLeaderboardUser[]> = {
  daily: [
    { rank: 1, name: 'Kiprono M.', avatar: '🇰🇪', winningsKsh: 14200, streak: 8, winRate: '94%', categorySpecialty: 'Kenya Heritage', change: 'up', changeAmount: 2, badge: 'Grand Master' },
    { rank: 2, name: 'Wanjiku K.', avatar: '🏆', winningsKsh: 11800, streak: 6, winRate: '89%', categorySpecialty: 'Football EPL', change: 'same', changeAmount: 0, badge: 'Sharpshooter' },
    { rank: 3, name: 'Otieno O.', avatar: '⚡', winningsKsh: 9500, streak: 5, winRate: '87%', categorySpecialty: 'Silicon Savannah', change: 'up', changeAmount: 4, badge: 'Speed Demon' },
    { rank: 4, name: 'Amina S.', avatar: '🌟', winningsKsh: 7200, streak: 4, winRate: '82%', categorySpecialty: 'Business Economy', change: 'down', changeAmount: 1 },
    { rank: 5, name: 'Kamau J.', avatar: '🔥', winningsKsh: 5900, streak: 3, winRate: '78%', categorySpecialty: 'Kenya Heritage', change: 'up', changeAmount: 1 },
    { rank: 6, name: 'Brian N.', avatar: '⚽', winningsKsh: 5100, streak: 4, winRate: '85%', categorySpecialty: 'Football EPL', change: 'up', changeAmount: 3 },
    { rank: 7, name: 'Faith M.', avatar: '💼', winningsKsh: 4600, streak: 3, winRate: '79%', categorySpecialty: 'Business Economy', change: 'down', changeAmount: 2 },
    { rank: 8, name: 'Dennis K.', avatar: '🎯', winningsKsh: 3900, streak: 2, winRate: '75%', categorySpecialty: 'World Wonders', change: 'same', changeAmount: 0 },
    { rank: 9, name: 'Mercy W.', avatar: '🌸', winningsKsh: 3200, streak: 3, winRate: '81%', categorySpecialty: 'Kenya Heritage', change: 'up', changeAmount: 5 },
    { rank: 10, name: 'Kevin O.', avatar: '🚀', winningsKsh: 2800, streak: 2, winRate: '73%', categorySpecialty: 'Silicon Savannah', change: 'down', changeAmount: 3 },
  ],
  weekly: [
    { rank: 1, name: 'Wanjiku K.', avatar: '🏆', winningsKsh: 48500, streak: 14, winRate: '92%', categorySpecialty: 'Football EPL', change: 'up', changeAmount: 1, badge: 'Legendary' },
    { rank: 2, name: 'Kiprono M.', avatar: '🇰🇪', winningsKsh: 42100, streak: 12, winRate: '90%', categorySpecialty: 'Kenya Heritage', change: 'down', changeAmount: 1, badge: 'Grand Master' },
    { rank: 3, name: 'Otieno O.', avatar: '⚡', winningsKsh: 36400, streak: 9, winRate: '88%', categorySpecialty: 'Silicon Savannah', change: 'up', changeAmount: 2, badge: 'Speed Demon' },
    { rank: 4, name: 'Brian N.', avatar: '⚽', winningsKsh: 29800, streak: 8, winRate: '86%', categorySpecialty: 'Football EPL', change: 'up', changeAmount: 3 },
    { rank: 5, name: 'Amina S.', avatar: '🌟', winningsKsh: 24500, streak: 7, winRate: '83%', categorySpecialty: 'Business Economy', change: 'down', changeAmount: 1 },
  ],
  alltime: [
    { rank: 1, name: 'Kiprono M.', avatar: '🇰🇪', winningsKsh: 215000, streak: 26, winRate: '95%', categorySpecialty: 'Kenya Heritage', change: 'same', changeAmount: 0, badge: 'Hall of Fame' },
    { rank: 2, name: 'Wanjiku K.', avatar: '🏆', winningsKsh: 189400, streak: 22, winRate: '93%', categorySpecialty: 'Football EPL', change: 'same', changeAmount: 0, badge: 'Hall of Fame' },
    { rank: 3, name: 'Otieno O.', avatar: '⚡', winningsKsh: 142000, streak: 18, winRate: '91%', categorySpecialty: 'Silicon Savannah', change: 'same', changeAmount: 0, badge: 'Grand Master' },
    { rank: 4, name: 'Brian N.', avatar: '⚽', winningsKsh: 118500, streak: 16, winRate: '89%', categorySpecialty: 'Football EPL', change: 'up', changeAmount: 1 },
    { rank: 5, name: 'Amina S.', avatar: '🌟', winningsKsh: 98400, streak: 14, winRate: '87%', categorySpecialty: 'Business Economy', change: 'down', changeAmount: 1 },
  ],
};

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserWinnings: number;
  currentUserStreak: number;
  onPlayArena: () => void;
  theme?: 'dark' | 'light';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserWinnings,
  currentUserStreak,
  onPlayArena,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  if (!isOpen) return null;

  const activeList = ALL_LEADERBOARD_DATA[timeframe];
  const filteredUsers = activeList.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.categorySpecialty.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCategoryFilter !== 'All' && u.categorySpecialty !== selectedCategoryFilter) {
      return false;
    }
    return true;
  });

  const topThree = activeList.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-3xl max-h-[92vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#070a0e] black-net border-emerald-950/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* MODAL HEADER */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between gap-3 ${
          isDark ? 'border-white/5 bg-[#0a0f16]' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl tracking-tight leading-tight">
                  Global Leaderboard
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Live Ranked
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Top profit earners, winning streaks, and verified champions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS BAR: TIMEFRAME TABS & SEARCH */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-white/5 bg-[#0a0f16]/80' : 'border-slate-100 bg-white'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Timeframe Selector Pills */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 w-full sm:w-auto ${
              isDark ? 'bg-[#151d2c] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {(['daily', 'weekly', 'alltime'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                    timeframe === t
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'alltime' ? 'All-Time' : t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player or category..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition-all ${
                  isDark
                    ? 'bg-[#151d2c] border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white'
                }`}
              />
            </div>
          </div>
        </div>

        {/* SCROLLABLE LEADERBOARD BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* TOP 3 PODIUM (Visible if no search query) */}
          {!searchQuery && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-4 pb-2">
              {/* #2 Silver (Left) */}
              {topThree[1] && (
                <div className={`p-3 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-between order-1 relative ${
                  isDark ? 'bg-[#151f33] border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs flex items-center justify-center mb-1 shadow-xs">
                    2
                  </div>
                  <div className="text-2xl sm:text-3xl my-1">{topThree[1].avatar}</div>
                  <div className="font-bold text-xs sm:text-sm truncate w-full">{topThree[1].name}</div>
                  <div className="text-emerald-500 font-extrabold text-xs sm:text-sm font-mono-numbers mt-1">
                    +KSh {topThree[1].winningsKsh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 mt-0.5">
                    <Flame className="w-2.5 h-2.5 fill-amber-500" />
                    <span>{topThree[1].streak} streak</span>
                  </div>
                </div>
              )}

              {/* #1 Gold (Center - Higher Elevation) */}
              {topThree[0] && (
                <div className={`p-3.5 sm:p-5 rounded-2xl border text-center flex flex-col items-center justify-between order-2 relative scale-105 shadow-xl ${
                  isDark
                    ? 'bg-gradient-to-b from-amber-500/20 via-[#1a233a] to-[#131b2e] border-amber-500/40 ring-2 ring-amber-500/20'
                    : 'bg-gradient-to-b from-amber-50 to-white border-amber-300 ring-2 ring-amber-200'
                }`}>
                  <div className="absolute -top-3 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Crown className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div className="text-3xl sm:text-4xl my-1 mt-2">{topThree[0].avatar}</div>
                  <div className="font-extrabold text-sm sm:text-base truncate w-full">{topThree[0].name}</div>
                  <div className="text-emerald-500 font-black text-sm sm:text-base font-mono-numbers mt-1">
                    +KSh {topThree[0].winningsKsh.toLocaleString()}
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 mt-1 border ${
                    isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>{topThree[0].streak} Streak • {topThree[0].winRate} Win</span>
                  </div>
                </div>
              )}

              {/* #3 Bronze (Right) */}
              {topThree[2] && (
                <div className={`p-3 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-between order-3 relative ${
                  isDark ? 'bg-[#151f33] border-amber-800/40' : 'bg-slate-50 border-amber-200'
                }`}>
                  <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center mb-1 shadow-xs">
                    3
                  </div>
                  <div className="text-2xl sm:text-3xl my-1">{topThree[2].avatar}</div>
                  <div className="font-bold text-xs sm:text-sm truncate w-full">{topThree[2].name}</div>
                  <div className="text-emerald-500 font-extrabold text-xs sm:text-sm font-mono-numbers mt-1">
                    +KSh {topThree[2].winningsKsh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 mt-0.5">
                    <Flame className="w-2.5 h-2.5 fill-amber-500" />
                    <span>{topThree[2].streak} streak</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RANKED LIST TABLE */}
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              return (
                <div
                  key={user.rank}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    user.rank === 1
                      ? isDark
                        ? 'bg-[#182338] border-amber-500/40'
                        : 'bg-amber-50/70 border-amber-200'
                      : isDark
                        ? 'bg-[#121927] border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 text-center font-bold text-xs shrink-0 ${
                      user.rank === 1 ? 'text-amber-500 font-extrabold' : isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      #{user.rank}
                    </div>

                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm shrink-0 ${
                      isDark ? 'bg-[#182338] border-slate-700' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {user.avatar}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs sm:text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.name}</span>
                        {user.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {user.badge}
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{user.categorySpecialty}</span>
                        <span>•</span>
                        <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-amber-500" />
                          {user.streak} streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-xs sm:text-sm text-emerald-500 font-mono-numbers">
                      +KSh {user.winningsKsh.toLocaleString()}
                    </div>
                    <div className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {user.winRate} accuracy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STICKY BOTTOM USER STANDING & ACTION */}
        <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-white/5 bg-[#0a0f16]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              YOU
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>Your Rank: #12</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                  Top 8%
                </span>
              </div>
              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Wallet: KSh {currentUserWinnings.toLocaleString()} • Streak: {currentUserStreak}x
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onPlayArena();
            }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Play Arena to Climb</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
