import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Zap, Play, Trophy } from 'lucide-react';

export interface MarketItem {
  id: string;
  categoryId: string;
  title: string;
  categoryName: string;
  icon: string;
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
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!markets || markets.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-3 font-sans select-none">
      {/* Header with Title, Subtitle & Slider Navigation Arrows */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
              isDark
                ? 'bg-[#16181f] border-[#262933] text-emerald-400'
                : 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-2xs'
            }`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className={`font-bold text-base sm:text-lg tracking-tight leading-tight ${
              isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
            }`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-xs font-normal ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Carousel Prev / Next Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0f1117] border-[#262933] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16181f]'
                : 'bg-white border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0f1117] border-[#262933] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16181f]'
                : 'bg-white border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100 shadow-2xs'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] sm:auto-cols-[minmax(280px,1fr)] lg:grid-flow-row lg:grid-cols-4 gap-3 sm:gap-3.5 overflow-x-auto lg:overflow-visible pb-1.5 pt-0.5 px-0.5 no-scrollbar scroll-smooth snap-x"
      >
        {markets.map((m) => {
          let badgeStyles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
          if (m.badgeType === 'hot') badgeStyles = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
          if (m.badgeType === 'jackpot') badgeStyles = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
          if (m.badgeType === 'live') badgeStyles = 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';

          return (
            <div
              key={m.id}
              onClick={() => onPlayMarket(m.categoryId)}
              className={`w-full snap-start p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                isDark
                  ? 'bg-[#0f1117] border-[#262933] hover:border-emerald-500/40 hover:bg-[#16181f]'
                  : 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
              }`}
            >
              {/* Card Top: Icon Tile, Tag & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {/* Consistent Rounded Icon Container Tile */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 border transition-transform group-hover:scale-105 shadow-2xs ${
                      isDark ? 'bg-[#16181f] border-[#262933]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {m.icon}
                    </div>
                    <span className={`text-xs font-semibold tracking-tight ${isDark ? 'text-[#94A3B8]' : 'text-slate-700'}`}>
                      {m.categoryName}
                    </span>
                  </div>

                  {m.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${badgeStyles}`}>
                      {m.badge}
                    </span>
                  )}
                </div>

                {/* Challenge Title */}
                <h4 className={`font-semibold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5rem] mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${
                  isDark ? 'text-[#F8FAFC]' : 'text-slate-900'
                }`}>
                  {m.title}
                </h4>

                {/* Info Bar */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs mb-3 ${
                  isDark ? 'bg-[#16181f] border-[#262933]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{m.pool}</span>
                  <span className={`flex items-center gap-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    <span>{m.endsIn}</span>
                  </span>
                </div>
              </div>

              {/* Card Bottom: Direct Action Button */}
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMarket(m.categoryId);
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                    isDark
                      ? 'bg-[#16181f] hover:bg-[#20242e] text-slate-100 border border-[#262933]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isDark ? 'fill-slate-100' : 'fill-white'}`} />
                  <span>Play Live Quiz</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
