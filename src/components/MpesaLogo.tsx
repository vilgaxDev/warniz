import React from 'react';

interface MpesaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'lipa_na_mpesa' | 'pill';
}

export const MpesaLogo: React.FC<MpesaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'badge',
}) => {
  if (variant === 'lipa_na_mpesa') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006838] text-white font-sans select-none shadow-xs ${className}`}>
        <div className="w-2 h-2 rounded-full bg-[#E50012] shrink-0 animate-pulse" />
        <span className="text-[10px] font-extrabold tracking-tight uppercase leading-none">
          Lipa Na <span className="text-[#00FF66]">M-PESA</span>
        </span>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold select-none ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] tracking-wide font-extrabold uppercase">M-PESA Verified</span>
      </div>
    );
  }

  // Standard Authentic M-PESA Emblem
  const sizeClasses = {
    sm: 'h-6 px-2 text-[11px]',
    md: 'h-8 px-3 text-xs',
    lg: 'h-10 px-4 text-sm',
  };

  return (
    <div className={`inline-flex items-center justify-center font-black rounded-lg bg-[#00A344] text-white shadow-md border border-[#00C853]/40 tracking-wider uppercase select-none ${sizeClasses[size]} ${className}`}>
      <span className="mr-0.5">M</span>
      <span className="text-[#E50012] font-black text-[1.15em] leading-none mx-0.5">-</span>
      <span>PESA</span>
    </div>
  );
};
