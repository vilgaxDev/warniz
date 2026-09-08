export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface RewardStep {
  questionNumber: number;
  rewardKsh: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  subtitle: string;
  questions: Question[];
}

export interface SpeedMode {
  id: string;
  name: string;
  questionsCount: number;
  durationSeconds: number;
  description: string;
  badge?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  currency: string;
  currencyCode: string;
  paymentMethod: string;
}

export type UserRole = 'player' | 'marketer' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  isLoggedIn: boolean;
  role?: UserRole;
  questionsAttempted: number;
  questionsCorrect: number;
  totalEarnedKsh: number;
  quizzesPlayed: number;
  rank: number;
  country?: string;
  countryCode?: string;
  currencySymbol?: string;
  emailVerified?: boolean;
}

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'withdrawal' | 'quiz_reward' | 'entry_fee';
  amount: number;
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  mpesaRef?: string;
}

export interface QuestionHistoryItem {
  id: string;
  category: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rewardKsh: number;
  timestamp: string;
}

export interface UserState {
  walletBalance: number;
  currentWinnings: number;
  streak: number;
  maxStreak: number;
  soundEnabled: boolean;
  xpPoints: number;
}

export interface QuizSessionState {
  categoryId: string;
  categoryName: string;
  questions: Question[];
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  accumulatedWinnings: number;
  streakCount: number;
  timerSeconds: number;
  isGameOver: boolean;
  gameOverReason: 'wrong_answer' | 'timeout' | 'cashed_out' | 'completed' | null;
  floatingEarnings: { id: number; amount: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time?: string;
  timestamp?: string;
  description?: string;
  icon?: string;
  type: 'quiz' | 'streak' | 'market' | 'withdrawal' | 'deposit' | 'system';
  read: boolean;
}
