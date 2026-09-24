import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, ArrowUpRight, History, Bell, Settings,
  LogOut, Plus, LogIn, X, ChevronRight, Wallet, Sparkles, HelpCircle, Gift,
  Sun, Moon, ShieldCheck, FileText, Zap, Flame, Eye, EyeOff, Target,
  ArrowDownToLine, ArrowUpFromLine
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

          {/* Left Drawer Container - Modern & Compact for Phones */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-[78vw] max-w-[280px] h-full flex flex-col shadow-2xl border-r overflow-hidden bg-[var(--card)] text-[var(--text-primary)] border-[var(--border)]"
          >
            {/* 1. TOP HEADER */}
            <div className="p-3 border-b flex items-center justify-between gap-2 border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center gap-2">
                <TrivquestIcon size={26} />
                <div>
                  <div className="font-black text-xs tracking-tight leading-none text-[var(--accent)]">
                    TRIVQUEST
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Profile & Account
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close Profile Menu"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* User Identity Card */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {userProfile.isLoggedIn ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)] shadow-xs">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] ring-2 ring-[var(--card)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-xs truncate text-[var(--text-primary)]">{userProfile.name || 'Player'}</h3>
                          {userProfile.id && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-soft)] text-[var(--accent-text)] font-mono font-bold border border-[var(--border)] shrink-0">
                              #{userProfile.id}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-[var(--accent-text)] truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block shrink-0" />
                          <span>{maskPhoneNumber(userProfile.phone || 'Online')}</span>
                          {userProfile.phone && (
                            <button
                              onClick={() => setHidePhoneNumber(!hidePhoneNumber)}
                              className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                              aria-label={hidePhoneNumber ? 'Show phone number' : 'Hide phone number'}
                            >
                              {hidePhoneNumber ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                          )}
                        </p>
                        {userProfile.email && (
                          <p className="text-[10px] truncate text-[var(--text-muted)]">
                            {userProfile.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Balance & Streak Bar */}
                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block font-bold text-[var(--text-muted)]">
                          Balance
                        </span>
                        <span className="text-xs font-black text-emerald-500 font-mono">
                          KSh {userState.walletBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={onOpenDeposit}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                        >
                          <ArrowDownToLine className="w-3 h-3 stroke-[2.5]" />
                          Deposit
                        </button>
                        <button
                          onClick={onOpenWithdraw}
                          className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                        >
                          <ArrowUpFromLine className="w-3 h-3 stroke-[2.5]" />
                          Withdraw
                        </button>
                      </div>
                      <div className="text-right flex items-center gap-1 text-amber-500 font-bold pl-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{userState.streak}d</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 space-y-2">
                    <div className="w-9 h-9 mx-auto rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-text)]">
                      <User className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[var(--text-primary)]">Quiz Arena Account</h3>
                      <p className="text-[11px] mt-0.5 text-[var(--text-muted)]">
                        Sign in to play & withdraw cash winnings.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        onClick={() => {
                          onOpenAuth('signin');
                          onClose();
                        }}
                        className="py-1.5 rounded-lg text-xs font-bold border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('signup');
                          onClose();
                        }}
                        className="py-1.5 rounded-lg text-xs font-bold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs transition-colors cursor-pointer"
                      >
                        Sign Up
                      </button>
                      <button
                        onClick={() => {
                          navigate('/viral');
                          onClose();
                        }}
                        className="col-span-2 py-1.5 rounded-lg text-xs font-bold border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Target className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                        <span>Demo Arena</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Balance & Instant Cash Actions */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    M-Pesa Wallet
                  </span>
                  <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-base font-black text-emerald-500">
                    KES {userState.walletBalance.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onOpenDeposit();
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowDownToLine className="w-3 h-3 stroke-[2.5]" />
                      <span>Deposit</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenWithdraw();
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowUpFromLine className="w-3 h-3 stroke-[2.5]" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onOpenDeposit();
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Deposit M-Pesa</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenWithdraw();
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    <ArrowUpFromLine className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Withdraw Cash</span>
                  </button>
                </div>
              </div>

              {/* Main Navigation Links */}
              <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden bg-[var(--card)]">
                <button
                  onClick={() => handleNav('questions')}
                  className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">Question History</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                </button>

                <button
                  onClick={() => {
                    onOpenDailyRewards();
                    onClose();
                  }}
                  className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
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
                  className="w-full p-2.5 flex items-center justify-between text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">How It Works</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                </button>
              </div>

              {/* Theme & Preferences */}
              <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <button
                  onClick={onToggleTheme}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
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
                  className="w-full py-2 px-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
