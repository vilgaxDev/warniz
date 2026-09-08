import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Wallet, RotateCcw, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ResultModalProps {
  totalWon: number;
  questionsCorrect: number;
  totalQuestions: number;
  maxStreak: number;
  reason: 'wrong_answer' | 'timeout' | 'cashed_out' | 'completed' | 'wrong' | null;
  categoryName: string;
  onClaimAndContinue: () => void;
  onPlayAgain: () => void;
  theme?: 'dark' | 'light';
}

export const ResultModal: React.FC<ResultModalProps> = ({
  totalWon,
  questionsCorrect,
  totalQuestions,
  maxStreak,
  reason,
  categoryName,
  onClaimAndContinue,
  onPlayAgain,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const isVictory = reason === 'completed' || reason === 'cashed_out';

  const getTitle = () => {
    switch (reason) {
      case 'cashed_out':
        return 'Cash Out Executed';
      case 'completed':
        return 'Round Completed!';
      case 'timeout':
        return 'Time Limit Reached';
      case 'wrong_answer':
      case 'wrong':
      default:
        return 'Round Settled';
    }
  };

  const getSubtitle = () => {
    switch (reason) {
      case 'cashed_out':
        return `You safely locked in KSh ${totalWon.toLocaleString()} in accumulated prediction rewards.`;
      case 'completed':
        return `Perfect score! Answered all ${totalQuestions} questions correctly.`;
      case 'timeout':
        return `Time limit elapsed on question ${questionsCorrect + 1}.`;
      case 'wrong_answer':
      case 'wrong':
      default:
        return `Market settled on question ${questionsCorrect + 1}.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-2xl p-6 border flex flex-col items-center text-center relative overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#121927] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Status Icon Header */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
          isVictory
            ? isDark ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            : isDark ? 'bg-rose-950/60 border-rose-500/50 text-rose-400' : 'bg-rose-100 border-rose-300 text-rose-800'
        }`}>
          {reason === 'cashed_out' ? (
            <ShieldCheck className="w-7 h-7" />
          ) : isVictory ? (
            <Trophy className="w-7 h-7" />
          ) : (
            <AlertCircle className="w-7 h-7" />
          )}
        </div>

        {/* Category Badge */}
        <span className={`text-[11px] px-2.5 py-0.5 rounded-md border mb-2 uppercase tracking-wider font-semibold ${
          isDark ? 'bg-slate-800 text-slate-300 border-slate-700/80' : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          {categoryName}
        </span>

        {/* Title & Subtitle */}
        <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          {getTitle()}
        </h2>
        <p className={`text-xs mt-1.5 leading-relaxed max-w-xs font-normal ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {getSubtitle()}
        </p>

        {/* Winnings Box */}
        <div className={`w-full my-5 p-4 rounded-xl border flex flex-col items-center justify-center ${
          isDark ? 'bg-[#0b101b] border-slate-800/90' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span>TOTAL EARNINGS</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-500">
            KSh {totalWon.toLocaleString()}
          </div>
          <div className={`text-[11px] mt-1 font-medium ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Credited directly to your wallet balance
          </div>
        </div>

        {/* Mini Performance Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Correct</div>
            <div className={`text-lg font-bold mt-0.5 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {questionsCorrect} <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ {totalQuestions}</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[10px] uppercase tracking-wider font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Best Streak</div>
            <div className="text-lg font-bold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{maxStreak}</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            onClick={onPlayAgain}
            className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Next Round</span>
          </button>

          <button
            onClick={onClaimAndContinue}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Claim & Lobby</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
