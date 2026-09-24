import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Zap, Wifi, Activity } from 'lucide-react';
import { TrivquestIcon } from './TrivquestLogo';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  theme?: 'dark' | 'light';
  fullScreen?: boolean;
  siteName?: string;
  onFinish?: () => void;
}

const DEFAULT_MESSAGES = [
  'Initializing Trivquest speed engine...',
  'Preparing 12-second live arena questions...',
  'Configuring 2X · 3X · 5X multiplier pipeline...',
  'Syncing Kenya 254 instant payouts...',
  'Finalizing arena connection...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  subMessage,
  theme = 'dark',
  fullScreen = true,
  siteName = 'Trivquest',
}) => {
  const isDark = theme === 'dark';
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  // Progressive loading simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        const jump = Math.floor(Math.random() * 14) + 6;
        return Math.min(prev + jump, 98);
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  // Cycling status messages
  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [message]);

  const currentStatus = message || DEFAULT_MESSAGES[activeMessageIndex];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none font-sans max-w-md mx-auto relative z-10">
      {/* 1. BRAND LOGO ICON */}
      <div className="relative flex items-center justify-center mb-5">
        <div className={`p-3 rounded-2xl border ${
          isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <TrivquestIcon size={44} />
        </div>
      </div>

      {/* 2. TRIVQUEST WORDMARK & TAGLINE */}
      <div className="mb-4">
        <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight leading-none mb-1 flex items-center justify-center">
          <span className={isDark ? 'text-white' : 'text-slate-950'}>TRIV</span>
          <span className="text-emerald-500 ml-0.5">
            QUEST
          </span>
        </h1>

        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
          Speed Trivia & Cash Prize Arena
        </p>
      </div>

      {/* 3. DYNAMIC STATUS & PERCENTAGE TRACKER */}
      <div className="w-full max-w-xs space-y-2 mb-4">
        <div className="flex items-center justify-between text-[11px] font-semibold px-1">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading Arena</span>
          <span className="text-emerald-500 font-mono font-bold">{progress}%</span>
        </div>

        {/* Clean Solid Progress Bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          isDark ? 'bg-[#1E2638]' : 'bg-slate-200'
        }`}>
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          />
        </div>

        {/* Active Stage Status */}
        <div className="h-6 flex items-center justify-center">
          <p className={`text-xs font-medium truncate ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {currentStatus}
          </p>
        </div>
      </div>

      {/* Sub message if provided */}
      {subMessage && (
        <p className={`text-[11px] font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subMessage}
        </p>
      )}

      {/* 4. FOOTER STATUS & TRUST BADGES */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-white/5">
        <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border ${
          isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Instant Settled</span>
        </div>

        <div className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${
          isDark ? 'bg-[#121722] border-[#222C3E] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>Live 24ms</span>
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors ${
      isDark ? 'bg-[#090D15] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {content}
    </div>
  );
};

