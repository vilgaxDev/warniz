import { QuizCategory, RewardStep, SpeedMode, NotificationItem } from '../types';
import { DEMO_QUESTIONS_BY_CATEGORY } from './demoQuestions';

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
    id: '3min',
    name: '3 Mins Speed Round',
    questionsCount: 6,
    durationSeconds: 12,
    description: 'Fast-paced, 12s countdown per question. Perfect for quick plays.',
    badge: '6 QUESTIONS',
  },
  {
    id: '5min',
    name: '5 Mins Pro Challenge',
    questionsCount: 8,
    durationSeconds: 12,
    description: 'Balanced trivia round with progressive medium difficulty.',
    badge: '8 QUESTIONS',
  },
  {
    id: '10min',
    name: '10 Mins Tournament',
    questionsCount: 10,
    durationSeconds: 12,
    description: 'Grand championship quiz with maximum XP multipliers & badges.',
    badge: '10 QUESTIONS',
  },
];

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'kenya',
    name: 'Kenya',
    icon: '🇰🇪',
    badge: 'POPULAR',
    subtitle: 'Heritage, Culture & Wildlife',
    questions: DEMO_QUESTIONS_BY_CATEGORY.kenya || [],
  },
  {
    id: 'world_cup',
    name: 'World Cup',
    icon: '⚽',
    badge: 'LIVE',
    subtitle: 'FIFA & Global Football',
    questions: DEMO_QUESTIONS_BY_CATEGORY.world_cup || [],
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '🏆',
    badge: 'FEATURED',
    subtitle: 'Premier League & Athletics',
    questions: DEMO_QUESTIONS_BY_CATEGORY.sports || [],
  },
  {
    id: 'tech',
    name: 'Tech',
    icon: '🤖',
    badge: 'HOT',
    subtitle: 'Silicon Savannah & AI',
    questions: DEMO_QUESTIONS_BY_CATEGORY.tech || [],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '📈',
    badge: 'VERIFIED',
    subtitle: 'Markets, Banking & CBK',
    questions: DEMO_QUESTIONS_BY_CATEGORY.finance || [],
  },
  {
    id: 'geopolitics',
    name: 'Geopolitics',
    icon: '🌍',
    badge: 'GLOBAL',
    subtitle: 'World Wonders & Treaties',
    questions: DEMO_QUESTIONS_BY_CATEGORY.geopolitics || [],
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: '⚡',
    badge: 'WEB3',
    subtitle: 'Blockchain & Digital Assets',
    questions: DEMO_QUESTIONS_BY_CATEGORY.crypto || [],
  },
  {
    id: 'politics',
    name: 'Politics',
    icon: '🏛️',
    badge: 'GOVERNANCE',
    subtitle: 'World Leaders & Civic Affairs',
    questions: DEMO_QUESTIONS_BY_CATEGORY.politics || [],
  },
  {
    id: 'esports',
    name: 'Esports',
    icon: '🎮',
    badge: 'GAMING',
    subtitle: 'Competitive Gaming & Consoles',
    questions: DEMO_QUESTIONS_BY_CATEGORY.esports || [],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    badge: 'ARTS',
    subtitle: 'Cinema, Music & Pop Culture',
    questions: DEMO_QUESTIONS_BY_CATEGORY.entertainment || [],
  },
  {
    id: 'general',
    name: 'General Trivia',
    icon: '🧠',
    badge: 'KNOWLEDGE',
    subtitle: 'Science & World Facts',
    questions: DEMO_QUESTIONS_BY_CATEGORY.general || [],
  },
  {
    id: 'trending',
    name: 'Trending',
    icon: '🔥',
    badge: 'HOT',
    subtitle: 'Viral Facts & Speed Records',
    questions: DEMO_QUESTIONS_BY_CATEGORY.trending || [],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
