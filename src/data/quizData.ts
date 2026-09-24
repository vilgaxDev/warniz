import { QuizCategory, RewardStep, SpeedMode, NotificationItem } from '../types';
// Demo questions removed - must use DB questions only
// import { DEMO_QUESTIONS_BY_CATEGORY } from './demoQuestions';

export const REWARD_LADDER: RewardStep[] = [
  { questionNumber: 1, rewardKsh: 4 },
  { questionNumber: 2, rewardKsh: 8 },
  { questionNumber: 3, rewardKsh: 16 },
  { questionNumber: 4, rewardKsh: 30 },
  { questionNumber: 5, rewardKsh: 60 },
  { questionNumber: 6, rewardKsh: 120 },
  { questionNumber: 7, rewardKsh: 200 },
  { questionNumber: 8, rewardKsh: 320 },
  { questionNumber: 9, rewardKsh: 500 },
  { questionNumber: 10, rewardKsh: 800 },
];

/**
 * Returns the streak multiplier based on consecutive correct answers.
 * 2 in a row = 2x, 3-4 in a row = 3x, 5+ in a row = 5x.
 */
export function getStreakMultiplier(streakCount: number): number {
  if (streakCount >= 5) return 5;
  if (streakCount >= 3) return 3;
  if (streakCount >= 2) return 2;
  return 1;
}

/**
 * Generates dynamic reward ladder steps scaled to the user's entered stake amount.
 */
export function generateRewardLadder(stakeKsh: number, totalQuestions: number = 6): RewardStep[] {
  const safeStake = Math.max(1, stakeKsh || 20);
  const baseRatios = [0.20, 0.40, 0.80, 1.50, 3.00, 6.00, 10.00, 16.00, 25.00, 40.00];

  return Array.from({ length: totalQuestions }, (_, i) => {
    const ratio = baseRatios[i] ?? (i + 1) * 3;
    const rewardKsh = Math.max(1, Math.round(safeStake * ratio));
    return {
      questionNumber: i + 1,
      rewardKsh,
    };
  });
}

/**
 * Calculates the maximum potential winnings if all questions are answered with consecutive streak multipliers.
 */
export function calculatePotentialWinnings(stakeKsh: number, totalQuestions: number = 6): number {
  const ladder = generateRewardLadder(stakeKsh, totalQuestions);
  return ladder.reduce((total, step, idx) => {
    const streak = idx; // 0 for Q1, 1 for Q2, 2 for Q3, 3 for Q4, etc.
    const mult = getStreakMultiplier(streak);
    return total + (step.rewardKsh * mult);
  }, 0);
}

export const SPEED_MODES: SpeedMode[] = [
  {
    id: 'speed_round',
    name: '15 Seconds — Speed Round',
    questionsCount: 6,
    durationSeconds: 15,
    description: 'Ultra-fast 15-second round. Answer all 6 questions before the round timer expires.',
    badge: '6 QUESTIONS',
    badges: ['6 QUESTIONS', '15s TOTAL'],
  },
  {
    id: 'pro_challenge',
    name: '20 Seconds — Pro Challenge',
    questionsCount: 9,
    durationSeconds: 20,
    description: 'Fast-paced 20-second challenge with 9 questions. Answer all questions before the round timer expires.',
    badge: '9 QUESTIONS',
    badges: ['9 QUESTIONS', '20s TOTAL'],
  },
  {
    id: 'tournament',
    name: '30 Seconds — Tournament',
    questionsCount: 15,
    durationSeconds: 30,
    description: 'Intense 30-second championship round with 15 questions. Answer all questions before the round timer expires.',
    badge: '15 QUESTIONS',
    badges: ['15 QUESTIONS', '30s TOTAL'],
  },
];

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    subtitle: 'NBA, Players & Basketball History',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    subtitle: 'Soccer, Clubs & International Matches',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    icon: '🧠',
    subtitle: 'Science, Facts & World Trivia',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'kenya',
    name: 'Kenya',
    icon: '🇰🇪',
    subtitle: 'Heritage, Culture & Wildlife',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'world_cup',
    name: 'World Cup',
    icon: '⚽',
    subtitle: 'FIFA & Global Football',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '🏆',
    subtitle: 'Premier League & Athletics',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'tech',
    name: 'Tech',
    icon: '🤖',
    subtitle: 'Silicon Savannah & AI',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '📈',
    subtitle: 'Markets, Banking & CBK',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'geopolitics',
    name: 'Geopolitics',
    icon: '🌍',
    subtitle: 'World Wonders & Treaties',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: '⚡',
    subtitle: 'Blockchain & Digital Assets',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'politics',
    name: 'Politics',
    icon: '🏛️',
    subtitle: 'World Leaders & Civic Affairs',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'esports',
    name: 'Esports',
    icon: '🎮',
    subtitle: 'Competitive Gaming & Consoles',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    subtitle: 'Cinema, Music & Pop Culture',
    questions: [], // Must be fetched from DB
  },
  {
    id: 'trending',
    name: 'Trending',
    icon: '🔥',
    subtitle: 'Viral Facts & Speed Records',
    questions: [], // Must be fetched from DB
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
