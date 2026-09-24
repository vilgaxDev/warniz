import React from 'react';
import { Trophy, TrendingUp, User } from 'lucide-react';

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  score: number;
  isCurrentUser?: boolean;
}

const DEFAULT_LEADERBOARD_USERS: LeaderboardUser[] = [
  { rank: 1, name: 'Kiprono M.', avatar: 'K', xp: 24500, score: 980 },
  { rank: 2, name: 'Wanjiku K.', avatar: 'W', xp: 21200, score: 910 },
  { rank: 3, name: 'Otieno O.', avatar: 'O', xp: 18900, score: 870 },
  { rank: 4, name: 'Amina S.', avatar: 'A', xp: 15400, score: 790 },
  { rank: 5, name: 'Kamau J.', avatar: 'J', xp: 13200, score: 740 },
  { rank: 6, name: 'Brian N.', avatar: 'B', xp: 11800, score: 690 },
  { rank: 7, name: 'Grace M.', avatar: 'G', xp: 9500, score: 620 },
  { rank: 8, name: 'David O.', avatar: 'D', xp: 8200, score: 580 },
];

interface LeaderboardProps {
  users?: LeaderboardUser[];
  currentUserWinnings?: number;
  currentUserStreak?: number;
  currentUserXP?: number;
  currentUserName?: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  users = DEFAULT_LEADERBOARD_USERS,
  currentUserWinnings = 1450,
  currentUserStreak = 3,
  currentUserXP = 4250,
  currentUserName = 'You',
  className = '',
}) => {
  return (
    <div className={`triv-card p-4 select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[var(--accent-text)]" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
            Leaderboard
          </h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">
          Live Standings
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
        <div className="col-span-2 text-center">Rank</div>
        <div className="col-span-6">User</div>
        <div className="col-span-2 text-right">XP</div>
        <div className="col-span-2 text-right">Score</div>
      </div>

      {/* List of Users */}
      <div className="space-y-1 mt-1.5">
        {users.slice(0, 6).map((u) => {
          const isCurrent = u.isCurrentUser;

          return (
            <div
              key={u.rank}
              className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-lg text-xs transition-colors border ${
                isCurrent
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] font-semibold'
                  : 'border-transparent hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'
              }`}
            >
              {/* Rank */}
              <div className="col-span-2 text-center font-mono font-bold">
                <span className={u.rank === 1 ? 'text-[var(--accent-text)]' : u.rank === 2 ? 'text-[var(--text-primary)]' : u.rank === 3 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}>
                  #{u.rank}
                </span>
              </div>

              {/* Avatar + Username */}
              <div className="col-span-6 flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-[var(--text-primary)] shrink-0">
                  {u.avatar}
                </div>
                <span className="truncate text-[var(--text-primary)] font-medium">
                  {u.name}
                </span>
              </div>

              {/* XP */}
              <div className="col-span-2 text-right font-mono tabular-nums text-[11px] text-[var(--accent-text)] font-semibold">
                {u.xp.toLocaleString()}
              </div>

              {/* Score */}
              <div className="col-span-2 text-right font-mono tabular-nums text-[11px] text-[var(--text-primary)] font-bold">
                {u.score}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Row Highlight */}
      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <div className="grid grid-cols-12 gap-2 items-center px-2.5 py-2 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)] text-xs">
          <div className="col-span-2 text-center font-mono font-bold text-[var(--accent-text)]">
            #12
          </div>
          <div className="col-span-6 flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              YOU
            </div>
            <span className="truncate font-semibold text-[var(--text-primary)]">
              {currentUserName}
            </span>
          </div>
          <div className="col-span-2 text-right font-mono tabular-nums text-[11px] text-[var(--accent-text)] font-bold">
            {currentUserXP.toLocaleString()}
          </div>
          <div className="col-span-2 text-right font-mono tabular-nums text-[11px] text-[var(--text-primary)] font-bold">
            420
          </div>
        </div>
      </div>
    </div>
  );
};
