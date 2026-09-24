import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Trophy, X, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ChallengeData {
  challenge_code: string;
  challenger: {
    name: string;
    score: number;
  };
  opponent: {
    name: string;
    score: number;
  } | null;
  status: string;
  question_count: number;
  time_limit: number;
  expires_at: string;
}

export default function ChallengePage() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  
  const [loading, setLoading] = useState(true);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      fetchChallenge(code);
    }
  }, [code]);

  const fetchChallenge = async (challengeCode: string) => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/viral/challenge/${challengeCode}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChallengeData(data.data);
        } else {
          setError(data.error || 'Failed to load challenge');
        }
      } else {
        setError('Challenge not found or expired');
      }
    } catch (err) {
      setError('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const beatTheScore = () => {
    // Navigate to viral page with challenge context
    navigate('/viral', { state: { challengeCode: code } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090D15] via-[#0E1726] to-[#05080E] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090D15] via-[#0E1726] to-[#05080E] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Challenge Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This challenge may have expired or does not exist.'}</p>
          <button
            onClick={() => navigate('/viral')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-all"
          >
            Try the Demo Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090D15] via-[#0E1726] to-[#05080E] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Challenge Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">CHALLENGE</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {challengeData.challenger.name} SCORED {challengeData.challenger.score}/{challengeData.question_count}
          </h1>
          
          <p className="text-2xl text-gray-300">
            CAN YOU BEAT THE SCORE?
          </p>
        </div>

        {/* Challenge Details */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400">{challengeData.question_count}</div>
              <div className="text-sm text-gray-400">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">{challengeData.time_limit}s</div>
              <div className="text-sm text-gray-400">Time Limit</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">{challengeData.challenger.score}</div>
              <div className="text-sm text-gray-400">To Beat</div>
            </div>
          </div>
        </div>

        {/* Status */}
        {challengeData.status === 'expired' && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-8 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-semibold">This challenge has expired</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={beatTheScore}
            disabled={challengeData.status === 'expired'}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25 disabled:shadow-none"
          >
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              BEAT THE SCORE
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
          </button>
          
          <p className="text-gray-400 mt-4 text-sm">
            {challengeData.status === 'expired' 
              ? 'This challenge is no longer active'
              : `Expires ${new Date(challengeData.expires_at).toLocaleDateString()}`
            }
          </p>
        </div>

        {/* Opponent Info */}
        {challengeData.opponent && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Challenge Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Challenger</div>
                <div className="font-semibold">{challengeData.challenger.name}</div>
                <div className="text-emerald-400">{challengeData.challenger.score} points</div>
              </div>
              <div className="text-gray-400">vs</div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Opponent</div>
                <div className="font-semibold">{challengeData.opponent.name}</div>
                <div className="text-emerald-400">{challengeData.opponent.score} points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
