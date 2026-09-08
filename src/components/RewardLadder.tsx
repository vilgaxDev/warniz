import React, { useRef, useEffect } from 'react';
import { Trophy, Check } from 'lucide-react';
import { RewardStep } from '../types';
import { REWARD_LADDER } from '../data/quizData';

interface RewardLadderProps {
  currentQuestionIndex: number;
  streakCount: number;
  totalQuestions?: number;
  rewardLadder?: RewardStep[];
  theme?: 'dark' | 'light';
}

export const RewardLadder: React.FC<RewardLadderProps> = ({
  currentQuestionIndex,
  streakCount,
  totalQuestions = 6,
  rewardLadder = REWARD_LADDER,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const activeSteps = rewardLadder.slice(0, totalQuestions);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active step into view on mobile so it's always centered and visible
  useEffect(() => {
    if (activeStepRef.current && containerRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentQuestionIndex]);

  return (
    <div className={`w-full rounded-xl p-2.5 sm:p-3 border my-1.5 sm:my-2 font-sans transition-colors ${
      isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2 px-1 gap-2">
        <div className={`flex items-center gap-1.5 text-xs font-semibold truncate ${
          isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
        }`}>
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="tracking-tight whitespace-nowrap">
            <span className="hidden sm:inline">Reward Tier </span>Pipeline
          </span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium whitespace-nowrap ${
            isDark ? 'bg-[#182030] text-slate-300 border border-[#222C3E]' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            Q{Math.min(currentQuestionIndex + 1, totalQuestions)}/{totalQuestions}
          </span>
        </div>

        {/* Streak Multipliers */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className={`text-[10px] uppercase tracking-wider font-extrabold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            BOOST:
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-black transition-all ${
            streakCount >= 2
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-105'
              : isDark
                ? 'bg-[#182030] text-slate-500 border-[#222C3E]'
                : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            2x
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-black transition-all ${
            streakCount >= 3
              ? 'bg-orange-500 text-white border-orange-400 shadow-xs scale-105'
              : isDark
                ? 'bg-[#182030] text-slate-500 border-[#222C3E]'
                : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            3x
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-black transition-all ${
            streakCount >= 5
              ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-xs scale-105 ring-1 ring-emerald-400/40'
              : isDark
                ? 'bg-[#182030] text-slate-500 border-[#222C3E]'
                : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}>
            5x
          </span>
        </div>
      </div>

      {/* Ladder Steps Bar - Horizontal scrollable ribbon on mobile with snap, grid on desktop */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex sm:grid gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-1 sm:pb-0 scroll-smooth snap-x touch-pan-x"
          style={{
            gridTemplateColumns: `repeat(${activeSteps.length}, minmax(0, 1fr))`,
          }}
        >
          {activeSteps.map((step, idx) => {
            const isPassed = idx < currentQuestionIndex;
            const isCurrent = idx === currentQuestionIndex;

            return (
              <div
                key={step.questionNumber}
                ref={isCurrent ? activeStepRef : null}
                className={`shrink-0 sm:shrink min-w-[76px] sm:min-w-0 flex-1 snap-center relative flex flex-col items-center justify-center py-2 px-2.5 sm:p-2 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? isDark
                      ? 'bg-[#1E293B] border-slate-300 text-white ring-1 ring-slate-400/40 shadow-sm scale-[1.02]'
                      : 'bg-slate-900 border-slate-900 text-white ring-1 ring-slate-400/30 shadow-sm scale-[1.02]'
                    : isPassed
                    ? isDark
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isDark
                      ? 'bg-[#182030] border-[#222C3E] text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  <span className={`text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                    isCurrent
                      ? isDark ? 'text-slate-200 font-bold' : 'text-slate-300 font-bold'
                      : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Q{step.questionNumber}
                  </span>
                </div>

                <div className={`text-xs font-bold whitespace-nowrap ${
                  isCurrent
                    ? 'text-white'
                    : isPassed
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                    : isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  KSh {step.rewardKsh}
                </div>

                {isPassed && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
