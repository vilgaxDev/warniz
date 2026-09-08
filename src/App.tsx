import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserState, QuizSessionState, NotificationItem, UserProfile, TransactionRecord, QuestionHistoryItem } from './types';
import { QUIZ_CATEGORIES, SPEED_MODES, REWARD_LADDER, INITIAL_NOTIFICATIONS } from './data/quizData';
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
import { BotTraderModal } from './components/BotTraderModal';
import { LiveArenaModal } from './components/LiveArenaModal';
import { MobileProfileDrawer } from './components/MobileProfileDrawer';
import { MobileCategoriesDrawer } from './components/MobileCategoriesDrawer';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { LoadingScreen } from './components/LoadingScreen';
import { User, Play, Sparkles, Layers, AlertCircle } from 'lucide-react';

export default function App() {
  // Page Loading State
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Connecting to Live Prediction Markets...');

  // Theme state ('dark' | 'light') - Default to bright light mode unless user activates dark mode
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

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
    siteName: 'Predicta',
    headerAnnouncement: '⚡ Win up to 100,000 KES on live speed trivia games!',
    headerAnnouncementEnabled: true,
    headerBadge: 'SPEED TRIVIA (+100 XP)',
    headerCtaText: 'PLAY NOW',
    bannerSlides: [],
    categoriesList: [],
    minDepositAmount: 10,
    minWithdrawAmount: 50,
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
  const [isBotTraderOpen, setIsBotTraderOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isLiveArenaOpen, setIsLiveArenaOpen] = useState<boolean>(false);

  // Mobile Side Drawers State (Left = Profile, Right = Categories)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState<boolean>(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState<boolean>(false);

  // M-PESA Deposit & Withdrawal Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [noQuestionsCategory, setNoQuestionsCategory] = useState<string | null>(null);

  // Search & Polymarket Category Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Transactions & Question History State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryItem[]>(INITIAL_QUESTION_HISTORY);

  // User Global State
  const [userState, setUserState] = useState<UserState>({
    walletBalance: 1450,
    currentWinnings: 0,
    streak: 3,
    maxStreak: 6,
    soundEnabled: true,
    xpPoints: 480,
  });

  // Initial Boot Loading Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Fetch remote site branding + theme config from admin
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/theme`, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(data => {
        setSiteConfig(prev => ({
          ...prev,
          siteName: data.site_name || 'Predicta',
          headerAnnouncement: data.header_announcement || '⚡ Win up to 100,000 KES on live speed trivia games!',
          headerAnnouncementEnabled: data.header_announcement_enabled === '1' || data.header_announcement_enabled === true,
          headerBadge: data.header_badge || 'SPEED TRIVIA (+100 XP)',
          headerCtaText: data.header_cta_text || 'PLAY NOW',
          minDepositAmount: parseFloat(data.min_deposit_amount) || 10,
          minWithdrawAmount: parseFloat(data.min_withdraw_amount) || 50,
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
                gradient: s.gradient || 'from-blue-950/80 via-[#0f172a] to-[#0a0f19]',
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

  // Check for existing auth state on load
  useEffect(() => {
    const storedProfile = localStorage.getItem('user_profile');
    const storedToken = localStorage.getItem('player_token');

    if (storedProfile && storedToken) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        localStorage.removeItem('user_profile');
        localStorage.removeItem('player_token');
      }
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

  const toggleTheme = () => {
    setTheme((prev: 'dark' | 'light') => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('player_theme', next);
      return next;
    });
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Category & Speed Selection State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('kenya');
  const [selectedSpeedModeId, setSelectedSpeedModeId] = useState<string>('3min');

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
    isGameOver: false,
    gameOverReason: null,
    floatingEarnings: [],
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setUserProfile(updatedProfile);
    setIsAuthOpen(false);
    
    // Store the updated profile in localStorage for persistence
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    
    setNotifications((prev: NotificationItem[]) => [
      {
        id: `n_${Date.now()}`,
        title: '🔑 Welcome to Polymarket!',
        message: `Signed in as ${updatedProfile.name}.`,
        time: 'Just now',
        type: 'market',
        read: false,
      },
      ...prev,
    ]);
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

    setUserProfile((prev: UserProfile) => ({ ...prev, isLoggedIn: false }));
    setIsProfileOpen(false);
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
    setUserState((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));

    const mpesaNumber = phone || userProfile.phone || '+254712345678';
    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      title: 'M-PESA Express Deposit',
      timestamp: 'Just now',
      status: 'completed',
      mpesaRef: `RK${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        title: '💵 Deposit Confirmed',
        message: `KSh ${amount.toLocaleString()} added to your wallet balance via M-PESA (${mpesaNumber}).`,
        time: 'Just now',
        type: 'deposit',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleWithdraw = (amount: number, phone?: string) => {
    if (amount > userState.walletBalance) {
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
    setUserState((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
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
            badge: c.badge || match?.badge || 'LIVE',
            subtitle: c.subtitle || c.description || match?.subtitle || 'Heritage, Culture & Trivia',
            questionsCount: c.questionsCount || 6,
            durationSeconds: 12,
            pool: c.pool || 'KSh 25,000 Pool',
            questions: match?.questions || (QUIZ_CATEGORIES[0]?.questions ?? []),
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

  // Filter Categories based on Polymarket subcategory pills & Search Query
  const filteredCategories = activeCategoriesList.filter((cat) => {
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

  // Start a new Speed Quiz Session - Fetches real questions directly from DB Generator
  const startQuizSession = async (targetCategoryId?: string, targetSpeedModeId?: string, _stakeTier?: string) => {
    const catId = targetCategoryId || selectedCategoryId;
    const modeId = targetSpeedModeId || selectedSpeedModeId;

    const cat = activeCategoriesList.find((c) => c.id === catId || c.name.toLowerCase() === catId.toLowerCase() || c.id.includes(catId) || catId.includes(c.id))
             || QUIZ_CATEGORIES.find((c) => c.id === catId || c.name.toLowerCase() === catId.toLowerCase() || c.id.includes(catId) || catId.includes(c.id))
             || QUIZ_CATEGORIES[0];

    const mode = SPEED_MODES.find((m) => m.id === modeId) || SPEED_MODES[0];

    setSelectedCategoryId(cat.id);
    setSelectedSpeedModeId(modeId);

    setLoadingMessage(`Loading ${cat.name} Questions from Database...`);
    setIsPageLoading(true);

    let dbQuestions: any[] = [];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/quiz/public-questions?category=${encodeURIComponent(cat.name)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          dbQuestions = data.questions;
        }
      }
    } catch {
      clearTimeout(timeoutId);
    }

    // If category has no questions in DB, show 'No questions available at the moment' alert
    if (dbQuestions.length === 0) {
      setIsPageLoading(false);
      setNoQuestionsCategory(cat.name);
      return;
    }

    const shuffledQuestions = [...dbQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, mode.questionsCount);

    setTimeout(() => {
      setQuizSession({
        categoryId: cat.id,
        categoryName: cat.name,
        questions: shuffledQuestions,
        currentQuestionIndex: 0,
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        accumulatedWinnings: 0,
        streakCount: 0,
        timerSeconds: 12,
        isGameOver: false,
        gameOverReason: null,
        floatingEarnings: [],
      });

      setIsQuizActive(true);
      setIsPageLoading(false);
    }, 300);
  };

  // Timer Tick during active question
  useEffect(() => {
    if (!isQuizActive || quizSession.isAnswered || quizSession.isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setQuizSession((prev) => {
        if (prev.timerSeconds <= 1) {
          clearInterval(timerRef.current!);
          return {
            ...prev,
            timerSeconds: 0,
            isAnswered: true,
            isCorrect: false,
            isGameOver: true,
            gameOverReason: 'timeout',
          };
        }
        return {
          ...prev,
          timerSeconds: prev.timerSeconds - 1,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizActive, quizSession.currentQuestionIndex, quizSession.isAnswered, quizSession.isGameOver]);

  // Handle Option Selection
  const handleSelectOption = (index: number) => {
    if (quizSession.isAnswered || quizSession.isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = quizSession.questions[quizSession.currentQuestionIndex];
    const isCorrect = index === currentQ.correctIndex;

    const currentLadderStep = REWARD_LADDER[quizSession.currentQuestionIndex] || {
      rewardKsh: (quizSession.currentQuestionIndex + 1) * 3,
    };
    const questionReward = isCorrect ? currentLadderStep.rewardKsh : 0;

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
            timerSeconds: 12,
          }));
        }, 1300);
      }
    } else {
      setUserState((prev) => ({
        ...prev,
        streak: 0,
      }));

      setQuizSession((prev) => ({
        ...prev,
        selectedOption: index,
        isAnswered: true,
        isCorrect: false,
        streakCount: 0,
        isGameOver: true,
        gameOverReason: 'wrong_answer',
      }));
    }
  };

  // Cash Out handler during active game
  const handleCashOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const win = quizSession.accumulatedWinnings;

    setUserState((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + win,
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

    setQuizSession((prev) => ({
      ...prev,
      isGameOver: true,
      gameOverReason: 'cashed_out',
    }));
  };

  const handleClaimAndContinue = () => {
    if (quizSession.accumulatedWinnings > 0) {
      setUserState((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + quizSession.accumulatedWinnings,
        currentWinnings: 0,
      }));
    }
    setIsQuizActive(false);
  };

  const handlePlayAgain = () => {
    if (quizSession.accumulatedWinnings > 0) {
      setUserState((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + quizSession.accumulatedWinnings,
        currentWinnings: 0,
      }));
    }
    startQuizSession();
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
        ? 'bg-[#0B0E14] text-[#F8FAFC] selection:bg-[#F55129]/30 selection:text-[#F55129]'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-[#F55129]/20'
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
            categoryItems={siteConfig.categoriesList}
            onToggleSound={handleToggleSound}
            onOpenNotifications={() => setShowNotifications(true)}
            unreadCount={unreadCount}
            onOpenLeaderboard={handleOpenLeaderboard}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenBotTrader={() => setIsBotTraderOpen(true)}
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
            theme={theme}
            onToggleTheme={toggleTheme}
            siteConfig={siteConfig}
          />
        )}

        {/* Main Content Area */}
        <main className="w-full flex-1 flex flex-col">
          {!isQuizActive ? (
            /* Home Page with Interactive Hero & Market Sliders */
            <HomePage
              categories={filteredCategories.length > 0 ? filteredCategories : activeCategoriesList}
              speedModes={SPEED_MODES}
              selectedCategoryId={selectedCategoryId}
              selectedSpeedModeId={selectedSpeedModeId}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
              onSelectCategory={setSelectedCategoryId}
              onSelectSpeedMode={setSelectedSpeedModeId}
              onPlayCategory={(catId) => startQuizSession(catId)}
              onOpenLeaderboard={handleOpenLeaderboard}
              onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
              currentUserWinnings={userState.walletBalance}
              currentUserStreak={userState.streak}
              theme={theme}
              bannerSlides={siteConfig.bannerSlides.length > 0 ? siteConfig.bannerSlides : undefined}
            />
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
              timerSeconds={quizSession.timerSeconds}
              selectedOption={quizSession.selectedOption}
              isAnswered={quizSession.isAnswered}
              isCorrect={quizSession.isCorrect}
              accumulatedWinnings={quizSession.accumulatedWinnings}
              streakCount={quizSession.streakCount}
              floatingEarnings={quizSession.floatingEarnings}
              rewardLadder={REWARD_LADDER}
              walletBalance={userState.walletBalance}
              soundEnabled={userState.soundEnabled}
              onToggleSound={handleToggleSound}
              onSelectOption={handleSelectOption}
              onCashOut={handleCashOut}
              onExitQuiz={() => setIsQuizActive(false)}
              theme={theme}
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
                title: '🏆 Prediction Market Settled!',
                message: 'Your Premier League speed trivia round locked in KSh 350 profit!',
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

      {/* Bot Trader Modal */}
      <BotTraderModal
        isOpen={isBotTraderOpen}
        onClose={() => setIsBotTraderOpen(false)}
        onRunBotRound={() => startQuizSession('tech_savannah')}
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
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
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
        theme={theme}
        minWithdrawAmount={siteConfig.minWithdrawAmount}
      />

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
        onOpenLeaderboard={handleOpenLeaderboard}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenBotTrader={() => setIsBotTraderOpen(true)}
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
        selectedCategoryId={selectedCategoryId}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedSubcategory(catId);
        }}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onPlayCategory={(catId) => {
          startQuizSession(catId);
        }}
        theme={theme}
      />

      {/* LIVE ARENA MATCHMAKER & MODES MODAL (TOPICS & SPEED SELECTOR) */}
      <LiveArenaModal
        isOpen={isLiveArenaOpen}
        onClose={() => setIsLiveArenaOpen(false)}
        categories={QUIZ_CATEGORIES}
        speedModes={SPEED_MODES}
        selectedCategoryId={selectedCategoryId}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setSelectedSubcategory(catId);
        }}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onStartQuiz={(catId, modeId, stakeTier) => {
          startQuizSession(catId, modeId, stakeTier);
        }}
        walletBalance={userState.walletBalance}
        theme={theme}
      />

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR: Always docked at bottom, fitting 100% left-to-right (Hidden in active quiz mode) */}
      {!isQuizActive && (
        <nav
          className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden w-full border-t transition-colors backdrop-blur-xl pb-[env(safe-area-inset-bottom)] ${
            theme === 'dark'
              ? 'bg-[#0B0E14]/95 border-[#222C3E] text-[#F8FAFC]'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          }`}
        >
          <div className="w-full max-w-lg mx-auto grid grid-cols-3 items-center px-3 py-2">
            {/* Left: Open Profile Drawer */}
            <button
              onClick={() => setIsMobileProfileOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'hover:bg-[#182030] text-[#94A3B8] active:text-white'
                  : 'hover:bg-slate-100 text-slate-700 active:text-black'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <User className="w-4 h-4 text-[#F55129]" />
                {userProfile.isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22C55E] ring-1 ring-[#0B0E14]" />
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight">Profile</span>
            </button>

            {/* Center: Live Arena Modal Launcher */}
            <div className="flex items-center justify-center px-1">
              <button
                onClick={() => {
                  setIsLiveArenaOpen(true);
                }}
                className="w-full max-w-[120px] py-2 px-2.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer bg-[#F55129] hover:bg-[#DB3211] active:scale-95 shadow-[#F55129]/30"
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
                  ? 'hover:bg-[#182030] text-[#F55129] active:text-[#E28C6D]'
                  : 'hover:bg-orange-50 text-[#F55129] active:text-orange-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F55129]" />
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
            theme === 'dark' ? 'bg-[#12100F] border-[#292524] text-[#F5F5F5]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1">No Questions Available</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              No questions available for <span className="font-semibold text-amber-500">{noQuestionsCategory}</span> at the moment. Please select another category or check back soon!
            </p>
            <button
              onClick={() => setNoQuestionsCategory(null)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#F55129] text-white hover:bg-[#d9431f] transition-all shadow-md cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
