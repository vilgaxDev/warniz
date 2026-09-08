import React from 'react';
import {
  Search, Sun, Moon, Gift, Bell, Bookmark, Info, Plus, ArrowUpRight,
  Wallet, LogIn, ChevronDown, Check, X, Sparkles, User
} from 'lucide-react';
import { UserState, UserProfile } from '../types';
import { ProfileDropdown } from './ProfileDropdown';
import { SquareCategoryFilter } from './SquareCategoryFilter';
import { TrivquestLogo } from './TrivquestLogo';

export interface PolymarketCategoryItem {
  id: string;
  name: string;
  icon: string;
  highlight?: boolean;
}

export const POLYMARKET_CATEGORIES: PolymarketCategoryItem[] = [
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'combos', name: 'Combos', icon: '⚡' },
  { id: 'perps', name: 'Perps', icon: '📈' },
  { id: 'breaking', name: 'Breaking', icon: '🚨' },
  { id: 'new', name: 'New', icon: '✦' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'sports', name: 'Sports', icon: '🏆' },
  { id: 'crypto', name: 'Crypto', icon: '🪙' },
  { id: 'esports', name: 'Esports', icon: '🎮' },
  { id: 'iran', name: 'Iran', icon: '🇮🇷' },
  { id: 'finance', name: 'Finance', icon: '💼' },
  { id: 'geopolitics', name: 'Geopolitics', icon: '🌍' },
  { id: 'tech', name: 'Tech', icon: '🤖' },
  { id: 'culture', name: 'Culture', icon: '🎭' },
  { id: 'economy', name: 'Economy', icon: '📊' },
  { id: 'weather', name: 'Weather', icon: '🌤️' },
  { id: 'mentions', name: 'Mentions', icon: '💬' },
  { id: 'elections', name: 'Elections', icon: '🗳️' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'more', name: 'More', icon: '➕' },
];


interface WalletBarProps {
  userState: UserState;
  userProfile: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (subId: string) => void;
  onToggleSound?: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenLeaderboard: () => void;
  onOpenHowItWorks: () => void;
  onOpenDailyRewards: () => void;
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
  onOpenProfile: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  isProfileDropdownOpen: boolean;
  onToggleProfileDropdown: () => void;
  onCloseProfileDropdown: () => void;
  onSelectNav: (navKey: any) => void;
  onLogout: () => void;
  onOpenMobileProfile?: () => void;
  onOpenMobileCategories?: () => void;
  categoryItems?: any[];
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  siteConfig?: {
    siteName?: string;
    headerAnnouncement?: string;
    headerAnnouncementEnabled?: boolean;
    headerBadge?: string;
    headerCtaText?: string;
  };
}

export const WalletBar: React.FC<WalletBarProps> = ({
  userState,
  userProfile,
  searchQuery,
  onSearchChange,
  selectedSubcategory,
  onSelectSubcategory,
  onOpenNotifications,
  unreadCount,
  onOpenLeaderboard,
  onOpenHowItWorks,
  onOpenDailyRewards,
  onDepositClick,
  onWithdrawClick,
  onOpenAuth,
  isProfileDropdownOpen,
  onToggleProfileDropdown,
  onCloseProfileDropdown,
  onSelectNav,
  onLogout,
  onOpenMobileProfile,
  onOpenMobileCategories,
  categoryItems,
  theme,
  onToggleTheme,
  siteConfig,
}) => {
  const isDark = theme === 'dark';
  const cfg = siteConfig ?? {
    siteName: 'Trivquest',
    headerAnnouncement: '⚡ Win up to 100,000 KES on live speed trivia games!',
    headerAnnouncementEnabled: true,
    headerBadge: 'SPEED TRIVIA (+100 XP)',
    headerCtaText: 'PLAY NOW',
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors backdrop-blur-md will-change-transform ${
      isDark ? 'bg-[#0B0E14]/95 text-[#F8FAFC] shadow-lg shadow-black/50' : 'bg-white/95 text-slate-900 shadow-md shadow-slate-200/70'
    }`}>
      {/* ANNOUNCEMENT BAR */}
      {cfg.headerAnnouncementEnabled && cfg.headerAnnouncement && (
        <div className={`w-full text-[11px] font-bold tracking-wide text-center py-1.5 px-4 truncate border-b flex items-center justify-center gap-2 ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950 via-[#101c2b] to-emerald-950 text-emerald-300 border-emerald-500/25'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-emerald-900 border-emerald-200'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block shrink-0" />
          <span className="truncate">{cfg.headerAnnouncement}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            FAST PAYOUTS
          </span>
        </div>
      )}
      {/* 1. TOP MAIN HEADER BAR */}
      <div className={`border-b w-full ${isDark ? 'border-[#222C3E] bg-[#0B0E14]/95' : 'border-slate-200 bg-white/95'}`}>
        <div className="max-w-[1440px] mx-auto px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative w-full">
          
          {/* LEFT: Trivquest Brand Logo & Search Input */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo Mark */}
            <div
              onClick={() => onSelectSubcategory('all')}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 select-none group"
            >
              <TrivquestLogo size="md" theme={theme} />
            </div>

            {/* Desktop / Tablet Search Bar */}
            <div className="relative flex-1 hidden md:block max-w-md">
              <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                isDark ? 'text-[#94A3B8]' : 'text-slate-400'
              }`}>
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search quizzes, topics & markets..."
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm font-normal transition-all outline-none ${
                  isDark
                    ? 'bg-[#121722] border border-[#222C3E] text-[#F8FAFC] placeholder-[#94A3B8]/70 focus:border-slate-400 focus:bg-[#182030] focus:ring-1 focus:ring-slate-400/30'
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${
                    isDark ? 'text-[#94A3B8] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT CONTROLS: Theme, Bell, Auth (Sign In & Sign Up fitting 100% on phone) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Theme Toggle Button (Yellow Sun / Moon) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-[#182030]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 stroke-[2.3]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 stroke-[2.3]" />
              )}
            </button>

            {/* Notification Bell with Red Badge Dot (Visible ONLY when logged in) */}
            {userProfile.isLoggedIn && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer relative ${
                  isDark
                    ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#182030]'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className={`absolute top-1 right-1 min-w-[7px] h-[7px] rounded-full bg-[#EF4444] ring-2 ${
                    isDark ? 'ring-[#0B0E14]' : 'ring-white'
                  }`} />
                )}
              </button>
            )}

            {/* Desktop Navigation Links */}
            {userProfile.isLoggedIn && (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenDailyRewards}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-[#94A3B8] hover:text-white hover:bg-[#182030]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Daily Rewards"
                >
                  <Gift className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenLeaderboard}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'text-[#94A3B8] hover:text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Leaderboard</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenHowItWorks}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'text-[#94A3B8] hover:text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>How It Works</span>
                </button>
              </div>
            )}

            {/* USER AUTH SECTION: Sign In & Sign Up OR Logged In Profile */}
            {userProfile.isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Wallet Balance Chip */}
                <div
                  onClick={() => onSelectNav('wallet')}
                  className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold cursor-pointer transition-all ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-950/60 to-[#121f2d] border-emerald-500/40 hover:border-emerald-400 text-emerald-400 shadow-sm shadow-emerald-500/20'
                      : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[85px] sm:max-w-none font-mono">
                    KSh {userState.walletBalance.toLocaleString()}
                  </span>
                  {onDepositClick && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDepositClick();
                      }}
                      className="hidden sm:block p-0.5 rounded-md bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors cursor-pointer ml-0.5 shadow-xs"
                      title="Deposit"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  )}
                </div>

                {/* Profile Trigger Button */}
                <button
                  type="button"
                  onClick={onToggleProfileDropdown}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border transition-all cursor-pointer ${
                    isProfileDropdownOpen
                      ? isDark
                        ? 'bg-[#182030] border-slate-400 text-white'
                        : 'bg-slate-200 border-slate-400 text-slate-900'
                      : isDark
                        ? 'bg-[#121722] border-[#222C3E] text-white hover:border-slate-400'
                        : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
                  }`}
                  title="Account Profile"
                >
                  <div className="relative">
                    <span className="text-xs sm:text-sm">{userProfile.avatar || '👤'}</span>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] ring-1 ${
                      isDark ? 'ring-[#0B0E14]' : 'ring-white'
                    }`} />
                  </div>
                  <span className="hidden sm:inline text-xs font-bold max-w-[70px] truncate">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180 text-slate-200' : ''}`} />
                </button>
              </div>
            ) : (
              /* LOGGED OUT: Sign In and Sign Up buttons tailored to fit on all mobile widths */
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Sign In Button */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className={`px-2 sm:px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap rounded-lg ${
                    isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  Sign In
                </button>

                {/* Sign Up Solid Button - High-energy vibrant gradient */}
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 hover:brightness-110 shadow-emerald-500/25"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown Component */}
          <ProfileDropdown
            isOpen={isProfileDropdownOpen}
            onClose={onCloseProfileDropdown}
            userProfile={userProfile}
            userState={userState}
            onSelectNav={onSelectNav}
            onOpenAuth={() => onOpenAuth('signin')}
            onLogout={onLogout}
            onOpenDeposit={() => {
              if (onDepositClick) onDepositClick();
            }}
            onOpenWithdraw={() => {
              if (onWithdrawClick) onWithdrawClick();
              else onSelectNav('withdraw');
            }}
            unreadCount={unreadCount}
            theme={theme}
          />
        </div>
      </div>

      {/* 2. SUBHEADER SINGLE-LINE POLYMARKET CATEGORY NAV BAR */}
      <SquareCategoryFilter
        selectedCategoryId={selectedSubcategory}
        onSelectCategory={onSelectSubcategory}
        theme={theme}
        items={categoryItems}
      />

    </header>
  );
};
