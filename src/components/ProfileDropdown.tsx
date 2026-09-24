import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ArrowUpRight, History, Trophy, Bell, Key, Lock, Settings,
  FileText, ShieldCheck, LogOut, Plus, LogIn, X, ChevronRight, Wallet, Sparkles, HelpCircle, Gift, Eye, EyeOff,
  ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';
import { UserProfile, UserState } from '../types';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userState: UserState;
  onSelectNav: (navKey: 'profile' | 'wallet' | 'withdraw' | 'transactions' | 'questions' | 'notifications' | 'password' | 'forgot_password' | 'settings' | 'terms' | 'privacy') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  unreadCount: number;
  theme?: 'dark' | 'light';
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  userProfile,
  userState,
  onSelectNav,
  onOpenAuth,
  onLogout,
  onOpenDeposit,
  onOpenWithdraw,
  unreadCount,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(() => {
    return localStorage.getItem('hidePhoneNumber') === 'true';
  });

  // Save phone visibility preference
  useEffect(() => {
    localStorage.setItem('hidePhoneNumber', hidePhoneNumber.toString());
  }, [hidePhoneNumber]);

  // Function to mask phone number
  const maskPhoneNumber = (phone: string) => {
    if (!hidePhoneNumber) return phone;
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 4) return '*'.repeat(cleaned.length);
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleAction = (key: any) => {
    onSelectNav(key);
    onClose();
  };

  const handleDepositClick = () => {
    onOpenDeposit();
    onClose();
  };

  const handleWithdrawClick = () => {
    onOpenWithdraw();
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          />

          {/* Floating Dropdown Card */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`fixed lg:absolute top-16 sm:top-14 right-2 sm:right-4 z-50 w-[calc(100vw-1rem)] max-w-sm sm:w-88 rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-5rem)] font-sans ${
              isDark
                ? 'bg-[#0B0E14] border-[#1A2332] text-slate-100 shadow-2xl'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            {/* Header Card Section with User Details */}
            <div className="p-3.5 sm:p-4 shrink-0">
              {userProfile.isLoggedIn ? (
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-[#0f172a]/90 border-slate-800/90 shadow-md'
                      : 'bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Top Avatar & Profile Header Row */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-md">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                      </div>

                      {/* Name, Player ID, Phone, Email */}
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className={`font-bold text-sm sm:text-base truncate leading-tight ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {userProfile.name || 'Player'}
                          </h3>
                          {userProfile.id && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                              #{userProfile.id}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-emerald-400 truncate flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                          <span>{maskPhoneNumber(userProfile.phone || userProfile.email || 'Verified Player')}</span>
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
                          <p className={`text-[11px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {userProfile.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Profile Button */}
                    <button
                      onClick={() => handleAction('profile')}
                      className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Balance & Tier Stats */}
                  <div className={`mt-3.5 pt-3 border-t flex items-center justify-between gap-2 ${
                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                  }`}>
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold block ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        PORTFOLIO CASH
                      </span>
                      <span className="font-extrabold text-emerald-500 text-base sm:text-lg">
                        KES {userState.walletBalance.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase tracking-wider font-bold block ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        TIER RANK
                      </span>
                      <span className="font-bold text-amber-500 text-xs flex items-center justify-end gap-1">
                        <span>Level 12 Legend</span>
                        <span>🏆</span>
                      </span>
                    </div>
                  </div>

                  {/* Deposit & Withdraw Action Buttons with M-Pesa Branding */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDepositClick}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Deposit</span>
                    </button>

                    <button
                      onClick={handleWithdrawClick}
                      className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-rose-600/20 active:scale-95"
                    >
                      <ArrowUpFromLine className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest Player Card */
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-2.5">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-soft)] text-[var(--accent-text)] flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">Guest Player</h4>
                    <p className="text-xs mt-0.5 text-[var(--text-muted)]">Sign in to save KES quiz earnings & rank up.</p>
                  </div>
                  <button
                    onClick={() => {
                      onOpenAuth();
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Menu Items List */}
            <div className="px-2.5 pb-3 overflow-y-auto space-y-0.5 flex-1 custom-scrollbar">
              {/* Account Options Group */}
              <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Portfolio & Activity
              </div>

              <button
                onClick={() => handleAction('wallet')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  <span>Wallet & M-PESA Balances</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction('questions')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-emerald-500" />
                  <span>Quiz History & Audits</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction('notifications')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Notifications & Alerts</span>
                </div>
                {unreadCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                    {unreadCount}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Security & Settings Group */}
              <div className={`mt-2 pt-2 border-t px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                Security & Account
              </div>

              <button
                onClick={() => handleAction('settings')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings & Preferences</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction('password')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Security & PIN</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setHidePhoneNumber(!hidePhoneNumber)}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {hidePhoneNumber ? <Eye className="w-4 h-4 text-slate-500" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  <span>{hidePhoneNumber ? 'Show Phone Number' : 'Hide Phone Number'}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  hidePhoneNumber ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                }`}>
                  {hidePhoneNumber ? 'Hidden' : 'Visible'}
                </span>
              </button>

              {/* Legal & Compliance Group */}
              <div className={`mt-2 pt-2 border-t px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                Info & Legal
              </div>

              <button
                onClick={() => handleAction('terms')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Terms of Service</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction('privacy')}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Privacy Policy & Fair Play</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Logout Option */}
              {userProfile.isLoggedIn && (
                <div className={`mt-2 pt-2 border-t ${
                  isDark ? 'border-slate-800/60' : 'border-slate-200'
                }`}>
                  <button
                    onClick={handleLogoutClick}
                    className={`w-full p-2.5 rounded-xl flex items-center gap-2.5 text-xs font-bold transition-colors cursor-pointer ${
                      isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
