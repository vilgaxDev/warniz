import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  theme?: 'dark' | 'light';
  fullScreen?: boolean;
  siteName?: string;
}

const DEFAULT_MESSAGES = [
  'Connecting to Live Prediction Markets...',
  'Preparing 12-Second Speed Trivia...',
  'Syncing Kenya 254 High-Stakes Arenas...',
  'Calculating Real-Time M-Pesa Multipliers...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  subMessage,
  theme = 'dark',
  fullScreen = true,
  siteName = 'CHEZAQUIZ',
}) => {
  const isDark = theme === 'dark';
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [message]);

  const currentStatus = message || DEFAULT_MESSAGES[activeMessageIndex];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none font-sans max-w-sm mx-auto">
      {/* 1. ANIMATED CHEZAQUIZ LOGO WITH GLOWING ENERGY RINGS */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer Pulsing Ambient Aura */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#DB3211]/30 via-[#F55129]/30 to-[#E28C6D]/20 blur-xl pointer-events-none"
        />

        {/* Rotating Geometric Energy Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-[#F55129]/40 pointer-events-none"
        />

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#E28C6D]/30 pointer-events-none"
        />

        {/* Core Rhombus Logo Box */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#DB3211] via-[#F55129] to-[#E28C6D] p-[2px] shadow-2xl relative z-10 flex items-center justify-center"
        >
          <div className={`w-full h-full rounded-[14px] flex items-center justify-center overflow-hidden ${
            isDark ? 'bg-[#0B0E14]' : 'bg-white'
          }`}>
            <motion.div
              animate={{ rotate: [12, 24, 12] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-tr from-[#F55129] via-[#DB3211] to-[#E28C6D] rounded-[4px] shadow-md flex items-center justify-center"
            >
              <Zap className="w-3.5 h-3.5 text-white fill-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 2. BRAND TITLE */}
      <h2 className={`font-black text-lg sm:text-xl tracking-tight uppercase leading-none mb-1.5 ${
        isDark ? 'text-white' : 'text-slate-950'
      }`}>
        {siteName.toUpperCase()}
      </h2>

      <p className={`text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5 ${
        isDark ? 'text-[#F55129]' : 'text-orange-600'
      }`}>
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>Instant Knowledge Arena</span>
      </p>

      {/* 3. DYNAMIC STATUS MESSAGE WITH FADE TRANSITION */}
      <div className="h-8 flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStatus}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={`text-xs sm:text-sm font-semibold max-w-xs ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {currentStatus}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 4. PROGRESS BAR */}
      <div className="w-48 sm:w-56 h-1.5 rounded-full overflow-hidden bg-black/20 border border-white/10 relative">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full rounded-full bg-gradient-to-r from-transparent via-[#F55129] to-emerald-400"
        />
      </div>

      {subMessage && (
        <p className={`text-[10px] mt-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {subMessage}
        </p>
      )}

      {/* 5. FOOTER TRUST BADGE */}
      <div className={`mt-6 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% Verified M-Pesa Real-Time Settled</span>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors backdrop-blur-md ${
      isDark ? 'bg-[#0B0E14]/95 text-[#F8FAFC]' : 'bg-[#F8FAFC]/95 text-slate-900'
    }`}>
      {content}
    </div>
  );
};
