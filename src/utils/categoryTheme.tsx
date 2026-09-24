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
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    gradient: 'from-emerald-700 to-emerald-900',
    glowColor: 'transparent',
    borderActive: 'border-emerald-500 ring-1 ring-emerald-500/50',
    bgActiveDark: 'bg-[#111927]',
    bgActiveLight: 'bg-emerald-50/70',
    accentText: 'text-emerald-400',
    subtitle: 'Nairobi, Culture, Safari & Kenyan 254 History',
    multiplierText: '2X · 3X · 5X M-PESA Multipliers',
  },
  world_cup: {
    icon: Trophy,
    badge: 'FIFA LIVE',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    gradient: 'from-amber-700 to-amber-900',
    glowColor: 'transparent',
    borderActive: 'border-amber-500 ring-1 ring-amber-500/50',
    bgActiveDark: 'bg-[#181615]',
    bgActiveLight: 'bg-amber-50/70',
    accentText: 'text-amber-400',
    subtitle: 'World Cup Finals, Golden Boot & Football Legends',
    multiplierText: 'Tournament Jackpot Arena',
  },
  sports: {
    icon: Flame,
    badge: 'PREMIER LEAGUE',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    gradient: 'from-orange-700 to-orange-900',
    glowColor: 'transparent',
    borderActive: 'border-orange-500 ring-1 ring-orange-500/50',
    bgActiveDark: 'bg-[#191414]',
    bgActiveLight: 'bg-orange-50/70',
    accentText: 'text-orange-400',
    subtitle: 'EPL, Champions League, Athletics & Boxing Records',
    multiplierText: 'Speed Play & High Odds',
  },
  tech: {
    icon: Cpu,
    badge: 'AI & SILICON',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    gradient: 'from-cyan-700 to-cyan-900',
    glowColor: 'transparent',
    borderActive: 'border-cyan-500 ring-1 ring-cyan-500/50',
    bgActiveDark: 'bg-[#111827]',
    bgActiveLight: 'bg-cyan-50/70',
    accentText: 'text-cyan-400',
    subtitle: 'Silicon Savannah, LLMs, Quantum & Mobile Tech',
    multiplierText: 'Real-Time Tech Multipliers',
  },
  finance: {
    icon: TrendingUp,
    badge: 'M-PESA & CBK',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    gradient: 'from-emerald-700 to-emerald-900',
    glowColor: 'transparent',
    borderActive: 'border-emerald-500 ring-1 ring-emerald-500/50',
    bgActiveDark: 'bg-[#111927]',
    bgActiveLight: 'bg-emerald-50/70',
    accentText: 'text-emerald-400',
    subtitle: 'NSE, Central Banks, M-Pesa Rails & Forex Markets',
    multiplierText: 'Fast Cashout Guaranteed',
  },
  geopolitics: {
    icon: Globe2,
    badge: 'GLOBAL 195',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    gradient: 'from-blue-700 to-blue-900',
    glowColor: 'transparent',
    borderActive: 'border-blue-500 ring-1 ring-blue-500/50',
    bgActiveDark: 'bg-[#111728]',
    bgActiveLight: 'bg-blue-50/70',
    accentText: 'text-blue-400',
    subtitle: 'United Nations, Borders, Treaties & World Capitals',
    multiplierText: 'Worldwide Knowledge Arena',
  },
  crypto: {
    icon: Coins,
    badge: 'WEB3 SPEED',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    gradient: 'from-purple-700 to-purple-900',
    glowColor: 'transparent',
    borderActive: 'border-purple-500 ring-1 ring-purple-500/50',
    bgActiveDark: 'bg-[#181326]',
    bgActiveLight: 'bg-purple-50/70',
    accentText: 'text-purple-400',
    subtitle: 'Bitcoin, Ethereum, DeFi, Stablecoins & Web3 Protocols',
    multiplierText: 'Up to 5X Streak Bonus',
  },
  politics: {
    icon: Landmark,
    badge: 'CIVIC ARENA',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    gradient: 'from-rose-700 to-rose-900',
    glowColor: 'transparent',
    borderActive: 'border-rose-500 ring-1 ring-rose-500/50',
    bgActiveDark: 'bg-[#1a1218]',
    bgActiveLight: 'bg-rose-50/70',
    accentText: 'text-rose-400',
    subtitle: 'Elections, Parliaments, Constitutions & State Affairs',
    multiplierText: 'Instant Odds Settlement',
  },
  esports: {
    icon: Gamepad2,
    badge: 'GAMING 120FPS',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    gradient: 'from-fuchsia-700 to-fuchsia-900',
    glowColor: 'transparent',
    borderActive: 'border-fuchsia-500 ring-1 ring-fuchsia-500/50',
    bgActiveDark: 'bg-[#191224]',
    bgActiveLight: 'bg-fuchsia-50/70',
    accentText: 'text-fuchsia-400',
    subtitle: 'Counter-Strike, Dota 2, FIFA, Valorant & Twitch Lore',
    multiplierText: 'High APM Trivia Rush',
  },
  entertainment: {
    icon: Clapperboard,
    badge: 'POP CULTURE',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    gradient: 'from-pink-700 to-pink-900',
    glowColor: 'transparent',
    borderActive: 'border-pink-500 ring-1 ring-pink-500/50',
    bgActiveDark: 'bg-[#19121c]',
    bgActiveLight: 'bg-pink-50/70',
    accentText: 'text-pink-400',
    subtitle: 'Afrobeats, Box Office, Grammy Awards & Streaming Stars',
    multiplierText: 'Viral Speed Rounds',
  },
  general: {
    icon: Brain,
    badge: 'IQ MASTERS',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    gradient: 'from-teal-700 to-teal-900',
    glowColor: 'transparent',
    borderActive: 'border-teal-500 ring-1 ring-teal-500/50',
    bgActiveDark: 'bg-[#111924]',
    bgActiveLight: 'bg-teal-50/70',
    accentText: 'text-teal-400',
    subtitle: 'World Wonders, Natural Science, Physics & Curiosities',
    multiplierText: 'Comprehensive IQ Challenge',
  },
  trending: {
    icon: Rocket,
    badge: 'VIRAL ARENA',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    gradient: 'from-red-700 to-red-900',
    glowColor: 'transparent',
    borderActive: 'border-red-500 ring-1 ring-red-500/50',
    bgActiveDark: 'bg-[#1a1215]',
    bgActiveLight: 'bg-red-50/70',
    accentText: 'text-red-400',
    subtitle: 'Breaking Viral Trends, Speed Feats & Top Picks',
    multiplierText: 'Fastest Payouts Live',
  },
};

const DEFAULT_THEME: CategoryThemeInfo = {
  icon: Sparkles,
  badge: 'ACTIVE ARENA',
  badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  gradient: 'from-emerald-700 to-emerald-900',
  glowColor: 'transparent',
  borderActive: 'border-emerald-500 ring-1 ring-emerald-500/50',
  bgActiveDark: 'bg-[#111927]',
  bgActiveLight: 'bg-emerald-50/70',
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
    sm: { box: 'w-9 h-9 rounded-xl', icon: 'w-4.5 h-4.5' },
    md: { box: 'w-11 h-11 rounded-xl', icon: 'w-5.5 h-5.5' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${currentSize.box} ${className} transition-transform duration-200`}
    >
      {/* Crisp Solid/Subtle Surface Badge */}
      <div className="absolute inset-0 rounded-inherit bg-[#141C2A] border border-[#232F46]" />

      {/* Vector Icon with Theme Accent */}
      <div className={`relative z-10 ${theme.accentText} flex items-center justify-center`}>
        <IconComponent className={`${currentSize.icon} stroke-[2]`} />
      </div>
    </div>
  );
};
