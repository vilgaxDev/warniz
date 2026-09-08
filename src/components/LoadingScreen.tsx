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
  'Syncing Kenya 254 M-PESA instant payouts...',
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
  const [progress, setProgress] = useState(12);

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
      {/* 1. ANIMATED TRIVQUEST BRAND LOGO CREST */}
      <div className="relative flex items-center justify-center mb-6 sm:mb-7">
        {/* Outer Pulsing Emerald Ambient Aura */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-500/30 to-emerald-400/20 blur-2xl pointer-events-none"
        />

        {/* Precision Orbital Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-emerald-500/40 pointer-events-none"
        />

        {/* Counter-Rotating Secondary Ring with Radar Notch */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-teal-400/30 pointer-events-none flex items-start justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mt-1 shadow-sm shadow-emerald-400" />
        </motion.div>

        {/* Core Trivquest Emblem Box */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 p-1.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-emerald-400/20 border border-emerald-400/30 shadow-2xl backdrop-blur-sm"
        >
          <TrivquestIcon size={56} animated />
        </motion.div>
      </div>

      {/* 2. TRIVQUEST WORDMARK & TAGLINE */}
      <div className="mb-4">
        <h1 className="font-black text-2xl sm:text-3xl tracking-tight uppercase leading-none mb-1 flex items-center justify-center">
          <span className={isDark ? 'text-white' : 'text-slate-950'}>TRIV</span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent ml-0.5">
            QUEST
          </span>
        </h1>

        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Speed Trivia & Live Prediction Arena</span>
        </p>
      </div>

      {/* 3. DYNAMIC STATUS & PERCENTAGE TRACKER */}
      <div className="w-full max-w-xs space-y-2 mb-4">
        <div className="flex items-center justify-between text-[11px] font-bold px-1">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading Arena</span>
          <span className="text-emerald-400 font-mono font-black">{progress}%</span>
        </div>

        {/* Active Progress Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-black/40 border border-white/10 relative p-0.5">
          <motion.div
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 relative shadow-sm shadow-emerald-500/50"
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[pulse_1s_infinite]" />
          </motion.div>
        </div>

        {/* Active Stage Status with Smooth Fade */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStatus}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={`text-xs font-medium truncate ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {currentStatus}
            </motion.p>
          </AnimatePresence>
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
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
          isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>M-PESA Instant Settled</span>
        </div>

        <div className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          isDark ? 'bg-[#121722] border-[#222C3E] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>24ms • Live</span>
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors backdrop-blur-md ${
      isDark ? 'bg-[#050507]/98 black-net text-[#F8FAFC]' : 'bg-[#F8FAFC]/98 text-slate-900'
    }`}>
      {content}
    </div>
  );
};

