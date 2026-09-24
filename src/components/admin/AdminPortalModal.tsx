import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ShieldCheck, Users, Database, DollarSign, Send, Plus, Trash2, Edit3,
  CheckCircle2, AlertCircle, Sparkles, RefreshCw, BarChart3, Tag, Image as ImageIcon,
  Lock, Settings, Radio, Bell, ArrowUpRight, Check, Ban, UserCheck, Flame, Zap,
  Search, ChevronDown, Filter, Sliders, Smartphone, Award, Trophy, Eye
} from 'lucide-react';
import { UserProfile, UserRole, Question, QuizCategory } from '../../types';
import { MpesaLogo } from '../MpesaLogo';
import { QUIZ_CATEGORIES } from '../../data/quizCategories';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateRole?: (userId: string, newRole: UserRole) => void;
  theme?: 'dark' | 'light';
  onAddBroadcastNotification?: (title: string, message: string, type: 'quiz' | 'streak' | 'market' | 'withdrawal' | 'deposit' | 'system') => void;
}

interface MockManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  countryFlag: string;
  status: 'active' | 'suspended';
  balanceKsh: number;
  joinedDate: string;
}

interface PromoCodeItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_bonus' | 'free_entry';
  value: number;
  usesCount: number;
  maxUses: number;
  active: boolean;
  expiryDate: string;
}

interface MarketingBannerItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bgGradient: string;
  ctaText: string;
  active: boolean;
}

const INITIAL_MANAGED_USERS: MockManagedUser[] = [
  {
    id: 'usr_001',
    name: 'Victor Vance',
    email: 'superadmin@trivquest.co.ke',
    phone: '+254 700 000 001',
    role: 'super_admin',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    status: 'active',
    balanceKsh: 125000,
    joinedDate: 'Jan 2025',
  },
  {
    id: 'usr_002',
    name: 'David Kiprop',
    email: 'admin@trivquest.co.ke',
    phone: '+254 722 111 222',
    role: 'admin',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    status: 'active',
    balanceKsh: 45000,
    joinedDate: 'Mar 2025',
  },
  {
    id: 'usr_003',
    name: 'Sarah Alouch',
    email: 'marketing@trivquest.co.ke',
    phone: '+254 733 444 555',
    role: 'marketer',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    status: 'active',
    balanceKsh: 18400,
    joinedDate: 'May 2025',
  },
  {
    id: 'usr_004',
    name: 'Sample Player',
    email: 'player@example.com',
    phone: '+254 712 345 678',
    role: 'player',
    country: 'Kenya',
    countryFlag: '🇰🇪',
    status: 'active',
    balanceKsh: 3850,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'usr_005',
    name: 'Chioma Okafor',
    email: 'chioma.okafor@trivquest.africa',
    phone: '+234 801 234 5678',
    role: 'player',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    status: 'active',
    balanceKsh: 9200,
    joinedDate: 'Feb 2026',
  },
  {
    id: 'usr_006',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@trivquest.africa',
    phone: '+233 24 123 4567',
    role: 'player',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    status: 'active',
    balanceKsh: 2100,
    joinedDate: 'Feb 2026',
  },
];

const INITIAL_PROMO_CODES: PromoCodeItem[] = [
  {
    id: 'pc_1',
    code: 'TRIVQUEST254',
    discountType: 'fixed_bonus',
    value: 200,
    usesCount: 428,
    maxUses: 1000,
    active: true,
    expiryDate: '31 Dec 2026',
  },
  {
    id: 'pc_2',
    code: 'SPEED100',
    discountType: 'percentage',
    value: 50,
    usesCount: 890,
    maxUses: 1000,
    active: true,
    expiryDate: '15 Sep 2026',
  },
  {
    id: 'pc_3',
    code: 'WEEKENDVIP',
    discountType: 'free_entry',
    value: 100,
    usesCount: 154,
    maxUses: 500,
    active: true,
    expiryDate: '28 Aug 2026',
  },
];

const INITIAL_BANNERS: MarketingBannerItem[] = [
  {
    id: 'bn_1',
    title: '🔥 KSh 50,000 Kenya Premier Trivia Tournament',
    subtitle: '12-second speed rounds with instant M-Pesa payouts!',
    tag: 'FEATURED TOURNAMENT',
    bgGradient: 'from-emerald-700 via-teal-700 to-emerald-900',
    ctaText: 'Enter for KSh 50',
    active: true,
  },
  {
    id: 'bn_2',
    title: '⚡ Weekend 2X Multiplier Rush',
    subtitle: 'Every correct answer earns double XP and cash bonus.',
    tag: 'LIMITED PROMO',
    bgGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    ctaText: 'Play Live Market',
    active: true,
  },
];

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateRole,
  theme = 'light',
  onAddBroadcastNotification,
}) => {
  const isDark = theme === 'dark';
  const userRole = currentUser.role || 'player';

  // Available tabs depending on role
  const isSuperAdmin = userRole === 'super_admin';
  const isAdmin = isSuperAdmin || userRole === 'admin';
  const isMarketer = isSuperAdmin || userRole === 'marketer';

  type TabKey = 'overview' | 'users' | 'questions' | 'marketing' | 'promos' | 'system';
  const [activeTab, setActiveTab] = useState<TabKey>(
    isSuperAdmin ? 'overview' : isMarketer && !isAdmin ? 'marketing' : 'questions'
  );

  // Managed Users state
  const [managedUsers, setManagedUsers] = useState<MockManagedUser[]>(INITIAL_MANAGED_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserRoleFilter, setSelectedUserRoleFilter] = useState<string>('all');

  // Question Management state
  const [categories, setCategories] = useState<QuizCategory[]>(QUIZ_CATEGORIES);
  const [selectedCategoryForQuestions, setSelectedCategoryForQuestions] = useState<string>(QUIZ_CATEGORIES[0].id);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['Option A', 'Option B', 'Option C', 'Option D']);
  const [newCorrectIdx, setNewCorrectIdx] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [questionFeedback, setQuestionFeedback] = useState<string>('');

  // Marketing broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'quiz' | 'streak' | 'market' | 'withdrawal' | 'system'>('quiz');
  const [broadcastFeedback, setBroadcastFeedback] = useState<string>('');

  // Promo codes state
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(INITIAL_PROMO_CODES);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState('100');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed_bonus' | 'free_entry'>('fixed_bonus');

  // Banners state
  const [banners, setBanners] = useState<MarketingBannerItem[]>(INITIAL_BANNERS);

  // System Controls state
  const [stkPushActive, setStkPushActive] = useState(true);
  const [instantPayoutLimit, setInstantPayoutLimit] = useState('50000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemFeedback, setSystemFeedback] = useState('');

  if (!isOpen) return null;

  // Filter users
  const filteredUsers = managedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch);
    const matchesRole =
      selectedUserRoleFilter === 'all' || u.role === selectedUserRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Role Change
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (onUpdateRole) onUpdateRole(userId, newRole);
  };

  // Handle Toggle User Ban
  const handleToggleBan = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  // Handle Add New Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: Question = {
      id: `q_custom_${Date.now()}`,
      question: newQuestionText.trim(),
      options: newOptions,
      correctIndex: newCorrectIdx,
      explanation: newExplanation.trim() || undefined,
    };

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryForQuestions
          ? { ...cat, questions: [newQ, ...cat.questions] }
          : cat
      )
    );

    setNewQuestionText('');
    setNewExplanation('');
    setQuestionFeedback('Question added successfully to category question bank!');
    setTimeout(() => setQuestionFeedback(''), 3000);
  };

  // Handle Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    if (onAddBroadcastNotification) {
      onAddBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType);
    }

    setBroadcastFeedback(`Broadcast alert sent to all ${managedUsers.length} registered players!`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastFeedback(''), 3500);
  };

  // Handle Add Promo Code
  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const newCodeItem: PromoCodeItem = {
      id: `pc_${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      value: parseFloat(newPromoValue) || 100,
      usesCount: 0,
      maxUses: 1000,
      active: true,
      expiryDate: '31 Dec 2026',
    };

    setPromoCodes((prev) => [newCodeItem, ...prev]);
    setNewPromoCode('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] border border-purple-500/30">👑 SUPER ADMIN</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">🛡️ ADMIN</span>;
      case 'marketer':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] border border-amber-500/30">📢 MARKETER</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">🎮 PLAYER</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto ${
          isDark
            ? 'bg-[#0B0E14] border-[#1A2332] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
          isSuperAdmin
            ? 'bg-purple-950/40'
            : isMarketer && !isAdmin
            ? 'bg-amber-950/40'
            : isDark ? 'bg-[#121722]' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center text-xl shadow-xs">
              {isSuperAdmin ? '👑' : isMarketer && !isAdmin ? '📢' : '🛡️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base leading-none">
                  {isSuperAdmin
                    ? 'Trivquest Super Admin Command Center'
                    : isMarketer && !isAdmin
                    ? 'Trivquest Marketing & Growth Hub'
                    : 'Trivquest Operations & Quiz Admin Portal'}
                </h3>
                {getRoleBadge(userRole)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close portal"
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto ${
          isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-100 border-slate-200'
        }`}>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Financials &amp; Treasury</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Roles ({managedUsers.length})</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Question Bank &amp; Live Rounds</span>
            </button>
          )}

          {isMarketer && (
            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'marketing'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Campaigns &amp; Broadcasts</span>
            </button>
          )}

          {isMarketer && (
            <button
              onClick={() => setActiveTab('promos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'promos'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Promo Codes &amp; Banners</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Safaricom Gateway &amp; System</span>
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* 1. OVERVIEW & FINANCIALS (SUPER ADMIN) */}
          {activeTab === 'overview' && isSuperAdmin && (
            <div className="space-y-5">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Gross Inflows (M-Pesa)</span>
                  <div className="text-xl sm:text-2xl font-black text-[#00A344]">KSh 1,420,500</div>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1 block">+18.4% this week</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Instant Payouts Dispatched</span>
                  <div className="text-xl sm:text-2xl font-black text-rose-500">KSh 845,000</div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">3,120 B2C transactions</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Net Platform Margin</span>
                  <div className="text-xl sm:text-2xl font-black text-purple-500">KSh 575,500</div>
                  <span className="text-[10px] text-purple-400 font-bold mt-1 block">40.5% Net Retained</span>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Daraja API Health</span>
                  <div className="text-xl sm:text-2xl font-black text-[#00A344] flex items-center gap-1">
                    <span>99.98%</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Avg STK latency: 1.1s</span>
                </div>
              </div>

              {/* Daraja Status Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isDark ? 'bg-[#121722] border-[#00A344]/30' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-3">
                  <MpesaLogo size="md" />
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm">Safaricom Daraja 2.0 B2C &amp; C2B Integration</h4>
                    <p className="text-xs text-slate-500">Production Paybill: <strong>174379</strong> &bull; Till: <strong>892341</strong> &bull; SSL Encrypted</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#00A344] text-white text-xs font-black uppercase">
                  OPERATIONAL
                </div>
              </div>
            </div>
          )}

          {/* 2. USER ROLE MANAGEMENT (SUPER ADMIN) */}
          {activeTab === 'users' && isSuperAdmin && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user by name, email, or phone..."
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs sm:text-sm ${
                      isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['all', 'super_admin', 'admin', 'marketer', 'player'].map((roleKey) => (
                    <button
                      key={roleKey}
                      onClick={() => setSelectedUserRoleFilter(roleKey)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        selectedUserRoleFilter === roleKey
                          ? 'bg-purple-600 text-white'
                          : isDark ? 'bg-[#121722] text-slate-400' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {roleKey === 'all' ? 'All Roles' : roleKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b text-[10px] uppercase font-black tracking-wider ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <tr>
                        <th className="p-3">User &amp; Country</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Wallet Balance</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Role Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-medium">
                      {filteredUsers.map((usr) => (
                        <tr key={usr.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <div className="font-extrabold flex items-center gap-1.5">
                              <span>{usr.countryFlag}</span>
                              <span className="text-slate-900 dark:text-white">{usr.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{usr.country} &bull; Joined {usr.joinedDate}</span>
                          </td>
                          <td className="p-3">{getRoleBadge(usr.role)}</td>
                          <td className="p-3">
                            <div>{usr.email}</div>
                            <div className="text-[10px] text-slate-400">{usr.phone}</div>
                          </td>
                          <td className="p-3 font-extrabold text-[#00A344]">
                            KSh {usr.balanceKsh.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              usr.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-500'
                                : 'bg-rose-500/20 text-rose-500'
                            }`}>
                              {usr.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Role Selector dropdown */}
                              <select
                                value={usr.role}
                                onChange={(e) => handleChangeRole(usr.id, e.target.value as UserRole)}
                                className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer outline-none ${
                                  isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              >
                                <option value="player">🎮 Player</option>
                                <option value="marketer">📢 Marketer</option>
                                <option value="admin">🛡️ Admin</option>
                                <option value="super_admin">👑 Super Admin</option>
                              </select>

                              {/* Suspend / Unban Toggle */}
                              <button
                                onClick={() => handleToggleBan(usr.id)}
                                title={usr.status === 'active' ? 'Suspend User' : 'Activate User'}
                                className="p-1 rounded-lg border border-slate-500/30 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. QUESTION BANK & LIVE ROUNDS (ADMIN & SUPER ADMIN) */}
          {activeTab === 'questions' && isAdmin && (
            <div className="space-y-5">
              {/* Category Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryForQuestions(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      selectedCategoryForQuestions === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isDark ? 'bg-[#121722] text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name} ({cat.questions.length})</span>
                  </button>
                ))}
              </div>

              {/* Add New Question Form */}
              <form onSubmit={handleAddQuestion} className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5 uppercase">
                    <Plus className="w-4 h-4" />
                    <span>Add New Question to Bank</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">2x2 Grid Output Compatible</span>
                </div>

                {questionFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{questionFeedback}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-400">Question Prompt</label>
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. Which Kenyan athlete holds the official marathon world record?"
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* 2x2 Answer Options Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewCorrectIdx(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 cursor-pointer ${
                          newCorrectIdx === idx
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-black/20 text-slate-400 hover:text-white'
                        }`}
                        title="Mark as correct answer"
                      >
                        {String.fromCharCode(65 + idx)}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[idx] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-semibold outline-none ${
                          isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Correct Answer: <strong className="text-emerald-500">{String.fromCharCode(65 + newCorrectIdx)}</strong> ({newOptions[newCorrectIdx]})
                  </span>

                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase transition-all shadow-md cursor-pointer"
                  >
                    Save to Category Bank
                  </button>
                </div>
              </form>

              {/* Existing Category Questions List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Questions in Category ({categories.find((c) => c.id === selectedCategoryForQuestions)?.questions.length || 0})
                </h4>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {categories
                    .find((c) => c.id === selectedCategoryForQuestions)
                    ?.questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                          isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {idx + 1}. {q.question}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                            {q.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className={oIdx === q.correctIndex ? 'text-emerald-500 font-bold' : ''}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex && '✓'}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setCategories((prev) =>
                              prev.map((cat) =>
                                cat.id === selectedCategoryForQuestions
                                  ? { ...cat, questions: cat.questions.filter((item) => item.id !== q.id) }
                                  : cat
                              )
                            );
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. MARKETING CAMPAIGNS & BROADCASTS (MARKETER & SUPER ADMIN) */}
          {activeTab === 'marketing' && isMarketer && (
            <div className="space-y-5">
              {/* Broadcast Alert Creator */}
              <form onSubmit={handleSendBroadcast} className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs sm:text-sm text-amber-500 flex items-center gap-1.5 uppercase">
                    <Send className="w-4 h-4" />
                    <span>Push &amp; In-App Notification Broadcast</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Sends to all registered players</span>
                </div>

                {broadcastFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{broadcastFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1 text-slate-400">Campaign Title</label>
                    <input
                      type="text"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. ⚡ Weekend Mega Prize: KSh 100,000 Live Round Starting!"
                      className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${
                        isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-400">Alert Category</label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none ${
                        isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="quiz">⚡ Live Quiz Announcement</option>
                      <option value="streak">🔥 Streak Bonus Offer</option>
                      <option value="market">🏆 Market Settlement</option>
                      <option value="system">📢 General Promotion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-400">Message Body</label>
                  <textarea
                    rows={2}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter short promotional text that drives players into the live speed markets..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold outline-none resize-none ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Send Broadcast Notification Now
                </button>
              </form>
            </div>
          )}

          {/* 5. PROMO CODES & BANNERS (MARKETER & SUPER ADMIN) */}
          {activeTab === 'promos' && isMarketer && (
            <div className="space-y-5">
              {/* Add Promo Code */}
              <form onSubmit={handleAddPromoCode} className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-extrabold text-xs uppercase text-amber-500 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>Generate New Promo Code</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    placeholder="CODE NAME (e.g. FLASH200)"
                    className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold uppercase ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />

                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="fixed_bonus">Fixed Bonus KSh</option>
                    <option value="percentage">% Deposit Match</option>
                    <option value="free_entry">Free Tournament Entry</option>
                  </select>

                  <input
                    type="number"
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(e.target.value)}
                    placeholder="Value (e.g. 100)"
                    className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                      isDark ? 'bg-[#0B0E14] border-[#222C3E] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />

                  <button
                    type="submit"
                    className="py-2 px-3 rounded-xl bg-amber-600 text-white font-extrabold text-xs uppercase cursor-pointer"
                  >
                    Create Code
                  </button>
                </div>
              </form>

              {/* Promo Codes Table */}
              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-white border-slate-200'
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] uppercase font-bold text-slate-400 ${
                    isDark ? 'bg-[#0B0E14] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-3">Promo Code</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Benefit</th>
                      <th className="p-3">Redemptions</th>
                      <th className="p-3">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold">
                    {promoCodes.map((pc) => (
                      <tr key={pc.id}>
                        <td className="p-3 font-mono font-black text-amber-500">{pc.code}</td>
                        <td className="p-3 capitalize">{pc.discountType.replace('_', ' ')}</td>
                        <td className="p-3 font-extrabold text-[#00A344]">
                          {pc.discountType === 'percentage' ? `${pc.value}%` : `KSh ${pc.value}`}
                        </td>
                        <td className="p-3">{pc.usesCount} / {pc.maxUses}</td>
                        <td className="p-3 text-slate-400">{pc.expiryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. SYSTEM & GATEWAYS (SUPER ADMIN) */}
          {activeTab === 'system' && isSuperAdmin && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-extrabold text-xs uppercase text-purple-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Platform System Switches &amp; Safaricom Thresholds</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 dark:bg-black/30">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">M-Pesa STK Push Express Gateway</div>
                      <div className="text-slate-400 text-[11px]">Enable / disable automated phone prompt payments</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStkPushActive(!stkPushActive)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs uppercase cursor-pointer ${
                        stkPushActive ? 'bg-[#00A344] text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {stkPushActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 dark:bg-black/30">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Auto B2C Instant Cashout Threshold</div>
                      <div className="text-slate-400 text-[11px]">Withdrawals above this amount require manual admin sign-off</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#00A344]">KSh</span>
                      <input
                        type="number"
                        value={instantPayoutLimit}
                        onChange={(e) => setInstantPayoutLimit(e.target.value)}
                        className={`w-24 px-2 py-1 rounded-lg border text-xs font-bold ${
                          isDark ? 'bg-[#0B0E14] border-[#222C3E]' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/10 dark:bg-black/30">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Global Maintenance Mode</div>
                      <div className="text-slate-400 text-[11px]">Locks trivia market trading while updating system</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs uppercase cursor-pointer ${
                        maintenanceMode ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {maintenanceMode ? 'Active (Locked)' : 'Off (Normal)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-[11px] font-semibold text-slate-400 ${
          isDark ? 'bg-[#0B0E14] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Role-Based Access Control (RBAC) &bull; Audit logs active</span>
          </div>
          <span>Trivquest v2.6 Enterprise</span>
        </div>
      </motion.div>
    </div>
  );
};
