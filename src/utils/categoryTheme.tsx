import React from 'react';
import {
  Shield,
  Trophy,
  Flame,
  Cpu,
  TrendingUp,
  Globe2,
  Coins,
  Landmark,
  Gamepad2,
  Clapperboard,
  Brain,
  Zap,
  Sparkles,
  Rocket,
  Atom,
  Crown,
  Compass,
  LucideIcon,
} from 'lucide-react';

export interface CategoryThemeInfo {
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
  gradient: string;
  glowColor: string;
  borderActive: string;
  bgActiveDark: string;
  bgActiveLight: string;
  accentText: string;
  subtitle: string;
  multiplierText: string;
}

export const CATEGORY_THEMES: Record<string, CategoryThemeInfo> = {
  kenya: {
    icon: Shield,
    badge: 'KENYA 254',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    gradient: 'from-emerald-600 via-teal-600 to-rose-700',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderActive: 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-emerald-500/25',
    bgActiveDark: 'bg-gradient-to-b from-emerald-950/40 via-[#101c24] to-[#0c141d]',
    bgActiveLight: 'bg-gradient-to-b from-emerald-50 via-teal-50/50 to-white',
    accentText: 'text-emerald-400',
    subtitle: 'Nairobi, Culture, Safari & Kenyan 254 History',
    multiplierText: '2X · 3X · 5X M-PESA Multipliers',
  },
  world_cup: {
    icon: Trophy,
    badge: 'FIFA LIVE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    gradient: 'from-amber-500 via-yellow-500 to-emerald-600',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderActive: 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/25',
    bgActiveDark: 'bg-gradient-to-b from-amber-950/40 via-[#1a1714] to-[#0e121a]',
    bgActiveLight: 'bg-gradient-to-b from-amber-50 via-yellow-50/40 to-white',
    accentText: 'text-amber-400',
    subtitle: 'World Cup Finals, Golden Boot & Football Legends',
    multiplierText: 'Tournament Jackpot Arena',
  },
  sports: {
    icon: Flame,
    badge: 'PREMIER LEAGUE',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    gradient: 'from-orange-500 via-rose-500 to-amber-600',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    borderActive: 'border-orange-400 ring-2 ring-orange-400/50 shadow-orange-500/25',
    bgActiveDark: 'bg-gradient-to-b from-orange-950/40 via-[#1a141a] to-[#0e131d]',
    bgActiveLight: 'bg-gradient-to-b from-orange-50 via-rose-50/40 to-white',
    accentText: 'text-orange-400',
    subtitle: 'EPL, Champions League, Athletics & Boxing Records',
    multiplierText: 'Speed Play & High Odds',
  },
  tech: {
    icon: Cpu,
    badge: 'AI & SILICON',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderActive: 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-cyan-500/25',
    bgActiveDark: 'bg-gradient-to-b from-cyan-950/40 via-[#101b2b] to-[#0c121e]',
    bgActiveLight: 'bg-gradient-to-b from-cyan-50 via-blue-50/40 to-white',
    accentText: 'text-cyan-400',
    subtitle: 'Silicon Savannah, LLMs, Quantum & Mobile Tech',
    multiplierText: 'Real-Time Tech Multipliers',
  },
  finance: {
    icon: TrendingUp,
    badge: 'M-PESA & CBK',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    gradient: 'from-emerald-500 via-teal-500 to-green-700',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderActive: 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-emerald-500/25',
    bgActiveDark: 'bg-gradient-to-b from-emerald-950/40 via-[#101c22] to-[#0d141e]',
    bgActiveLight: 'bg-gradient-to-b from-emerald-50 via-teal-50/40 to-white',
    accentText: 'text-emerald-400',
    subtitle: 'NSE, Central Banks, M-Pesa Rails & Forex Markets',
    multiplierText: 'Fast Cashout Guaranteed',
  },
  geopolitics: {
    icon: Globe2,
    badge: 'GLOBAL 195',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    gradient: 'from-blue-500 via-sky-600 to-teal-700',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    borderActive: 'border-blue-400 ring-2 ring-blue-400/50 shadow-blue-500/25',
    bgActiveDark: 'bg-gradient-to-b from-blue-950/40 via-[#101928] to-[#0c121d]',
    bgActiveLight: 'bg-gradient-to-b from-blue-50 via-sky-50/40 to-white',
    accentText: 'text-blue-400',
    subtitle: 'United Nations, Borders, Treaties & World Capitals',
    multiplierText: 'Worldwide Knowledge Arena',
  },
  crypto: {
    icon: Coins,
    badge: 'WEB3 SPEED',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    gradient: 'from-purple-500 via-fuchsia-600 to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    borderActive: 'border-purple-400 ring-2 ring-purple-400/50 shadow-purple-500/25',
    bgActiveDark: 'bg-gradient-to-b from-purple-950/40 via-[#191226] to-[#0e121d]',
    bgActiveLight: 'bg-gradient-to-b from-purple-50 via-pink-50/40 to-white',
    accentText: 'text-purple-400',
    subtitle: 'Bitcoin, Ethereum, DeFi, Stablecoins & Web3 Protocols',
    multiplierText: 'Up to 5X Streak Bonus',
  },
  politics: {
    icon: Landmark,
    badge: 'CIVIC ARENA',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    gradient: 'from-rose-600 via-red-600 to-indigo-800',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    borderActive: 'border-rose-400 ring-2 ring-rose-400/50 shadow-rose-500/25',
    bgActiveDark: 'bg-gradient-to-b from-rose-950/40 via-[#1c121c] to-[#0e121e]',
    bgActiveLight: 'bg-gradient-to-b from-rose-50 via-red-50/40 to-white',
    accentText: 'text-rose-400',
    subtitle: 'Elections, Parliaments, Constitutions & State Affairs',
    multiplierText: 'Instant Odds Settlement',
  },
  esports: {
    icon: Gamepad2,
    badge: 'GAMING 120FPS',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40',
    gradient: 'from-fuchsia-500 via-pink-600 to-cyan-600',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    borderActive: 'border-fuchsia-400 ring-2 ring-fuchsia-400/50 shadow-fuchsia-500/25',
    bgActiveDark: 'bg-gradient-to-b from-fuchsia-950/40 via-[#1c1228] to-[#0e121d]',
    bgActiveLight: 'bg-gradient-to-b from-fuchsia-50 via-pink-50/40 to-white',
    accentText: 'text-fuchsia-400',
    subtitle: 'Counter-Strike, Dota 2, FIFA, Valorant & Twitch Lore',
    multiplierText: 'High APM Trivia Rush',
  },
  entertainment: {
    icon: Clapperboard,
    badge: 'POP CULTURE',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
    gradient: 'from-pink-500 via-rose-500 to-amber-500',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    borderActive: 'border-pink-400 ring-2 ring-pink-400/50 shadow-pink-500/25',
    bgActiveDark: 'bg-gradient-to-b from-pink-950/40 via-[#1b1320] to-[#0e121d]',
    bgActiveLight: 'bg-gradient-to-b from-pink-50 via-rose-50/40 to-white',
    accentText: 'text-pink-400',
    subtitle: 'Afrobeats, Box Office, Grammy Awards & Streaming Stars',
    multiplierText: 'Viral Speed Rounds',
  },
  general: {
    icon: Brain,
    badge: 'IQ MASTERS',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    gradient: 'from-teal-400 via-emerald-500 to-blue-600',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    borderActive: 'border-teal-400 ring-2 ring-teal-400/50 shadow-teal-500/25',
    bgActiveDark: 'bg-gradient-to-b from-teal-950/40 via-[#101c24] to-[#0c131e]',
    bgActiveLight: 'bg-gradient-to-b from-teal-50 via-emerald-50/40 to-white',
    accentText: 'text-teal-400',
    subtitle: 'World Wonders, Natural Science, Physics & Curiosities',
    multiplierText: 'Comprehensive IQ Challenge',
  },
  trending: {
    icon: Rocket,
    badge: 'VIRAL ARENA',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-400/40',
    gradient: 'from-red-500 via-orange-500 to-amber-500',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    borderActive: 'border-red-400 ring-2 ring-red-400/50 shadow-red-500/25',
    bgActiveDark: 'bg-gradient-to-b from-red-950/40 via-[#1c1214] to-[#0e121d]',
    bgActiveLight: 'bg-gradient-to-b from-red-50 via-orange-50/40 to-white',
    accentText: 'text-red-400',
    subtitle: 'Breaking Viral Trends, Speed Feats & Top Picks',
    multiplierText: 'Fastest Payouts Live',
  },
};

const DEFAULT_THEME: CategoryThemeInfo = {
  icon: Sparkles,
  badge: 'ACTIVE ARENA',
  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  gradient: 'from-emerald-500 via-teal-600 to-indigo-700',
  glowColor: 'rgba(16, 185, 129, 0.45)',
  borderActive: 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-emerald-500/25',
  bgActiveDark: 'bg-gradient-to-b from-emerald-950/40 via-[#101b26] to-[#0e131e]',
  bgActiveLight: 'bg-gradient-to-b from-emerald-50 via-teal-50/40 to-white',
  accentText: 'text-emerald-400',
  subtitle: 'Live speed trivia arena with instant rewards',
  multiplierText: '2X · 3X · 5X Multiplier Ladder',
};

export function getCategoryTheme(categoryId: string): CategoryThemeInfo {
  const norm = categoryId.toLowerCase().trim().replace(/[\s-]+/g, '_');
  return CATEGORY_THEMES[norm] || DEFAULT_THEME;
}

interface CategoryTopicBadgeProps {
  categoryId: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  badgeOverride?: string;
}

export const CategoryTopicBadge: React.FC<CategoryTopicBadgeProps> = ({
  categoryId,
  size = 'md',
  animated = true,
  className = '',
}) => {
  const theme = getCategoryTheme(categoryId);
  const IconComponent = theme.icon;

  const sizeClasses = {
    sm: { box: 'w-10 h-10 rounded-xl', icon: 'w-5 h-5' },
    md: { box: 'w-13 h-13 rounded-2xl', icon: 'w-6.5 h-6.5' },
    lg: { box: 'w-16 h-16 rounded-3xl', icon: 'w-8 h-8' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${currentSize.box} ${className} group-hover:scale-105 transition-transform duration-300`}
      style={{
        boxShadow: `0 8px 24px -4px ${theme.glowColor}`,
      }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 rounded-inherit bg-gradient-to-br ${theme.gradient}`} />

      {/* Glossy Upper Light Reflection */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-t-inherit pointer-events-none" />

      {/* Crisp Inner High-Contrast Border */}
      <div className="absolute inset-0 rounded-inherit border border-white/30 pointer-events-none" />

      {/* Subtle Corner Glow Dot */}
      <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/70 blur-[0.5px]" />

      {/* High-Resolution Vector Icon with Subtle Drop Shadow */}
      <div className="relative z-10 text-white drop-shadow-md flex items-center justify-center">
        <IconComponent className={`${currentSize.icon} stroke-[2.2]`} />
      </div>
    </div>
  );
};
