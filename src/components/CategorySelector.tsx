import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Play,
  Zap,
  Sparkles,
  Check,
  Flame,
  Trophy,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { QuizCategory, SpeedMode } from '../types';
import { CategoryTopicBadge, getCategoryTheme } from '../utils/categoryTheme';

interface CategorySelectorProps {
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId?: string | null;
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
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const activeSpeed = speedModes.find((s) => s.id === selectedSpeedModeId) || speedModes[0];

  // Map category ID to URL slug
  const categoryIdToSlug: Record<string, string> = {
    'basketball': 'basketball',
    'football': 'football',
    'general_knowledge': 'general-knowledge',
    'kenya': 'kenya',
    'world_cup': 'world-cup',
    'sports': 'sports',
    'tech': 'tech',
    'finance': 'finance',
    'geopolitics': 'geopolitics',
    'crypto': 'crypto',
    'politics': 'politics',
    'esports': 'esports',
    'entertainment': 'entertainment',
    'trending': 'trending',
  };

  // Handle category card click - navigate to category page
  const handleCategoryCardClick = (categoryId: string) => {
    const slug = categoryIdToSlug[categoryId] || categoryId;
    navigate(`/category/${slug}`);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.subtitle && cat.subtitle.toLowerCase().includes(q)) ||
      (cat.badge && cat.badge.toLowerCase().includes(q)) ||
      cat.questions.some((qu) => qu.question.toLowerCase().includes(q))
    );
  });

  const speedModeStyles: Record<
    string,
    { icon: any; color: string; bgSelected: string; borderSelected: string; badgeColor: string }
  > = {
    'speed_round': {
      icon: Zap,
      color: 'text-cyan-400',
      bgSelected: isDark ? 'bg-cyan-950/30' : 'bg-cyan-50',
      borderSelected: 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-500/20',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    },
    'pro_challenge': {
      icon: Flame,
      color: 'text-amber-400',
      bgSelected: isDark ? 'bg-amber-950/30' : 'bg-amber-50',
      borderSelected: 'border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    },
    'tournament': {
      icon: Trophy,
      color: 'text-purple-400',
      bgSelected: isDark ? 'bg-purple-950/30' : 'bg-purple-50',
      borderSelected: 'border-purple-400 ring-2 ring-purple-400/40 shadow-purple-500/20',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    },
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 font-sans">
      {/* 1. SPEED ENGINE MODE SELECTOR - REAL PRODUCTION UI */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isDark
            ? 'bg-[#0E131E] border-[#1F2737]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b ${
            isDark ? 'border-[#1F2737]' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark ? 'bg-[#151D2C] border-[#222E42] text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2
                className={`font-bold text-sm sm:text-base tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Speed Engine Mode
              </h2>
              <p
                className={`text-[11px] font-medium mt-0.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                12-Second countdown per question • Fast settlement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Real-Time M-Pesa Multipliers</span>
            </span>
          </div>
        </div>

        {/* Speed Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {speedModes.map((mode) => {
            const isSelected = mode.id === selectedSpeedModeId;
            const style = speedModeStyles[mode.id] || speedModeStyles['3min'];
            const IconComp = style.icon;

            return (
              <div
                key={mode.id}
                onClick={() => onSelectSpeedMode(mode.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? `${style.bgSelected} ${style.borderSelected} -translate-y-0.5 shadow-lg`
                    : isDark
                    ? 'bg-[#121927]/80 border-[#222E42] hover:border-slate-400 hover:bg-[#162032]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`font-black text-xs sm:text-sm flex items-center gap-2 ${
                      isSelected
                        ? isDark
                          ? 'text-white'
                          : 'text-slate-950'
                        : isDark
                        ? 'text-slate-200'
                        : 'text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark
                          ? 'bg-[#182338] text-slate-400'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    {mode.name}
                  </span>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider border ${
                      isSelected
                        ? isDark
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-slate-950 text-white border-slate-950'
                        : style.badgeColor
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>

                <p
                  className={`text-xs font-normal leading-relaxed ${
                    isSelected
                      ? isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {mode.description}
                </p>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-emerald-400" />
                      <span>{mode.questionsCount} Questions Live</span>
                    </span>
                    <span className="text-amber-400 font-mono">12s Pace</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CHOOSE QUIZ TOPICS & ARENAS */}
      <div
        className={`rounded-2xl p-4 sm:p-6 border transition-all ${
          isDark
            ? 'bg-[#0E131E] border-[#1F2737]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {/* Section Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b ${
            isDark ? 'border-[#1F2737]' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDark ? 'bg-[#151D2C] border-[#222E42] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Sparkles className="w-4.5 h-4.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`font-bold text-base sm:text-lg tracking-tight leading-none ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  Quiz Topics & Arenas
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-2.5 h-2.5" />
                  <span>SPEED LADDER ACTIVE</span>
                </span>
              </div>
              <p
                className={`text-xs font-medium mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Select your arena • Answer fast • Climb the 2X · 3X · 5X multiplier streak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#141d2d] border-[#222E42] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700 shadow-xs'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-emerald-400 font-black">{categories.length}</strong> Arenas
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar for Question Sets */}
        <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
          isDark
            ? 'bg-[#141d2d] border-[#222E42]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <Search className={`w-4.5 h-4.5 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question sets (e.g., Kenya, Football, Crypto, AI, Politics)..."
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-[#222E42] text-slate-400 hover:text-slate-200'
                  : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4-in-a-Row Vibrant Topic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5 relative z-10">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategoryId ? cat.id === selectedCategoryId : false;
            const themeInfo = getCategoryTheme(cat.id);
            const questionPool = cat.questions?.length || 10; // Use actual question count or default to 10

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? isDark
                      ? `${themeInfo.bgActiveDark} ${themeInfo.borderActive} -translate-y-1 shadow-xl ring-2 ring-emerald-400/50`
                      : `${themeInfo.bgActiveLight} border-slate-900 -translate-y-1 shadow-xl ring-2 ring-slate-900/40`
                    : isDark
                    ? 'bg-[#111726]/90 border-[#1f293d] hover:border-slate-400 hover:bg-[#151d2f] hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* ACTIVE SELECTION BADGE (Top Right) */}
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 bg-emerald-600 text-white border border-emerald-500">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Selected Arena</span>
                  </div>
                )}

                {/* Card Top: Topic Icon Tile & Name */}
                <div>
                  <div className="flex items-start gap-3.5 mb-3 mt-1">
                    {/* High-Grade Vector Icon Badge */}
                    <CategoryTopicBadge
                      categoryId={cat.id}
                      size="md"
                      animated={isSelected}
                    />

                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3
                        className={`font-black text-base sm:text-lg leading-tight truncate ${
                          isSelected
                            ? isDark
                              ? 'text-white'
                              : 'text-slate-950'
                            : isDark
                            ? 'text-slate-100 group-hover:text-emerald-400'
                            : 'text-slate-900 group-hover:text-emerald-600'
                        } transition-colors`}
                      >
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Topic Subtitle / Description */}
                  <p
                    className={`text-xs font-normal leading-relaxed mb-3.5 line-clamp-2 ${
                      isSelected
                        ? isDark
                          ? 'text-slate-200'
                          : 'text-slate-700'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {cat.subtitle || themeInfo.subtitle}
                  </p>
                </div>

                {/* Card Bottom: Multiplier & Launch Action Button */}
                <div className="space-y-2.5 pt-1">
                  {/* Multiplier / Stakes Banner */}
                  <div
                    className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-[11px] font-semibold transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-black/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : isDark
                        ? 'bg-[#0a0f19] border-[#1d2639] text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>Questions Available</span>
                    </span>

                    <span className="font-mono text-emerald-400 font-black">
                      {isSelected ? '5X PEAK MULTIPLIER' : '2X-5X MULTIPLIERS'}
                    </span>
                  </div>

                  {/* Play Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayCategory(cat.id);
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : isDark
                        ? 'bg-[#182338] border border-[#2e3e5c] text-white hover:bg-emerald-600 hover:border-emerald-500 hover:text-white'
                        : 'bg-slate-900 text-white hover:bg-emerald-600'
                    }`}
                  >
                    <span>Launch {cat.name} Arena</span>
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
