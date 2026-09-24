import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, User, Wallet, History, Settings, LogOut, ArrowUpRight, ArrowDownLeft,
  CheckCircle2, Clock, Phone, Mail, Award, Flame, Trophy, Plus, ShieldAlert, Edit2, Save, Key, Check, ShieldCheck, FileText, Globe, ChevronDown, Eye, EyeOff,
  ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';
import { UserProfile, TransactionRecord, QuestionHistoryItem, UserState } from '../types';
import { getAvatarOptionsForCountry } from '../data/userProfileData';

// Helper: validate and format international phone numbers
function validateAndFormatPhoneNumber(phone: string, dialCode: string, countryCode: string): { isValid: boolean; formatted: string; error: string } {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Remove all + signs first to normalize
  let digitsOnly = cleaned.replace(/\+/g, '');

  // Remove duplicate country codes from digits (e.g., 254254 -> 254)
  while (digitsOnly.startsWith(dialCode) && digitsOnly.length > dialCode.length && digitsOnly.substring(dialCode.length).startsWith(dialCode)) {
    digitsOnly = digitsOnly.substring(dialCode.length);
  }

  // If starting with 0, replace with country code
  if (digitsOnly.startsWith('0')) {
    digitsOnly = dialCode + digitsOnly.substring(1);
  }

  // If starting with country code, keep it
  if (digitsOnly.startsWith(dialCode)) {
    // Already has country code, ensure it's properly formatted
  } 
  // If it doesn't start with country code, add it
  else if (!digitsOnly.startsWith(dialCode)) {
    digitsOnly = dialCode + digitsOnly;
  }

  // Format with + sign
  cleaned = '+' + digitsOnly;

  // Country-specific validation
  if (countryCode === 'KE') {
    // Kenyan numbers: +254 followed by 9 digits
    // Supports all Kenyan mobile operators:
    // - Safaricom: +25470X, +25471X, +25472X, +25474X, +25475X, +25476X, +25477X, +25478X, +25479X
    // - Airtel: +25410X, +25411X, +25412X, +25413X, +25414X, +25415X, +25416X, +25417X, +25418X, +25419X
    // - Telkom: +25474X (shared prefix range)
    const kenyanPattern = /^\+254[71]\d{8}$/;
    if (!kenyanPattern.test(cleaned)) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Invalid Kenyan phone number. Must be a valid Safaricom (07XX...) or Airtel (01XX...) number. Format: +2547XXXXXXXXX or 07XXXXXXXXX'
      };
    }
  } else {
    // International validation: must have at least 10 digits total including country code
    const internationalPattern = /^\+\d{10,15}$/;
    if (!internationalPattern.test(cleaned)) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Invalid phone number. Must be 10-15 digits including country code.'
      };
    }
  }

  return {
    isValid: true,
    formatted: cleaned,
    error: ''
  };
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userState: UserState;
  transactions: TransactionRecord[];
  questionHistory: QuestionHistoryItem[];
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
  onOpenDepositModal: () => void;
  onOpenWithdrawModal: () => void;
  initialTab?: 'profile' | 'wallet' | 'questions' | 'edit' | 'terms' | 'privacy' | 'withdraw';
  theme?: 'dark' | 'light';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  userState,
  transactions,
  questionHistory,
  onUpdateProfile,
  onLogout,
  onOpenDepositModal,
  onOpenWithdrawModal,
  initialTab = 'profile',
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = React.useState<'profile' | 'wallet' | 'questions' | 'edit' | 'terms' | 'privacy'>('profile');

  // Transaction filter state
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'quiz_reward'>('all');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab, isOpen]);

  // Edit Profile form state
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  // Change Password state inside Settings
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeFeedback, setPasswordChangeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(() => {
    return localStorage.getItem('hidePhoneNumber') === 'true';
  });

  // Save phone visibility preference
  useEffect(() => {
    localStorage.setItem('hidePhoneNumber', hidePhoneNumber.toString());
  }, [hidePhoneNumber]);

  // Function to mask phone number
  const maskPhoneNumber = (phone: string) => {
    if (!hidePhoneNumber) return phone;
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 4) return '*'.repeat(cleaned.length);
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput.trim()) {
      setPasswordChangeFeedback({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (newPasswordInput.length < 6) {
      setPasswordChangeFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      const token = localStorage.getItem('player_token') || localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/player/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPasswordInput,
          new_password: newPasswordInput,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPasswordChangeFeedback({
          type: 'success',
          message: data.message || 'Password changed successfully! Security confirmation email sent.',
        });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');

        setTimeout(() => {
          setPasswordChangeFeedback(null);
        }, 4000);
      } else {
        const errorData = await response.json();
        setPasswordChangeFeedback({
          type: 'error',
          message: errorData.error || errorData.message || 'Failed to change password.',
        });
      }
    } catch (error) {
      setPasswordChangeFeedback({
        type: 'error',
        message: 'Error: Failed to connect to server',
      });
    }
  };

  const selectedCountry = { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', currency: 'KES', currencyCode: 'KES', paymentMethod: 'M-PESA' };

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate and format phone number (Kenya only)
    const dialCode = '+254'.replace('+', '');
    const validation = validateAndFormatPhoneNumber(editPhone.trim(), dialCode, 'KE');
    if (!validation.isValid) {
      setEditSuccessMsg(`Error: ${validation.error}`);
      setTimeout(() => {
        setEditSuccessMsg('');
      }, 3000);
      return;
    }
    const formattedPhone = validation.formatted;

    try {
      const token = localStorage.getItem('player_token') || localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/player/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone_number: formattedPhone,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update local profile state
        const updatedProfile: UserProfile = {
          ...userProfile,
          name: editName,
          email: editEmail,
          phone: formattedPhone,
          avatar: editAvatar,
          country: 'Kenya',
          countryCode: 'KE',
          currencySymbol: 'KES',
        };

        onUpdateProfile(updatedProfile);
        setEditSuccessMsg('Profile updated successfully!');
        setTimeout(() => {
          setEditSuccessMsg('');
          setActiveTab('profile');
        }, 1200);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to update profile';
        if (errorMessage.includes('Phone number already in use')) {
          setEditSuccessMsg('Error: This phone number is already in use by another account.');
        } else if (errorMessage.includes('Email already in use')) {
          setEditSuccessMsg('Error: This email is already in use by another account.');
        } else {
          setEditSuccessMsg(`Error: ${errorMessage}`);
        }
        setTimeout(() => {
          setEditSuccessMsg('');
        }, 3000);
      }
    } catch (error) {
      setEditSuccessMsg('Error: Failed to connect to server');
      setTimeout(() => {
        setEditSuccessMsg('');
      }, 3000);
    }
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenDepositModal();
  };

  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenWithdrawModal();
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter === 'all') return true;
    return tx.type === txFilter;
  });

  const accuracyPercent = userProfile.questionsAttempted > 0
    ? Math.round((userProfile.questionsCorrect / userProfile.questionsAttempted) * 100)
    : 0;

  return (
    <>
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className={`w-full max-w-3xl rounded-2xl border flex flex-col max-h-[92vh] overflow-hidden shadow-2xl relative ${
            isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Bar */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-white/5 bg-[#0a0f16]/90' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-2xl flex items-center justify-center shrink-0 shadow-md">
                {userProfile.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`font-semibold text-base sm:text-lg leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {userProfile.name}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                    RANK #{userProfile.rank}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="flex items-center gap-1.5">
                    {maskPhoneNumber(userProfile.phone)}
                    {userProfile.phone && (
                      <button
                        onClick={() => setHidePhoneNumber(!hidePhoneNumber)}
                        className={`text-xs transition-colors cursor-pointer ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                        aria-label={hidePhoneNumber ? 'Show phone number' : 'Hide phone number'}
                      >
                        {hidePhoneNumber ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </span>
                  {' • Joined '}{userProfile.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark ? 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/25' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-[#111827] border-[#1A2332] text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`grid grid-cols-4 p-1.5 border-b text-xs font-semibold shrink-0 ${
            isDark ? 'bg-[#0a0f16] border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'wallet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet & Tx</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'questions'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Question Log</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* TAB 1: OVERVIEW & ACCOUNT */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Balance KPI Bar */}
                <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#22C55E] font-semibold block mb-1">
                      CURRENT WALLET BALANCE
                    </span>
                    <div className="text-2xl sm:text-3xl font-semibold text-[#22C55E]">
                      {selectedCountry.currency} {userState.walletBalance.toLocaleString()}
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Available for instant cashout or live market rounds.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={onOpenDepositModal}
                      className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
                      Deposit
                    </button>
                    <button
                      onClick={onOpenWithdrawModal}
                      className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                    >
                      <ArrowUpFromLine className="w-4 h-4 stroke-[2.5]" />
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#181513] border-[#292524]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold block mb-1">
                      Total Earned
                    </span>
                    <div className="text-lg sm:text-xl font-semibold text-[#22C55E]">
                      {selectedCountry.currency} {userProfile.totalEarnedKsh.toLocaleString()}
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Win Accuracy
                    </span>
                    <div className="text-lg sm:text-xl font-semibold text-emerald-400">
                      {accuracyPercent}%
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Questions Solved
                    </span>
                    <div className="text-lg sm:text-xl font-semibold text-slate-100">
                      {userProfile.questionsCorrect}/{userProfile.questionsAttempted}
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Country Location
                    </span>
                    <div className="text-lg sm:text-xl font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{selectedCountry.flag}</span>
                      <span className="text-sm truncate">{selectedCountry.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WALLET & TRANSACTIONS */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Transaction History
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    {(['all', 'deposit', 'withdrawal', 'quiz_reward'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setTxFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg border font-semibold capitalize cursor-pointer transition-colors ${
                          txFilter === filter
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isDark ? 'bg-[#111827] border-[#1A2332] text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {filter === 'quiz_reward' ? 'Winnings' : filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredTransactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No transaction records found.
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.type === 'deposit' || tx.type === 'quiz_reward'
                              ? 'bg-[#22C55E]/15 text-[#22C55E]'
                              : 'bg-[#EF4444]/15 text-[#EF4444]'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'quiz_reward' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-slate-100">{tx.title}</div>
                            <div className="text-[11px] text-slate-400">{tx.timestamp} • Ref: {tx.mpesaRef}</div>
                          </div>
                        </div>

                        <div className={`font-semibold text-sm sm:text-base ${
                          tx.type === 'deposit' || tx.type === 'quiz_reward' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'quiz_reward' ? '+' : '-'}
                          {selectedCountry.currency} {tx.amount.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: QUESTION LOG */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Recent Question Audits ({questionHistory.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Auto-recorded for transparency
                  </span>
                </div>

                <div className="space-y-2.5">
                  {questionHistory.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No question attempts logged yet. Start a quiz round!
                    </div>
                  ) : (
                    questionHistory.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border space-y-2 ${
                          isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.timestamp}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-100">
                          {item.questionText}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#1A2332]">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Your Answer:</span>
                            <span className={`font-semibold ${item.isCorrect ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                              {item.userAnswer}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Correct Answer:</span>
                            <span className="text-[#22C55E] font-semibold">
                              {item.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: EDIT PROFILE */}
            {activeTab === 'edit' && (
              <div className="space-y-6 max-w-lg mx-auto">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {editSuccessMsg && (
                    <div className="p-3 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  {/* Country / Location - Kenya Only */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`block text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        Country / Region
                      </label>
                      <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>Currency: KES</span>
                      </span>
                    </div>

                    <div className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                      isDark
                        ? 'bg-[#111827] border-[#1A2332] text-slate-100'
                        : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                    }`}>
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-2xl shrink-0 drop-shadow-xs">🇰🇪</span>
                        <span className="font-semibold truncate text-slate-100">Kenya</span>
                        <span className="text-[11px] font-mono text-emerald-400 shrink-0">(+254)</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                        <span className="text-[10px] text-[#22C55E] font-semibold bg-[#22C55E]/10 px-1.5 py-0.5 rounded border border-[#22C55E]/20">
                          KES (KES)
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 text-[10px] px-1 text-slate-400">
                      <span>Payout: <strong className="text-[#22C55E]">M-PESA</strong></span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                        isDark ? 'bg-[#111827] border-[#1A2332] text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                        isDark ? 'bg-[#111827] border-[#1A2332] text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                      Kenya Mobile Number (with Flag)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-sm">🇰🇪</span>
                      </div>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                          isDark ? 'bg-[#111827] border-[#1A2332] text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`block text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        Avatar Icon
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Flag: <strong className="text-emerald-400">Kenya (🇰🇪)</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {getAvatarOptionsForCountry('🇰🇪').map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setEditAvatar(av)}
                          className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center shrink-0 cursor-pointer ${
                            editAvatar === av
                              ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500'
                              : isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Details</span>
                  </button>
                </form>

                {/* Privacy Settings */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-extrabold text-white">Privacy Settings</h4>
                  </div>
                  <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Control your personal information visibility in your profile.
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-[#111827]">
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">Hide Phone Number</span>
                      <span className="text-[10px] text-slate-400">Mask your phone number in profile display</span>
                    </div>
                    <button
                      onClick={() => setHidePhoneNumber(!hidePhoneNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        hidePhoneNumber
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {hidePhoneNumber ? 'Hidden' : 'Visible'}
                    </button>
                  </div>
                </div>

                {/* Dedicated Password Change Section */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-extrabold text-white">Change Account Password</h4>
                  </div>
                  <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Ensure your account is using a secure password. You will receive an instant email notification once updated.
                  </p>

                  {passwordChangeFeedback && (
                    <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      passwordChangeFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                    }`}>
                      {passwordChangeFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                      )}
                      <span>{passwordChangeFeedback.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-emerald-500 ${
                          isDark ? 'bg-[#121927] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="At least 6 characters"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-emerald-500 ${
                          isDark ? 'bg-[#121927] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Re-type new password"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-emerald-500 ${
                          isDark ? 'bg-[#121927] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                    >
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Update Password &amp; Send Confirmation Email</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 5: TERMS */}
            {activeTab === 'terms' && (
              <div className="space-y-4 text-xs leading-relaxed max-w-xl mx-auto">
                <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-[#1A2332]' : 'border-slate-200'}`}>
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Terms of Service</h3>
                </div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>1. <strong>Fair Play:</strong> Each question is bound to an immutable countdown clock. Results are settled instantly.</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>2. <strong>Withdrawals:</strong> Immediate payout via supported global payment rails with 0% processing fee.</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>3. <strong>Wallet Safety:</strong> Funds are safeguarded in an isolated transparent pool.</p>
              </div>
            )}

            {/* TAB 6: PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 text-xs leading-relaxed max-w-xl mx-auto">
                <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-[#1A2332]' : 'border-slate-200'}`}>
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Privacy & Security</h3>
                </div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>1. <strong>Data Encryption:</strong> All transactions and session keys are secured with 256-bit AES encryption.</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>2. <strong>Payment Privacy:</strong> We never store private banking PINs. All authentication occurs via secure external gateway prompts.</p>
              </div>
            )}
          </div>


        </motion.div>
      </div>
    </AnimatePresence>


    </>
  );
};
