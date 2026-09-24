import React from 'react';
import { Volume2, Clock } from 'lucide-react';

interface QuizTimerProps {
  roundSecondsLeft: number;
  totalRoundSeconds: number;
  currentQuestion: number;
  totalQuestions: number;
  soundEnabled?: boolean;
  theme?: 'dark' | 'light';
  isDemo?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  roundSecondsLeft,
  totalRoundSeconds,
  currentQuestion,
  totalQuestions,
  soundEnabled = true,
  theme = 'dark',
  isDemo = false,
}) => {
  const isDark = theme === 'dark';
  const roundPercentage = Math.max(0, Math.min(100, (roundSecondsLeft / totalRoundSeconds) * 100));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const roundStrokeDashoffset = circumference - (roundPercentage / 100) * circumference;
  const isRoundUrgent = roundSecondsLeft <= 3;
  const isRoundWarning = roundSecondsLeft <= 5 && roundSecondsLeft > 3;

  const roundStrokeColor = isRoundUrgent
    ? '#EF4444' // red
    : isRoundWarning
    ? '#F59E0B' // amber
    : '#10B981'; // emerald

  return (
    <div className="relative flex flex-col items-center justify-center my-0 select-none">
      <div
        className={`relative flex items-center justify-center ${isDemo ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-24 h-24 sm:w-28 sm:h-28'} rounded-full transition-all ${
          isRoundUrgent
            ? 'bg-rose-500/15 border border-rose-500/40'
            : isRoundWarning
            ? 'bg-amber-500/15 border border-amber-500/30'
            : isDark
            ? 'bg-[#121722] border border-[#222C3E]'
            : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        {/* SVG Circular Timer */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background Track Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={isDark ? 'stroke-slate-800' : 'stroke-slate-200'}
            strokeWidth={isDemo ? "4" : "5"}
            fill="transparent"
          />
          {/* Animated Countdown Progress Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={roundStrokeColor}
            strokeWidth={isDemo ? "4" : "5"}
            strokeDasharray={circumference}
            strokeDashoffset={roundStrokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Timer Digits */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1">
            <Clock className={`w-3 h-3 sm:w-4 sm:h-4 ${isRoundUrgent ? 'text-rose-500' : isRoundWarning ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span
              className={`font-semibold tracking-tight leading-none ${isDemo ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'} transition-colors ${
                isRoundUrgent
                  ? 'text-rose-500 animate-pulse'
                  : isRoundWarning
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {roundSecondsLeft}s
            </span>
          </div>
          {!isDemo && (
            <span className="text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF] mt-1">
              ROUND TIME
            </span>
          )}
        </div>

        {soundEnabled && isRoundUrgent && (
          <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white rounded-full p-1">
            <Volume2 className="w-3 h-3" />
          </div>
        )}
      </div>
      
      {/* Question Progress Indicator - Hide in demo mode */}
      {!isDemo && (
        <div className={`mt-2 text-xs font-semibold ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Question {currentQuestion + 1} of {totalQuestions}
        </div>
      )}
    </div>
  );
};
