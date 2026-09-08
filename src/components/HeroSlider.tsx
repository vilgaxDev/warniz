import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Clock, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FeaturedSlide {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  rewardPool: string;
  volume: string;
  participants: number;
  endsIn: string;
  icon: string;
  gradient: string;
  difficulty: string;
  questionsCount: number;
  tags: string[];
  // Image support
  imageUrl?: string;           // Background image URL
  showTextOverlay?: boolean;   // If false = pure image, no text overlay
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'; // object-position
}

const FEATURED_SLIDES: FeaturedSlide[] = [
  {
    id: 'slide-1',
    categoryId: 'kenya',
    title: 'Kenya Heritage, Geography & Safari History Trivia',
    subtitle: 'Test your national knowledge on Kenyan geography, currency, independence history, and world-record athletes.',
    badge: '🇰🇪 LIVE ARENA',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rewardPool: 'KSh 75,000 Pool',
    volume: '10 Qs Round',
    participants: 1420,
    endsIn: '4h 12m',
    icon: '🇰🇪',
    gradient: 'from-emerald-950/90 via-slate-900 to-slate-950',
    difficulty: 'Medium',
    questionsCount: 10,
    tags: ['Kenya', 'History', 'Safari'],
    showTextOverlay: true,
  },
  {
    id: 'slide-2',
    categoryId: 'world_cup',
    title: 'World Cup Champions & Global Football Clash',
    subtitle: 'Who will lift the trophy in 2026? Test your FIFA history, iconic world records, and legendary matches.',
    badge: '⚽ WORLD CUP',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rewardPool: 'KSh 100,000 Pool',
    volume: '8 Qs Speed',
    participants: 3280,
    endsIn: '1h 45m',
    icon: '⚽',
    gradient: 'from-emerald-900/90 via-slate-900 to-slate-950',
    difficulty: 'Pro Challenge',
    questionsCount: 8,
    tags: ['World Cup', 'Football', 'Top Prize'],
    showTextOverlay: true,
  },
  {
    id: 'slide-3',
    categoryId: 'tech',
    title: 'Silicon Savannah: M-Pesa & AI Innovation Boom',
    subtitle: 'Solve speed trivia on tech giants, AI models, undersea fiber cables, and next-gen telecom breakthroughs.',
    badge: '🤖 TECH ARENA',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rewardPool: 'KSh 50,000 Pool',
    volume: '6 Qs Flash',
    participants: 980,
    endsIn: '6h 30m',
    icon: '🤖',
    gradient: 'from-indigo-900/90 via-slate-900 to-slate-950',
    difficulty: 'Fast Pace',
    questionsCount: 6,
    tags: ['Tech', 'M-Pesa', 'AI'],
    showTextOverlay: true,
  },
  {
    id: 'slide-4',
    categoryId: 'finance',
    title: 'Finance & Markets: NSE & Central Bank of Kenya',
    subtitle: 'Sharpen your financial acumen on CBK monetary policies, GDP calculations, inflation, and East African markets.',
    badge: '📈 HIGH STAKES',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    rewardPool: 'KSh 60,000 Pool',
    volume: '10 Qs Tourney',
    participants: 1150,
    endsIn: '12h 00m',
    icon: '📈',
    gradient: 'from-cyan-900/90 via-slate-900 to-slate-950',
    difficulty: 'Master Level',
    questionsCount: 10,
    tags: ['Finance', 'NSE', 'CBK'],
    showTextOverlay: true,
  },
];

interface HeroSliderProps {
  onPlayCategory: (categoryId: string) => void;
  theme?: 'dark' | 'light';
  slides?: FeaturedSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onPlayCategory,
  theme = 'dark',
  slides: remoteSlides,
}) => {
  const isDark = theme === 'dark';
  const slides = (remoteSlides && remoteSlides.length > 0) ? remoteSlides : FEATURED_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSlideIndex, slides.length]);

  const slide = slides[currentSlideIndex] ?? slides[0];
  const hasImage = Boolean(slide.imageUrl);
  const showText = slide.showTextOverlay !== false; // default true
  const imgPos = slide.imagePosition || 'center';

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border font-sans group select-none transition-all shadow-lg ${
        isDark ? 'border-[#222C3E]' : 'border-slate-200 shadow-md'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`relative flex flex-col justify-between min-h-[300px] sm:min-h-[340px] overflow-hidden`}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* ── BACKGROUND: Image OR gradient ── */}
          {hasImage ? (
            <>
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover object-${imgPos} transition-transform duration-700 group-hover:scale-105`}
              />
              {/* Vibrant gradient scrim overlay (not solid black) */}
              {showText && (
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                  isDark 
                    ? 'from-slate-950/90 via-slate-900/40 to-transparent'
                    : 'from-slate-900/30 via-slate-600/20 to-transparent'
                }`} />
              )}
            </>
          ) : (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  // In light mode, force light gradient regardless of slide.gradient
                  !isDark 
                    ? 'from-white via-slate-50 to-slate-100'
                    : (slide.gradient || 'from-slate-900 via-slate-900/90 to-[#0B0E14]')
                }`}
              />
              {/* Subtle ambient grid */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]" />
            </>
          )}

          {/* ── CONTENT (hidden for pure image slides) ── */}
          {showText && (
            <div className={`relative z-10 flex flex-col justify-between h-full p-5 sm:p-7 md:p-8 ${
              hasImage 
                ? (isDark ? 'text-white' : 'text-slate-900') 
                : (isDark ? 'text-[#F8FAFC]' : 'text-slate-900')
            }`}>
              {/* TOP BAR */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border shadow-2xs uppercase tracking-wider ${
                    hasImage 
                      ? (isDark 
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30 backdrop-blur-md'
                          : 'bg-emerald-500/30 text-emerald-700 border-emerald-500/40 backdrop-blur-md')
                      : slide.badgeColor
                  }`}>
                    {slide.badge}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                    hasImage
                      ? (isDark
                          ? 'bg-slate-900/60 border-slate-700/60 text-white backdrop-blur-md'
                          : 'bg-white/70 border-slate-300 text-slate-700 backdrop-blur-md')
                      : isDark ? 'bg-[#182030] border-[#222C3E] text-[#94A3B8]' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span>{(slide.participants || 0).toLocaleString()} Active Players</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-xs font-medium ${
                  hasImage 
                    ? (isDark ? 'text-slate-200' : 'text-slate-600')
                    : (isDark ? 'text-[#94A3B8]' : 'text-slate-600')
                }`}>
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>12s Countdown / Q</span>
                </div>
              </div>

              {/* CENTER: Title, Subtitle & Attributes */}
              <div className="my-4 sm:my-5 max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-sm ${
                    hasImage
                      ? (isDark
                          ? 'bg-slate-900/60 border-slate-700/60 backdrop-blur-md'
                          : 'bg-white/70 border-slate-300 backdrop-blur-md')
                      : isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200 shadow-2xs'
                  }`}>
                    {slide.icon}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(slide.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                          hasImage
                            ? (isDark
                                ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 backdrop-blur-md'
                                : 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 backdrop-blur-md')
                            : isDark ? 'bg-[#182030] text-[#94A3B8] border border-[#222C3E]' : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug mb-2 ${
                  hasImage 
                    ? (isDark ? 'text-white drop-shadow-md' : 'text-slate-900')
                    : (isDark ? 'text-[#F8FAFC]' : 'text-slate-900')
                }`}>
                  {slide.title}
                </h2>
                <p className={`text-xs sm:text-sm font-normal line-clamp-2 ${
                  hasImage 
                    ? (isDark ? 'text-slate-200 drop-shadow-xs' : 'text-slate-600')
                    : (isDark ? 'text-[#94A3B8]' : 'text-slate-600')
                }`}>
                  {slide.subtitle}
                </p>
              </div>

              {/* BOTTOM: Pool Info & Play Button */}
              <div className={`flex flex-wrap items-center justify-between gap-4 pt-3 border-t ${
                hasImage 
                  ? (isDark ? 'border-slate-700/50' : 'border-slate-300/50')
                  : (isDark ? 'border-[#222C3E]' : 'border-slate-200')
              }`}>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div>
                    <div className={`text-[10px] font-medium uppercase tracking-wider ${
                      hasImage 
                        ? (isDark ? 'text-slate-300' : 'text-slate-600')
                        : (isDark ? 'text-[#94A3B8]' : 'text-slate-500')
                    }`}>Live Prize Pool</div>
                    <div className="text-sm sm:text-base font-bold text-emerald-500 dark:text-emerald-400">{slide.rewardPool}</div>
                  </div>
                  <div className={`h-6 w-px ${
                    hasImage 
                      ? (isDark ? 'bg-slate-700/50' : 'bg-slate-300/50')
                      : (isDark ? 'bg-[#222C3E]' : 'bg-slate-200')
                  }`} />
                  <div>
                    <div className={`text-[10px] font-medium uppercase tracking-wider ${
                      hasImage 
                        ? (isDark ? 'text-slate-300' : 'text-slate-600')
                        : (isDark ? 'text-[#94A3B8]' : 'text-slate-500')
                    }`}>Format</div>
                    <div className={`text-sm sm:text-base font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{slide.volume}</div>
                  </div>
                </div>

                <button
                  onClick={() => onPlayCategory(slide.categoryId)}
                  className="px-5 sm:px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-300 animate-blink-play"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Live Quiz</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pure image: subtle play button at bottom-right */}
          {!showText && (
            <div className="absolute bottom-4 right-4 z-20">
              <button
                onClick={() => onPlayCategory(slide.categoryId)}
                className={`px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-white hover:bg-slate-100 text-slate-950'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isDark ? 'fill-slate-950' : 'fill-white'}`} />
                Play
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-md ${
            isDark
              ? 'bg-[#121722]/90 border-[#222C3E] text-[#F8FAFC] hover:bg-[#182030]'
              : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-white hover:text-black'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-md ${
            isDark
              ? 'bg-[#121722]/90 border-[#222C3E] text-[#F8FAFC] hover:bg-[#182030]'
              : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-white hover:text-black'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentSlideIndex
                ? 'w-6 bg-emerald-500'
                : isDark
                  ? 'w-2 bg-[#222C3E] hover:bg-[#94A3B8]'
                  : 'w-2 bg-slate-300 hover:bg-slate-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};