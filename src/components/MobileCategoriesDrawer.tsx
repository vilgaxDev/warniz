import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, Sparkles, Clock, Play, Zap, Check, Flame, ArrowRight, Layers
} from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { CategoryTopicBadge, getCategoryTheme } from '../utils/categoryTheme';

interface MobileCategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId?: string | null;
  selectedSpeedModeId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedModeId: string) => void;
  onPlayCategory: (categoryId: string) => void;
  theme: 'dark' | 'light';
}

export const MobileCategoriesDrawer: React.FC<MobileCategoriesDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  speedModes,
  selectedCategoryId,
  selectedSpeedModeId,
  onSelectCategory,
  onSelectSpeedMode,
  onPlayCategory,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeSpeed = speedModes.find((s) => s.id === selectedSpeedModeId) || speedModes[0];

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Right Drawer Container - Modern & Lively for Phones */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-[88vw] max-w-[360px] h-full min-h-0 flex flex-col shadow-2xl border-l overflow-hidden bg-[var(--card)] text-[var(--text-primary)] border-[var(--border)]"
          >
            {/* 1. TOP HEADER */}
            <div className="p-3 border-b flex items-center justify-between gap-2 border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xs sm:text-sm tracking-tight leading-none text-[var(--text-primary)]">
                    Quiz Topics
                  </h2>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {categories.length} Arenas Active
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close Categories Menu"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SEARCH & SPEED MODE FILTER */}
            <div className="p-3 border-b space-y-2.5 border-[var(--border)] bg-[var(--card)]">
              {/* Category Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter topics & arenas..."
                  className="w-full pl-8 pr-6 py-1.5 rounded-lg text-xs transition-colors outline-none bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Speed Mode Selector Pills */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[var(--accent-text)]" />
                    <span>Speed Mode</span>
                  </span>
                  <span className="text-amber-500 font-mono font-extrabold">{activeSpeed?.durationSeconds ?? 15}s / Question</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {speedModes.map((mode) => {
                    const isSelected = mode.id === selectedSpeedModeId;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => onSelectSpeedMode(mode.id)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer truncate ${
                          isSelected
                            ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-xs'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                        }`}
                      >
                        {mode.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. SCROLLABLE CATEGORIES LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 space-y-2 [scrollbar-width:thin]">
              {filteredCategories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                const themeInfo = getCategoryTheme(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Category Icon Badge */}
                      <CategoryTopicBadge
                        categoryId={cat.id}
                        size="sm"
                        animated={isSelected}
                      />

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className={`font-bold text-xs truncate ${
                            isSelected ? 'text-[var(--accent-text)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {cat.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[var(--accent)] text-white shrink-0">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] truncate mt-0.5 text-[var(--text-muted)]">
                          {cat.subtitle || themeInfo.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls for Category */}
                    <div className="mt-2 pt-1.5 border-t border-[var(--border)] flex items-center justify-between gap-1.5">
                      <span className="text-[10px] flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>{activeSpeed?.questionsCount ?? 0}Q • {activeSpeed?.durationSeconds ?? 15}s</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(cat.id);
                          onPlayCategory(cat.id);
                          onClose();
                        }}
                        className="py-1 px-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                      >
                        <span>Play</span>
                        <Play className="w-2.5 h-2.5 fill-white" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-[var(--text-muted)]">No categories matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-1.5 text-xs font-bold text-[var(--accent-text)] hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* 4. BOTTOM DIRECT LAUNCH BUTTON */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
              <button
                onClick={() => {
                  onPlayCategory(selectedCategoryId);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:scale-95 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Quiz Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
