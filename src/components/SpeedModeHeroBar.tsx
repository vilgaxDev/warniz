import React from 'react';
import { Zap, Clock, Flame, Trophy, Play, Check } from 'lucide-react';
import { SpeedMode } from '../types';
import { DEFAULT_GAME_MODES, GameModeInfo } from './GameModeCard';

interface SpeedModeHeroBarProps {
  speedModes?: SpeedMode[];
  selectedSpeedModeId: string;
  onSelectSpeedMode: (speedModeId: string) => void;
  onQuickPlay?: (speedModeId: string) => void;
  theme?: 'dark' | 'light';
}

export const SpeedModeHeroBar: React.FC<SpeedModeHeroBarProps> = ({
  selectedSpeedModeId,
  onSelectSpeedMode,
  onQuickPlay,
}) => {
  return (
    <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-5 shadow-sm space-y-3.5 select-none relative overflow-hidden">
      {/* Background subtle energetic accent glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-[var(--accent)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] tracking-tight">
                Game Speed Mode
              </h2>
              <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)] uppercase tracking-wider">
                ⚡ MULTIPLIER BOOST
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-medium">
              Pick your question countdown pace to unlock higher multiplier payouts
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--surface)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span>Real-time Clock</span>
        </div>
      </div>

      {/* Speed Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {DEFAULT_GAME_MODES.map((mode) => {
          const isSelected = selectedSpeedModeId === mode.id;
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectSpeedMode(mode.id)}
              className={`relative rounded-xl p-3 sm:p-3.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/40'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {/* Top Row: Icon + Name + Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                        : 'bg-[var(--card)] text-[var(--accent-text)] border-[var(--border)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[var(--text-primary)] leading-tight">
                      {mode.name}
                    </h3>
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">
                      {mode.badge}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--card)] text-[var(--accent-text)] border border-[var(--border)]'
                  }`}
                >
                  {mode.maxMultiplier}
                </span>
              </div>

              {/* Middle Row: Duration & Questions count specs */}
              <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)] pt-1 border-t border-[var(--border)]/60">
                <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                  <Clock className="w-3 h-3 text-[var(--accent-text)]" />
                  {mode.durationSeconds}s / question
                </span>
                <span>{mode.questionsCount} Questions</span>
              </div>

              {/* Bottom Quick Play / Selected State */}
              <div className="flex items-center justify-between pt-1">
                {isSelected ? (
                  <span className="text-[11px] font-black text-[var(--accent-text)] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Mode Active</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                    Tap to Select
                  </span>
                )}

                {onQuickPlay && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSpeedMode(mode.id);
                      onQuickPlay(mode.id);
                    }}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs'
                        : 'bg-[var(--card)] hover:bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]'
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Play</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
