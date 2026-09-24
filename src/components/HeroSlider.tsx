import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategoryLucideIcon } from './CategoryNav';

export interface FeaturedSlide {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  rewardPool: string;
  volume: string;
  participants: number;
  endsIn: string;
  icon?: string;
  gradient?: string;
  difficulty?: string;
  questionsCount?: number;
  tags?: string[];
  imageUrl?: string;
  showTextOverlay?: boolean;
}

const DEFAULT_SLIDES: FeaturedSlide[] = [
  {
    id: 'slide-1',
    categoryId: 'kenya',
    title: 'Kenya Heritage, Geography & Wildlife Trivia',
    subtitle: 'Test your knowledge on Kenyan geography, currency, independence history, and world-record champions.',
    badge: 'FEATURED ARENA',
    rewardPool: 'KES 75,000 Pool',
    volume: '10 Qs Round',
    participants: 1420,
    endsIn: '4h 12m',
    difficulty: 'Medium',
    questionsCount: 10,
    tags: ['Kenya', 'History', 'Wildlife'],
  },
  {
    id: 'slide-2',
    categoryId: 'sports',
    title: 'Premier League & Global Football Championship',
    subtitle: 'Test your football history, iconic world records, club managers, and legendary tournaments.',
    badge: 'SPORTS SPEED',
    rewardPool: 'KES 100,000 Pool',
    volume: '8 Qs Speed',
    participants: 3280,
    endsIn: '1h 45m',
    difficulty: 'Hard',
    questionsCount: 8,
    tags: ['Football', 'EPL', 'Champions'],
  },
  {
    id: 'slide-3',
    categoryId: 'tech',
    title: 'Tech Frontiers: AI, Algorithms & Silicon Savannah',
    subtitle: 'Solve speed trivia on tech pioneers, AI models, undersea fiber cables, and telecom innovations.',
    badge: 'TECH SPRINT',
    rewardPool: 'KES 50,000 Pool',
    volume: '6 Qs Flash',
    participants: 980,
    endsIn: '6h 30m',
    difficulty: 'Medium',
    questionsCount: 6,
    tags: ['Tech', 'AI', 'Silicon Savannah'],
  },
  {
    id: 'slide-4',
    categoryId: 'finance',
    title: 'Finance & Markets: Global Economics & Currency',
    subtitle: 'Sharpen your financial acumen on central banking, market indices, GDP indicators, and monetary policy.',
    badge: 'PRO ARENA',
    rewardPool: 'KES 60,000 Pool',
    volume: '10 Qs Tourney',
    participants: 1150,
    endsIn: '12h 00m',
    difficulty: 'Expert',
    questionsCount: 10,
    tags: ['Finance', 'Markets', 'Banking'],
  },
];

interface HeroSliderProps {
  onPlayCategory: (categoryId: string) => void;
  theme?: 'dark' | 'light';
  slides?: FeaturedSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onPlayCategory,
  slides: customSlides,
}) => {
  const slides = customSlides && customSlides.length > 0 ? customSlides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentIndex] || slides[0];
  const CategoryIcon = getCategoryLucideIcon(slide.categoryId || slide.title);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full triv-card overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="p-5 sm:p-7 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] bg-[var(--card)]"
        >
          {/* Top metadata strip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)]">
                {slide.badge}
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="font-mono tabular-nums">{slide.participants.toLocaleString()} players</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>12s / Question</span>
            </div>
          </div>

          {/* Main Slide Content */}
          <div className="my-2">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)]">
                <CategoryIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex gap-1.5">
                {(slide.tags || []).map((t) => (
                  <span key={t} className="text-[10px] text-[var(--text-muted)] font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="text-base sm:text-xl font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-1.5 max-w-2xl">
              {slide.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Bottom Bar: Pool info + Start CTA */}
          <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">Prize Pool</span>
                <span className="font-mono font-bold text-[var(--success)]">{slide.rewardPool}</span>
              </div>
              <div className="h-5 w-[1px] bg-[var(--border)]" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">Format</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{slide.volume}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onPlayCategory(slide.categoryId)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--card)]/80 hover:bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] backdrop-blur-xs transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--card)]/80 hover:bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] backdrop-blur-xs transition-colors cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-4 bg-[var(--accent)]'
                : 'w-1.5 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
