import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  User,
  Search,
  Share2,
  Target,
  ArrowLeft,
  Flame,
  Zap,
} from 'lucide-react';
import { TrivquestLogo } from '../components/TrivquestLogo';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  xp: number;
  winnings: number;
  streak: number;
  winRate: number;
  isCurrentUser?: boolean;
}

interface LeaderboardData {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime';
  entries: LeaderboardEntry[];
  userPosition?: LeaderboardEntry;
}

const getMockLeaderboardData = (
  timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime',
  isLoggedIn: boolean
): LeaderboardData => {
  const mockEntries: LeaderboardEntry[] = [
    { rank: 1, name: 'QuizMaster_Kenya', avatar: 'Q', xp: 24500, winnings: 45000, streak: 15, winRate: 92 },
    { rank: 2, name: 'TriviaKing_NBO', avatar: 'T', xp: 21200, winnings: 42000, streak: 12, winRate: 88 },
    { rank: 3, name: 'Brainiac_KE', avatar: 'B', xp: 18900, winnings: 38000, streak: 10, winRate: 85 },
    { rank: 4, name: 'SmartMind_254', avatar: 'S', xp: 15400, winnings: 35000, streak: 8, winRate: 82 },
    { rank: 5, name: 'QuizNinja', avatar: 'N', xp: 13200, winnings: 32000, streak: 7, winRate: 80 },
    { rank: 6, name: 'FactFinder_Msa', avatar: 'F', xp: 11800, winnings: 30000, streak: 6, winRate: 78 },
    { rank: 7, name: 'KnowledgeSeeker', avatar: 'K', xp: 9500, winnings: 28000, streak: 5, winRate: 75 },
    { rank: 8, name: 'QuickThinker_Eld', avatar: 'E', xp: 8200, winnings: 26000, streak: 5, winRate: 73 },
    { rank: 9, name: 'WiseOwl_Ksm', avatar: 'W', xp: 7400, winnings: 24000, streak: 4, winRate: 70 },
    { rank: 10, name: 'BrainPower_Nak', avatar: 'P', xp: 6800, winnings: 22000, streak: 4, winRate: 68 },
  ];

  return {
    timeframe,
    entries: mockEntries,
    userPosition: isLoggedIn
      ? {
          rank: 24,
          name: 'You',
          avatar: 'Y',
          xp: 4250,
          winnings: 1450,
          streak: 3,
          winRate: 65,
          isCurrentUser: true,
        }
      : undefined,
  };
};

export default function LeaderboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Trivquest Leaderboard — Live Trivia Rankings';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Compete with Kenya's fastest trivia speed players and climb the rankings on Trivquest."
      );
    }
  }, []);

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>(() =>
    getMockLeaderboardData('daily', Boolean(localStorage.getItem('player_token')))
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('player_token');
    setIsLoggedIn(Boolean(token));
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, isLoggedIn]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const fallback = getMockLeaderboardData(timeframe, isLoggedIn);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        setLeaderboardData(fallback);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('player_token');
      const response = await fetch(
        `${baseUrl}/api/leaderboard?timeframe=${timeframe}&limit=50`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.leaderboard)
          ? data.leaderboard
          : null;

        if (rawList && rawList.length > 0) {
          const entries: LeaderboardEntry[] = rawList.map((player: any, index: number) => ({
            rank: player.rank || index + 1,
            name: player.name || player.username || 'Anonymous',
            avatar: (player.name || player.username || 'A')[0].toUpperCase(),
            xp: player.xp || player.winningsKsh || 0,
            winnings: player.winningsKsh || player.winnings || 0,
            streak: player.streak || 0,
            winRate: parseInt(player.winRate, 10) || 75,
          }));

          setLeaderboardData({
            timeframe,
            entries,
            userPosition: data.user_position
              ? {
                  rank: data.user_position.rank,
                  name: data.user_position.name || 'You',
                  avatar: 'Y',
                  xp: data.user_position.xp || data.user_position.winningsKsh || 0,
                  winnings: data.user_position.winningsKsh || 0,
                  streak: data.user_position.streak || 0,
                  winRate: parseInt(data.user_position.winRate, 10) || 0,
                  isCurrentUser: true,
                }
              : fallback.userPosition,
          });
          setLoading(false);
          return;
        }
      }
      setLeaderboardData(fallback);
    } catch {
      // Graceful fallback to rich local state
      setLeaderboardData(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = 'Check out the Trivquest leaderboard and see who is on top!';
    const shareUrl = `${window.location.origin}/leaderboard`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Trivquest Leaderboard',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  const filteredEntries = leaderboardData.entries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    return entry.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-main)]/90 border-b border-[var(--border)] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Return to Arenas"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <TrivquestLogo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Play Arenas</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Share leaderboard"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-5">
        {/* Banner */}
        <div className="triv-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-[var(--accent-text)]" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Leaderboard Rankings
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Compete against top speed trivia players in Kenya. Rank up, boost your XP, and win cash prizes.
            </p>
          </div>

          {/* Timeframe switch */}
          <div className="flex items-center gap-1 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl self-start sm:self-auto">
            {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer capitalize ${
                  timeframe === tf
                    ? 'bg-[var(--card)] text-[var(--accent-text)] border border-[var(--border)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Current User Row Card */}
        {leaderboardData.userPosition && (
          <div className="triv-card p-4 border-[var(--accent)] bg-[var(--accent-soft)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white font-mono font-bold text-sm flex items-center justify-center">
                #{leaderboardData.userPosition.rank}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
                  Your Current Standing
                </span>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {leaderboardData.userPosition.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">XP Points</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[var(--accent-text)]">
                  {leaderboardData.userPosition.xp.toLocaleString()} XP
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Total Won</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[var(--success)]">
                  KES {leaderboardData.userPosition.winnings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Table Card */}
        <div className="triv-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-5">Player</div>
            <div className="hidden sm:block sm:col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-right">XP Points</div>
            <div className="col-span-2 text-right">Winnings</div>
          </div>

          {/* Table Rows */}
          {loading ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              Loading standings...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No players found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filteredEntries.map((entry) => {
                const isCurrent = entry.isCurrentUser;

                return (
                  <div
                    key={entry.rank}
                    className={`grid grid-cols-12 gap-2 items-center px-4 py-3 text-xs transition-colors ${
                      isCurrent
                        ? 'bg-[var(--accent-soft)]'
                        : 'hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-1 text-center font-mono font-bold">
                      <span
                        className={
                          entry.rank === 1
                            ? 'text-[var(--accent-text)]'
                            : entry.rank === 2
                            ? 'text-[var(--text-primary)]'
                            : entry.rank === 3
                            ? 'text-[var(--warning)]'
                            : 'text-[var(--text-muted)]'
                        }
                      >
                        #{entry.rank}
                      </span>
                    </div>

                    {/* Player */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--accent-text)] shrink-0">
                        {entry.avatar || entry.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[var(--text-primary)] truncate">
                          {entry.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono sm:hidden">
                          {entry.streak} streak · {entry.winRate}% rate
                        </div>
                      </div>
                    </div>

                    {/* Streak (desktop) */}
                    <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 font-mono text-[11px] text-[var(--warning)]">
                      <Flame className="w-3 h-3 fill-[var(--warning)]" />
                      <span>{entry.streak}x</span>
                    </div>

                    {/* XP */}
                    <div className="col-span-2 text-right font-mono tabular-nums font-semibold text-[var(--accent-text)]">
                      {entry.xp.toLocaleString()}
                    </div>

                    {/* Winnings */}
                    <div className="col-span-2 text-right font-mono tabular-nums font-bold text-[var(--success)]">
                      KES {entry.winnings.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
