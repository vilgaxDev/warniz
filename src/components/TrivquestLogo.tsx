import React from 'react';

interface TrivquestLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const TrivquestIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 28, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="14"
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="2"
        />
        {/* Stylized geometric T and Q with spark */}
        <path
          d="M20 22H44V27H35V42H29V27H20V22Z"
          fill="var(--accent)"
        />
        <circle
          cx="42"
          cy="38"
          r="6"
          stroke="var(--accent-hover)"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M45 41L49 46"
          stroke="var(--accent-hover)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const TrivquestLogo: React.FC<TrivquestLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { iconSize: 20, textClass: 'text-xs', badgeClass: 'text-[8.5px] px-1.5 py-0.2' },
    sm: { iconSize: 24, textClass: 'text-sm', badgeClass: 'text-[9px] px-1.5 py-0.5' },
    md: { iconSize: 28, textClass: 'text-base font-bold', badgeClass: 'text-[9.5px] px-1.5 py-0.5' },
    lg: { iconSize: 36, textClass: 'text-xl font-bold', badgeClass: 'text-[10px] px-2 py-0.5' },
    xl: { iconSize: 48, textClass: 'text-2xl font-bold', badgeClass: 'text-xs px-2.5 py-1' },
  };

  const conf = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <TrivquestIcon size={conf.iconSize} />

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none shrink-0">
          <span className={`font-bold tracking-tight ${conf.textClass} text-[var(--text-primary)]`}>
            TRIV<span className="text-[var(--accent)] font-extrabold">QUEST</span>
          </span>
          <span
            className={`hidden sm:inline-flex rounded-md font-semibold tracking-wide uppercase border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] ${conf.badgeClass}`}
          >
            ARENA
          </span>
        </div>
      )}
    </div>
  );
};
