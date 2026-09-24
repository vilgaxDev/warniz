import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Zap, Activity, Flame, Trophy } from 'lucide-react';
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
  'Connecting to live speed trivia arenas...',
  'Loading 5s, 10s & 15s multiplier speed engines...',
  'Syncing live leaderboard & M-Pesa prize pools...',
  'Preparing instant settlement engine...',
  'Welcome to Trivquest Arena!',
];

const GAME_TIPS = [
  '⚡ Faster answers multiply your XP and cash points!',
  '🔥 Maintain a daily streak to unlock up to 3x payout bonus!',
  '🏆 Blitz mode gives maximum adrenaline with 5-second timers!',
  '💰 Instant M-Pesa automated cashout available 24/7!',
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
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  // Progressive loading simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        const jump = Math.floor(Math.random() * 14) + 6;
        return Math.min(prev + jump, 98);
      });
    }, 240);

    return () => clearInterval(interval);
  }, []);

  // Cycling status messages
  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
      setActiveTipIndex((prev) => (prev + 1) % GAME_TIPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [message]);

  const currentStatus = message || DEFAULT_MESSAGES[activeMessageIndex];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none font-sans max-w-sm sm:max-w-md mx-auto relative z-10">
      {/* 1. LIVELY ANIMATED GAME LOGO BADGE */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Animated Glow Halo */}
        <div className="absolute -inset-4 rounded-3xl bg-[var(--accent)]/20 blur-xl animate-pulse" />
        
        {/* Pulsing Outer Ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute -inset-2 rounded-2xl border-2 border-[var(--accent)]/30"
        />

        {/* Logo Card */}
        <div className="relative p-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] shadow-xl flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <TrivquestIcon size={52} />
          </motion.div>

          {/* Live Game Indicator Dot */}
          <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--accent)] border-2 border-[var(--card)] flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. TRIVQUEST WORDMARK & LIVELY TAGLINE */}
      <div className="mb-5">
        <h1 className="font-black text-2xl sm:text-3xl tracking-tight leading-none mb-1.5 flex items-center justify-center gap-1">
          <span className="text-[var(--text-primary)]">TRIV</span>
          <span className="text-[var(--accent)]">QUEST</span>
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)] ml-1">
            ARENA
          </span>
        </h1>

        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Live Speed Trivia & Cash Arena</span>
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        </p>
      </div>

      {/* 3. DYNAMIC PROGRESS & PERCENTAGE TRACKER */}
      <div className="w-full max-w-xs space-y-2 mb-5">
        <div className="flex items-center justify-between text-[11px] font-semibold px-1">
          <span className="text-[var(--text-secondary)] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[var(--accent)]" />
            <span>Loading Arena</span>
          </span>
          <span className="text-[var(--accent-text)] font-mono font-bold">{progress}%</span>
        </div>

        {/* Clean Solid Progress Bar with Glow */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300 relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Active Stage Status */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStatus}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium truncate text-[var(--text-secondary)]"
            >
              {currentStatus}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. GAME TIP BADGE */}
      <div className="w-full max-w-xs mb-5 px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-left flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--accent-text)] block">
            Arena Tip
          </span>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
            {GAME_TIPS[activeTipIndex]}
          </p>
        </div>
      </div>

      {/* Sub message if provided */}
      {subMessage && (
        <p className="text-[11px] font-medium mb-3 text-[var(--text-muted)]">
          {subMessage}
        </p>
      )}

      {/* 5. FOOTER STATUS & TRUST BADGES */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span>Instant Settled</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent-text)]">
          <Activity className="w-3 h-3 text-[var(--accent-text)]" />
          <span>Live 24ms</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span>M-Pesa 24/7</span>
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors bg-[var(--bg-main)] text-[var(--text-primary)]">
      {content}
    </div>
  );
};

