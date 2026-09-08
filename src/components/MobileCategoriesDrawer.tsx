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
  selectedCategoryId: string;
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

          {/* Right Drawer Container - Ultra-Compact & Slim for Phones */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative z-10 w-[62%] max-w-[225px] h-full flex flex-col shadow-2xl border-l overflow-hidden ${
              isDark
                ? 'bg-[#080c10] black-net text-slate-100 border-emerald-950/60'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* 1. TOP HEADER */}
            <div className={`p-3 border-b flex items-center justify-between gap-2 ${
              isDark ? 'border-white/5 bg-[#0d1219]/90' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xs tracking-tight leading-none">
                    Quiz Topics
                  </h2>
                  <div className={`text-[9px] font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {categories.length} Categories
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close Categories Menu"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-slate-200 border-slate-300 text-slate-700 hover:text-black'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. SEARCH & SPEED MODE FILTER */}
            <div className={`p-2.5 border-b space-y-2 ${
              isDark ? 'border-white/5 bg-[#090d14]/80' : 'border-slate-100 bg-slate-50/70'
            }`}>
              {/* Category Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3 h-3" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter topics..."
                  className={`w-full pl-7 pr-6 py-1.5 rounded-lg text-xs transition-colors outline-none ${
                    isDark
                      ? 'bg-[#121926] border border-white/10 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Speed Mode Selector Pills */}
              <div>
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                  <span>Speed Mode</span>
                  <span className="text-amber-400 font-mono">12s / Q</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {speedModes.map((mode) => {
                    const isSelected = mode.id === selectedSpeedModeId;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => onSelectSpeedMode(mode.id)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer truncate ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                            : isDark
                              ? 'bg-[#121926] border-white/5 text-slate-300 hover:border-emerald-700/50'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {filteredCategories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                const themeInfo = getCategoryTheme(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? isDark
                          ? `${themeInfo.bgActiveDark} ${themeInfo.borderActive} ring-1 ring-emerald-400/50 shadow-md`
                          : `${themeInfo.bgActiveLight} border-slate-900 ring-1 ring-slate-900/30 shadow-md`
                        : isDark
                          ? 'bg-[#101624] border-[#1e283c] hover:border-slate-400 hover:bg-[#151d2f]'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
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
                          <h3 className={`font-black text-xs truncate ${
                            isSelected ? (isDark ? 'text-white' : 'text-slate-950') : (isDark ? 'text-slate-100' : 'text-slate-900')
                          }`}>
                            {cat.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-xs shrink-0">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] truncate mt-0.5 ${isSelected ? (isDark ? 'text-slate-300' : 'text-slate-700') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                          {cat.subtitle || themeInfo.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls for Category */}
                    <div className="mt-2 pt-1.5 border-t border-slate-800/40 flex items-center justify-between gap-1.5">
                      <span className={`text-[9px] flex items-center gap-1 font-semibold ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        <span>{activeSpeed.questionsCount}Q • 12s</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(cat.id);
                          onPlayCategory(cat.id);
                          onClose();
                        }}
                        className="py-1 px-2 rounded-md bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                      >
                        <span>Play</span>
                        <Play className="w-2 h-2 fill-white" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCategories.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">No categories matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-1 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* 4. BOTTOM DIRECT LAUNCH BUTTON */}
            <div className={`p-2.5 border-t ${
              isDark ? 'border-white/5 bg-[#0d1219]' : 'border-slate-100 bg-slate-50'
            }`}>
              <button
                onClick={() => {
                  onPlayCategory(selectedCategoryId);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-emerald-300 animate-blink-play"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
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
