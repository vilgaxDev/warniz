import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play } from 'lucide-react';
import { getCategoryLucideIcon } from './CategoryNav';

export interface MarketItem {
  id: string;
  categoryId: string;
  title: string;
  categoryName: string;
  icon?: string;
  questionsCount?: number;
  pool: string;
  badge?: string;
  badgeType?: 'hot' | 'new' | 'jackpot' | 'live';
  endsIn: string;
  participants: number;
}

interface MarketSliderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  markets: MarketItem[];
  onPlayMarket: (categoryId: string) => void;
  theme?: 'dark' | 'light';
}

export const MarketSlider: React.FC<MarketSliderProps> = ({
  title,
  subtitle,
  icon,
  markets,
  onPlayMarket,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!markets || markets.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-2.5 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-[var(--text-muted)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="p-1 rounded-md bg-[var(--card)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="p-1 rounded-md bg-[var(--card)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards Slider */}
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] sm:auto-cols-[minmax(270px,1fr)] gap-3 overflow-x-auto no-scrollbar pb-1 pt-0.5"
      >
        {markets.map((m) => {
          const CategoryIcon = getCategoryLucideIcon(m.categoryId || m.categoryName);

          return (
            <div
              key={m.id}
              onClick={() => onPlayMarket(m.categoryId)}
              className="triv-card triv-card-interactive p-3.5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--text-secondary)] truncate">
                      {m.categoryName}
                    </span>
                  </div>

                  {m.badge && (
                    <span className="text-[9.5px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)]">
                      {m.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-xs leading-snug line-clamp-2 text-[var(--text-primary)] mb-2.5">
                  {m.title}
                </h4>

                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs mb-3">
                  <span className="font-mono font-bold text-[var(--success)]">{m.pool}</span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{m.endsIn}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayMarket(m.categoryId);
                }}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--accent)] text-[var(--text-primary)] hover:text-white border border-[var(--border)] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3" />
                <span>Play Live Quiz</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
