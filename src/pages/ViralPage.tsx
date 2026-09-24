import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Trophy, Zap, X, RefreshCw, Wallet, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { WalletBar } from '../components/WalletBar';
import { SiteFooter } from '../components/SiteFooter';
import { QuestionCard } from '../components/QuestionCard';
import { ResultModal } from '../components/ResultModal';
import { QuizEntryModal } from '../components/QuizEntryModal';
import { HowItWorksModal } from '../components/HowItWorksModal';
import { INITIAL_USER_PROFILE } from '../data/userProfileData';
import { UserState, UserProfile, Question, RewardStep, QuizCategory, SpeedMode } from '../types';
import { generateRewardLadder, getStreakMultiplier } from '../data/quizData';

interface DemoQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const INITIAL_DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 1,
    question: "Which country has the largest population in Africa?",
    options: ["Kenya", "Nigeria", "Egypt", "South Africa"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What is the capital of Tanzania?",
    options: ["Nairobi", "Dar es Salaam", "Dodoma", "Mwanza"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Who was the first President of Kenya?",
    options: ["Jomo Kenyatta", "Daniel arap Moi", "Mwai Kibaki", "Uhuru Kenyatta"],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "What is the currency of Ghana?",
    options: ["Naira", "Shilling", "Cedi", "Rand"],
    correctAnswer: 2
  }
];

export default function ViralPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // SEO metadata
  useEffect(() => {
    document.title = 'TrivQuest Challenge — Can You Beat the Score?';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Take the TrivQuest challenge and see how high you can climb.');
    }
  }, []);
  
  // Track campaign parameters
  const utmSource = searchParams.get('utm_source') || 'direct';
  const utmCampaign = searchParams.get('utm_campaign') || 'default';

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('player_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  // Reset VIRTUAL demo balance to 1k on page refresh (first load)
  // This is DEMO MONEY ONLY - completely isolated from real user accounts
  // Uses separate localStorage key 'demo_balance' - never conflicts with real accounts
  useEffect(() => {
    // Reset to 1k on every page load as requested (VIRTUAL DEMO MONEY)
    localStorage.setItem('demo_balance', '1000');
    setUserState(prev => ({ ...prev, walletBalance: 1000 })); // VIRTUAL DEMO BALANCE
  }, []);

  // Listen for auth changes from localStorage
  useEffect(() => {
    const handleAuthChange = () => {
      const storedProfile = localStorage.getItem('user_profile');
      const storedToken = localStorage.getItem('player_token');
      
      if (storedProfile && storedToken) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          if (parsedProfile && parsedProfile.isLoggedIn) {
            setUserProfile(parsedProfile);
          } else {
            setUserProfile(INITIAL_USER_PROFILE);
          }
        } catch (e) {
          console.log('Failed to parse stored profile');
          setUserProfile(INITIAL_USER_PROFILE);
        }
      } else {
        setUserProfile(INITIAL_USER_PROFILE);
      }
    };

    // Check initially
    handleAuthChange();

    // Listen for custom auth events
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Synchronize document root classes with theme
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('player_theme', newTheme);
  };

  // User state for WalletBar - DEMO BALANCE ONLY (completely isolated from real account)
  // This is virtual money for demo mode and never affects the real user's balance
  // Uses separate localStorage key 'demo_balance' - never conflicts with real accounts
  const [userState, setUserState] = useState<UserState>(() => {
    // Get stored demo balance or default to 1k (VIRTUAL DEMO MONEY ONLY)
    const storedDemoBalance = localStorage.getItem('demo_balance');
    const initialBalance = storedDemoBalance ? parseInt(storedDemoBalance, 10) : 1000;
    return {
      walletBalance: initialBalance, // VIRTUAL DEMO BALANCE - NOT REAL MONEY
      currentWinnings: 0,           // VIRTUAL DEMO WINNINGS - NOT REAL MONEY
      streak: 0,                   // VIRTUAL DEMO STREAK - NOT REAL
      maxStreak: 0,                // VIRTUAL DEMO STREAK - NOT REAL
      soundEnabled: false,
      xpPoints: 0,                 // VIRTUAL DEMO XP - NOT REAL
    };
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Check if user is actually logged in from localStorage
    const storedProfile = localStorage.getItem('user_profile');
    const storedToken = localStorage.getItem('player_token');

    if (storedProfile && storedToken) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile && parsedProfile.isLoggedIn) {
          return parsedProfile;
        }
      } catch (e) {
        console.log('Failed to parse stored profile');
      }
    }

    return INITIAL_USER_PROFILE;
  });

  // Check if user is logged in
  const isLoggedIn = userProfile.isLoggedIn && !!localStorage.getItem('player_token');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Site config
  const siteConfig = {
    siteName: 'Trivquest',
    headerAnnouncement: '⚡ Win up to 100,000 KES on live speed trivia games!',
    headerAnnouncementEnabled: true,
    headerBadge: 'SPEED TRIVIA (+100 XP)',
    headerCtaText: 'PLAY NOW',
  };

  // WalletBar handlers
  const handleOpenLeaderboard = () => navigate('/leaderboard');
  const handleOpenHowItWorks = () => setIsHowItWorksOpen(true);
  const handleOpenDailyRewards = () => {};
  const handleOpenProfile = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleOpenAuth = (mode?: 'signin' | 'signup') => {
    trackEvent('signup_clicked', { utm_source: utmSource, utm_campaign: utmCampaign });
    // If already logged in, don't open auth modal
    if (userProfile.isLoggedIn) {
      navigate('/');
      return;
    }
    navigate('/');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: mode || 'signin' }));
    }, 100);
  };
  const handleToggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleCloseProfileDropdown = () => setIsProfileDropdownOpen(false);
  const onSelectNav = () => {};
  const onLogout = () => {
    // Clear local storage and reset profile
    localStorage.removeItem('player_token');
    localStorage.removeItem('player_data');
    localStorage.removeItem('user_profile');
    setUserProfile(INITIAL_USER_PROFILE);
    // Navigate to home
    navigate('/');
  };
  const onOpenMobileProfile = () => {};
  const onOpenMobileCategories = () => {};
  const onToggleSound = () => {};
  const onOpenNotifications = () => {};

  // State
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isQuizEntryModalOpen, setIsQuizEntryModalOpen] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [demoQuestions, setDemoQuestions] = useState<Question[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'wrong_answer' | 'timeout' | 'cashed_out' | 'completed' | null>(null);
  const [maxStreakCount, setMaxStreakCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [accumulatedWinnings, setAccumulatedWinnings] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [floatingEarnings, setFloatingEarnings] = useState<{ id: string | number; amount: number }[]>([]);
  const [rewardLadder, setRewardLadder] = useState<RewardStep[]>([]);
  const [demoStake, setDemoStake] = useState(20);
  const [selectedSpeedModeId, setSelectedSpeedModeId] = useState('medium');

  const trackEvent = (eventName: string, data: any = {}) => {
    console.log('[Analytics]', eventName, data);
  };

  const handlePlayClick = () => {
    setIsQuizEntryModalOpen(true);
    trackEvent('demo_started', { utm_source: utmSource, utm_campaign: utmCampaign });
  };

  const handleSignIn = () => {
    setIsAuthPromptOpen(false);
    trackEvent('signup_clicked', { utm_source: utmSource, utm_campaign: utmCampaign });
    navigate('/');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
    }, 100);
  };

  const handleTryDemo = () => {
    setIsAuthPromptOpen(false);
    setIsQuizEntryModalOpen(true);
  };

  const handleStartDemo = (categoryId: string, speedModeId: string, stakeAmount: number) => {
    setIsQuizEntryModalOpen(false);
    setDemoStake(stakeAmount);
    setSelectedSpeedModeId(speedModeId);

    // Check if demo balance is zero, reset to 1k
    if (userState.walletBalance <= 0) {
      const newBalance = 1000;
      setUserState(prev => ({ ...prev, walletBalance: newBalance }));
      localStorage.setItem('demo_balance', newBalance.toString());
    }

    // Deduct stake amount immediately (like real game)
    const newBalance = Math.max(0, userState.walletBalance - stakeAmount);
    setUserState(prev => ({ ...prev, walletBalance: newBalance }));
    localStorage.setItem('demo_balance', newBalance.toString());

    // Start demo immediately (questions load from API with local fallback)
    setIsDemoPlaying(true);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setCorrectCount(0);
    setAccumulatedWinnings(0);
    setStreakCount(0);
    setMaxStreakCount(0);
    setFloatingEarnings([]);
    setShowResult(false);
    setGameOverReason(null);
    setTimeLeft(60);

    fetchDemoQuestions(stakeAmount);
  };

  const fetchDemoQuestions = async (stakeAmount: number = demoStake, speedModeId: string = selectedSpeedModeId) => {
    let questions: Question[] = [];

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/viral/demo-questions`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          questions = data.data
            .filter(
              (q: any) =>
                q &&
                typeof q.question === 'string' &&
                Array.isArray(q.options) &&
                q.options.length >= 2
            )
            .map((q: any): Question => ({
              id: String(q.id),
              question: q.question,
              options: q.options,
              correctIndex: typeof q.correct_answer === 'number' ? q.correct_answer : 0,
              explanation: q.explanation || undefined,
            }));
        }
      } else {
        console.warn('[DEMO] Demo questions API responded with', response.status);
      }
    } catch (error) {
      console.warn('[DEMO] Failed to fetch demo questions from API:', error);
    }

    // Fallback to local questions if the API didn't provide enough valid ones
    if (questions.length < 5) {
      console.log('[DEMO] Using local fallback demo questions');
      questions = INITIAL_DEMO_QUESTIONS.map((q: DemoQuestion): Question => ({
        id: String(q.id),
        question: q.question,
        options: q.options,
        correctIndex: q.correctAnswer,
      }));
    }

    // Get speed mode details to set timer and question count
    const speedModes: SpeedMode[] = [
      { id: 'easy', name: 'Easy', questionsCount: 6, durationSeconds: 15, description: '6Q · 15s' },
      { id: 'medium', name: 'Medium', questionsCount: 9, durationSeconds: 20, description: '9Q · 20s' },
      { id: 'hard', name: 'Fast', questionsCount: 15, durationSeconds: 30, description: '15Q · 30s' },
    ];
    const selectedSpeedMode = speedModes.find(m => m.id === speedModeId) || speedModes[1];

    const playableQuestions = questions.slice(0, selectedSpeedMode.questionsCount);
    setDemoQuestions(playableQuestions);
    setTimeLeft(selectedSpeedMode.durationSeconds);
    // Reward ladder scaled to the stake picked in the demo modal (same as signed-in users)
    setRewardLadder(generateRewardLadder(stakeAmount, playableQuestions.length));
  };

  type DemoEndReason = 'wrong_answer' | 'timeout' | 'cashed_out' | 'completed';

  // Fire-and-forget analytics POST to the backend (never blocks the result flow)
  const recordDemoResult = (result: { correct: number; total: number; timeUsed: number }) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      // Add authentication token if user is logged in
      const playerToken = localStorage.getItem('player_token');
      if (playerToken) {
        headers['Authorization'] = `Bearer ${playerToken}`;
      }
      
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/viral/record-demo-result`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          score: result.correct,
          correct: result.correct,
          total: result.total,
          accuracy: result.total ? Math.round((result.correct / result.total) * 100) : 0,
          xp_earned: result.correct * 10,
          time_used: result.timeUsed,
          stake_amount: demoStake,
          virtual_winnings: accumulatedWinnings,
          speed_mode: selectedSpeedModeId,
          utm_source: utmSource,
          utm_campaign: utmCampaign,
        }),
      });
    } catch {
      // Analytics is best-effort only
    }
  };

  // Ends the demo and shows the site-wide ResultModal with the correct reason
  const endDemo = (reason: DemoEndReason, overrides?: { correct?: number; total?: number; timeUsed?: number }) => {
    const finalCorrect = overrides?.correct ?? correctCount;
    const finalTotal = overrides?.total ?? demoQuestions.length;

    // Update demo balance based on performance
    // Note: Stake is already deducted at the start, so we only add winnings here
    if (reason === 'completed' || reason === 'cashed_out') {
      // When you win, add winnings to balance
      const newBalance = userState.walletBalance + accumulatedWinnings;
      setUserState(prev => ({ ...prev, walletBalance: newBalance }));
      localStorage.setItem('demo_balance', newBalance.toString());
    }
    // If wrong_answer or timeout, stake is already lost (deducted at start)

    setGameOverReason(reason);
    setShowResult(true);
    setIsDemoPlaying(false);
    recordDemoResult({
      correct: finalCorrect,
      total: finalTotal,
      timeUsed: overrides?.timeUsed ?? 60 - timeLeft,
    });
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const question = demoQuestions[currentQuestion];
    const correct = optionIndex === question.correctIndex;
    const nextCorrectCount = correct ? correctCount + 1 : correctCount;
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streakCount + 1;
      setCorrectCount(nextCorrectCount);
      setStreakCount(nextStreak);
      setMaxStreakCount((prev) => Math.max(prev, nextStreak));

      // Calculate earnings
      const currentStreakMultiplier = getStreakMultiplier(nextStreak);
      const baseReward = rewardLadder[currentQuestion]?.rewardKsh || 10;
      const earned = Math.round(baseReward * currentStreakMultiplier);
      setAccumulatedWinnings(accumulatedWinnings + earned);

      // Add floating earning animation
      const newFloating = { id: Date.now(), amount: earned };
      setFloatingEarnings([...floatingEarnings, newFloating]);
      setTimeout(() => {
        setFloatingEarnings(prev => prev.filter(item => item.id !== newFloating.id));
      }, 850);

      // Move to next question after a short feedback delay
      setTimeout(() => {
        if (currentQuestion < demoQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
          setIsAnswered(false);
          setIsCorrect(null);
        } else {
          endDemo('completed', {
            correct: nextCorrectCount,
            total: demoQuestions.length,
            timeUsed: 60 - timeLeft,
          });
        }
      }, 1500);
    } else {
      // WRONG ANSWER - Immediately end demo (like real game)
      setStreakCount(0);
      setTimeout(() => {
        endDemo('wrong_answer', {
          correct: nextCorrectCount,
          total: demoQuestions.length,
          timeUsed: 60 - timeLeft,
        });
      }, 1500);
    }
  };

  const handleCashOut = () => {
    endDemo('cashed_out');
  };

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleExitQuiz = () => {
    setShowExitConfirm(true);
  };

  const confirmExitDemo = () => {
    setShowExitConfirm(false);
    setIsDemoPlaying(false);
    setShowResult(false);
    navigate('/');
  };

  const handleTryAgain = () => {
    // Check if balance is zero and reset to 1k
    if (userState.walletBalance <= 0) {
      const newBalance = 1000;
      setUserState(prev => ({ ...prev, walletBalance: newBalance }));
      localStorage.setItem('demo_balance', newBalance.toString());
    }
    
    // Close result modal and open quiz entry modal to place new bet
    setShowResult(false);
    setIsQuizEntryModalOpen(true);
  };

  // Timer effect - only counts down while a demo round with questions is in progress
  useEffect(() => {
    let interval: number | undefined;
    if (isDemoPlaying && demoQuestions.length > 0 && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDemoPlaying, demoQuestions.length, timeLeft]);

  // When the clock hits zero, settle the round like the main quiz arena
  useEffect(() => {
    if (isDemoPlaying && demoQuestions.length > 0 && timeLeft <= 0) {
      endDemo('timeout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoPlaying, demoQuestions.length, timeLeft]);

  return (
    <div className={`min-h-screen font-sans antialiased w-full max-w-full transition-colors duration-200 ${
      theme === 'dark'
        ? 'dark bg-[#090D15] text-[#F8FAFC] selection:bg-emerald-500/30 selection:text-emerald-300'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-700'
    }`}>
      {/* Header - stays visible at all times on the demo page, including while the demo plays */}
      {/* CRITICAL: On ViralPage (demo page), ALWAYS use DEMO balance from userState, never real balance */}
      {/* Real balance only shows on actual game pages, not on demo page */}
      <WalletBar
        userState={userState}
        userProfile={userProfile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        onToggleSound={onToggleSound}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={handleOpenProfile}
        unreadCount={unreadCount}
        onOpenHowItWorks={handleOpenHowItWorks}
        onOpenDailyRewards={handleOpenDailyRewards}
        onOpenAuth={handleOpenAuth}
        isProfileDropdownOpen={isProfileDropdownOpen}
        onToggleProfileDropdown={handleToggleProfileDropdown}
        onCloseProfileDropdown={handleCloseProfileDropdown}
        onSelectNav={onSelectNav}
        onLogout={onLogout}
        onOpenMobileProfile={onOpenMobileProfile}
        onOpenMobileCategories={onOpenMobileCategories}
        categoryItems={[]}
        theme={theme}
        onToggleTheme={toggleTheme}
        siteConfig={siteConfig}
      />

      {/* Main Content - the demo quiz plays inline here, with the header above and footer below */}
      <main className="w-full flex-1 flex-col">
      {isDemoPlaying ? (
        /* Demo Quiz - plays inline on the page, between the always-visible header and footer */
        <>
          {/* DEMO MODE BANNER - CLEARLY INDICATES VIRTUAL MONEY */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-xs font-bold tracking-wider sticky top-0 z-50">
            🎮 DEMO MODE - VIRTUAL MONEY ONLY - NOT REAL ACCOUNT BALANCE
          </div>
          {demoQuestions.length > 0 ? (
            <QuestionCard
              categoryName="Demo Challenge"
              categoryIcon="🎯"
              question={demoQuestions[currentQuestion]}
              currentQuestionIndex={currentQuestion}
              totalQuestions={demoQuestions.length}
              roundTimerSeconds={timeLeft}
              totalRoundSeconds={60}
              selectedOption={selectedOption}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              accumulatedWinnings={accumulatedWinnings}
              streakCount={streakCount}
              floatingEarnings={floatingEarnings}
              rewardLadder={rewardLadder}
              walletBalance={userState.walletBalance} // VIRTUAL DEMO BALANCE - NOT REAL MONEY
              soundEnabled={false}
              onSelectOption={handleSelectOption}
              onCashOut={handleCashOut}
              onExitQuiz={handleExitQuiz}
              theme={theme}
              isDemo={true}
              cashoutEnabled={false}
            />
          ) : (
            <div className="min-h-[60vh] w-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="inline-block w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading demo questions...</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Enhanced */}
          <div className="text-center space-y-10 sm:space-y-12 mb-16 sm:mb-20">
            {/* CTA Button - Bigger and more dramatic */}
            <button
              onClick={handlePlayClick}
              className="group relative px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-blue-700 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl md:text-2xl transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/30"
            >
              <span className="flex items-center gap-3 sm:gap-4">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                PLAY THE DEMO CHALLENGE
              </span>
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            </button>
          </div>



          {/* Demo Balance Display - Enhanced */}
          <div className={`max-w-lg mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl border mb-8 sm:mb-12 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 shadow-xl shadow-emerald-500/10'
              : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200 shadow-xl'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
                }`}>
                  <Wallet className={`w-6 h-6 sm:w-7 sm:h-7 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <div>
                  <span className={`text-sm sm:text-base font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Demo Balance
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                    Virtual money for practice
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  KSh {userState.walletBalance.toLocaleString()}
                </span>
                <button
                  onClick={() => {
                    const newBalance = 1000;
                    setUserState(prev => ({ ...prev, walletBalance: newBalance }));
                    localStorage.setItem('demo_balance', newBalance.toString());
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
                  title="Reset to KSh 1,000"
                >
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            {userState.walletBalance <= 0 && (
              <div className={`mt-4 p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm font-medium text-amber-500 flex items-center gap-2 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Balance reset to KSh 1,000 available - Click refresh or start to add!</span>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20">
            <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
              theme === 'dark'
                ? 'bg-[#121722] border-[#222C3E]'
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
              }`}>
                <Trophy className={`w-7 h-7 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Win Real Cash
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Answer correctly and win real money. The more you play, the more you can win!
              </p>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
              theme === 'dark'
                ? 'bg-[#121722] border-[#222C3E]'
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Zap className={`w-7 h-7 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Fast Paced
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                60-second speed rounds. Quick questions, quick answers, quick rewards.
              </p>
            </div>
            <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${
              theme === 'dark'
                ? 'bg-[#121722] border-[#222C3E]'
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <Trophy className={`w-7 h-7 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Climb Leaderboard
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                Compete with players across Kenya. Top players win bigger prizes.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 sm:mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-black ${
                  theme === 'dark' ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  1
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Select Challenge
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Choose your speed mode and stake amount
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-black ${
                  theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                  2
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Answer Questions
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Answer correctly within 60 seconds
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl font-black ${
                  theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'
                }`}>
                  3
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Win Prizes
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                  Cash out anytime or complete for bonus
                </p>
              </div>
            </div>
          </div>

          </div>
      </div>
        </>
      )}
      </main>

      {/* Footer - always visible on the demo page */}
      {/* CRITICAL: Deposit/Withdraw buttons navigate to home page to prevent accidental real transactions during demo */}
      <SiteFooter
        onOpenHowItWorks={handleOpenHowItWorks}
        onOpenLeaderboard={handleOpenLeaderboard}
        onOpenDailyRewards={handleOpenDailyRewards}
        onOpenDeposit={() => navigate('/')}
        onOpenWithdraw={() => navigate('/')}
        onSelectCategory={() => {}}
        theme={theme}
      />

      {/* Demo Result - Uses the actual site-wide ResultModal component */}
      {showResult && (
        <ResultModal
          totalWon={accumulatedWinnings}
          questionsCorrect={correctCount}
          totalQuestions={demoQuestions.length}
          maxStreak={maxStreakCount}
          reason={gameOverReason}
          categoryName="Demo Challenge"
          onClaimAndContinue={() => {
            setShowResult(false);
            setIsDemoPlaying(false);
          }}
          onPlayAgain={handleTryAgain}
          theme={theme}
          stakeAmount={0}
          isDemo={true}
          onSignUp={() => {
            setShowResult(false);
            navigate('/');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'signup' }));
            }, 100);
          }}
        />
      )}

      {/* Quiz Entry Modal - uses the same modal as signed-in users */}
      <QuizEntryModal
        isOpen={isQuizEntryModalOpen}
        onClose={() => setIsQuizEntryModalOpen(false)}
        category={{
          id: 'demo',
          name: 'Demo Challenge',
          icon: '🎯',
          badge: 'DEMO',
          subtitle: 'Virtual Money Only',
          questions: []
        }}
        speedModes={[
          { id: 'easy', name: 'Easy', questionsCount: 6, durationSeconds: 15, description: '6Q · 15s' },
          { id: 'medium', name: 'Medium', questionsCount: 9, durationSeconds: 20, description: '9Q · 20s' },
          { id: 'hard', name: 'Fast', questionsCount: 15, durationSeconds: 30, description: '15Q · 30s' },
        ]}
        selectedSpeedModeId={selectedSpeedModeId}
        onSelectSpeedMode={setSelectedSpeedModeId}
        onConfirmStart={handleStartDemo}
        walletBalance={userState.walletBalance}
        isLoggedIn={isLoggedIn}
        theme={theme}
        isDemo={true}
      />

      {/* How It Works Modal - identical to the rest of the site */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Demo Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowExitConfirm(false)}
          />
          <div className={`relative w-full max-w-sm rounded-2xl border shadow-2xl p-6 ${
            theme === 'dark' ? 'bg-[#0E131E] border-[#222C3E]' : 'bg-white border-slate-200'
          }`}>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <X className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Leave Demo?
              </h3>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Are you sure you want to leave the demo? Your progress will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#182030] text-slate-300 hover:text-white border border-[#222C3E]'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Stay in Demo
                </button>
                <button
                  onClick={confirmExitDemo}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  Leave Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
