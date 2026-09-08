import React from 'react';
import { Volume2 } from 'lucide-react';

interface QuizTimerProps {
  secondsLeft: number;
  totalSeconds?: number;
  soundEnabled?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  secondsLeft,
  totalSeconds = 12,
  soundEnabled = true,
}) => {
  const percentage = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isUrgent = secondsLeft <= 3;
  const isWarning = secondsLeft <= 5 && secondsLeft > 3;

  const strokeColor = isUrgent
    ? '#EF4444' // red
    : isWarning
    ? '#F55129' // bright orange
    : '#22C55E'; // green

  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none">
      <div
        className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all ${
          isUrgent
            ? 'bg-[#EF4444]/15 border border-[#EF4444]/40'
            : isWarning
            ? 'bg-[#F55129]/15 border border-[#F55129]/30'
            : 'bg-[#181513] border border-[#292524]'
        }`}
      >
        {/* SVG Circular Timer */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background Track Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-[#292524]"
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
                ? 'text-[#EF4444] animate-pulse'
                : isWarning
                ? 'text-[#F55129]'
                : 'text-[#22C55E]'
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

