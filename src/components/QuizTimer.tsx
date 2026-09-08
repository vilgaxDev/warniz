import React from 'react';
import { Volume2 } from 'lucide-react';

interface QuizTimerProps {
  secondsLeft: number;
  totalSeconds?: number;
  soundEnabled?: boolean;
  theme?: 'dark' | 'light';
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  secondsLeft,
  totalSeconds = 12,
  soundEnabled = true,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const percentage = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isUrgent = secondsLeft <= 3;
  const isWarning = secondsLeft <= 5 && secondsLeft > 3;

  const strokeColor = isUrgent
    ? '#EF4444' // red
    : isWarning
    ? '#F59E0B' // amber
    : '#10B981'; // emerald

  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none">
      <div
        className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all ${
          isUrgent
            ? 'bg-rose-500/15 border border-rose-500/40'
            : isWarning
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
            strokeWidth="5"
            fill="transparent"
          />
          {/* Animated Countdown Progress Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={strokeColor}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Timer Digits */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`font-semibold tracking-tight leading-none text-2xl sm:text-3xl transition-colors ${
              isUrgent
                ? 'text-rose-500 animate-pulse'
                : isWarning
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}
          >
            {secondsLeft}s
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF] mt-1">
            REMAINING
          </span>
        </div>

        {soundEnabled && isUrgent && (
          <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white rounded-full p-1">
            <Volume2 className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );
};

