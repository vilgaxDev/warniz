import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Gift,
  Bell,
  Wallet,
  ChevronDown,
  X,
  Target,
  Plus,
  Compass,
  LayoutGrid,
  Trophy,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { UserState, UserProfile } from '../types';
import { ProfileDropdown } from './ProfileDropdown';
import { SquareCategoryFilter } from './SquareCategoryFilter';
import { TrivquestLogo } from './TrivquestLogo';

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
  onOpenQuizBets?: () => void;
  siteConfig?: {
    siteName?: string;
    headerAnnouncement?: string;
    headerAnnouncementEnabled?: boolean;
    headerBadge?: string;
    headerCtaText?: string;
  };
  onCategoryClick?: (category: string) => void;
  selectedCategoryId?: string | null;
}

export const WalletBar: React.FC<WalletBarProps> = ({
  userState,
  userProfile,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  unreadCount,
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
  theme = 'dark',
  onToggleTheme,
  onOpenQuizBets,
  siteConfig,
  onCategoryClick,
  selectedCategoryId,
}) => {
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full transition-colors backdrop-blur-md bg-[var(--card)]/90 border-b border-[var(--border)]">
      {/* 1. ANNOUNCEMENT STRIP (if enabled) */}
      {siteConfig?.headerAnnouncementEnabled && siteConfig?.headerAnnouncement && (
        <div
          onClick={() => onCategoryClick && onCategoryClick('all')}
          className="w-full text-[11px] font-medium tracking-wide text-center py-1 px-4 truncate border-b border-[var(--border)] flex items-center justify-center gap-2 cursor-pointer bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
          <span className="truncate">{siteConfig.headerAnnouncement}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)]">
            INSTANT CASHOUTS
          </span>
        </div>
      )}

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* LEFT ZONE: Logo & Primary Nav Links */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div
            onClick={() => {
              if (onCategoryClick) onCategoryClick('all');
              navigate('/');
            }}
            className="cursor-pointer select-none"
          >
            <TrivquestLogo size="md" theme={theme} />
          </div>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
            <button
              type="button"
              onClick={() => {
                if (onCategoryClick) onCategoryClick('all');
                navigate('/');
              }}
              className="px-2.5 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenMobileCategories) {
                  onOpenMobileCategories();
                } else {
                  const el = document.getElementById('categories-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-2.5 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => navigate('/leaderboard')}
              className="px-2.5 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Leaderboard
            </button>
          </nav>
        </div>

        {/* CENTER ZONE: Search Bar */}
        <div className="flex-1 max-w-sm sm:max-w-md hidden sm:block">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search trivia, topics & categories..."
              className="w-full pl-8.5 pr-8 py-1.5 rounded-lg text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT ZONE: Utility Controls & User Profile / Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--danger)]" />
            )}
          </button>

          {/* User Auth or Profile Button */}
          {userProfile.isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Wallet Chip */}
              <div
                onClick={() => onSelectNav('wallet')}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold cursor-pointer hover:border-[var(--border-strong)] transition-colors"
                title="Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="tabular-nums font-mono font-bold text-[var(--text-primary)] text-[11px] sm:text-xs">
                  KES {userState.walletBalance.toLocaleString()}
                </span>
              </div>

              {/* Green Deposit Button */}
              {onDepositClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDepositClick();
                  }}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Deposit Funds via M-PESA"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden xs:inline sm:inline">Deposit</span>
                </button>
              )}

              {/* Red Withdraw Button */}
              {onWithdrawClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWithdrawClick();
                  }}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-extrabold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Instant Cashout / Withdraw"
                >
                  <ArrowUpFromLine className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden xs:inline sm:inline">Withdraw</span>
                </button>
              )}

              {/* Profile Trigger */}
              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 640 && onOpenMobileProfile) {
                    onOpenMobileProfile();
                  } else {
                    onToggleProfileDropdown();
                  }
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                  isProfileDropdownOpen
                    ? 'bg-[var(--surface-hover)] border-[var(--border-strong)] text-[var(--text-primary)]'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[10px] text-[var(--accent-text)] font-bold shrink-0">
                  {userProfile.name ? userProfile.name[0].toUpperCase() : 'P'}
                </div>
                <span className="hidden md:inline font-medium max-w-[90px] truncate text-[var(--text-primary)]">
                  {userProfile.name ? userProfile.name.split(' ')[0] : 'Player'}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Green Deposit Button for Guests */}
              <button
                type="button"
                onClick={() => {
                  if (onDepositClick) onDepositClick();
                  else onOpenAuth('signin');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Instant Deposit via M-PESA"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors cursor-pointer shadow-xs"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => navigate('/viral')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                <Target className="w-3 h-3" />
                <span>Demo</span>
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

      {/* 3. SUBHEADER HORIZONTAL CATEGORY NAVIGATION */}
      <SquareCategoryFilter
        selectedCategoryId={selectedCategoryId || 'all'}
        onSelectCategory={onCategoryClick || (() => {})}
        theme={theme}
        items={categoryItems && categoryItems.length > 0 ? categoryItems : undefined}
      />
    </header>
  );
};
