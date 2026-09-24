import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, ArrowUpRight, History, Bell, Settings,
  LogOut, Plus, LogIn, X, ChevronRight, Wallet, Sparkles, HelpCircle, Gift,
  Sun, Moon, ShieldCheck, FileText, Zap, Flame, Eye, EyeOff, Target
} from 'lucide-react';
import { UserProfile, UserState } from '../types';
import { TrivquestIcon } from './TrivquestLogo';

interface MobileProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userState: UserState;
  onSelectNav: (navKey: 'profile' | 'wallet' | 'withdraw' | 'transactions' | 'questions' | 'notifications' | 'password' | 'forgot_password' | 'settings' | 'terms' | 'privacy') => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenDailyRewards: () => void;
  onOpenHowItWorks: () => void;
  unreadCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const MobileProfileDrawer: React.FC<MobileProfileDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  userState,
  onSelectNav,
  onOpenAuth,
  onLogout,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenDailyRewards,
  onOpenHowItWorks,
  unreadCount,
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [hidePhoneNumber, setHidePhoneNumber] = useState(() => {
    return localStorage.getItem('hidePhoneNumber') === 'true';
  });

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Save phone visibility preference
  useEffect(() => {
    localStorage.setItem('hidePhoneNumber', hidePhoneNumber.toString());
  }, [hidePhoneNumber]);

  // Mask phone number helper
  const maskPhoneNumber = (phone: string) => {
    if (!phone) return '-';
    if (!hidePhoneNumber) return phone;
    // Show last 4 digits only
    return phone.replace(/(\d{3})\d{5}(\d{3})/, '******$2');
  };

  const handleNav = (key: any) => {
    onSelectNav(key);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Left Drawer Container - Ultra-Compact & Slim for Phones */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative z-10 w-[62%] max-w-[225px] h-full flex flex-col shadow-2xl border-r overflow-hidden ${
              isDark
                ? 'bg-[#0B0E14] text-slate-100 border-[#1A2332]'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* 1. TOP HEADER */}
            <div className={`p-3 border-b flex items-center justify-between gap-2 ${
              isDark ? 'border-[#262933] bg-[#0f1117]' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2">
                <TrivquestIcon size={24} />
                <div>
                  <div className="font-black text-xs tracking-tight leading-none text-emerald-400">
                    TRIVQUEST
                  </div>
                  <div className={`text-[9px] font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Profile & Account
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close Profile Menu"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800/80 border-zinc-700 text-slate-300 hover:text-white'
                    : 'bg-slate-200 border-slate-300 text-slate-700 hover:text-black'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* User Identity Card */}
              <div className={`p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-[#16181f] border-[#262933]' : 'bg-slate-50 border-slate-200 shadow-2xs'
              }`}>
                {userProfile.isLoggedIn ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#050507]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-xs truncate">{userProfile.name || 'Player'}</h3>
                          {userProfile.id && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30 shrink-0">
                              #{userProfile.id}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-emerald-400 truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                          <span>{maskPhoneNumber(userProfile.phone || 'Online')}</span>
                          {userProfile.phone && (
                            <button
                              onClick={() => setHidePhoneNumber(!hidePhoneNumber)}
                              className="ml-1 text-emerald-400/60 hover:text-emerald-400 transition-colors cursor-pointer"
                              aria-label={hidePhoneNumber ? 'Show phone number' : 'Hide phone number'}
                            >
                              {hidePhoneNumber ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                          )}
                        </p>
                        {userProfile.email && (
                          <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {userProfile.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Balance & Streak Bar */}
                    <div className={`p-2 rounded-lg border flex items-center justify-between text-[11px] ${
                      isDark ? 'bg-[#0f1117] border-[#262933]' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div>
                          <span className={`text-[9px] uppercase tracking-wider block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Balance
                          </span>
                          <span className="text-xs font-black text-emerald-400">
                            KSh {userState.walletBalance.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={onOpenDeposit}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Deposit
                        </button>
                      </div>
                      <div className="text-right flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{userState.streak}d</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-1.5 space-y-2">
                    <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs">Quiz Arena Account</h3>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Sign in to withdraw winnings.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        onClick={() => {
                          onOpenAuth('signin');
                          onClose();
                        }}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                            : 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('signup');
                          onClose();
                        }}
                        className="py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => {
                          navigate('/viral');
                          onClose();
                        }}
                        className="py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5" />
                        Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Balance & Instant Cash Actions */}
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    M-Pesa Wallet
                  </span>
                  <Wallet className="w-3.5 h-3.5 text-[#00A344]" />
                </div>

                <div className="flex items-center justify-between mb-2.5">
                  <div className="font-mono-numbers text-lg font-extrabold text-[#00A344]">
                    KSh {userState.walletBalance.toLocaleString()}
                  </div>
                  <button
                    onClick={() => {
                      onOpenDeposit();
                      onClose();
                    }}
                    className="px-2 py-1 rounded-lg bg-[#00A344] hover:bg-[#008A38] active:scale-95 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Deposit</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      onOpenDeposit();
                      onClose();
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#00A344] hover:bg-[#008A38] active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Deposit</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenWithdraw();
                      onClose();
                    }}
                    className={`py-1.5 px-2 rounded-lg border font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#182030] border-[#EF4444]/40 hover:bg-[#EF4444] text-[#EF4444] hover:text-white'
                        : 'bg-white border-red-200 hover:bg-red-50 text-red-600'
                    }`}
                  >
                    <ArrowUpRight className="w-3 h-3 text-[#EF4444]" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>

              {/* Main Navigation Links */}
              <div className={`rounded-xl border divide-y overflow-hidden ${
                isDark ? 'bg-[#121927] border-slate-800 divide-slate-800/80' : 'bg-white border-slate-200 divide-slate-100 shadow-2xs'
              }`}>
                <button
                  onClick={() => handleNav('questions')}
                  className={`w-full p-2.5 flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">Question History</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    onOpenDailyRewards();
                    onClose();
                  }}
                  className={`w-full p-2.5 flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">Daily Rewards</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    FREE
                  </span>
                </button>

                <button
                  onClick={() => {
                    onOpenHowItWorks();
                    onClose();
                  }}
                  className={`w-full p-2.5 flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">How It Works</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>
              </div>

              {/* Theme & Preferences */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-[#16181f] border-[#262933]' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="text-xs font-semibold">{isDark ? 'Dark' : 'Light'}</span>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Toggle
                </button>
              </div>

              {/* Logout / Sign In Footer */}
              {userProfile.isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 text-rose-400 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                      : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
