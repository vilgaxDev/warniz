import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Play,
  Zap,
  Flame,
  Trophy,
  ArrowRight,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { getCategoryLucideIcon } from './CategoryNav';
import { GameModeCard, DEFAULT_GAME_MODES } from './GameModeCard';

interface CategorySelectorProps {
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId?: string | null;
  selectedSpeedModeId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedModeId: string) => void;
  onPlayCategory: (categoryId: string) => void;
  theme?: 'dark' | 'light';
  hideGameModes?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  selectedSpeedModeId,
  onSelectCategory,
  onSelectSpeedMode,
  onPlayCategory,
  hideGameModes = false,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryIdToSlug: Record<string, string> = {
    basketball: 'basketball',
    football: 'football',
    general_knowledge: 'general-knowledge',
    kenya: 'kenya',
    world_cup: 'world-cup',
    sports: 'sports',
    tech: 'tech',
    finance: 'finance',
    geopolitics: 'geopolitics',
    crypto: 'crypto',
    politics: 'politics',
    esports: 'esports',
    entertainment: 'entertainment',
    trending: 'trending',
  };

  const handleCategoryCardClick = (categoryId: string) => {
    const slug = categoryIdToSlug[categoryId] || categoryId;
    navigate(`/category/${slug}`);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.subtitle && cat.subtitle.toLowerCase().includes(q)) ||
      (cat.badge && cat.badge.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-6 font-sans select-none" id="categories-section">
      {/* 1. GAME MODES SECTION (Section 10 in design spec) */}
      {!hideGameModes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-text)]" />
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                Game Modes
              </h2>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Instant Payouts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DEFAULT_GAME_MODES.map((mode) => {
              const isSelected = selectedSpeedModeId === mode.id;

              return (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  isSelected={isSelected}
                  onSelect={() => onSelectSpeedMode(mode.id)}
                  onStart={() => onPlayCategory(selectedCategoryId || 'kenya')}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CATEGORIES GRID SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent-text)]" />
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Trivia Arenas
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
              {categories.length} Available
            </span>
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-8 pr-7 py-1 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid (2 to 4 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const CategoryIcon = getCategoryLucideIcon(cat.id || cat.name);
            const questionPool = cat.questionsCount || cat.questions?.length || 10;
            const difficulty = cat.badge?.toLowerCase().includes('hard') ? 'HARD' : 'MEDIUM';

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`triv-card triv-card-interactive p-4 flex flex-col justify-between cursor-pointer ${
                  isSelected ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                        {cat.name}
                      </span>
                    </div>

                    <DifficultyBadge difficulty={difficulty} />
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                    {cat.subtitle || 'Speed trivia arena with instant multiplier payouts.'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded-md bg-[var(--surface)] border border-[var(--border)] mb-3">
                    <span className="text-[var(--text-muted)] font-mono">{questionPool} Questions</span>
                    <span className="font-mono font-bold text-[var(--success)]">{cat.pool || 'KES 25,000 Pool'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayCategory(cat.id);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Play Arena</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryCardClick(cat.id);
                    }}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="View details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
