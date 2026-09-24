import React, { useState } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  Trophy,
  Atom,
  Cpu,
  ChartNoAxesCombined,
  Bitcoin,
  Globe2,
  Landmark,
  Clapperboard,
  ChevronDown,
  ChevronUp,
  Brain,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { QuizCategory } from '../types';

interface CategorySidebarProps {
  categories?: QuizCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
  theme?: 'dark' | 'light';
}

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'science', name: 'Science', icon: Atom },
  { id: 'tech', name: 'Technology', icon: Cpu },
  { id: 'finance', name: 'Finance', icon: ChartNoAxesCombined },
  { id: 'crypto', name: 'Crypto', icon: Bitcoin },
  { id: 'world', name: 'World', icon: Globe2 },
  { id: 'politics', name: 'Politics', icon: Landmark },
  { id: 'entertainment', name: 'Entertainment', icon: Clapperboard },
];

const MORE_SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'kenya', name: 'Kenya', icon: MapPin },
  { id: 'general_knowledge', name: 'General Trivia', icon: Brain },
];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  className = '',
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <aside className={`w-full triv-card p-3 select-none ${className}`}>
      <div className="flex items-center justify-between px-2 py-1.5 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Categories
        </span>
      </div>

      <nav className="space-y-0.5">
        {PRIMARY_SIDEBAR_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.id || (!selectedCategory && item.id === 'all');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCategorySelect(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                isSelected
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] font-semibold border border-[var(--border-strong)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'}`} />
                <span className="truncate">{item.name}</span>
              </div>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
              )}
            </button>
          );
        })}

        {/* More categories dropdown accordion */}
        {showMore && (
          <div className="pt-0.5 space-y-0.5 border-t border-[var(--border)] mt-1">
            {MORE_SIDEBAR_ITEMS.map((item) => {
              const isSelected = selectedCategory === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCategorySelect(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] font-semibold border border-[var(--border-strong)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer mt-1"
        >
          <span>{showMore ? 'Less' : 'More'}</span>
          {showMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </nav>

      {/* Speed Arena Info Box */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] px-2">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-[var(--text-muted)]">Live Multiplier</span>
          <span className="font-mono font-semibold text-[var(--success)]">Up to 10x</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--text-muted)]">Settlement</span>
          <span className="font-mono text-[var(--text-secondary)]">Instant M-Pesa</span>
        </div>
      </div>
    </aside>
  );
};
