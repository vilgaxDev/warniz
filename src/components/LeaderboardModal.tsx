import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Search,
  X,
  TrendingUp,
  User,
  ArrowRight,
} from 'lucide-react';

export interface ExtendedLeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  winningsKsh: number;
  streak: number;
  xp?: number;
  score?: number;
  winRate?: string;
  categorySpecialty?: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserWinnings: number;
  currentUserStreak: number;
  onPlayArena: () => void;
  theme?: 'dark' | 'light';
}

const FALLBACK_USERS: ExtendedLeaderboardUser[] = [
  { rank: 1, name: 'Kiprono M.', avatar: 'K', winningsKsh: 14200, streak: 8, xp: 24500, score: 980, categorySpecialty: 'Kenya' },
  { rank: 2, name: 'Wanjiku K.', avatar: 'W', winningsKsh: 11800, streak: 6, xp: 21200, score: 910, categorySpecialty: 'Finance' },
  { rank: 3, name: 'Otieno O.', avatar: 'O', winningsKsh: 9500, streak: 5, xp: 18900, score: 870, categorySpecialty: 'Sports' },
  { rank: 4, name: 'Amina S.', avatar: 'A', winningsKsh: 7200, streak: 4, xp: 15400, score: 790, categorySpecialty: 'Science' },
  { rank: 5, name: 'Kamau J.', avatar: 'J', winningsKsh: 5900, streak: 3, xp: 13200, score: 740, categorySpecialty: 'Technology' },
  { rank: 6, name: 'Brian N.', avatar: 'B', winningsKsh: 4800, streak: 3, xp: 11800, score: 690, categorySpecialty: 'World' },
  { rank: 7, name: 'Grace M.', avatar: 'G', winningsKsh: 3900, streak: 2, xp: 9500, score: 620, categorySpecialty: 'Entertainment' },
  { rank: 8, name: 'David O.', avatar: 'D', winningsKsh: 3100, streak: 2, xp: 8200, score: 580, categorySpecialty: 'Crypto' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserWinnings,
  currentUserStreak,
  onPlayArena,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leaderboardData, setLeaderboardData] = useState<ExtendedLeaderboardUser[]>(FALLBACK_USERS);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchLeaderboard = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/leaderboard?timeframe=${timeframe}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          if (data.leaderboard && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
            setLeaderboardData(data.leaderboard);
          }
        }
      } catch {
        // Fallback gracefully to default data
      }
    };

    fetchLeaderboard();
  }, [isOpen, timeframe]);

  if (!isOpen) return null;

  const filteredUsers = leaderboardData.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || (u.categorySpecialty && u.categorySpecialty.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-sans select-none">
      <div className="triv-card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Leaderboard Standings
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Top trivia performers and XP rankers
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

        {/* Controls Bar: Timeframe tabs + Search */}
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex flex-wrap items-center justify-between gap-3">
          {/* Timeframe Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs">
            {(['daily', 'weekly', 'alltime'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                  timeframe === t
                    ? 'bg-[var(--accent)] text-white font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="w-full pl-8 pr-3 py-1 rounded-md text-xs bg-[var(--card)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] mb-1">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-right">Streak</div>
            <div className="col-span-3 text-right">XP / Cash</div>
          </div>

          {/* User Rows */}
          <div className="space-y-1">
            {filteredUsers.map((user) => (
              <div
                key={user.rank}
                className="grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-lg text-xs hover:bg-[var(--surface-hover)] transition-colors border border-transparent"
              >
                {/* Rank */}
                <div className="col-span-2 text-center font-mono font-bold">
                  <span className={user.rank === 1 ? 'text-[var(--accent-text)]' : user.rank === 2 ? 'text-[var(--text-primary)]' : user.rank === 3 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}>
                    #{user.rank}
                  </span>
                </div>

                {/* Player */}
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-[var(--text-primary)] shrink-0">
                    {user.avatar || user.name[0]}
                  </div>
                  <div className="truncate">
                    <div className="font-medium text-[var(--text-primary)] truncate">{user.name}</div>
                    {user.categorySpecialty && (
                      <div className="text-[10px] text-[var(--text-muted)]">{user.categorySpecialty}</div>
                    )}
                  </div>
                </div>

                {/* Streak */}
                <div className="col-span-2 text-right font-mono tabular-nums text-[11px] text-[var(--text-secondary)]">
                  {user.streak}x
                </div>

                {/* XP / Winnings */}
                <div className="col-span-3 text-right font-mono tabular-nums">
                  <div className="font-bold text-[var(--success)] text-xs">
                    +KES {user.winningsKsh.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {(user.xp || user.winningsKsh * 2).toLocaleString()} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: User status & Play Arena Button */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[var(--text-muted)]">Your Rank: </span>
            <span className="font-bold font-mono text-[var(--text-primary)]">#12 (Top 8%)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onPlayArena();
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Enter Quiz Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
