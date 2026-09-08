import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Zap, Trophy, Cpu, Coins, Globe2, Landmark, Gamepad2, TrendingUp, Sparkles } from 'lucide-react';

export interface CategoryFilterItem {
  id: string;
  name: string;
  icon?: string;
  badge?: string;
  gradient?: string;
  lightGradient?: string;
}

export const SQUARE_CATEGORY_ITEMS: CategoryFilterItem[] = [
  { id: 'trending', name: 'Trending', icon: '🔥', gradient: 'from-orange-500 to-red-600' },
  { id: 'combos', name: 'Combos', icon: '⚡', gradient: 'from-amber-400 to-yellow-600' },
  { id: 'perps', name: 'Perps', icon: '📈', gradient: 'from-emerald-500 to-teal-700' },
  { id: 'breaking', name: 'Breaking', icon: '🚨', gradient: 'from-rose-500 to-red-700' },
  { id: 'new', name: 'New', icon: '✦', gradient: 'from-cyan-400 to-blue-600' },
  { id: 'sports', name: 'Sports', icon: '🏆', gradient: 'from-orange-500 to-amber-600' },
  { id: 'crypto', name: 'Crypto', icon: '🪙', gradient: 'from-purple-500 to-pink-600' },
  { id: 'esports', name: 'Esports', icon: '🎮', gradient: 'from-fuchsia-500 to-purple-700' },
  { id: 'finance', name: 'Finance', icon: '💼', gradient: 'from-emerald-500 to-teal-700' },
  { id: 'geopolitics', name: 'Geopolitics', icon: '🌍', gradient: 'from-blue-500 to-indigo-700' },
  { id: 'tech', name: 'Tech', icon: '🤖', gradient: 'from-cyan-500 to-blue-700' },
  { id: 'politics', name: 'Politics', icon: '🏛️', gradient: 'from-rose-600 to-red-800' },
  { id: 'culture', name: 'Culture', icon: '🎭', gradient: 'from-pink-500 to-rose-600' },
  { id: 'economy', name: 'Economy', icon: '📊', gradient: 'from-teal-500 to-emerald-700' },
  { id: 'weather', name: 'Weather', icon: '🌤️', gradient: 'from-sky-400 to-blue-600' },
  { id: 'mentions', name: 'Mentions', icon: '💬', gradient: 'from-violet-500 to-purple-600' },
  { id: 'elections', name: 'Elections', icon: '🗳️', gradient: 'from-red-500 to-indigo-700' },
  { id: 'art', name: 'Art', icon: '🎨', gradient: 'from-fuchsia-400 to-pink-600' },
  { id: 'more', name: 'More', icon: '➕', gradient: 'from-slate-600 to-slate-800' },
];

interface SquareCategoryFilterProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  theme?: 'dark' | 'light';
  variant?: 'banner' | 'compact' | 'standalone';
  items?: CategoryFilterItem[];
}

export const SquareCategoryFilter: React.FC<SquareCategoryFilterProps> = ({
  selectedCategoryId,
  onSelectCategory,
  theme = 'dark',
  items,
}) => {
  const categoryItems = items && items.length > 0 ? items : SQUARE_CATEGORY_ITEMS;
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`w-full border-t border-b select-none transition-colors relative ${
        isDark
          ? 'bg-gradient-to-r from-[#0c101a] via-[#0e1422] to-[#0c101a] border-[#1d273a] text-slate-300'
          : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 text-slate-700'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 py-2 relative flex items-center">
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isDark
                ? 'bg-[#182338] text-white border border-[#2e3e5c] hover:bg-emerald-600'
                : 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100'
            }`}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isDark
                ? 'bg-[#182338] text-white border border-[#2e3e5c] hover:bg-emerald-600'
                : 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100'
            }`}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Single-Line Polymarket Categories Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryItems.map((item) => {
            const isSelected =
              selectedCategoryId === item.id ||
              (selectedCategoryId === 'all' && item.id === 'trending');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer relative group ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/30'
                      : 'bg-slate-950 text-white border border-slate-950 shadow-md ring-1 ring-slate-900/30'
                    : isDark
                    ? 'bg-[#121827]/70 text-slate-300 border border-white/5 hover:border-emerald-500/40 hover:bg-[#162034] hover:text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {/* Mini Gradient Icon Container */}
                {item.icon && (
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shadow-xs transition-transform group-hover:scale-110 ${
                      item.gradient
                        ? `bg-gradient-to-br ${item.gradient} text-white`
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}

                <span className="tracking-tight">{item.name}</span>

                {/* Badge Tag */}
                {item.badge && (
                  <span
                    className={`text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 shadow-xs'
                        : item.badge === 'HOT' || item.badge === 'LIVE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.badge === '5X' || item.badge === 'SPEED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
