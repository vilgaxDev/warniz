import React from 'react';
import { Clock, Play, Zap, Sparkles, Check, Flame } from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { SQUARE_CATEGORY_ITEMS } from './SquareCategoryFilter';

interface CategorySelectorProps {
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId: string;
  selectedSpeedModeId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedModeId: string) => void;
  onPlayCategory: (categoryId: string) => void;
  theme?: 'dark' | 'light';
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  speedModes,
  selectedCategoryId,
  selectedSpeedModeId,
  onSelectCategory,
  onSelectSpeedMode,
  onPlayCategory,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const activeSpeed = speedModes.find((s) => s.id === selectedSpeedModeId) || speedModes[0];

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. Speed Engine Mode Selector */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
        isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between gap-2 mb-4 pb-3 border-b ${
          isDark ? 'border-[#222C3E]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F55129]" />
            <h2 className={`font-bold text-sm sm:text-base tracking-tight ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              Speed Engine Mode
            </h2>
          </div>
          <span className={`text-[11px] font-medium uppercase tracking-wider ${
            isDark ? 'text-[#94A3B8]' : 'text-slate-500'
          }`}>
            12s Fast Settlement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {speedModes.map((mode) => {
            const isSelected = mode.id === selectedSpeedModeId;
            return (
              <div
                key={mode.id}
                onClick={() => onSelectSpeedMode(mode.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? isDark
                      ? 'bg-[#182030] border-[#F55129] ring-2 ring-[#F55129]/30'
                      : 'bg-orange-50/80 border-[#F55129] ring-2 ring-orange-400/30'
                    : isDark
                      ? 'bg-[#182030]/60 border-[#222C3E] hover:border-[#F55129]/40 hover:bg-[#182030]'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`font-semibold text-xs sm:text-sm flex items-center gap-1.5 ${
                    isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                  }`}>
                    <Zap className="w-3.5 h-3.5 text-[#E28C6D]" />
                    {mode.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#F55129] text-white'
                      : isDark
                        ? 'bg-[#121722] border border-[#222C3E] text-[#94A3B8]'
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {mode.badge}
                  </span>
                </div>
                <p className={`text-xs font-normal leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-slate-600'
                }`}>
                  {mode.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Choose Quiz Category */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
        isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className={`flex items-center justify-between gap-2 mb-4 pb-3 border-b ${
          isDark ? 'border-[#222C3E]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F55129]" />
            <h2 className={`font-bold text-sm sm:text-base tracking-tight ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              Quiz Topics & Arenas
            </h2>
          </div>
          <span className={`text-[11px] font-medium uppercase tracking-wider ${
            isDark ? 'text-[#94A3B8]' : 'text-slate-500'
          }`}>
            {categories.length} Categories Available
          </span>
        </div>

        {/* Categories Grid (4 in a row on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            const squareMeta = SQUARE_CATEGORY_ITEMS.find((s) => s.id === cat.id);
            const gradient = (squareMeta && squareMeta.gradient) ? (isDark ? squareMeta.gradient : (squareMeta.lightGradient || squareMeta.gradient)) : 'from-slate-700 to-slate-900';
            const badgeText = squareMeta?.badge || cat.badge || 'LIVE';

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? isDark
                      ? 'bg-[#182030] border-[#F55129] ring-2 ring-[#F55129]/40 shadow-lg -translate-y-0.5'
                      : 'bg-orange-50/90 border-[#F55129] ring-2 ring-orange-400/40 shadow-lg -translate-y-0.5'
                    : isDark
                      ? 'bg-[#182030]/60 border-[#222C3E] hover:border-[#F55129]/40 hover:bg-[#182030]'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider bg-[#F55129] text-white shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>SELECTED</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {/* Square App Icon Tile */}
                    <div className={`w-14 h-14 rounded-2xl relative flex items-center justify-center shrink-0 shadow-md overflow-hidden group-hover:scale-105 transition-transform ${
                      isSelected ? 'ring-2 ring-[#F55129]' : ''
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                      
                      {badgeText && (
                        <span className="absolute top-1 right-1 text-[8px] font-black uppercase px-1 py-0.2 rounded-sm bg-black/40 backdrop-blur-xs text-white border border-white/20 leading-none">
                          {badgeText}
                        </span>
                      )}
                      
                      <span className="text-2xl filter drop-shadow-md select-none">
                        {cat.icon}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Category Title & Description */}
                      <h3 className={`font-bold text-sm sm:text-base leading-tight truncate ${
                        isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                      }`}>
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-[#22C55E] font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-[#22C55E]" />
                        <span>{cat.questions?.length || 10} Questions Pool</span>
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs font-normal leading-relaxed mb-3 line-clamp-2 ${
                    isDark ? 'text-[#94A3B8]' : 'text-slate-500'
                  }`}>
                    {cat.subtitle || `Speed trivia arena for ${cat.name} with instant rewards`}
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="space-y-2 pt-1">
                  <div className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-[11px] ${
                    isDark ? 'bg-[#121722] border-[#222C3E] text-[#94A3B8]' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E28C6D]" />
                      <span>{activeSpeed.questionsCount} Qs</span>
                    </span>
                    <span className="font-semibold text-[#22C55E]">12s Countdown</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayCategory(cat.id);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-[#F55129] hover:bg-[#DB3211] active:bg-[#BA391F] text-white'
                        : isDark
                          ? 'bg-[#121722] border border-[#222C3E] text-[#F8FAFC] hover:border-[#F55129]/40 hover:bg-[#182030]'
                          : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>Launch {cat.name} Quiz</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
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
