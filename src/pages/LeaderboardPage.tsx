import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, TrendingUp, User, Search, Filter, Share2, Target, Crown, Award, Lock } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
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

export default function LeaderboardPage() {
  const navigate = useNavigate();
  
  // SEO metadata
  useEffect(() => {
    document.title = 'TrivQuest Leaderboard — Who\'s on Top?';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compete with TrivQuest players and climb the rankings. See who\'s on top of the leaderboard.');
    }
  }, []);
  
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('daily');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('player_token');
    setIsLoggedIn(!!token);

    fetchLeaderboard();
  }, [timeframe, category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('player_token');
      
      const response = await fetch(
        `${baseUrl}/api/leaderboard?timeframe=${timeframe}&limit=50${category !== 'all' ? `&category=${category}` : ''}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to leaderboard format
        const entries: LeaderboardEntry[] = data.map((player: any, index: number) => ({
          rank: index + 1,
          name: player.name || 'Anonymous',
          xp: player.winningsKsh || 0,
          winnings: player.winningsKsh || 0,
          streak: player.streak || 0,
          winRate: parseInt(player.winRate) || 0,
        }));

        setLeaderboardData({
          timeframe,
          entries,
          userPosition: data.user_position ? {
            rank: data.user_position.rank,
            name: data.user_position.name,
            xp: data.user_position.winningsKsh || 0,
            winnings: data.user_position.winningsKsh || 0,
            streak: data.user_position.streak || 0,
            winRate: parseInt(data.user_position.winRate) || 0,
            isCurrentUser: true,
          } : undefined,
        });
      } else {
        // Mock data for development
        const mockEntries: LeaderboardEntry[] = [
          { rank: 1, name: 'QuizMaster_Kenya', xp: 9840, winnings: 45000, streak: 15, winRate: 92 },
          { rank: 2, name: 'TriviaKing', xp: 9620, winnings: 42000, streak: 12, winRate: 88 },
          { rank: 3, name: 'Brainiac_KE', xp: 9410, winnings: 38000, streak: 10, winRate: 85 },
          { rank: 4, name: 'SmartMind', xp: 9280, winnings: 35000, streak: 8, winRate: 82 },
          { rank: 5, name: 'QuizNinja', xp: 9120, winnings: 32000, streak: 7, winRate: 80 },
          { rank: 6, name: 'FactFinder', xp: 8950, winnings: 30000, streak: 6, winRate: 78 },
          { rank: 7, name: 'KnowledgeSeeker', xp: 8780, winnings: 28000, streak: 5, winRate: 75 },
          { rank: 8, name: 'QuickThinker', xp: 8610, winnings: 26000, streak: 5, winRate: 73 },
          { rank: 9, name: 'WiseOwl', xp: 8440, winnings: 24000, streak: 4, winRate: 70 },
          { rank: 10, name: 'BrainPower', xp: 8270, winnings: 22000, streak: 4, winRate: 68 },
        ];

        setLeaderboardData({
          timeframe,
          entries: mockEntries,
          userPosition: isLoggedIn ? {
            rank: 342,
            name: 'You',
            xp: 8420,
            winnings: 5000,
            streak: 2,
            winRate: 65,
            isCurrentUser: true,
          } : undefined,
        });
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = 'Check out the TrivQuest leaderboard and see who\'s on top!';
    const shareUrl = `${window.location.origin}/leaderboard`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrivQuest Leaderboard',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-300" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-600" />;
    return null;
  };

  const getRankBackground = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090D15] via-[#0E1726] to-[#05080E] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                WHO'S ON TOP?
              </h1>
              <p className="text-gray-400 mt-2">
                Compete with TrivQuest players and climb the rankings.
              </p>
            </div>
            <button
              onClick={() => navigate('/viral')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              PLAY CHALLENGE
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Timeframe Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>

        {/* User Position Card */}
        {leaderboardData?.userPosition && (
          <div className="mb-8 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">YOUR POSITION</div>
                  <div className="text-2xl font-bold">#{leaderboardData.userPosition.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{leaderboardData.userPosition.xp.toLocaleString()} XP</div>
                <div className="text-sm text-gray-400">
                  {leaderboardData.userPosition.xp - leaderboardData.entries[leaderboardData.userPosition.rank - 2]?.xp || 0} XP to #{leaderboardData.userPosition.rank - 1}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Prompt */}
        {!isLoggedIn && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">LOGIN TO SEE YOUR POSITION</h3>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-all"
            >
              LOGIN
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Categories</option>
              <option value="geography">Geography</option>
              <option value="history">History</option>
              <option value="sports">Sports</option>
              <option value="tech">Technology</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData?.entries.map((entry) => (
              <div
                key={entry.rank}
                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankBackground(entry.rank)} ${
                  entry.isCurrentUser ? 'ring-2 ring-emerald-500/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-xl font-bold text-gray-400">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Player */}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{entry.name}</div>
                    <div className="text-sm text-gray-400">
                      Streak: {entry.streak} • Win Rate: {entry.winRate}%
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-400">{entry.xp.toLocaleString()} XP</div>
                    <div className="text-sm text-gray-400">KES {entry.winnings.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
          >
            <Share2 className="w-5 h-5" />
            SHARE LEADERBOARD
          </button>
        </div>

        {/* Viral Loop */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                CHALLENGE A FRIEND
              </h3>
              <p className="text-gray-300">
                Share your score and challenge friends to beat you on the leaderboard.
              </p>
            </div>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              CHALLENGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
