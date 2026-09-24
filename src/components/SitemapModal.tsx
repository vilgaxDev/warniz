import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map,
  Search,
  Zap,
  Play,
  Wallet,
  Trophy,
  Gift,
  HelpCircle,
  ShieldCheck,
  User,
  Bell,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  Check,
  Lock,
  Layers,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { TrivquestIcon } from './TrivquestLogo';
import { QUIZ_CATEGORIES, SPEED_MODES } from '../data/quizData';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectSpeedMode: (speedId: string) => void;
  onOpenLiveArena: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenLeaderboard: () => void;
  onOpenDailyRewards: () => void;
  onOpenHowItWorks: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onTriggerSiteLoading: () => void;
  theme?: 'dark' | 'light';
}

type FilterTab = 'all' | 'arenas' | 'topics' | 'wallet' | 'rewards' | 'account';

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectSpeedMode,
  onOpenLiveArena,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenLeaderboard,
  onOpenDailyRewards,
  onOpenHowItWorks,
  onOpenProfile,
  onOpenNotifications,
  onOpenAdmin,
  onTriggerSiteLoading,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState(100);

  // Trigger simulated site indexer loading effect
  const handleReindex = () => {
    setIsIndexing(true);
    setIndexProgress(10);
    const interval = setInterval(() => {
      setIndexProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsIndexing(false), 200);
          return 100;
        }
        return prev + 18;
      });
    }, 80);
  };

  useEffect(() => {
    if (isOpen) {
      handleReindex();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sitemap Data Model
  const sitemapSections = [
    {
      id: 'arenas',
      title: 'Game Arenas & Speed Modes',
      description: 'Select your round duration, decision clock, and prize multiplier ladder.',
      badge: `${SPEED_MODES.length} Modes`,
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      items: [
        ...SPEED_MODES.map((mode) => ({
          title: `${mode.name}`,
          subtitle: `${mode.questionsCount} questions • ${mode.durationSeconds}s clock • ${mode.description}`,
          badge: mode.badge || `${mode.questionsCount} Qs`,
          badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
          action: () => {
            onSelectSpeedMode(mode.id);
            onOpenLiveArena();
            onClose();
          },
          actionLabel: 'Launch Arena',
          type: 'speed',
        })),
        {
          title: 'Live Arena Matchmaker',
          subtitle: 'Interactive room selector: pick topic, stake tier (Free to KSh 100), and speed mode.',
          badge: 'Matchmaker',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          action: () => {
            onOpenLiveArena();
            onClose();
          },
          actionLabel: 'Open Arena',
          type: 'launcher',
        },
      ],
    },
    {
      id: 'topics',
      title: 'Trivia Categories & Knowledge Arenas',
      description: 'Over 100+ verified Kenyan and global speed questions across 8 domains.',
      badge: `${QUIZ_CATEGORIES.length} Arenas`,
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      items: QUIZ_CATEGORIES.map((cat) => ({
        title: `${cat.icon} ${cat.name}`,
        subtitle: `${cat.subtitle} • ${cat.questions.length} Questions Available`,
        badge: cat.badge || 'Live',
        badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        action: () => {
          onSelectCategory(cat.id);
          onClose();
        },
        actionLabel: 'Play Category',
        type: 'category',
      })),
    },
    {
      id: 'wallet',
      title: 'Financial Engine & M-PESA Cashouts',
      description: 'Instant deposit STK push and guaranteed mobile money payouts within 60 seconds.',
      badge: '254 Instant',
      icon: <Wallet className="w-4 h-4 text-emerald-500" />,
      items: [
        {
          title: 'M-PESA Express Direct Deposit',
          subtitle: 'Fund your player balance instantly via Safaricom STK prompt from KSh 10.',
          badge: 'Instant STK',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          action: () => {
            onOpenDeposit();
            onClose();
          },
          actionLabel: 'Deposit M-Pesa',
          type: 'deposit',
        },
        {
          title: 'Direct M-PESA Cashout / Withdrawal',
          subtitle: 'Withdraw winnings straight to your Safaricom phone number from KSh 50.',
          badge: 'Zero Delay',
          badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
          action: () => {
            onOpenWithdraw();
            onClose();
          },
          actionLabel: 'Withdraw Cash',
          type: 'withdraw',
        },
        {
          title: '2X · 3X · 5X Multiplier Pipeline',
          subtitle: 'Answer sequentially without hints to accelerate your round winnings.',
          badge: 'Ladder',
          badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
          action: () => {
            onOpenHowItWorks();
            onClose();
          },
          actionLabel: 'View Ladder',
          type: 'rules',
        },
      ],
    },
    {
      id: 'rewards',
      title: 'Rankings, Rewards & Fair Play',
      description: 'Climb the national leaderboard and maintain consecutive daily login streaks.',
      badge: 'Competitive',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
      items: [
        {
          title: 'National Kenya Leaderboard',
          subtitle: 'Live top players ranked by total KSh cash won, win rate %, and longest streak.',
          badge: 'Live Rankings',
          badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
          action: () => {
            onOpenLeaderboard();
            onClose();
          },
          actionLabel: 'View Leaderboard',
          type: 'leaderboard',
        },
        {
          title: 'Daily Streak & Gift Drops',
          subtitle: 'Log in daily to claim escalating XP bonuses, free game tokens, and cash rewards.',
          badge: '7-Day Ladder',
          badgeColor: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
          action: () => {
            onOpenDailyRewards();
            onClose();
          },
          actionLabel: 'Claim Streak',
          type: 'streak',
        },
        {
          title: 'Rules of the Arena & Fair Play',
          subtitle: 'Review 12-second clock rules, provably fair question shuffles, and payout audits.',
          badge: 'Fair Play',
          badgeColor: 'bg-slate-500/15 text-slate-300 border border-slate-500/30',
          action: () => {
            onOpenHowItWorks();
            onClose();
          },
          actionLabel: 'Read Rules',
          type: 'how-it-works',
        },
      ],
    },
    {
      id: 'account',
      title: 'Account Settings & System Control',
      description: 'Manage personal profile, audio preferences, notifications, and site diagnostics.',
      badge: 'System',
      icon: <User className="w-4 h-4 text-cyan-400" />,
      items: [
        {
          title: 'Player Profile & Identity',
          subtitle: 'Update username, avatar, verified Safaricom phone, and view question history.',
          badge: 'Profile',
          badgeColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
          action: () => {
            onOpenProfile();
            onClose();
          },
          actionLabel: 'Edit Profile',
          type: 'profile',
        },
        {
          title: 'Notifications & Alerts Center',
          subtitle: 'Manage round commencement alerts, cashout receipts, and tournament drops.',
          badge: 'Alerts',
          badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
          action: () => {
            onOpenNotifications();
            onClose();
          },
          actionLabel: 'Open Alerts',
          type: 'notifications',
        },
        {
          title: 'Admin & Operator Portal',
          subtitle: 'Manage banner carousels, question categories, promo codes, and payout audits.',
          badge: 'Staff Only',
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          action: () => {
            onOpenAdmin();
            onClose();
          },
          actionLabel: 'Open Admin',
          type: 'admin',
        },
        {
          title: 'Trigger Site Loading Screen',
          subtitle: 'Re-run the full brand animated loading screen and connectivity diagnostics.',
          badge: 'Diagnostics',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          action: () => {
            onClose();
            onTriggerSiteLoading();
          },
          actionLabel: 'Simulate Loading',
          type: 'loading',
        },
      ],
    },
  ];

  // Filter items based on active tab and search query
  const filteredSections = sitemapSections
    .filter((sec) => activeTab === 'all' || sec.id === activeTab)
    .map((sec) => {
      if (!searchQuery.trim()) return sec;
      const q = searchQuery.toLowerCase();
      const matchingItems = sec.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
      );
      return {
        ...sec,
        items: matchingItems,
      };
    })
    .filter((sec) => sec.items.length > 0);

  const totalNodesCount = sitemapSections.reduce((acc, sec) => acc + sec.items.length, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden font-sans transition-all ${
          isDark
            ? 'bg-[#0B0F17] border-[#1E2638] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#101726] border-[#1E2638]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#141E33] border-[#222C3E] text-emerald-400' : 'bg-white border-slate-200 text-emerald-600 shadow-2xs'
              }`}
            >
              <Map className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight">
                  Trivquest Site Map & Arena Index
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {totalNodesCount} Nodes
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Complete structural roadmap: all speed modes, quiz arenas, M-PESA cashout gateways, and tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReindex}
              disabled={isIndexing}
              title="Refresh Site Map Index"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#141E33] border-[#222C3E] text-slate-300 hover:text-white hover:bg-[#1A2844]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SITE MAP LOADING / INDEXING STATUS BAR */}
        {isIndexing && (
          <div className={`w-full px-4 py-2 text-xs font-semibold flex items-center justify-between border-b ${
            isDark ? 'bg-[#0E1524] text-emerald-400 border-[#1E2638]' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Indexing Trivquest arenas, questions & mobile money channels...</span>
            </div>
            <span className="font-mono font-bold text-[11px]">{indexProgress}%</span>
          </div>
        )}

        {/* SEARCH & FILTER TABS */}
        <div className={`p-3 sm:p-4 border-b space-y-3 ${
          isDark ? 'bg-[#0E1420] border-[#1E2638]' : 'bg-slate-50/60 border-slate-200'
        }`}>
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sitemap by arena, topic, question count, or financial gateway..."
              className={`w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-[#141C2C] border-[#222C3E] text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-2xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'arenas', label: '⚡ Arenas & Speeds' },
              { id: 'topics', label: '📚 Topics & Quizzes' },
              { id: 'wallet', label: '💰 M-PESA & Cashout' },
              { id: 'rewards', label: '🏆 Rankings & Streak' },
              { id: 'account', label: '⚙️ Account & Diagnostic' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FilterTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : isDark
                      ? 'bg-[#141C2C] text-slate-400 hover:text-slate-200 border border-[#222C3E]'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT SITEMAP SECTIONS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">No matching nodes found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No sitemap items matched &quot;{searchQuery}&quot;. Try another search term or reset the filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-2xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div key={section.id} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b pb-2 border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-[#141C2C] border border-[#222C3E]' : 'bg-slate-100'
                      }`}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base tracking-tight">
                        {section.title}
                      </h4>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    {section.badge}
                  </span>
                </div>

                {/* Section Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={item.action}
                      className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                        isDark
                          ? 'bg-[#111726]/80 border-[#1E2638] hover:bg-[#162035] hover:border-emerald-500/40'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-emerald-500/50 hover:shadow-2xs'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h5 className="font-bold text-xs sm:text-sm tracking-tight truncate group-hover:text-emerald-500 transition-colors">
                            {item.title}
                          </h5>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {item.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                          item.type === 'deposit'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            : item.type === 'withdraw'
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                            : isDark
                            ? 'bg-[#182438] text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                            : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                        }`}
                      >
                        {item.type === 'deposit' && <ArrowDownToLine className="w-3 h-3 stroke-[2.5]" />}
                        {item.type === 'withdraw' && <ArrowUpFromLine className="w-3 h-3 stroke-[2.5]" />}
                        <span>{item.actionLabel}</span>
                        {item.type !== 'deposit' && item.type !== 'withdraw' && (
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* BOTTOM FOOTER SUMMARY */}
        <div
          className={`p-3 sm:p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#0E1524] border-[#1E2638] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Trivquest Kenya • Verified 12s Speed Trivia Engine • Instant Payouts</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onTriggerSiteLoading();
              }}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 font-bold text-[11px] transition-colors cursor-pointer"
            >
              Replay Loading Screen
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
