import { UserProfile, TransactionRecord, QuestionHistoryItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: '',
  name: 'Player',
  email: '',
  phone: '',
  avatar: '👤',
  joinedDate: '2026',
  isLoggedIn: false,
  role: 'player',
  questionsAttempted: 0,
  questionsCorrect: 0,
  totalEarnedKsh: 0,
  quizzesPlayed: 0,
  rank: 0,
  country: 'Kenya',
  countryCode: 'KE',
  currencySymbol: 'KSh',
  emailVerified: false,
};

export interface DemoAccount {
  role: 'super_admin' | 'admin' | 'marketer' | 'player';
  roleLabel: string;
  roleBadge: string;
  email: string;
  password: string;
  profile: UserProfile;
}

export const DEMO_ROLE_ACCOUNTS: DemoAccount[] = [];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [];

export const INITIAL_QUESTION_HISTORY: QuestionHistoryItem[] = [];

export const GENERAL_AVATAR_ICONS = ['🦁', '⚡', '🏆', '⚽', '💻', '💼', '🚀', '🔥', '👑', '🎯', '💰', '🌟', '🧠', '🦅'];

export const getAvatarOptionsForCountry = (countryFlag?: string): string[] => {
  if (!countryFlag) return GENERAL_AVATAR_ICONS;
  return [countryFlag, ...GENERAL_AVATAR_ICONS];
};

export const AVATAR_OPTIONS = ['🇰🇪', '🦁', '⚡', '🏆', '⚽', '💻', '💼', '🚀', '🔥', '👑', '🎯', '💰'];
