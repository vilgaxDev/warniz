import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CategoryFilterItem {
  id: string;
  name: string;
  icon?: string;
  badge?: string;
  gradient?: string;
  lightGradient?: string;
}

export const SQUARE_CATEGORY_ITEMS: CategoryFilterItem[] = [
  { id: 'trending', name: 'Trending', icon: '🔥', badge: 'HOT' },
  { id: 'combos', name: 'Combos', icon: '⚡' },
  { id: 'perps', name: 'Perps', icon: '📈' },
  { id: 'breaking', name: 'Breaking', icon: '🚨' },
  { id: 'new', name: 'New', icon: '✦' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'sports', name: 'Sports', icon: '🏆' },
  { id: 'crypto', name: 'Crypto', icon: '🪙' },
  { id: 'esports', name: 'Esports', icon: '🎮' },
  { id: 'iran', name: 'Iran', icon: '🇮🇷' },
  { id: 'finance', name: 'Finance', icon: '💼' },
  { id: 'geopolitics', name: 'Geopolitics', icon: '🌍' },
  { id: 'tech', name: 'Tech', icon: '🤖' },
  { id: 'culture', name: 'Culture', icon: '🎭' },
  { id: 'economy', name: 'Economy', icon: '📊' },
  { id: 'weather', name: 'Weather', icon: '🌤️' },
  { id: 'mentions', name: 'Mentions', icon: '💬' },
  { id: 'elections', name: 'Elections', icon: '🗳️' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'more', name: 'More', icon: '➕' },
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
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -240 : 240;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`w-full border-t border-b select-none transition-colors relative ${
      isDark
        ? 'bg-[#0E121B] border-[#222C3E] text-[#94A3B8]'
        : 'bg-white border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 py-1.5 relative flex items-center">
        
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isDark ? 'bg-[#182030] text-white border border-[#222C3E]' : 'bg-white text-slate-800 border border-slate-200'
            }`}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isDark ? 'bg-[#182030] text-white border border-[#222C3E]' : 'bg-white text-slate-800 border border-slate-200'
            }`}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Single-Line Polymarket Categories Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryItems.map((item) => {
            const isSelected = selectedCategoryId === item.id || (selectedCategoryId === 'all' && item.id === 'trending');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer relative ${
                  isSelected
                    ? isDark
                      ? 'bg-[#182030] text-white border border-[#2E3B52] shadow-xs'
                      : 'bg-slate-900 text-white border border-slate-900 shadow-xs'
                    : isDark
                      ? 'hover:bg-[#182030]/60 hover:text-white text-[#94A3B8]'
                      : 'hover:bg-slate-200 hover:text-slate-950 text-slate-600'
                }`}
              >
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <span>{item.name}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                    isSelected
                      ? isDark
                        ? 'bg-white/20 text-white'
                        : 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isSelected && (
                  <span className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full ${
                    isDark ? 'bg-white' : 'bg-slate-900'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

