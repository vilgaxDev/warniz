import React from 'react';
import { HeroSlider } from './HeroSlider';
import { MarketSlider, MarketItem } from './MarketSlider';
import { CategorySelector } from './CategorySelector';
import { PayoutsSideBar } from './PayoutsSideBar';
import { SQUARE_CATEGORY_ITEMS } from './SquareCategoryFilter';
import { QuizCategory, SpeedMode } from '../types';
import {
  Flame, Trophy, Zap, Clock, ChevronRight, X, Sparkles, Filter
} from 'lucide-react';

interface HomePageProps {
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId: string;
  selectedSpeedModeId: string;
  selectedSubcategory?: string;
  onSelectSubcategory?: (subId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedModeId: string) => void;
  onPlayCategory: (categoryId: string) => void;
  onOpenLeaderboard: () => void;
  onOpenDailyRewards?: () => void;
  currentUserWinnings: number;
  currentUserStreak: number;
  theme?: 'dark' | 'light';
  bannerSlides?: any[];
}

const TRENDING_QUIZZES: MarketItem[] = [];
const SPORTS_QUIZZES: MarketItem[] = [];

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  speedModes,
  selectedCategoryId,
  selectedSpeedModeId,
  selectedSubcategory,
  onSelectSubcategory,
  onSelectCategory,
  onSelectSpeedMode,
  onPlayCategory,
  onOpenLeaderboard,
  onOpenDailyRewards,
  currentUserWinnings,
  currentUserStreak,
  theme = 'dark',
  bannerSlides,
}) => {
  const isDark = theme === 'dark';
  const activeSubcategoryMeta = SQUARE_CATEGORY_ITEMS.find((s) => s.id === selectedSubcategory);
  const isFiltered = Boolean(selectedSubcategory && selectedSubcategory !== 'all');

  return (
    <div className="w-full space-y-6 sm:space-y-8 font-sans max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Active Filter Indicator Bar */}
      {isFiltered && activeSubcategoryMeta && onSelectSubcategory && (
        <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
          isDark
            ? 'bg-[#182030] border-[#222C3E]'
            : 'bg-emerald-50/80 border-emerald-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-xl shadow-xs shrink-0 text-white">
              {activeSubcategoryMeta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  Active Filter
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} Matching
                </span>
              </div>
              <h4 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeSubcategoryMeta.name} Trivia Arena
              </h4>
            </div>
          </div>

          <button
            onClick={() => onSelectSubcategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isDark
                ? 'bg-[#121722] hover:bg-[#222C3E] text-slate-300 hover:text-white border border-[#222C3E]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset to All</span>
          </button>
        </div>
      )}

      {/* 2-COLUMN MAIN LAYOUT: MAIN QUIZ ARENA + PAYOUTS SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* MAIN COLUMN (3 COLS ON XL) */}
        <div className="xl:col-span-3 space-y-6 sm:space-y-8">
          {/* 1. HERO FEATURED CAROUSEL SLIDER */}
          <HeroSlider onPlayCategory={onPlayCategory} theme={theme} slides={bannerSlides} />

          {/* 3. HORIZONTAL QUIZ CHALLENGE SLIDERS */}
          <MarketSlider
            title="Featured Quiz Challenges"
            subtitle="High-stakes speed trivia with live prize pools"
            icon={<Flame className="w-4.5 h-4.5 fill-rose-500 text-rose-500" />}
            markets={TRENDING_QUIZZES}
            onPlayMarket={onPlayCategory}
            theme={theme}
          />

          <MarketSlider
            title="Sports & Premier League Tournaments"
            subtitle="Test your football history, records, and club knowledge"
            icon={<Trophy className="w-4.5 h-4.5 text-amber-500" />}
            markets={SPORTS_QUIZZES}
            onPlayMarket={onPlayCategory}
            theme={theme}
          />

          {/* 4. SPEED ENGINE & 4-IN-A-ROW CATEGORY CARDS */}
          <CategorySelector
            categories={categories}
            speedModes={speedModes}
            selectedCategoryId={selectedCategoryId}
            selectedSpeedModeId={selectedSpeedModeId}
            onSelectCategory={onSelectCategory}
            onSelectSpeedMode={onSelectSpeedMode}
            onPlayCategory={onPlayCategory}
            theme={theme}
          />
        </div>

        {/* SIDEBAR COLUMN (1 COL ON XL): LIVE PAYOUTS BAR WITH HIDDEN NAME & PHONE */}
        <div className="xl:col-span-1 sticky top-20">
          <PayoutsSideBar theme={theme} />
        </div>
      </div>
    </div>
  );
};
