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
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex items-center justify-center px-4 font-sans">
        <div className="triv-card max-w-md w-full p-8 text-center border border-[var(--border)] shadow-xl bg-[var(--card)]">
          <AlertCircle className="w-12 h-12 text-[var(--danger)] mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Challenge Not Found</h1>
          <p className="text-xs text-[var(--text-secondary)] mb-6">{error || 'This challenge may have expired or does not exist.'}</p>
          <button
            type="button"
            onClick={() => navigate('/viral')}
            className="px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            Try the Demo Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            TrivQuest Challenge Arena
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Challenge Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-soft)] border border-[var(--border)] rounded-full mb-4 text-[var(--accent-text)]">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-wider uppercase">SPEED CHALLENGE</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[var(--text-primary)]">
            {challengeData.challenger.name} Scored {challengeData.challenger.score}/{challengeData.question_count}
          </h1>
          
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Can you beat their trivia score within the speed timer?
          </p>
        </div>

        {/* Challenge Details */}
        <div className="triv-card p-6 mb-8 border border-[var(--border)] bg-[var(--card)]">
          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-[var(--border)]">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--accent-text)]">{challengeData.question_count}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Questions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--accent-text)]">{challengeData.time_limit}s</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Time Limit</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--success)]">{challengeData.challenger.score}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">To Beat</div>
            </div>
          </div>
        </div>

        {/* Status */}
        {challengeData.status === 'expired' && (
          <div className="bg-[var(--danger-soft)] border border-[var(--danger)] rounded-xl p-4 mb-8 text-center text-[var(--danger)]">
            <AlertCircle className="w-5 h-5 mx-auto mb-1.5" />
            <p className="font-semibold text-xs">This challenge has expired</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={beatTheScore}
            disabled={challengeData.status === 'expired'}
            className="px-8 py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-gray-400 text-white rounded-xl font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>BEAT THE SCORE</span>
          </button>
          
          <p className="text-[var(--text-muted)] mt-3 text-xs">
            {challengeData.status === 'expired' 
              ? 'This challenge is no longer active'
              : `Expires ${new Date(challengeData.expires_at).toLocaleDateString()}`
            }
          </p>
        </div>

        {/* Opponent Info */}
        {challengeData.opponent && (
          <div className="mt-8 triv-card p-5 border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Challenge Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[var(--text-muted)]">Challenger</div>
                <div className="font-semibold text-xs text-[var(--text-primary)]">{challengeData.challenger.name}</div>
                <div className="text-[var(--accent-text)] font-mono font-bold text-xs">{challengeData.challenger.score} points</div>
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)]">VS</div>
              <div className="text-right">
                <div className="text-[11px] text-[var(--text-muted)]">Opponent</div>
                <div className="font-semibold text-xs text-[var(--text-primary)]">{challengeData.opponent.name}</div>
                <div className="text-[var(--accent-text)] font-mono font-bold text-xs">{challengeData.opponent.score} points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
