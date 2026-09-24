import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserState, QuizSessionState, NotificationItem, UserProfile, TransactionRecord, QuestionHistoryItem, QuizCategory } from './types';
import { QUIZ_CATEGORIES, SPEED_MODES, REWARD_LADDER, INITIAL_NOTIFICATIONS, generateRewardLadder, getStreakMultiplier } from './data/quizData';
import { INITIAL_USER_PROFILE, INITIAL_TRANSACTIONS, INITIAL_QUESTION_HISTORY } from './data/userProfileData';
import { WalletBar } from './components/WalletBar';
import { HomePage } from './components/HomePage';
import { LeaderboardModal } from './components/LeaderboardModal';
import { QuestionCard } from './components/QuestionCard';
import { ResultModal } from './components/ResultModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { LiveArenaModal } from './components/LiveArenaModal';
import { QuizEntryModal } from './components/QuizEntryModal';
import { MobileProfileDrawer } from './components/MobileProfileDrawer';
import { MobileCategoriesDrawer } from './components/MobileCategoriesDrawer';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizBetsSidebar } from './components/QuizBetsSidebar';
import { BettingSlipModal } from './components/BettingSlipModal';

import { SiteFooter } from './components/SiteFooter';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { User, Play, Sparkles, Layers, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  // Page Loading State
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Connecting to Trivquest Speed Arenas...');

  // Theme state ('dark' | 'light') - Default to dark mode or user stored choice, with authentic Polymarket styling
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('player_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prev: 'dark' | 'light') => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('player_theme', next);
      return next;
    });
  };

  // Synchronize document root classes and colorScheme with theme
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Remote site branding/config from admin backend
  const [siteConfig, setSiteConfig] = useState<{
    siteName: string;
    headerAnnouncement: string;
    headerAnnouncementEnabled: boolean;
    headerBadge: string;
    headerCtaText: string;
    bannerSlides: Array<{
      id: string; title: string; subtitle: string; badge: string;
      badgeColor: string; rewardPool: string; volume: string;
      participants: number; endsIn: string; icon: string;
      gradient: string; difficulty: string; questionsCount: number; tags: string[];
    }>;
    categoriesList?: Array<{
      id: string; name: string; icon?: string; badge?: string;
    }>;
    minDepositAmount: number;
    minWithdrawAmount: number;
  }>({
    siteName: 'Trivquest',
    headerAnnouncement: '⚡ Win up to 100,000 KES on live speed trivia games!',
    headerAnnouncementEnabled: true,
    headerBadge: 'SPEED TRIVIA (+100 XP)',
    headerCtaText: 'PLAY NOW',
    bannerSlides: [],
    categoriesList: [],
    minDepositAmount: 200,
    minWithdrawAmount: 500,
  });

  // User Profile State & Auth
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'wallet' | 'questions' | 'edit' | 'terms' | 'privacy' | 'withdraw'>('profile');

  // Profile Dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  // Polymarket Header Modal States
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isDailyRewardsOpen, setIsDailyRewardsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isLiveArenaOpen, setIsLiveArenaOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isQuizBetsOpen, setIsQuizBetsOpen] = useState<boolean>(false);

  // Mobile Side Drawers State (Left = Profile, Right = Categories)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);

  // M-PESA Deposit & Withdrawal Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [noQuestionsCategory, setNoQuestionsCategory] = useState<string | null>(null);
  const [isBettingSlipOpen, setIsBettingSlipOpen] = useState<boolean>(false);
  const [bettingSlipData, setBettingSlipData] = useState<{
    playerName: string;
    category: string;
    mode: string;
    questionsCorrect: number;
    totalQuestions: number;
    winnings: number;
    stake: number;
    timestamp: string;
    questions: QuestionHistoryItem[];
  } | null>(null);

  // Search & Polymarket Category Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Transactions & Question History State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>(INITIAL_QUESTION_HISTORY);

  // User Global State - Initialize with 0 balance, will be loaded from backend when logged in
  const [userState, setUserState] = useState<UserState>({
    walletBalance: 0,
    currentWinnings: 0,
    streak: 0,
    maxStreak: 0,
    soundEnabled: true,
    xpPoints: 0,
  });

  // Boot & Dynamic Site Loading Screen (1800ms)
  useEffect(() => {
    if (isPageLoading) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isPageLoading]);

  // Fetch remote site branding + theme config from admin
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/theme`, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        setSiteConfig(prev => ({
          ...prev,
          siteName: data.site_name || 'Trivquest',
          headerAnnouncement: data.header_announcement || '⚡ Win up to 100,000 KES on live speed trivia games!',
          headerAnnouncementEnabled: data.header_announcement_enabled === '1' || data.header_announcement_enabled === true,
          headerBadge: data.header_badge || 'SPEED TRIVIA (+100 XP)',
          headerCtaText: data.header_cta_text || 'PLAY NOW',
          minDepositAmount: parseFloat(data.min_deposit_amount) || 200,
          minWithdrawAmount: parseFloat(data.min_withdraw_amount) || 500,
          categoriesList: (() => {
            const rawCat = data.categories_list || localStorage.getItem('admin_categories_list');
            if (!rawCat) return [];
            try {
              const parsed = typeof rawCat === 'string' ? JSON.parse(rawCat) : rawCat;
              if (!Array.isArray(parsed)) return [];
              return parsed.filter((c: any) => c.is_active !== false);
            } catch { return []; }
          })(),
          bannerSlides: (() => {
            if (!data.banner_slides) return [];
            try {
              const raw = typeof data.banner_slides === 'string' ? JSON.parse(data.banner_slides) : data.banner_slides;
              if (!Array.isArray(raw)) return [];
              // Map admin banner format -> FeaturedSlide format
              return raw.map((s: any, i: number) => ({
                id: s.id || `slide-${i}`,
                categoryId: s.categoryId || 'general',
                title: s.title || '',
                subtitle: s.subtitle || '',
                badge: s.badge || '',
                badgeColor: s.badgeColor || 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                rewardPool: s.rewardPool || '',
                volume: s.volume || '',
                participants: s.participants || 0,
                endsIn: s.endsIn || '',
                icon: s.icon || '🎯',
                gradient: s.gradient || 'from-neutral-950 via-zinc-900 to-black',
                difficulty: s.difficulty || 'Medium',
                questionsCount: s.questionsCount || 10,
                tags: Array.isArray(s.tags) ? s.tags : (s.tags ? s.tags.split(',').map((t: string) => t.trim()) : []),
              }));
            } catch { return []; }
          })(),
        }));
        // Apply the admin-configured default theme for the player site
        if (data.theme_mode === 'dark' || data.theme_mode === 'light') {
          setTheme(prev => {
            // Only apply remote default if user hasn't manually toggled
            const saved = localStorage.getItem('player_theme');
            return saved ? prev : data.theme_mode;
          });
        }
      })
      .catch(() => {/* silently ignore – use defaults */});
  }, []);

  // Check for existing auth state on load & sync with backend
  useEffect(() => {
    // Clear demo balance on normal pages (not demo page)
    // Demo balance should only exist on ViralPage (/viral)
    if (window.location.pathname !== '/viral') {
      localStorage.removeItem('demo_balance');
      console.log('[AUTH] Cleared demo balance from localStorage (not on demo page)');
    }

    // Check for selected category from CategoryPage navigation
    const selectedCategoryForQuiz = localStorage.getItem('selected_category_for_quiz');
    if (selectedCategoryForQuiz) {
      setSelectedCategoryId(selectedCategoryForQuiz);
      localStorage.removeItem('selected_category_for_quiz');
      // Auto-open stake modal after a short delay
      setTimeout(() => {
        handleOpenStakeModal(selectedCategoryForQuiz);
      }, 500);
    }

    const storedProfile = localStorage.getItem('user_profile');
    const storedToken = localStorage.getItem('player_token');
    console.log('[AUTH] Checking auth state:', { hasProfile: !!storedProfile, hasToken: !!storedToken, pathname: window.location.pathname });

    let profile = null;
    if (storedProfile && storedToken) {
      try {
        profile = JSON.parse(storedProfile);
        // Only set profile if it's marked as logged in
        if (profile.isLoggedIn) {
          setUserProfile(profile);
          // DON'T set balance from localStorage - it might be stale
          // Always wait for backend sync to get real balance
          console.log('[AUTH] User logged in, syncing with backend for real balance...');
        } else {
          // Profile exists but not logged in, clear it
          localStorage.removeItem('user_profile');
          localStorage.removeItem('player_token');
          localStorage.removeItem('player_data');
          setUserProfile(INITIAL_USER_PROFILE);
          setUserState(prev => ({ ...prev, walletBalance: 0 }));
          return;
        }
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        localStorage.removeItem('user_profile');
        localStorage.removeItem('player_token');
        setUserProfile(INITIAL_USER_PROFILE);
        setUserState(prev => ({ ...prev, walletBalance: 0 }));
        return;
      }

      // Re-verify session and fetch fresh player data & balance from backend
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      fetch(`${apiUrl}/api/player/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Accept': 'application/json',
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const playerData = await res.json();
            const numericBalance = parseFloat(playerData.balance || '0');
            console.log('[AUTH] Backend sync successful, real balance:', numericBalance);
            setUserProfile(prev => {
              const updated = {
                ...prev,
                isLoggedIn: true,
                id: String(playerData.id || prev.id),
                name: playerData.name || prev.name || playerData.phone_number,
                email: playerData.email || prev.email || '',
                phone: playerData.phone_number || prev.phone,
                walletBalance: numericBalance,
              };
              localStorage.setItem('user_profile', JSON.stringify(updated));
              localStorage.setItem('player_data', JSON.stringify(playerData));
              return updated;
            });
            setUserState(prev => ({ ...prev, walletBalance: numericBalance }));
          } else if (res.status === 401) {
            // Token expired or invalid on backend
            console.warn('[AUTH] Token expired, clearing session');
            localStorage.removeItem('player_token');
            localStorage.removeItem('player_data');
            localStorage.removeItem('user_profile');
            setUserProfile(INITIAL_USER_PROFILE);
            setUserState(prev => ({ ...prev, walletBalance: 0 }));
          }
        })
        .catch(err => {
          console.error('[AUTH] Backend sync failed:', err);
          // If backend is unreachable, keep using stored profile if logged in
          // Otherwise, clear session
          if (!userProfile.isLoggedIn) {
            localStorage.removeItem('player_token');
            localStorage.removeItem('player_data');
            localStorage.removeItem('user_profile');
            setUserProfile(INITIAL_USER_PROFILE);
            setUserState(prev => ({ ...prev, walletBalance: 0 }));
          } else {
            // Logged in but backend unreachable - use stored profile balance as fallback
            console.log('[AUTH] Backend unreachable, using stored profile balance as fallback');
            if (profile.walletBalance !== undefined) {
              setUserState(prev => ({ ...prev, walletBalance: Number(profile.walletBalance) || 0 }));
            }
          }
        });
    } else {
      // No stored profile or token, ensure logged out state
      setUserProfile(INITIAL_USER_PROFILE);
      setUserState(prev => ({ ...prev, walletBalance: 0 }));
    }

    // Check for email verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verificationToken = urlParams.get('token');

    if (verificationToken) {
      // Auto-verify email when token is present
      handleEmailVerification(verificationToken);
    }
  }, []);

  const handleEmailVerification = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/player/email/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Email verified successfully! You can now login.');
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        // Open auth modal in login mode
        setAuthMode('signin');
        setIsAuthOpen(true);
      } else {
        alert('Verification failed: ' + (data.error || 'Invalid token'));
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    }
  };

  // Notifications State - empty initially, populated from API
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Category & Speed Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSpeedModeId, setSelectedSpeedModeId] = useState<string>('speed_round');

  // Quiz Entry Stake Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(false);
  const [entryCategory, setEntryCategory] = useState<QuizCategory>(QUIZ_CATEGORIES[0]);

  // Active Quiz Session State
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizSession, setQuizSession] = useState<QuizSessionState>({
    categoryId: 'kenya',
    categoryName: 'Kenya',
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: null,
    isAnswered: false,
    isCorrect: null,
    accumulatedWinnings: 0,
    streakCount: 0,
    timerSeconds: 12,
    roundTimerSeconds: 15,
    totalRoundSeconds: 15,
    isGameOver: false,
    gameOverReason: null,
    floatingEarnings: [],
    stakeAmount: 20,
    rewardLadder: REWARD_LADDER,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle category click from header - navigate to category page
  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      navigate('/category/all');
    } else {
      // Map category ID to URL slug
      const categoryIdToSlug: Record<string, string> = {
        'basketball': 'basketball',
        'football': 'football',
        'general_knowledge': 'general-knowledge',
        'kenya': 'kenya',
        'world_cup': 'world-cup',
        'sports': 'sports',
        'tech': 'tech',
        'finance': 'finance',
        'geopolitics': 'geopolitics',
        'crypto': 'crypto',
        'politics': 'politics',
        'esports': 'esports',
        'entertainment': 'entertainment',
        'trending': 'trending',
      };
      
      const slug = categoryIdToSlug[category] || category;
      navigate(`/category/${slug}`);
    }
  };

  // Navigation from Dropdown / Header
  const handleSelectNav = (
    navKey: 'profile' | 'wallet' | 'withdraw' | 'transactions' | 'questions' | 'notifications' | 'password' | 'forgot_password' | 'settings' | 'terms' | 'privacy'
  ) => {
    setIsProfileDropdownOpen(false);

    if (navKey === 'notifications') {
      setShowNotifications(true);
      return;
    }

    if (navKey === 'terms') {
      setProfileModalTab('terms');
      setIsProfileOpen(true);
      return;
    }

    if (navKey === 'privacy') {
      setProfileModalTab('privacy');
      setIsProfileOpen(true);
      return;
    }

    // Require Auth for User-specific features
    if (!userProfile.isLoggedIn) {
      setAuthMode('signin');
      setIsAuthOpen(true);
      return;
    }

    if (navKey === 'withdraw') {
      setProfileModalTab('withdraw');
      setIsProfileOpen(true);
      return;
    }

    if (navKey === 'transactions') {
      setProfileModalTab('wallet');
      setIsProfileOpen(true);
      return;
    }

    if (['password', 'forgot_password', 'settings'].includes(navKey)) {
      setProfileModalTab('edit');
      setIsProfileOpen(true);
      return;
    }

    if (['profile', 'wallet', 'questions'].includes(navKey)) {
      setProfileModalTab(navKey as any);
      setIsProfileOpen(true);
    }
  };

  // Auth & Profile Handlers
  const handleLogin = (updatedProfile: UserProfile) => {
    console.log('[AUTH] handleLogin called with profile:', updatedProfile);
    setUserProfile(updatedProfile);
    setIsAuthOpen(false);

    // Sync wallet balance to userState immediately
    const balance = (updatedProfile as any).walletBalance !== undefined
      ? Number((updatedProfile as any).walletBalance)
      : 0;
    setUserState(prev => ({ ...prev, walletBalance: balance }));
    
    // Store the updated profile in localStorage for persistence
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    
    setNotifications((prev: NotificationItem[]) => [
      {
        id: `n_${Date.now()}`,
        title: '🔑 Logged In Successfully',
        message: `Welcome, ${updatedProfile.name || updatedProfile.phone}!`,
        time: 'Just now',
        type: 'market',
        read: false,
      },
      ...prev,
    ]);

    // Reload the page to refresh the application state
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleLogout = async () => {
    // Call backend logout if token exists
    const token = localStorage.getItem('player_token');
    if (token) {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        await fetch(`${apiUrl}/api/player/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear local storage
    localStorage.removeItem('player_token');
    localStorage.removeItem('player_data');
    localStorage.removeItem('user_profile');

    setUserProfile((prev: UserProfile) => ({
      ...prev,
      id: '',
      name: '',
      email: '',
      phone: '',
      isLoggedIn: false,
    }));
    setUserState((prev: UserState) => ({
      ...prev,
      walletBalance: 0,
      currentWinnings: 0,
      streak: 0,
    }));
    setIsProfileOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMobileProfileOpen(false);

    setNotifications((prev: NotificationItem[]) => [
      {
        id: `n_${Date.now()}`,
        title: '👋 Signed Out',
        message: 'You have signed out of your account.',
        time: 'Just now',
        type: 'market',
        read: false,
      },
      ...prev,
    ]);

    // Reload the page to refresh the application state
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const handleOpenDepositModal = () => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
    } else {
      setIsDepositModalOpen(true);
    }
  };

  const handleOpenWithdrawModal = () => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
    } else {
      setIsWithdrawModalOpen(true);
    }
  };

  const handleDeposit = (amount: number, phone?: string) => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
      return;
    }

    console.log('[TRANSACTION] Deposit verification received from backend - refreshing balance:', { amount, phone, userId: userProfile.id });
    
    // Refresh balance from backend since backend already credited the account
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('player_token');
    
    if (token) {
      fetch(`${apiUrl}/api/player/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const playerData = await res.json();
            const numericBalance = parseFloat(playerData.balance || '0');
            setUserState(prev => ({ ...prev, walletBalance: numericBalance }));
            setUserProfile(prev => ({
              ...prev,
              walletBalance: numericBalance,
            }));
          }
        })
        .catch(err => {
          console.error('[TRANSACTION] Failed to refresh balance after deposit:', err);
        });
    }

    console.log('[TRANSACTION] Deposit verified - balance refreshed from backend');

    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        title: '💵 Deposit Confirmed',
        message: `KSh ${amount.toLocaleString()} added to your wallet balance via M-PESA.`,
        time: 'Just now',
        type: 'deposit',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleWithdraw = (amount: number, phone?: string) => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
      return;
    }

    console.log('[TRANSACTION] Withdrawal initiated:', { amount, phone, userId: userProfile.id });
    
    if (amount > userState.walletBalance) {
      console.error('[TRANSACTION] Withdrawal failed: Insufficient funds', { amount, balance: userState.walletBalance });
      alert('Insufficient wallet funds.');
      return;
    }

    setUserState((prev) => ({ ...prev, walletBalance: prev.walletBalance - amount }));

    const mpesaNumber = phone || userProfile.phone || '+254712345678';
    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount,
      title: 'M-PESA Cashout',
      timestamp: 'Just now',
      status: 'completed',
      mpesaRef: `WS${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    console.log('[TRANSACTION] Withdrawal completed:', { txId: newTx.id, amount, mpesaNumber });

    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        title: '🚀 M-PESA Payout Dispatched',
        message: `KSh ${amount.toLocaleString()} sent to ${mpesaNumber}.`,
        time: 'Just now',
        type: 'withdrawal',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleClaimDailyReward = (amount: number) => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
      return;
    }

    // Refresh balance from backend instead of manually adding
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('player_token');
    
    if (token) {
      fetch(`${apiUrl}/api/player/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const playerData = await res.json();
            const numericBalance = parseFloat(playerData.balance || '0');
            setUserState(prev => ({ ...prev, walletBalance: numericBalance }));
            setUserProfile(prev => ({
              ...prev,
              walletBalance: numericBalance,
            }));
          }
        })
        .catch(err => {
          console.error('[DAILY REWARD] Failed to refresh balance:', err);
        });
    }

    setUserState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
    }));
    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        title: '🎁 Daily Streak Bonus Claimed!',
        message: `+KSh ${amount} bonus credited to your wallet balance.`,
        time: 'Just now',
        type: 'quiz',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleToggleSound = () => {
    setUserState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Dynamic Database-backed Categories List
  const activeCategoriesList = React.useMemo(() => {
    if (siteConfig.categoriesList && siteConfig.categoriesList.length > 0) {
      const activeCategories = siteConfig.categoriesList
        .filter((c: any) => c.is_active !== false) // Only show active categories
        .map((c: any) => {
          const match = QUIZ_CATEGORIES.find((q) => q.id === c.id || q.name.toLowerCase() === c.name?.toLowerCase());
          return {
            id: c.id || c.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: c.name,
            icon: c.icon || match?.icon || '🇰🇪',
            badge: c.badge || match?.badge || '',
            subtitle: c.subtitle || c.description || match?.subtitle || 'Heritage, Culture & Trivia',
            questionsCount: c.questionsCount || 6,
            durationSeconds: 12,
            pool: c.pool || 'KSh 25,000 Pool',
            questions: match?.questions || (QUIZ_CATEGORIES[0]?.questions ?? []),
            gradient: match?.gradient || 'from-violet-500 to-purple-600',
          };
        });
      
      // Return empty array if no active categories (don't fall back to hardcoded list)
      if (activeCategories.length === 0) {
        return [];
      }
      
      return activeCategories;
    }
    // Only fall back to hardcoded list if no DB config at all
    return QUIZ_CATEGORIES;
  }, [siteConfig.categoriesList]);

  // Map categories to SquareCategoryFilter format for header navigation
  const headerCategories = React.useMemo(() => {
    return activeCategoriesList.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      badge: cat.badge,
      gradient: cat.gradient || 'from-violet-500 to-purple-600',
    }));
  }, [activeCategoriesList]);

  // Filter Categories based on Polymarket subcategory pills & Search Query
  const filteredCategories = activeCategoriesList.filter((cat) => {
    // Category filter from header
    if (selectedCategoryId && selectedCategoryId !== 'all') {
      if (cat.id !== selectedCategoryId && !cat.id.includes(selectedCategoryId)) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchSub = cat.subtitle?.toLowerCase().includes(q);
      if (!matchName && !matchSub) return false;
    }

    // Subcategory pill filter
    if (selectedSubcategory === 'all') return true;
    if (selectedSubcategory === 'trending') return true;
    if (selectedSubcategory === 'combos' || selectedSubcategory === 'breaking') return true;
    if (selectedSubcategory === cat.id) return true;

    return cat.id === selectedSubcategory;
  });

  // Open the Stake Confirmation Modal before starting a game
  // First: check if questions are available for the category in the backend
  const handleOpenStakeModal = async (catId?: string) => {
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
      return;
    }

    const targetId = catId || selectedCategoryId || 'kenya';
    const cat = activeCategoriesList.find((c) => c.id === targetId || c.name.toLowerCase() === targetId.toLowerCase() || c.id.includes(targetId) || targetId.includes(c.id))
             || QUIZ_CATEGORIES.find((c) => c.id === targetId || c.name.toLowerCase() === targetId.toLowerCase() || c.id.includes(targetId) || targetId.includes(c.id))
             || QUIZ_CATEGORIES[0];

    setSelectedCategoryId(cat.id);
    setEntryCategory(cat);

    setLoadingMessage(`Checking ${cat.name} Questions...`);
    setIsPageLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/quiz/public-questions?category=${encodeURIComponent(cat.name)}`);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      const hasQuestions = data.questions && Array.isArray(data.questions) && data.questions.length > 0;

      if (!hasQuestions) {
        setIsPageLoading(false);
        setNoQuestionsCategory(cat.name);
        return;
      }

      // Questions are available, open stake modal
      setIsPageLoading(false);
      setIsEntryModalOpen(true);
    } catch (err) {
      console.error('[STAKE] Error checking questions availability:', err);
      setIsPageLoading(false);
      setNoQuestionsCategory(cat.name);
    }
  };

  // Start a new Speed Quiz Session - Fetches real questions directly from DB Generator
  const startQuizSession = async (targetCategoryId?: string, targetSpeedModeId?: string, stakeAmount: number = 20) => {
    // Require authentication before allowing quiz play
    if (!userProfile.isLoggedIn) {
      handleOpenAuthModal('signin');
      return;
    }

    const effectiveStake = stakeAmount;

    const catId = targetCategoryId || selectedCategoryId || 'kenya';
    const modeId = targetSpeedModeId || selectedSpeedModeId;

    const cat = activeCategoriesList.find((c) => c.id === catId || c.name.toLowerCase() === catId.toLowerCase() || c.id.includes(catId) || catId.includes(c.id))
             || QUIZ_CATEGORIES.find((c) => c.id === catId || c.name.toLowerCase() === catId.toLowerCase() || c.id.includes(catId) || catId.includes(c.id))
             || QUIZ_CATEGORIES[0];

    const mode = SPEED_MODES.find((m) => m.id === modeId) || SPEED_MODES[0];

    setSelectedCategoryId(cat.id);
    setSelectedSpeedModeId(modeId);

    // Deduct stake from wallet balance if greater than 0
    if (effectiveStake > 0) {
      // SECURITY: Prevent demo mode from deducting real money
      if (window.location.pathname === '/viral') {
        console.log('[QUIZ] Demo mode - skipping real stake deduction');
        setUserState((prev) => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - effectiveStake),
          currentWinnings: 0,
          streak: 0,
        }));
        const entryTx: TransactionRecord = {
          id: `tx_${Date.now()}`,
          type: 'entry_fee',
          amount: effectiveStake,
          title: `${cat.name} Speed Quiz Stake (DEMO)`,
          timestamp: 'Just now',
          status: 'completed',
        };
        setTransactions((prev) => [entryTx, ...prev]);
      } else {
        try {
          // Deduct stake from backend wallet
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
          const token = localStorage.getItem('player_token');
          
          const res = await fetch(`${baseUrl}/api/player/deduct-stake`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              amount: effectiveStake,
              category: cat.name,
              mode: mode.name,
            }),
          });

          if (!res.ok) {
            console.error('[QUIZ] Failed to deduct stake from backend:', res.status);
            alert('Failed to deduct stake. Please try again.');
            return;
          }

          const data = await res.json();
          console.log('[QUIZ] Stake deducted from backend:', data);

          // Update local state with new balance from backend
          if (data.balance !== undefined) {
            setUserState((prev) => ({
              ...prev,
              walletBalance: parseFloat(data.balance),
              currentWinnings: 0,
              streak: 0,
            }));
            setUserProfile(prev => ({
              ...prev,
              walletBalance: parseFloat(data.balance),
            }));
            localStorage.setItem('user_profile', JSON.stringify({
              ...userProfile,
              walletBalance: parseFloat(data.balance),
            }));
          } else {
            // Fallback: deduct from local state if backend doesn't return balance
            setUserState((prev) => ({
              ...prev,
              walletBalance: Math.max(0, prev.walletBalance - effectiveStake),
              currentWinnings: 0,
              streak: 0,
            }));
          }

          const entryTx: TransactionRecord = {
            id: `tx_${Date.now()}`,
            type: 'entry_fee',
            amount: effectiveStake,
            title: `${cat.name} Speed Quiz Stake`,
            timestamp: 'Just now',
            status: 'completed',
          };
          setTransactions((prev) => [entryTx, ...prev]);

          // Save entry fee to database
          try {
            const saveRes = await fetch(`${baseUrl}/api/quiz/record-entry-fee`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                amount: effectiveStake,
                category: cat.name,
                mode: mode.name,
              }),
            });
            console.log('[QUIZ] Entry fee saved to database:', await saveRes.json());
          } catch (saveError) {
            console.error('[QUIZ] Failed to save entry fee to database:', saveError);
          }
        } catch (error) {
          console.error('[QUIZ] Error deducting stake:', error);
          alert('Failed to deduct stake. Please check your connection.');
          return;
        }
      }
    }

    // Dynamic reward ladder scaled to the stake amount!
    const sessionLadder = generateRewardLadder(effectiveStake, mode.questionsCount);

    console.log('[QUIZ] Starting quiz session');
    console.log('[QUIZ] Category:', cat.name, 'ID:', cat.id);
    console.log('[QUIZ] Mode:', mode.name, 'Questions count:', mode.questionsCount);
    console.log('[QUIZ] Effective stake:', effectiveStake);

    setLoadingMessage(`Loading ${cat.name} Questions from Database...`);
    setIsPageLoading(true);

    console.log('[QUIZ] Fetching questions from DB for category:', cat.name);

    let dbQuestions: any[] = [];

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/quiz/public-questions?category=${encodeURIComponent(cat.name)}`);
      
      console.log('[QUIZ] Fetching questions from:', `${baseUrl}/api/quiz/public-questions?category=${encodeURIComponent(cat.name)}`);
      
      if (!res.ok) {
        console.error('[QUIZ] Failed to fetch questions:', res.status, res.statusText);
        throw new Error(`API returned ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[QUIZ] API response:', data);
      
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        dbQuestions = data.questions;
        console.log('[QUIZ] Successfully fetched questions:', dbQuestions.length);
      } else {
        console.warn('[QUIZ] No questions returned from API. Response:', data);
      }
    } catch (error) {
      console.error('[QUIZ] Error fetching questions:', error);
    }

    // No fallback to demo questions - must use DB questions only
    if (dbQuestions.length === 0) {
      console.error('[QUIZ] No questions available for category:', cat.name);
      console.error('[QUIZ] Category object:', cat);
      setIsPageLoading(false);
      setNoQuestionsCategory(cat.name);
      alert(`No questions available for ${cat.name}. Please try a different category.`);
      return;
    }

    console.log('[QUIZ] Starting quiz session with category:', cat.name, 'ID:', cat.id);
    console.log('[QUIZ] Mode:', mode.name, 'Questions count:', mode.questionsCount);
    console.log('[QUIZ] Effective stake:', effectiveStake);
    console.log('[QUIZ] Total questions fetched from DB:', dbQuestions.length);

    // Remove duplicate questions by ID to ensure no repeats in a session
    const uniqueQuestions = dbQuestions.filter((question, index, self) =>
      index === self.findIndex((q) => q.id === question.id)
    );
    
    console.log('[QUIZ] Unique questions after deduplication:', uniqueQuestions.length);
    
    // If not enough unique questions, use what's available and adjust mode
    if (uniqueQuestions.length < mode.questionsCount) {
      console.warn('[QUIZ] Not enough unique questions, using available:', uniqueQuestions.length);
      // Don't block the session - use available questions
    }

    // Enhanced randomization: multiple shuffle passes with different algorithms
    const shuffledQuestions = [...uniqueQuestions]
      .sort(() => Math.random() - 0.5) // Random sort
      .sort(() => Math.random() - 0.5) // Second random sort
      .reverse() // Reverse order
      .sort(() => Math.random() - 0.5) // Third random sort
      .slice(0, mode.questionsCount + 5) // Take extra questions
      .sort(() => Math.random() - 0.5) // Shuffle again
      .slice(0, Math.min(mode.questionsCount, uniqueQuestions.length)); // Take available count

    // Final deduplication check
    const finalQuestions = shuffledQuestions.filter((question, index, self) =>
      index === self.findIndex((q) => q.id === question.id)
    );
    
    console.log('[QUIZ] Final questions after deduplication:', finalQuestions.length);
    console.log('[QUIZ] Question IDs:', finalQuestions.map(q => q.id));

    // Check for duplicates in final selection
    const questionIds = finalQuestions.map(q => q.id);
    const uniqueIds = new Set(questionIds);
    if (uniqueIds.size !== questionIds.length) {
      console.error('[QUIZ] ERROR: Duplicate questions found in final selection!');
      alert('Error: Duplicate questions detected. Please try again.');
      setIsPageLoading(false);
      return;
    }

    setTimeout(() => {
      console.log('[QUIZ] Setting quiz session state');
      setQuizSession({
        categoryId: cat.id,
        categoryName: cat.name,
        questions: finalQuestions,
        currentQuestionIndex: 0,
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        accumulatedWinnings: 0,
        streakCount: 0,
        timerSeconds: 12,
        roundTimerSeconds: mode.durationSeconds,
        totalRoundSeconds: mode.durationSeconds,
        isGameOver: false,
        gameOverReason: null,
        floatingEarnings: [],
        stakeAmount: effectiveStake,
        rewardLadder: sessionLadder,
      });

      console.log('[QUIZ] Setting isQuizActive to true');
      setIsQuizActive(true);
      setIsPageLoading(false);
    }, 300);
  };

  // Timer Tick during active round - Single round timer
  useEffect(() => {
    if (!isQuizActive || quizSession.isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setQuizSession((prev) => {
        // Prevent negative values
        const newRoundTimer = Math.max(0, prev.roundTimerSeconds - 1);

        // Check if round timer expired - END GAME
        if (newRoundTimer === 0 && prev.roundTimerSeconds > 0) {
          clearInterval(timerRef.current!);
          setUserState((userState) => ({
            ...userState,
            currentWinnings: 0,
            streak: 0,
          }));
          return {
            ...prev,
            roundTimerSeconds: 0,
            isAnswered: true,
            isCorrect: false,
            accumulatedWinnings: 0,
            floatingEarnings: [],
            streakCount: 0,
            isGameOver: true,
            gameOverReason: 'timeout',
          };
        }

        // Normal tick - decrement round timer
        return {
          ...prev,
          roundTimerSeconds: newRoundTimer,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizActive, quizSession.isGameOver]);

  // Handle Option Selection
  const handleSelectOption = (index: number) => {
    // Prevent answering if already answered, game over, or timer expired
    if (quizSession.isAnswered || quizSession.isGameOver) return;
    if (quizSession.roundTimerSeconds <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = quizSession.questions[quizSession.currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;

    const activeLadder = (quizSession.rewardLadder && quizSession.rewardLadder.length > 0)
      ? quizSession.rewardLadder
      : REWARD_LADDER;

    const currentLadderStep = activeLadder[quizSession.currentQuestionIndex] || {
      rewardKsh: (quizSession.currentQuestionIndex + 1) * 3,
    };

    // Calculate streak multiplier: 2 in a row = 2x, 3-4 = 3x, 5+ = 5x
    const activeMultiplier = getStreakMultiplier(quizSession.streakCount);
    const questionReward = isCorrect ? Math.round(currentLadderStep.rewardKsh * activeMultiplier) : 0;

    const newAccumulated = isCorrect
      ? quizSession.accumulatedWinnings + questionReward
      : quizSession.accumulatedWinnings;

    const newStreak = isCorrect ? quizSession.streakCount + 1 : 0;

    // Record question history
    const historyItem: QuestionHistoryItem = {
      id: `qh_${Date.now()}`,
      category: quizSession.categoryName,
      questionText: currentQ.question,
      userAnswer: currentQ.options[index],
      correctAnswer: currentQ.options[currentQ.correctIndex],
      isCorrect,
      rewardKsh: questionReward,
      timestamp: 'Just now',
    };
    setQuestionHistory((prev) => [historyItem, ...prev]);

    if (isCorrect) {
      setUserState((prev) => ({
        ...prev,
        currentWinnings: newAccumulated,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        xpPoints: prev.xpPoints + 15,
      }));

      const isFinalQuestion = quizSession.currentQuestionIndex + 1 >= quizSession.questions.length;

      setQuizSession((prev) => ({
        ...prev,
        selectedOption: index,
        isAnswered: true,
        isCorrect: true,
        accumulatedWinnings: newAccumulated,
        streakCount: newStreak,
        floatingEarnings: [
          ...prev.floatingEarnings,
          { id: Date.now(), amount: questionReward },
        ],
        isGameOver: isFinalQuestion,
        gameOverReason: isFinalQuestion ? 'completed' : null,
      }));

      if (!isFinalQuestion) {
        setTimeout(() => {
          setQuizSession((prev) => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
            selectedOption: null,
            isAnswered: false,
            isCorrect: null,
            // Round timer continues, do NOT reset
          }));
        }, 1300);
      }
    } else {
      setUserState((prev) => ({
        ...prev,
        currentWinnings: 0,
        streak: 0,
      }));

      setQuizSession((prev) => ({
        ...prev,
        selectedOption: index,
        isAnswered: true,
        isCorrect: false,
        accumulatedWinnings: 0,
        floatingEarnings: [],
        streakCount: 0,
        isGameOver: true,
        gameOverReason: 'wrong_answer',
      }));
    }
  };

  // Cash Out handler during active game
  const handleCashOut = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const win = quizSession.accumulatedWinnings;

    // SECURITY: Prevent demo mode from adding real money
    if (window.location.pathname === '/viral') {
      console.log('[CASHOUT] Demo mode - skipping real winnings addition');
      setUserState((prev) => ({
        ...prev,
        currentWinnings: 0,
      }));
      if (win > 0) {
        const tx: TransactionRecord = {
          id: `tx_${Date.now()}`,
          type: 'quiz_reward',
          amount: win,
          title: `Cashout: ${quizSession.categoryName} (DEMO)`,
          timestamp: 'Just now',
          status: 'completed',
        };
        setTransactions((prev) => [tx, ...prev]);
      }
    } else {
      // Add winnings to backend balance
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('player_token');
      
      if (token && win > 0) {
        try {
          const res = await fetch(`${apiUrl}/api/player/add-winnings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              amount: win,
              category: quizSession.categoryName,
              questions_correct: quizSession.streakCount,
              total_questions: quizSession.questions.length,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            console.log('[CASHOUT] Winnings added to backend:', data);
            
            // Update local state with new balance from backend
            if (data.balance !== undefined) {
              setUserState(prev => ({ ...prev, walletBalance: parseFloat(data.balance) }));
              setUserProfile(prev => ({
                ...prev,
                walletBalance: parseFloat(data.balance),
              }));
              localStorage.setItem('user_profile', JSON.stringify({
                ...userProfile,
                walletBalance: parseFloat(data.balance),
              }));
            }
          } else {
            console.error('[CASHOUT] Failed to add winnings:', res.status);
          }
        } catch (err) {
          console.error('[CASHOUT] Error adding winnings:', err);
        }
      } else if (token) {
        // Just refresh balance if no winnings
        try {
          const res = await fetch(`${apiUrl}/api/player/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
          if (res.ok) {
            const playerData = await res.json();
            const numericBalance = parseFloat(playerData.balance || '0');
            setUserState(prev => ({ ...prev, walletBalance: numericBalance }));
            setUserProfile(prev => ({
              ...prev,
              walletBalance: numericBalance,
            }));
          }
        } catch (err) {
          console.error('[CASHOUT] Failed to refresh balance:', err);
        }
      }

      setUserState((prev) => ({
        ...prev,
        currentWinnings: 0,
      }));

      if (win > 0) {
        const tx: TransactionRecord = {
          id: `tx_${Date.now()}`,
          type: 'quiz_reward',
          amount: win,
          title: `Cashout: ${quizSession.categoryName}`,
          timestamp: 'Just now',
          status: 'completed',
        };
        setTransactions((prev) => [tx, ...prev]);

        // Save quiz reward to database
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
          const saveRes = await fetch(`${baseUrl}/api/quiz/record-reward`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              amount: win,
              category: quizSession.categoryName,
              questions_correct: quizSession.streakCount,
              total_questions: quizSession.questions.length,
            }),
          });
          console.log('[QUIZ] Quiz reward saved to database:', await saveRes.json());
        } catch (saveError) {
          console.error('[QUIZ] Failed to save quiz reward to database:', saveError);
        }

        setNotifications((prev) => [
          {
            id: `n_${Date.now()}`,
            title: '💰 Cashout Locked In!',
            message: `KSh ${win} credited to your wallet balance.`,
            time: 'Just now',
            type: 'quiz',
            read: false,
          },
          ...prev,
        ]);
      }
    }

    setQuizSession((prev) => ({
      ...prev,
      isGameOver: true,
      gameOverReason: 'cashed_out',
    }));
  };

  const handleClaimAndContinue = async () => {
    if (quizSession.accumulatedWinnings > 0 && quizSession.gameOverReason !== 'cashed_out') {
      // SECURITY: Prevent demo mode from adding real money
      if (window.location.pathname === '/viral') {
        console.log('[CLAIM] Demo mode - skipping real winnings addition');
        setUserState((prev) => ({
          ...prev,
          currentWinnings: 0,
        }));
        const win = quizSession.accumulatedWinnings;
        const tx: TransactionRecord = {
          id: `tx_${Date.now()}`,
          type: 'quiz_reward',
          amount: win,
          title: `Round Payout: ${quizSession.categoryName} (DEMO)`,
          timestamp: 'Just now',
          status: 'completed',
        };
        setTransactions((prev) => [tx, ...prev]);
      } else {
        // Add winnings to backend balance
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const token = localStorage.getItem('player_token');
        const win = quizSession.accumulatedWinnings;
        
        if (token) {
          try {
            const res = await fetch(`${apiUrl}/api/player/add-winnings`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                amount: win,
                category: quizSession.categoryName,
                questions_correct: quizSession.streakCount,
                total_questions: quizSession.questions.length,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              console.log('[CLAIM] Winnings added to backend:', data);
              
              // Update local state with new balance from backend
              if (data.balance !== undefined) {
                setUserState((prev) => ({ ...prev, walletBalance: parseFloat(data.balance) }));
                setUserProfile(prev => ({
                  ...prev,
                  walletBalance: parseFloat(data.balance),
                }));
                localStorage.setItem('user_profile', JSON.stringify({
                  ...userProfile,
                  walletBalance: parseFloat(data.balance),
                }));
              }
            } else {
              console.error('[CLAIM] Failed to add winnings:', res.status);
            }
          } catch (err) {
            console.error('[CLAIM] Error adding winnings:', err);
          }
        }

        setUserState((prev) => ({
          ...prev,
          currentWinnings: 0,
        }));

        const tx: TransactionRecord = {
          id: `tx_${Date.now()}`,
          type: 'quiz_reward',
          amount: win,
          title: `Round Payout: ${quizSession.categoryName}`,
          timestamp: 'Just now',
          status: 'completed',
        };
        setTransactions((prev) => [tx, ...prev]);
      }
    }
    setIsQuizActive(false);
  };

  const handlePlayAgain = () => {
    if (quizSession.accumulatedWinnings > 0 && quizSession.gameOverReason !== 'cashed_out') {
      // Refresh balance from backend after claiming reward
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = localStorage.getItem('player_token');
      
      if (token) {
        fetch(`${apiUrl}/api/player/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
          .then(async (res) => {
            if (res.ok) {
              const playerData = await res.json();
              const numericBalance = parseFloat(playerData.balance || '0');
              setUserState(prev => ({ ...prev, walletBalance: numericBalance }));
              setUserProfile(prev => ({
                ...prev,
                walletBalance: numericBalance,
              }));
            }
          })
          .catch(err => {
            console.error('[PLAY AGAIN] Failed to refresh balance:', err);
          });
      }

      setUserState((prev) => ({
        ...prev,
        currentWinnings: 0,
      }));

      const tx: TransactionRecord = {
        id: `tx_${Date.now()}`,
        type: 'quiz_reward',
        amount: quizSession.accumulatedWinnings,
        title: `Round Payout: ${quizSession.categoryName}`,
        timestamp: 'Just now',
        status: 'completed',
      };
      setTransactions((prev) => [tx, ...prev]);
    }
    setIsQuizActive(false);
    handleOpenStakeModal(quizSession.categoryId);
  };

  const handleOpenAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleOpenLeaderboard = () => {
    setIsLeaderboardOpen(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen font-sans antialiased w-full max-w-full transition-colors duration-200 ${
      theme === 'dark'
        ? 'dark bg-[#090D15] text-[#F8FAFC] selection:bg-emerald-500/30 selection:text-emerald-300'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-700'
    }`}>
      {/* Main Content Layout */}
      <div className={`flex flex-col min-h-screen w-full max-w-full ${!isQuizActive ? 'pb-20 lg:pb-0' : 'pb-0'}`}>
        
        {/* Authentic Polymarket Header & Subheader (Hidden in active quiz mode for focused gaming immersion) */}
        {!isQuizActive && (
          <WalletBar
            userState={userState}
            userProfile={userProfile}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            onToggleSound={handleToggleSound}
            onOpenNotifications={() => setShowNotifications(true)}
            unreadCount={unreadCount}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
            onDepositClick={handleOpenDepositModal}
            onWithdrawClick={handleOpenWithdrawModal}
            onOpenProfile={() => {
              setIsProfileDropdownOpen((prev) => !prev);
            }}
            onOpenAuth={handleOpenAuthModal}
            isProfileDropdownOpen={isProfileDropdownOpen}
            onToggleProfileDropdown={() => setIsProfileDropdownOpen((prev) => !prev)}
            onCloseProfileDropdown={() => setIsProfileDropdownOpen(false)}
            onSelectNav={handleSelectNav}
            onLogout={handleLogout}
            onOpenMobileProfile={() => setIsMobileProfileOpen(true)}
            onOpenMobileCategories={() => setIsMobileCategoriesOpen(true)}
            onOpenQuizBets={() => setIsQuizBetsOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            siteConfig={siteConfig}
            onCategoryClick={handleCategoryClick}
            selectedCategoryId={selectedCategoryId}
            categoryItems={headerCategories}
          />
        )}

        {/* Main Content Area */}
        <main className="w-full flex-1 flex flex-col">
          {!isQuizActive ? (
            <>
              {/* Home Page with Interactive Hero & Market Sliders */}
              <HomePage
                categories={filteredCategories.length > 0 ? filteredCategories : activeCategoriesList}
                speedModes={SPEED_MODES}
                selectedCategoryId={selectedCategoryId}
                selectedSpeedModeId={selectedSpeedModeId}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={setSelectedSubcategory}
                onSelectCategory={setSelectedCategoryId}
                onSelectSpeedMode={setSelectedSpeedModeId}
                onPlayCategory={(catId) => handleOpenStakeModal(catId)}
                onOpenLeaderboard={handleOpenLeaderboard}
                onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
                currentUserWinnings={userState.walletBalance}
                currentUserStreak={userState.streak}
                theme={theme}
                bannerSlides={siteConfig.bannerSlides.length > 0 ? siteConfig.bannerSlides : undefined}
              />

              {/* Comprehensive Trivquest Site Footer */}
              <SiteFooter
                onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
                onOpenLeaderboard={handleOpenLeaderboard}
                onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
                onOpenDeposit={handleOpenDepositModal}
                onOpenWithdraw={handleOpenWithdrawModal}
                onSelectCategory={(catId) => {
                  setSelectedCategoryId(catId);
                  handleOpenStakeModal(catId);
                }}
                theme={theme}
              />
            </>
          ) : (
            /* Active Full-Screen Immersive Quiz Arena */
            <QuestionCard
              categoryName={quizSession.categoryName}
              categoryIcon={
                QUIZ_CATEGORIES.find((c) => c.id === quizSession.categoryId)?.icon || '🇰🇪'
              }
              question={quizSession.questions[quizSession.currentQuestionIndex]}
              currentQuestionIndex={quizSession.currentQuestionIndex}
              totalQuestions={quizSession.questions.length}
              roundTimerSeconds={quizSession.roundTimerSeconds}
              totalRoundSeconds={quizSession.totalRoundSeconds}
              selectedOption={quizSession.selectedOption}
              isAnswered={quizSession.isAnswered}
              isCorrect={quizSession.isCorrect}
              accumulatedWinnings={quizSession.accumulatedWinnings}
              streakCount={quizSession.streakCount}
              floatingEarnings={quizSession.floatingEarnings}
              rewardLadder={quizSession.rewardLadder || REWARD_LADDER}
              walletBalance={userState.walletBalance}
              soundEnabled={userState.soundEnabled}
              onToggleSound={handleToggleSound}
              onSelectOption={handleSelectOption}
              onCashOut={handleCashOut}
              onExitQuiz={() => setIsQuizActive(false)}
              theme={theme}
              cashoutEnabled={false}
            />
          )}
        </main>
      </div>

      {/* Global Leaderboard Modal (Opens on Click) */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserWinnings={userState.walletBalance}
        currentUserStreak={userState.streak}
        onPlayArena={() => {
          setIsLeaderboardOpen(false);
          setIsLiveArenaOpen(true);
        }}
        theme={theme}
      />

      {/* Result Modal (Game Over / Cash Out / Victory) */}
      {isQuizActive && quizSession.isGameOver && (
        <ResultModal
          totalWon={quizSession.accumulatedWinnings}
          questionsCorrect={
            quizSession.isCorrect && quizSession.gameOverReason === 'completed'
              ? quizSession.questions.length
              : quizSession.currentQuestionIndex
          }
          totalQuestions={quizSession.questions.length}
          maxStreak={userState.maxStreak}
          reason={quizSession.gameOverReason}
          categoryName={quizSession.categoryName}
          onClaimAndContinue={handleClaimAndContinue}
          onPlayAgain={handlePlayAgain}
          theme={theme}
          stakeAmount={quizSession.stakeAmount}
          isDemo={!userProfile.isLoggedIn}
          onSignUp={() => handleOpenAuthModal('signup')}
          onShareBettingSlip={() => {
            const mode = SPEED_MODES.find(m => m.durationSeconds === quizSession.totalRoundSeconds);
            setBettingSlipData({
              playerName: userProfile.name || 'Guest Player',
              category: quizSession.categoryName,
              mode: mode?.name || 'Speed Quiz',
              questionsCorrect: quizSession.isCorrect && quizSession.gameOverReason === 'completed'
                ? quizSession.questions.length
                : quizSession.currentQuestionIndex,
              totalQuestions: quizSession.questions.length,
              winnings: quizSession.accumulatedWinnings,
              stake: quizSession.stakeAmount,
              timestamp: new Date().toLocaleString(),
              questions: questionHistory.slice(0, quizSession.currentQuestionIndex + 1),
            });
            setIsBettingSlipOpen(true);
          }}
        />
      )}

      {/* Activity & Notifications Modal */}
      {showNotifications && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
          onClearAll={() => setNotifications([])}
          onMarkRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
          onAddTestNotification={() => {
            const simulationPool: NotificationItem[] = [
              {
                id: `n_${Date.now()}_1`,
                title: '⚡ 3-Minute Live Quiz Starting!',
                message: 'Round in category "Kenya" starts in 45 seconds. Top prize: 500 XP & KSh 500!',
                time: 'Just now',
                type: 'quiz',
                icon: '⚡',
                read: false,
              },
              {
                id: `n_${Date.now()}_2`,
                title: '🔥 Daily Streak Preserved!',
                message: 'You have logged in 7 days in a row! 200 Bonus XP & KSh 50 credited to your account.',
                time: 'Just now',
                type: 'streak',
                icon: '🔥',
                read: false,
              },
              {
                id: `n_${Date.now()}_3`,
                title: '💰 M-Pesa Payout Processed!',
                message: 'Your instant withdrawal of KSh 1,450 has been sent to M-Pesa successfully.',
                time: 'Just now',
                type: 'withdrawal',
                icon: '💰',
                read: false,
              },
              {
                id: `n_${Date.now()}_4`,
                title: '🏆 Trivia Challenge Settled!',
                message: 'Your Premier League speed trivia round locked in KSh 350 cash prize!',
                time: 'Just now',
                type: 'quiz',
                icon: '🏆',
                read: false,
              },
            ];

            const randomAlert = simulationPool[Math.floor(Math.random() * simulationPool.length)];
            setNotifications((prev) => [randomAlert, ...prev]);
          }}
          theme={theme}
        />
      )}

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onLaunchDemo={() => {
          setIsHowItWorksOpen(false);
          navigate('/viral');
        }}
        theme={theme}
      />

      {/* Daily Streak & Gift Rewards Modal */}
      <DailyRewardsModal
        isOpen={isDailyRewardsOpen}
        onClose={() => setIsDailyRewardsOpen(false)}
        onClaimReward={handleClaimDailyReward}
        streak={userState.streak}
        theme={theme}
      />

      {/* Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onLogin={handleLogin}
        theme={theme}
        initialMode={authMode}
      />

      {/* Account Dashboard & Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        userState={userState}
        transactions={transactions}
        questionHistory={questionHistory}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onOpenDepositModal={handleOpenDepositModal}
        onOpenWithdrawModal={handleOpenWithdrawModal}
        initialTab={profileModalTab}
        theme={theme}
      />

      {/* DIRECT M-PESA EXPRESS DEPOSIT MODAL */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        userProfile={userProfile}
        userState={userState}
        onDeposit={handleDeposit}
        onOpenAuth={() => handleOpenAuthModal('signin')}
        theme={theme}
        minDepositAmount={siteConfig.minDepositAmount}
      />

      {/* DIRECT M-PESA INSTANT CASHOUT MODAL */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        userProfile={userProfile}
        userState={userState}
        onWithdraw={handleWithdraw}
        onOpenAuth={() => handleOpenAuthModal('signin')}
        theme={theme}
        minWithdrawAmount={siteConfig.minWithdrawAmount}
      />

      {/* Betting Slip Share Modal */}
      {bettingSlipData && (
        <BettingSlipModal
          isOpen={isBettingSlipOpen}
          onClose={() => setIsBettingSlipOpen(false)}
          playerName={bettingSlipData.playerName}
          category={bettingSlipData.category}
          mode={bettingSlipData.mode}
          questionsCorrect={bettingSlipData.questionsCorrect}
          totalQuestions={bettingSlipData.totalQuestions}
          winnings={bettingSlipData.winnings}
          stake={bettingSlipData.stake}
          timestamp={bettingSlipData.timestamp}
          questions={bettingSlipData.questions}
          theme={theme}
        />
      )}

      {/* QUIZ BETS SIDEBAR */}
      {isQuizBetsOpen && (
        <div className="fixed inset-y-0 right-0 w-80 z-50">
          <QuizBetsSidebar
            theme={theme}
            onClose={() => setIsQuizBetsOpen(false)}
          />
        </div>
      )}

      {/* MOBILE LEFT SIDE MENU: User Profile & Account Drawer */}
      <MobileProfileDrawer
        isOpen={isMobileProfileOpen}
        onClose={() => setIsMobileProfileOpen(false)}
        userProfile={userProfile}
        userState={userState}
        onSelectNav={handleSelectNav}
        onOpenAuth={handleOpenAuthModal}
        onLogout={handleLogout}
        onOpenDeposit={() => {
          setIsMobileProfileOpen(false);
          handleOpenDepositModal();
        }}
        onOpenWithdraw={() => {
          setIsMobileProfileOpen(false);
          handleOpenWithdrawModal();
        }}
        onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        unreadCount={unreadCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* MOBILE RIGHT SIDE MENU: Question Categories & Topics Drawer */}
      <MobileCategoriesDrawer
        isOpen={isMobileCategoriesOpen}
        onClose={() => setIsMobileCategoriesOpen(false)}
        categories={QUIZ_CATEGORIES}
        speedModes={SPEED_MODES}
        selectedCategoryId={selectedCategoryId || 'kenya'}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedSubcategory(catId);
        }}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onPlayCategory={(catId) => {
          setIsMobileCategoriesOpen(false);
          handleOpenStakeModal(catId);
        }}
        theme={theme}
      />

      {/* LIVE ARENA MATCHMAKER & MODES MODAL (TOPICS & SPEED SELECTOR) */}
      <LiveArenaModal
        isOpen={isLiveArenaOpen}
        onClose={() => setIsLiveArenaOpen(false)}
        categories={QUIZ_CATEGORIES}
        speedModes={SPEED_MODES}
        selectedCategoryId={selectedCategoryId || 'kenya'}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedSubcategory(catId);
        }}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onStartQuiz={(catId, modeId, stakeTier) => {
          // Require authentication before allowing quiz play
          if (!userProfile.isLoggedIn) {
            setIsLiveArenaOpen(false);
            handleOpenAuthModal('signin');
            return;
          }

          setIsLiveArenaOpen(false);
          let stakeVal = 20;
          if (stakeTier === 'free') stakeVal = 0;
          else if (stakeTier === 'casual_20') stakeVal = 20;
          else if (stakeTier === 'pro_50') stakeVal = 50;
          else if (stakeTier === 'high_100') stakeVal = 100;
          startQuizSession(catId, modeId, stakeVal);
        }}
        walletBalance={userState.walletBalance}
        theme={theme}
      />

      {/* PRE-QUIZ STAKE ENTRY & SPEED MODES MODAL */}
      <QuizEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        category={entryCategory}
        speedModes={SPEED_MODES}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onConfirmStart={startQuizSession}
        walletBalance={userState.walletBalance}
        onOpenDeposit={handleOpenDepositModal}
        onOpenAuth={() => handleOpenAuthModal('signin')}
        isLoggedIn={userProfile.isLoggedIn}
        theme={theme}
      />

      {/* ADMIN & MARKETER PORTAL MODAL */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={userProfile}
        theme={theme}
        onAddBroadcastNotification={(title, message, type) => {
          const newNotification: NotificationItem = {
            id: `n_broadcast_${Date.now()}`,
            title,
            message,
            time: 'Just now',
            type,
            icon: '📢',
            read: false,
          };
          setNotifications((prev) => [newNotification, ...prev]);
        }}
      />

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR: Always docked at bottom, fitting 100% left-to-right (Hidden in active quiz mode) */}
      {!isQuizActive && (
        <nav
          className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden w-full border-t transition-colors backdrop-blur-xl pb-[env(safe-area-inset-bottom)] ${
            theme === 'dark'
              ? 'bg-[#070709]/95 border-[#262933] text-[#F8FAFC]'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          }`}
        >
          <div className="w-full max-w-lg mx-auto grid grid-cols-3 items-center px-3 py-2">
            {/* Left: Open Profile Drawer */}
            <button
              onClick={() => setIsMobileProfileOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'hover:bg-zinc-800 text-slate-400 active:text-white'
                  : 'hover:bg-slate-100 text-slate-700 active:text-black'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                {userProfile.isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] ring-1 ring-[#050507]" />
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight">Profile</span>
            </button>

            {/* Center: Live Arena Modal Launcher */}
            <div className="flex items-center justify-center px-1">
              <button
                onClick={() => {
                  if (!userProfile.isLoggedIn) {
                    handleOpenAuthModal('signin');
                    return;
                  }
                  setIsLiveArenaOpen(true);
                }}
                className="w-full max-w-[120px] py-2 px-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="truncate">Live Arena</span>
              </button>
            </div>

            {/* Right: Open Categories Drawer */}
            <button
              onClick={() => setIsMobileCategoriesOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'hover:bg-zinc-800 text-emerald-400 active:text-emerald-300'
                  : 'hover:bg-emerald-50 text-emerald-600 active:text-emerald-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-[11px] font-bold tracking-tight">Topics</span>
            </button>
          </div>
        </nav>
      )}

      {/* Global Page & Transition Loading Screen with Animated Brand Logo */}
      <AnimatePresence>
        {isPageLoading && (
          <LoadingScreen
            theme={theme}
            message={loadingMessage}
            siteName={siteConfig.siteName}
          />
        )}
      </AnimatePresence>
      {/* No Questions Available Modal */}
      {noQuestionsCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-xl text-center font-sans ${
            theme === 'dark' ? 'bg-[#0f1117] border-[#262933] text-[#F5F5F5]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1">No Questions Available</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              No questions available for <span className="font-semibold text-emerald-400">{noQuestionsCategory}</span> at the moment. Please select another category or check back soon!
            </p>
            <button
              onClick={() => setNoQuestionsCategory(null)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition-all shadow-md cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
