import React from 'react';
import { HeroSlider } from './HeroSlider';
import { MarketSlider, MarketItem } from './MarketSlider';
import { CategorySelector } from './CategorySelector';
import { SpeedModeHeroBar } from './SpeedModeHeroBar';
import { CategorySidebar } from './CategorySidebar';
import { PayoutsSideBar } from './PayoutsSideBar';
import { Leaderboard } from './Leaderboard';
import { QuizCategory, SpeedMode } from '../types';
import { Flame, Trophy, X } from 'lucide-react';

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

const TRENDING_QUIZZES: MarketItem[] = [
  {
    id: 't-1',
    categoryId: 'kenya',
    categoryName: 'Kenya',
    title: 'Kenya Geography & Independence Landmarks',
    pool: 'KES 75,000 Pool',
    endsIn: '4h 12m',
    participants: 1420,
    badge: 'TRENDING',
  },
  {
    id: 't-2',
    categoryId: 'tech',
    categoryName: 'Tech',
    title: 'Generative AI & Modern Silicon Architecture',
    pool: 'KES 50,000 Pool',
    endsIn: '6h 30m',
    participants: 980,
    badge: 'HOT',
  },
  {
    id: 't-3',
    categoryId: 'finance',
    categoryName: 'Finance',
    title: 'Global Forex, CBK Reserves & Inflation Indices',
    pool: 'KES 60,000 Pool',
    endsIn: '12h 00m',
    participants: 1150,
    badge: 'JACKPOT',
  },
  {
    id: 't-4',
    categoryId: 'sports',
    categoryName: 'Sports',
    title: 'Champions League & World Athletics Gold Records',
    pool: 'KES 80,000 Pool',
    endsIn: '2h 15m',
    participants: 2100,
    badge: 'LIVE',
  },
];

const SPORTS_QUIZZES: MarketItem[] = [
  {
    id: 's-1',
    categoryId: 'sports',
    categoryName: 'Football',
    title: 'English Premier League All-Time Golden Boot Records',
    pool: 'KES 40,000 Pool',
    endsIn: '5h 10m',
    participants: 840,
    badge: 'EPL',
  },
  {
    id: 's-2',
    categoryId: 'sports',
    categoryName: 'Athletics',
    title: 'Marathon Kings & Kipchoge Sub-2 Breakthrough',
    pool: 'KES 35,000 Pool',
    endsIn: '8h 40m',
    participants: 620,
    badge: 'KENYA',
  },
  {
    id: 's-3',
    categoryId: 'sports',
    categoryName: 'Basketball',
    title: 'NBA Finals MVPs & Scoring Gauntlets',
    pool: 'KES 30,000 Pool',
    endsIn: '14h 20m',
    participants: 510,
    badge: 'NBA',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  speedModes,
  selectedCategoryId,
  selectedSpeedModeId,
  onSelectCategory,
  onSelectSpeedMode,
  onPlayCategory,
  onOpenLeaderboard,
  currentUserWinnings,
  currentUserStreak,
  theme = 'dark',
  bannerSlides,
}) => {
  const isFiltered = Boolean(selectedCategoryId && selectedCategoryId !== 'all');
  const activeCategoryMeta = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6 font-sans select-none">
      {/* Active Filter Indicator */}
      {isFiltered && activeCategoryMeta && (
        <div className="mb-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
              Filtering:
            </span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {activeCategoryMeta.name}
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] font-mono">
              {categories.length} {categories.length === 1 ? 'Arena' : 'Arenas'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--card)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filter</span>
          </button>
        </div>
      )}

      {/* 3-PART DESKTOP LAYOUT (Section 6) */}
      <div className="flex items-start gap-5 w-full">
        {/* LEFT COLUMN: Persistent Category Sidebar */}
        <div className="w-52 lg:w-56 shrink-0 hidden lg:block sticky top-20 self-start">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategoryId || 'all'}
            onCategorySelect={onSelectCategory}
          />
        </div>

        {/* CENTER COLUMN: Main Content & Question Feed */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* 1. Game Speed Mode Arena Selector (Top of Dashboard) */}
          <SpeedModeHeroBar
            speedModes={speedModes}
            selectedSpeedModeId={selectedSpeedModeId}
            onSelectSpeedMode={onSelectSpeedMode}
            onQuickPlay={(modeId) => onPlayCategory(selectedCategoryId || 'kenya')}
            theme={theme}
          />

          {/* 2. Featured Quiz Challenges Feed (Top with Speed Mode) */}
          <MarketSlider
            title="Featured Quiz Challenges"
            subtitle="High-stakes speed trivia with live prize pools"
            icon={<Flame className="w-4 h-4 text-rose-500" />}
            markets={TRENDING_QUIZZES}
            onPlayMarket={onPlayCategory}
            theme={theme}
          />

          {/* 3. Featured Hero Promotional Slider */}
          <HeroSlider
            onPlayCategory={onPlayCategory}
            theme={theme}
            slides={bannerSlides}
          />

          {/* 4. Sports & Championship Tournaments */}
          <MarketSlider
            title="Sports & Championship Tournaments"
            subtitle="Test your football history, records, and club knowledge"
            icon={<Trophy className="w-4 h-4 text-amber-500" />}
            markets={SPORTS_QUIZZES}
            onPlayMarket={onPlayCategory}
            theme={theme}
          />

          {/* 5. Trivia Category Arenas Grid */}
          <CategorySelector
            categories={categories}
            speedModes={speedModes}
            selectedCategoryId={selectedCategoryId}
            selectedSpeedModeId={selectedSpeedModeId}
            onSelectCategory={onSelectCategory}
            onSelectSpeedMode={onSelectSpeedMode}
            onPlayCategory={onPlayCategory}
            theme={theme}
            hideGameModes={true}
          />
        </div>

        {/* RIGHT COLUMN: Compact Statistics / Live Cashouts / Leaderboard Panel */}
        <div className="w-72 xl:w-80 shrink-0 hidden xl:flex flex-col gap-4 sticky top-20 self-start">
          {/* Live Automated Cashouts Stream (Interchanged: Cashout on top) */}
          <PayoutsSideBar theme={theme} />

          {/* Live Standings Compact Leaderboard (Leaderboard below) */}
          <Leaderboard
            currentUserWinnings={currentUserWinnings}
            currentUserStreak={currentUserStreak}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
