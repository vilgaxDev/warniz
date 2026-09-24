import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X, Zap, AlertCircle, RefreshCw, CheckCircle2, Lock, ShieldCheck, CreditCard, Smartphone, Building2, Globe, Diamond, LogIn,
  ArrowDownToLine
} from 'lucide-react';
import { UserProfile, UserState } from '../types';
import { paymentService, PaymentProvider } from '../services/paymentService';
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

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  userState: UserState;
  onDeposit: (amount: number, phone: string) => void;
  onOpenAuth?: () => void;
  theme?: 'dark' | 'light';
  minDepositAmount?: number; // Deprecated: Now fetched from backend
}

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

const COUNTRY_OPTIONS = [
  { code: 'KE', name: 'Kenya', flag: 'KE', dialCode: '+254', currency: 'KES', currencyCode: 'KES', paymentMethod: 'M-PESA', provider: 'M-PESA', placeholder: '0712 345 678' },
];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  userState,
  onDeposit,
  onOpenAuth,
  theme = 'light',
  minDepositAmount = 10, // Deprecated: Now fetched from backend
}) => {
  const isDark = theme === 'dark';

  const [amount, setAmount] = useState<string>('500');
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.phone || '+254712345678');
  const [status, setStatus] = useState<'idle' | 'prompting' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedRef, setGeneratedRef] = useState<string>('');
  const [apiMessage, setApiMessage] = useState<string>('');
  const [dynamicMinDeposit, setDynamicMinDeposit] = useState<number>(minDepositAmount);
  const [quickAmounts, setQuickAmounts] = useState<number[]>([50, 100, 250, 500, 1000, 2500]);

  const selectedCountry = COUNTRY_OPTIONS[0];
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider>('mpesa');

  // Keep phone in sync when userProfile changes
  useEffect(() => {
    if (userProfile.phone && (!phoneNumber || phoneNumber === '+254712345678')) {
      setPhoneNumber(userProfile.phone);
    }
  }, [userProfile.phone]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setIsSubmitting(false);
      setApiMessage('');
      if (!amount || amount === '0') setAmount('500');
      if (userProfile.phone) setPhoneNumber(userProfile.phone);

      // Fetch payment settings from backend
      loadPaymentSettings();
    }
  }, [isOpen, userProfile.phone]);

  // Load payment settings from backend
  const loadPaymentSettings = async () => {
    try {
      const settings = await paymentSettingsService.fetchPaymentSettings();
      setDynamicMinDeposit(settings.min_deposit_amount);
      setQuickAmounts(settings.deposit_amounts);
      setSelectedPaymentProvider(settings.payment_provider as PaymentProvider);
      
      // Update amount if current amount is below new minimum
      const currentAmount = parseFloat(amount) || 0;
      if (currentAmount < settings.min_deposit_amount) {
        setAmount(settings.deposit_amounts[0]?.toString() || settings.min_deposit_amount.toString());
      }
    } catch (error) {
      console.error('Failed to load payment settings:', error);
      // Keep using defaults if fetch fails
    }
  };

  // Active polling of deposit verification status
  useEffect(() => {
    let pollInterval: any;
    if (status === 'prompting' && generatedRef) {
      pollInterval = setInterval(async () => {
        try {
          const verification = await paymentService.verifyPayment(generatedRef, selectedPaymentProvider);
          if (verification.status === 'completed') {
            const numAmount = parseFloat(amount) || 500;
            onDeposit(numAmount, phoneNumber);
            setStatus('success');
          } else if (verification.status === 'failed') {
            setErrorMessage('Payment failed or was cancelled. Please try again.');
            setStatus('idle');
          }
        } catch {
          // Silence background poll error - continue polling
        }
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [status, generatedRef, amount, phoneNumber, onDeposit, selectedPaymentProvider]);

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
                  Deposit to your wallet account
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
              isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Please sign in to deposit funds to your wallet and start playing trivia for real cash prizes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth?.();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-emerald-600/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In to Deposit</span>
            </button>
          </div>
          <div className={`px-5 py-3 border-t flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
            isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Payment &bull; Real-time Verification</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const parsedAmount = parseFloat(amount) || 0;
  // No balance preview - only backend can confirm actual balance after deposit

  const handleQuickSelect = (amt: number) => {
    setAmount(amt.toString());
    setErrorMessage('');
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isNaN(parsedAmount) || parsedAmount < dynamicMinDeposit) {
      setErrorMessage(`Minimum deposit amount is KES ${dynamicMinDeposit}`);
      return;
    }

    if (parsedAmount > 150000) {
      setErrorMessage(`Maximum single transaction is KES 150,000`);
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

    try {
      const paymentResponse = await paymentService.initiatePayment({
        amount: parsedAmount,
        phone_number: cleanPhone,
        currency: 'KES',
        country_code: 'KE',
        provider: selectedPaymentProvider,
        customer_email: userProfile.email,
        customer_name: userProfile.name,
      });

      setIsSubmitting(false);

      if (paymentResponse.success) {
        setGeneratedRef(paymentResponse.reference);
        setApiMessage(paymentResponse.message);

        // Handle different authorization models
        if (paymentResponse.auth_model === 'REDIRECT' && paymentResponse.checkout_url) {
          // Open checkout URL in new window
          window.open(paymentResponse.checkout_url, '_blank');
          setStatus('prompting');
        } else {
          setStatus('prompting');
        }
      } else {
        setErrorMessage(paymentResponse.message);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Payment initiation failed. Please check your connection and try again.');
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border border-emerald-500/30 bg-emerald-500/15 text-emerald-500">
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                  Instant M-PESA Deposit
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base tracking-tight leading-none text-[var(--text-primary)]">
                Mobile Money Top-Up
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
          {/* Balance Preview Banner */}
          {status === 'idle' && (
            <div className={`p-3.5 rounded-2xl border mb-4 flex items-center justify-between ${
              isDark ? 'bg-[#111827] border-[#1A2332]' : 'bg-emerald-50/60 border-emerald-100'
            }`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Current Balance
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  KES {userState.walletBalance.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Current Balance
                </span>
                <span className="text-base font-black text-emerald-500">
                  KES {userState.walletBalance.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ─── IDLE: DEPOSIT FORM ─── */}
          {status === 'idle' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
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

              {/* Payment Method - From Admin Settings (Read-only) */}
              <div>
                <label className={`block text-xs font-extrabold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Payment Method
                </label>
                <div className="p-3 rounded-xl border bg-emerald-600 border-emerald-600 text-white shadow-sm flex items-center gap-2">
                  <span className="text-lg">{paymentService.getProviderInfo(selectedPaymentProvider).icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold">{paymentService.getProviderInfo(selectedPaymentProvider).name}</div>
                    <div className="text-[10px] opacity-70">{paymentService.getProviderInfo(selectedPaymentProvider).description}</div>
                  </div>
                  <Lock className="w-3 h-3 ml-auto opacity-70" />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className={`block text-xs font-extrabold mb-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-500">
                    KES
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="150000"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="500"
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-2xl border text-sm font-extrabold transition-all outline-none ${
                      isDark
                        ? 'bg-[#111827] border-[#1A2332] text-white focus:border-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="grid grid-cols-6 gap-1.5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickSelect(amt)}
                    className={`py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                      parsedAmount === amt
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : isDark
                        ? 'bg-[#111827] border-[#1A2332] text-slate-300 hover:border-emerald-500/50'
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
                        ? 'bg-[#111827] border-[#1A2332] text-white focus:border-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-emerald-600/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{isSubmitting ? 'Processing Payment...' : `Deposit KES ${parsedAmount ? parsedAmount.toLocaleString() : 'Funds'}`}</span>
              </button>
            </form>
          )}

          {/* ─── PROMPTING: STK PUSH SENT / WAITING FOR CONFIRMATION ─── */}
          {status === 'prompting' && (
            <div className="py-2 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>

              <div>
                <h4 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  STK Push Prompt Dispatched!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {apiMessage || 'Please check your phone screen and enter your M-PESA PIN to complete the deposit.'}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border text-left text-xs font-mono space-y-1 ${
                isDark ? 'bg-[#111827] border-[#1A2332] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <span className="font-bold text-emerald-500">{generatedRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient Phone:</span>
                  <span className="font-bold">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-emerald-500">KES {parsedAmount.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 animate-pulse">
                ⏳ Polling network for payment confirmation...
              </p>
            </div>
          )}

          {/* ─── SUCCESS: RECEIPT ─── */}
          {status === 'success' && (
            <div className="py-2 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                  Deposit Successful!
                </h3>
                <p className="text-xs text-slate-500">
                  KES {parsedAmount.toLocaleString()} has been credited to your wallet.
                </p>
              </div>

              {/* Receipt Card */}
              <div className={`p-3.5 rounded-2xl border text-left text-xs font-mono leading-relaxed ${
                isDark ? 'bg-[#111827] border-[#1A2332] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-1.5 text-emerald-500 font-sans font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Transaction Confirmed</span>
                </div>
                <p>
                  <strong>{generatedRef}</strong> Confirmed. KES {parsedAmount.toFixed(2)} sent to TRIVQUEST TRIVIA on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer shadow-xs"
              >
                Done &bull; Start Playing
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className={`px-5 py-3 border-t flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
          isDark ? 'bg-[#0B0E14] border-[#1A2332] text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Payment &bull; Real-time Verification</span>
        </div>
      </motion.div>
    </div>
  );
};
