import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Trophy, Clock, Coins, Flame, TrendingUp } from 'lucide-react';

interface QuizBet {
  id: string;
  playerName: string;
  category: string;
  stake: number;
  winnings: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: string;
  questionsCorrect?: number;
  totalQuestions?: number;
}

interface QuizBetsSidebarProps {
  theme?: 'dark' | 'light';
  onClose?: () => void;
}

export const QuizBetsSidebar: React.FC<QuizBetsSidebarProps> = ({
  theme = 'dark',
  onClose
}) => {
  const isDark = theme === 'dark';
  const [quizBets, setQuizBets] = useState<QuizBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real quiz bets from backend (user's own bets)
  useEffect(() => {
    const fetchQuizBets = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const token = localStorage.getItem('player_token');
        
        const res = await fetch(`${baseUrl}/api/quiz/my-bets`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.bets && Array.isArray(data.bets)) {
            // Filter out any undefined/null bets
            setQuizBets(data.bets.filter((bet: QuizBet) => bet && bet.playerName));
          }
        } else {
          // Fallback to public bets if auth fails
          const publicRes = await fetch(`${baseUrl}/api/quiz/latest-bets`, {
            headers: {
              'Accept': 'application/json',
            },
          });
          const publicData = await publicRes.json();
          if (publicData.bets && Array.isArray(publicData.bets)) {
            // Filter out any undefined/null bets
            setQuizBets(publicData.bets.filter((bet: QuizBet) => bet && bet.playerName));
          }
        }
      } catch (error) {
        console.error('Failed to fetch quiz bets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizBets();

    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchQuizBets, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full h-full ${isDark ? 'bg-[#0B0E14]' : 'bg-white'} border-l ${
      isDark ? 'border-white/5' : 'border-slate-200'
    } flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-white/5 bg-[#0a0f16]/90' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
            }`}>
              <Zap className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                LATEST QUIZ BETS
              </h3>
              <div className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                LIVE
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-200'}`}
            >
              <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
            </button>
          )}
        </div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Loading bets...
          </div>
        ) : quizBets.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No recent quiz bets
          </div>
        ) : (
          <AnimatePresence>
            {quizBets.map((bet, index) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-xl border ${
                  isDark 
                    ? 'bg-[#0a0f16] border-white/5 hover:border-emerald-500/30' 
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                } transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      bet.status === 'won' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bet.playerName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {bet.playerName || 'Unknown'}
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {bet.category || 'General'}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                    bet.status === 'won'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {bet.status === 'won' ? 'WIN' : 'LOSS'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className="font-medium">KES {bet.stake}</span>
                    {bet.questionsCorrect !== undefined && (
                      <span className="ml-2">
                        {bet.questionsCorrect}/{bet.totalQuestions} Qs
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold ${
                    bet.status === 'won' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {bet.status === 'won' ? `+KES ${bet.winnings}` : `-KES ${bet.stake}`}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Stats */}
      <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-[#0a0f16]/90' : 'border-slate-200 bg-slate-50'}`}>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>
            <div className={`text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Total Won
            </div>
            <div className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              KES {quizBets.reduce((sum, bet) => sum + (bet.status === 'won' ? bet.winnings : 0), 0).toLocaleString()}
            </div>
          </div>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-red-500/10' : 'bg-red-100'}`}>
            <div className={`text-[10px] ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Total Lost
            </div>
            <div className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              KES {quizBets.reduce((sum, bet) => sum + (bet.status === 'lost' ? bet.stake : 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
