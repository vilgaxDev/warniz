import React, { useRef, useState, useEffect } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  MapPin,
  Globe2,
  Trophy,
  Atom,
  Cpu,
  ChartNoAxesCombined,
  Bitcoin,
  Globe,
  Landmark,
  Gamepad2,
  Clapperboard,
  BookOpen,
  Rocket,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface CategoryNavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORY_NAV_ITEMS: CategoryNavItem[] = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'kenya', name: 'Kenya', icon: MapPin },
  { id: 'world', name: 'World', icon: Globe2 },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'science', name: 'Science', icon: Atom },
  { id: 'tech', name: 'Tech', icon: Cpu },
  { id: 'finance', name: 'Finance', icon: ChartNoAxesCombined },
  { id: 'crypto', name: 'Crypto', icon: Bitcoin },
  { id: 'geopolitics', name: 'Geopolitics', icon: Globe },
  { id: 'politics', name: 'Politics', icon: Landmark },
  { id: 'esports', name: 'Esports', icon: Gamepad2 },
  { id: 'entertainment', name: 'Entertainment', icon: Clapperboard },
  { id: 'history', name: 'History', icon: BookOpen },
  { id: 'space', name: 'Space', icon: Rocket },
  { id: 'general_knowledge', name: 'General Trivia', icon: Brain },
];

// Helper mapping for any other category id/name to Lucide icon
export const getCategoryLucideIcon = (idOrName: string): React.ComponentType<{ className?: string }> => {
  const norm = idOrName.toLowerCase();
  if (norm.includes('trend')) return TrendingUp;
  if (norm.includes('kenya')) return MapPin;
  if (norm.includes('world') || norm.includes('global')) return Globe2;
  if (norm.includes('sport') || norm.includes('football') || norm.includes('basketball')) return Trophy;
  if (norm.includes('sci') || norm.includes('physics') || norm.includes('chem')) return Atom;
  if (norm.includes('tech') || norm.includes('code') || norm.includes('ai')) return Cpu;
  if (norm.includes('finan') || norm.includes('money') || norm.includes('market')) return ChartNoAxesCombined;
  if (norm.includes('crypto') || norm.includes('btc') || norm.includes('web3')) return Bitcoin;
  if (norm.includes('geo')) return Globe;
  if (norm.includes('polit') || norm.includes('law') || norm.includes('gov')) return Landmark;
  if (norm.includes('esport') || norm.includes('game')) return Gamepad2;
  if (norm.includes('movie') || norm.includes('music') || norm.includes('entertain')) return Clapperboard;
  if (norm.includes('hist') || norm.includes('heritage')) return BookOpen;
  if (norm.includes('space') || norm.includes('astron')) return Rocket;
  if (norm.includes('trivia') || norm.includes('brain') || norm.includes('general')) return Brain;
  return LayoutGrid;
};

interface CategoryNavProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategoryId,
  onSelectCategory,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative w-full border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md select-none ${className}`}>
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-r from-[var(--card)] via-[var(--card)]/90 to-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-l from-[var(--card)] via-[var(--card)]/90 to-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Horizontal Category Strip */}
      <div
        ref={scrollRef}
        className="max-w-[1440px] mx-auto px-3 sm:px-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 text-xs"
      >
        {CATEGORY_NAV_ITEMS.map((item) => {
          const isSelected = selectedCategoryId === item.id || (!selectedCategoryId && item.id === 'all');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border-strong)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
