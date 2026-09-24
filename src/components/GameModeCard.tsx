import React from 'react';
import { Clock, Zap, Trophy, Flame, ArrowRight, HelpCircle } from 'lucide-react';
import { DifficultyBadge, DifficultyLevel } from './DifficultyBadge';

export interface GameModeInfo {
  id: string;
  name: string;
  badge: string;
  description: string;
  questionsCount: number;
  durationSeconds: number;
  difficulty: DifficultyLevel;
  rewardXP: number;
  maxMultiplier: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DEFAULT_GAME_MODES: GameModeInfo[] = [
  {
    id: 'speed_round',
    name: 'Speed Round',
    badge: '12s Pace',
    description: 'Fast-paced lightning trivia with rapid multipliers for quick thinkers.',
    questionsCount: 6,
    durationSeconds: 12,
    difficulty: 'MEDIUM',
    rewardXP: 600,
    maxMultiplier: '5x',
    icon: Zap,
  },
  {
    id: 'pro_challenge',
    name: 'Pro Challenge',
    badge: 'High Stakes',
    description: 'Extended gauntlet covering in-depth questions for seasoned trivia players.',
    questionsCount: 10,
    durationSeconds: 12,
    difficulty: 'HARD',
    rewardXP: 1500,
    maxMultiplier: '10x',
    icon: Flame,
  },
  {
    id: 'tournament',
    name: 'Tournament',
    badge: 'Championship',
    description: 'Elite competition across all categories to top Kenya’s weekly leaderboard.',
    questionsCount: 15,
    durationSeconds: 10,
    difficulty: 'EXPERT',
    rewardXP: 3000,
    maxMultiplier: '25x',
    icon: Trophy,
  },
];

interface GameModeCardProps {
  mode: GameModeInfo;
  isSelected?: boolean;
  onSelect?: () => void;
  onStart?: () => void;
  className?: string;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({
  mode,
  isSelected = false,
  onSelect,
  onStart,
  className = '',
}) => {
  const Icon = mode.icon;

  return (
    <div
      onClick={onSelect}
      className={`triv-card p-4 flex flex-col justify-between transition-all cursor-pointer ${
        isSelected
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20 shadow-xs'
          : 'hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
      } ${className}`}
    >
      <div>
        {/* Header: Mode Icon + Name + Difficulty */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--border)] ${
              isSelected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--accent-text)]'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-none">
                {mode.name}
              </h3>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                {mode.badge}
              </span>
            </div>
          </div>

          <DifficultyBadge difficulty={mode.difficulty} />
        </div>

        {/* Description */}
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2">
          {mode.description}
        </p>

        {/* Compact Statistics Grid */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-3 text-center">
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Questions</div>
            <div className="text-xs font-bold font-mono text-[var(--text-primary)]">{mode.questionsCount} Qs</div>
          </div>
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Timer</div>
            <div className="text-xs font-bold font-mono text-[var(--text-primary)]">{mode.durationSeconds}s / Q</div>
          </div>
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Reward</div>
            <div className="text-xs font-bold font-mono text-[var(--success)]">+{mode.rewardXP} XP</div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onStart) onStart();
          else if (onSelect) onSelect();
        }}
        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
          isSelected
            ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white'
            : 'bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-primary)] border border-[var(--border)]'
        }`}
      >
        <span>Play {mode.name}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
