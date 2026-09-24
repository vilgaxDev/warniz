import React from 'react';

interface TrivquestLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  animated?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const TrivquestIcon: React.FC<{
  size?: number;
  className?: string;
  animated?: boolean;
}> = ({ size = 36, className = '', animated = false }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-md ${animated ? 'animate-pulse' : ''}`}
      >
        <defs>
          {/* Outer Ring & Shield Gradients */}
          <linearGradient id="tq-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="tq-fill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E1726" />
            <stop offset="60%" stopColor="#05080E" />
            <stop offset="100%" stopColor="#020408" />
          </linearGradient>

          <linearGradient id="tq-bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="tq-core-t" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* Outer Faceted Shield Container */}
        <path
          d="M32 4L56 16V40L32 60L8 40V16L32 4Z"
          fill="url(#tq-fill-grad)"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Subtle Circuit / Orbit Ring */}
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="#10B981"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          strokeOpacity="0.3"
        />

        {/* Modern Geometrical Monogram: "T" intersecting dynamic "Q" with lightning quest spark */}
        {/* The "T" Crossbar */}
        <path
          d="M19 21C19 20.4477 19.4477 20 20 20H44C44.5523 20 45 20.4477 45 21V25C45 25.5523 44.5523 26 44 26H35V38C35 38.5523 34.5523 39 34 39H30C29.4477 39 29 38.5523 29 38V26H20C19.4477 26 19 25.5523 19 25V21Z"
          fill="#FFFFFF"
        />

        {/* Dynamic Quest Spear / Lightning Descender completing the "Q" */}
        <path
          d="M31 32L43 44L47 48L40 47L48 55L45 42L37 40L31 32Z"
          fill="#10B981"
        />

        {/* Precision Compass Ticks */}
        <line x1="32" y1="8" x2="32" y2="12" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52" y1="28" x2="48" y2="28" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="28" x2="16" y2="28" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />

        {/* Core Apex Star Point */}
        <circle cx="32" cy="20" r="1.5" fill="#10B981" />
      </svg>
    </div>
  );
};

export const TrivquestLogo: React.FC<TrivquestLogoProps> = ({
  size = 'md',
  showWordmark = true,
  animated = false,
  className = '',
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const sizeMap = {
    xs: { iconSize: 20, textClass: 'text-xs', badgeClass: 'text-[8px] px-1 py-0.2' },
    sm: { iconSize: 24, textClass: 'text-sm sm:text-base', badgeClass: 'text-[8.5px] px-1.5 py-0.5' },
    md: { iconSize: 28, textClass: 'text-base sm:text-xl', badgeClass: 'text-[9px] px-1.5 py-0.5' },
    lg: { iconSize: 44, textClass: 'text-2xl sm:text-3xl', badgeClass: 'text-[10px] px-2 py-0.5' },
    xl: { iconSize: 60, textClass: 'text-3xl sm:text-4xl', badgeClass: 'text-xs px-2.5 py-1' },
  };

  const conf = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-1.5 sm:gap-2.5 select-none ${className}`}>
      <TrivquestIcon size={conf.iconSize} animated={animated} />

      {showWordmark && (
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none shrink-0">
          <div className={`font-black tracking-tight ${conf.textClass} flex items-center whitespace-nowrap`}>
            <span className={isDark ? 'text-white' : 'text-slate-950'}>TRIV</span>
            <span className="text-emerald-500 ml-0.5">
              QUEST
            </span>
          </div>

          <span
            className={`hidden sm:inline-flex rounded font-bold uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 ${conf.badgeClass}`}
          >
            ARENA
          </span>
        </div>
      )}
    </div>
  );
};
