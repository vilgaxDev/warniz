import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X, ArrowUpRight, AlertCircle, RefreshCw, CheckCircle2, Lock, ShieldCheck, LogIn,
  ArrowUpFromLine
} from 'lucide-react';
import { UserProfile, UserState } from '../types';
import { paymentSettingsService } from '../services/paymentSettingsService';

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

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userState: UserState;
  onWithdraw: (amount: number, phone: string) => void;
  onOpenAuth?: () => void;
  theme?: 'dark' | 'light';
  minWithdrawAmount?: number;
}

const QUICK_WITHDRAW_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const COUNTRY_OPTIONS = [
  { code: 'KE', name: 'Kenya', flag: 'KE', dialCode: '+254', provider: 'M-PESA', placeholder: '0712 345 678' },
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  userState,
  onWithdraw,
  onOpenAuth,
  theme = 'light',
  minWithdrawAmount = 500,
}) => {
  const isDark = theme === 'dark';

  const [amount, setAmount] = useState<string>(String(minWithdrawAmount || 500));
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.phone || '+254712345678');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedRef, setGeneratedRef] = useState<string>('');
  const [currentMinWithdraw, setCurrentMinWithdraw] = useState<number>(minWithdrawAmount || 500);
  const [quickWithdrawAmounts, setQuickWithdrawAmounts] = useState<number[]>(QUICK_WITHDRAW_AMOUNTS);

  const selectedCountry = COUNTRY_OPTIONS[0];

  // Load payment settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await paymentSettingsService.fetchPaymentSettings();
        setCurrentMinWithdraw(settings.min_withdraw_amount);
        setAmount(String(settings.min_withdraw_amount));
        // Use backend deposit amounts for quick withdraw as well
        if (settings.deposit_amounts && settings.deposit_amounts.length > 0) {
          setQuickWithdrawAmounts(settings.deposit_amounts);
        }
      } catch (error) {
        console.error('Failed to load withdraw settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Keep phone in sync with userProfile
  useEffect(() => {
    if (userProfile.phone && (!phoneNumber || phoneNumber === '+254712345678')) {
      setPhoneNumber(userProfile.phone);
    }
  }, [userProfile.phone]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setIsSubmitting(false);
      if (userProfile.phone) setPhoneNumber(userProfile.phone);
      const defaultAmt = Math.min(currentMinWithdraw, userState.walletBalance > 0 ? userState.walletBalance : currentMinWithdraw);
      setAmount(defaultAmt.toString());
    }
  }, [isOpen, userProfile.phone, userState.walletBalance, currentMinWithdraw]);

  if (!isOpen) return null;

  if (!userProfile.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-md rounded-3xl border relative overflow-hidden shadow-2xl my-auto ${
            isDark
              ? 'bg-[#0B0E14] border-[#1A2332] text-[#F8FAFC]'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className={`px-5 py-4 flex items-center justify-between border-b ${
            isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight leading-none">
                  Sign In Required
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Withdraw from wallet balance
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'border-[#222C3E] text-slate-400 hover:text-white hover:bg-[#182030]' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Please sign in to withdraw your winnings instantly via M-PESA mobile money.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth?.();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-rose-600/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowUpFromLine className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In to Withdraw</span>
            </button>
          </div>
          <div className={`px-5 py-3 border-t flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
            isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Payout &bull; M-PESA Instant</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const parsedAmount = parseFloat(amount) || 0;
  const remainingBalance = Math.max(0, userState.walletBalance - parsedAmount);

  const handleMaxClick = () => {
    const maxVal = Math.max(currentMinWithdraw, userState.walletBalance);
    setAmount(maxVal.toString());
    setErrorMessage('');
  };

  const handleQuickSelect = (amt: number) => {
    if (amt > userState.walletBalance) {
      setAmount(userState.walletBalance.toString());
    } else if (amt < currentMinWithdraw) {
      setAmount(currentMinWithdraw.toString());
    } else {
      setAmount(amt.toString());
    }
    setErrorMessage('');
  };

  const handleInitiateWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isNaN(parsedAmount) || parsedAmount < currentMinWithdraw) {
      setErrorMessage(`Minimum withdrawal amount is KES ${currentMinWithdraw}`);
      return;
    }

    if (parsedAmount > userState.walletBalance) {
      setErrorMessage(`Insufficient funds. You have KES ${userState.walletBalance.toLocaleString()} available.`);
      return;
    }

    let cleanPhone = phoneNumber.replace(/\s+/g, '');

    // Validate and format phone number (Kenya only)
    const dialCode = '+254'.replace('+', '');
    const validation = validateAndFormatPhoneNumber(cleanPhone, dialCode, 'KE');
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }
    cleanPhone = validation.formatted;

    setIsSubmitting(true);

    const token = localStorage.getItem('player_token') || localStorage.getItem('token');
    if (token) {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/player/withdraw`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            amount: parsedAmount,
            phone_number: cleanPhone,
          }),
        });

        const data = await res.json();
        setIsSubmitting(false);

        if (res.ok) {
          const ref = data.transaction?.reference || `WD-${Date.now()}`;
          setGeneratedRef(ref);
          onWithdraw(parsedAmount, cleanPhone);
          setStatus('success');
        } else {
          setErrorMessage(data.error || data.message || 'Withdrawal request failed. Please check your inputs.');
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMessage('Unable to connect to the M-PESA withdrawal service. Please try again.');
      }
    } else {
      setIsSubmitting(false);
      setErrorMessage('Please sign in to request a withdrawal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] relative overflow-hidden shadow-xl my-auto triv-card"
      >
        {/* Clean Modern Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border border-rose-500/30 bg-rose-500/15 text-rose-500">
              <ArrowUpFromLine className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                  Instant M-PESA Cashout
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base tracking-tight leading-none text-[var(--text-primary)]">
                Mobile Money Withdraw
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Available Balance Banner */}
          {status === 'idle' && (
            <div className={`p-3.5 rounded-2xl border mb-4 flex items-center justify-between ${
              isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Available to Withdraw
                </span>
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
                  KES {userState.walletBalance.toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={handleMaxClick}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-[11px] font-black uppercase transition-all cursor-pointer shadow-sm shadow-rose-600/20 active:scale-95"
              >
                Max
              </button>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ─── IDLE: WITHDRAW FORM ─── */}
          {status === 'idle' && (
            <form onSubmit={handleInitiateWithdraw} className="space-y-4">
              {/* Country - Kenya Only */}
              <div>
                <label className={`block text-xs font-extrabold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Country
                </label>
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  isDark ? 'bg-[#111827] border-[#1A2332] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <span className="text-lg">KE</span>
                  <div className="text-left">
                    <div className="text-xs font-bold">Kenya</div>
                    <div className="text-[10px] opacity-70">M-PESA</div>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Withdraw Amount
                  </label>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Remaining: <strong className={isDark ? 'text-white' : 'text-slate-800'}>KES {remainingBalance.toLocaleString()}</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600 dark:text-emerald-400">
                    KES
                  </span>
                  <input
                    type="number"
                    min={currentMinWithdraw}
                    max={userState.walletBalance}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder={String(currentMinWithdraw)}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-2xl border text-sm font-extrabold transition-all outline-none ${
                      isDark
                        ? 'bg-[#111827] border-[#1A2332] text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-5 gap-1.5">
                {quickWithdrawAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    disabled={amt > userState.walletBalance}
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      parsedAmount === amt
                        ? 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-600/20'
                        : isDark
                        ? 'bg-[#111827] border-[#1A2332] text-slate-300 hover:border-rose-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {/* Phone Number */}
              <div>
                <label className={`block text-xs font-extrabold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  M-PESA Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-sm">KE</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="0712 345 678"
                    className={`w-full pl-11 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                      isDark
                        ? 'bg-[#111827] border-[#1A2332] text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Breakdown Summary */}
              <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                isDark ? 'bg-[#111827]/80 border-[#1A2332]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Payout Amount</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>KES {parsedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Transaction Fee</span>
                  <span className="font-bold text-emerald-500">FREE (0.00)</span>
                </div>
                <div className={`flex justify-between pt-1.5 border-t font-black ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>You Receive</span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold">KES {parsedAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || parsedAmount <= 0 || parsedAmount > userState.walletBalance}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-rose-600/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUpFromLine className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{isSubmitting ? 'Processing Request...' : `Instant Withdraw KES ${parsedAmount ? parsedAmount.toLocaleString() : ''}`}</span>
              </button>
            </form>
          )}

          {/* ─── SUCCESS: RECEIPT ─── */}
          {status === 'success' && (
            <div className="py-2 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-black text-lg text-rose-600 dark:text-rose-400">
                  Payout Dispatched!
                </h3>
                <p className="text-xs text-slate-500">
                  KES {parsedAmount.toLocaleString()} withdrawal has been submitted to your mobile money line.
                </p>
              </div>

              {/* Receipt Card */}
              <div className={`p-3.5 rounded-2xl border text-left text-xs font-mono leading-relaxed ${
                isDark ? 'bg-[#111827] border-[#1A2332] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-1.5 text-rose-600 dark:text-rose-400 font-sans font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payout Confirmation</span>
                </div>
                <p>
                  <strong>{generatedRef}</strong> Confirmed. You have received Ksh {parsedAmount.toFixed(2)} from TRIVQUEST TRIVIA on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Mobile money balance updated.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className={`px-5 py-3 border-t flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
          isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>End-to-End Encrypted &bull; 256-Bit SSL</span>
        </div>
      </motion.div>
    </div>
  );
};
