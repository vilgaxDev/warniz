import React from 'react';
import { Trophy, Check } from 'lucide-react';
import { RewardStep } from '../types';
import { REWARD_LADDER } from '../data/quizData';

interface RewardLadderProps {
  currentQuestionIndex: number;
  streakCount: number;
  totalQuestions?: number;
  rewardLadder?: RewardStep[];
}

export const RewardLadder: React.FC<RewardLadderProps> = ({
  currentQuestionIndex,
  streakCount,
  totalQuestions = 6,
  rewardLadder = REWARD_LADDER,
}) => {
  const activeSteps = rewardLadder.slice(0, totalQuestions);

  return (
    <div className="w-full bg-[#12100F] rounded-xl p-3 border border-[#292524] my-2 font-sans">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F5F5]">
          <Trophy className="w-3.5 h-3.5 text-[#E28C6D]" />
          <span className="tracking-tight">Reward Tier Pipeline</span>
        </div>

        {/* Streak Multipliers */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold">MULT:</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-semibold ${
            streakCount >= 2 ? 'bg-[#F55129]/20 text-[#F55129] border-[#F55129]/40' : 'bg-[#181513] text-[#A3A3A3] border-[#292524]'
          }`}>
            2x
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-semibold ${
            streakCount >= 3 ? 'bg-[#F55129]/20 text-[#F55129] border-[#F55129]/40' : 'bg-[#181513] text-[#A3A3A3] border-[#292524]'
          }`}>
            3x
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-semibold ${
            streakCount >= 5 ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40' : 'bg-[#181513] text-[#A3A3A3] border-[#292524]'
          }`}>
            5x
          </span>
        </div>
      </div>

      {/* Ladder Steps Bar */}
      <div
        className="grid gap-1.5"
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
              className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border text-center transition-colors ${
                isCurrent
                  ? 'bg-[#F55129]/20 border-[#F55129] text-[#F5F5F5] ring-2 ring-[#F55129]/30'
                  : isPassed
                  ? 'bg-[#22C55E]/15 border-[#22C55E]/60 text-[#22C55E]'
                  : 'bg-[#181513] border-[#292524] text-[#9CA3AF]'
              }`}
            >
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] mb-0.5 font-semibold">
                Q{step.questionNumber}
              </div>
              <div className={`text-[11px] sm:text-xs font-semibold ${
                isCurrent
                  ? 'text-[#F5F5F5]'
                  : isPassed
                  ? 'text-[#22C55E]'
                  : 'text-[#A3A3A3]'
              }`}>
                KSh {step.rewardKsh}
              </div>
              {isPassed && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22C55E] text-slate-950 flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
