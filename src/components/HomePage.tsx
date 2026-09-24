import React from 'react';
import { HeroSlider } from './HeroSlider';
import { MarketSlider, MarketItem } from './MarketSlider';
import { CategorySelector } from './CategorySelector';
import { PayoutsSideBar } from './PayoutsSideBar';
import { QuizCategory, SpeedMode } from '../types';
import {
  Flame, Trophy, Zap, Clock, ChevronRight, X, Sparkles, Filter
} from 'lucide-react';

interface HomePageProps {
  categories: QuizCategory[];
  speedModes: SpeedMode[];
  selectedCategoryId?: string | null;
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
  const activeCategoryMeta = categories.find((c) => c.id === selectedCategoryId);
  const isFiltered = Boolean(selectedCategoryId && selectedCategoryId !== 'all');

  return (
    <div className="w-full space-y-6 sm:space-y-8 font-sans max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Active Filter Indicator Bar */}
      {isFiltered && activeCategoryMeta && onSelectCategory && (
        <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
          isDark
            ? 'bg-[#182030] border-[#222C3E]'
            : 'bg-emerald-50/80 border-emerald-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl shadow-2xs shrink-0 text-white">
              {activeCategoryMeta.icon}
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
                {activeCategoryMeta.name} Trivia Arena
              </h4>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* MAIN COLUMN (2 COLS ON LG, 3 COLS ON XL) */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6 sm:space-y-8">
          {/* 1. HERO FEATURED CAROUSEL SLIDER */}
          <HeroSlider onPlayCategory={onPlayCategory} theme={theme} slides={bannerSlides} />

          {/* 2. HORIZONTAL QUIZ CHALLENGE SLIDERS */}
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

          {/* 3. SPEED ENGINE & 4-IN-A-ROW CATEGORY CARDS */}
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

        {/* SIDEBAR COLUMN (1 COL ON LG/XL, FULL WIDTH ON MOBILE) */}
        <div className="lg:col-span-1 xl:col-span-1 w-full">
          <PayoutsSideBar theme={theme} />
        </div>
      </div>
    </div>
  );
};
