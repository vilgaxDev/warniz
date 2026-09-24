import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, LogIn, UserPlus, Phone, Lock, Mail, User, CheckCircle2, ShieldCheck,
  KeyRound, Sparkles, Globe, ArrowLeft, RefreshCw, Check, AlertCircle, Send,
  ChevronDown, Key, Eye, EyeOff, Zap, Trophy, Flame, Award, Gift
} from 'lucide-react';
import { UserProfile, CountryInfo } from '../types';
import { getAvatarOptionsForCountry } from '../data/userProfileData';
import { COUNTRIES_DATA } from '../data/countriesData';
import { CountrySelectModal } from './CountrySelectModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogin: (updatedProfile: UserProfile) => void;
  theme?: 'dark' | 'light';
  initialMode?: 'signin' | 'signup';
}

type AuthMode = 'login' | 'register' | 'forgot_password' | 'email_verification' | 'verification_login';
type ForgotStep = 'enter_email' | 'enter_new_password' | 'success';

// Helper: fetch JSON with correct Accept header, throws on HTML error pages
async function safeFetchJson(url: string, body: Record<string, unknown>): Promise<any> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json: any;
    try { json = JSON.parse(text); } catch {
      throw new Error('Server error – please try again later.');
    }
    if (!res.ok) {
      let errorDetails = null;
      try {
        if (json && typeof json === 'object' && json.errors) {
          // Simple string conversion without using flat()
          const errorString = JSON.stringify(json.errors);
          if (errorString) {
            // Remove quotes and brackets for cleaner message
            errorDetails = errorString.replace(/["\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
          }
        }
      } catch (e) {
        // If error processing fails, use fallback
        errorDetails = null;
      }
      let fallbackMessage = 'Request failed.';
      try {
        if (json && typeof json === 'object') {
          const message = json.message || json.error;
          if (message !== undefined && message !== null) {
            fallbackMessage = String(message);
          }
        }
      } catch (e) {
        fallbackMessage = 'Request failed.';
      }
      // Hide raw technical exception dumps (e.g. PHP/TypeError messages) behind a friendly message,
      // while keeping the real reason visible in the console for debugging.
      if (res.status >= 500) {
        console.error('[safeFetchJson] Server responded with 5xx:', fallbackMessage);
        errorDetails = null;
        fallbackMessage = 'Server error – please try again later.';
      }
      throw new Error(errorDetails || fallbackMessage);
    }
    return json;
  } catch (error: any) {
    console.error('[safeFetchJson] Error:', error);
    throw error;
  }
}

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
    const kenyanPattern = /^\+254(7[0-9]|1[0-9])\d{7}$/;
    if (!kenyanPattern.test(cleaned)) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Invalid Kenyan phone number. Must be a valid mobile number. Format: +2547XXXXXXXXX or 07XXXXXXXXX'
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLogin,
  theme = 'light',
  initialMode = 'signin',
}) => {
  const isDark = theme === 'dark';
  const [mode, setMode] = useState<AuthMode>(initialMode === 'signup' ? 'register' : 'login');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('enter_email');

  useEffect(() => {
    if (initialMode === 'signup') {
      setMode('register');
    } else {
      setMode('login');
    }
  }, [initialMode, isOpen]);

  // Country selection state
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('KE');
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState<boolean>(false);
  const activeCountry = COUNTRIES_DATA.find((c) => c.code === selectedCountryCode) || COUNTRIES_DATA[0];

  // Login form state
  const [loginInputMode, setLoginInputMode] = useState<'phone' | 'email'>('phone');
  const [loginPhoneLocal, setLoginPhoneLocal] = useState('');
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhoneLocal, setRegPhoneLocal] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [regAvatar, setRegAvatar] = useState(activeCountry.flag);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNotifications, setAcceptNotifications] = useState(true);

  // Verification code login state
  const [verifPhoneLocal, setVerifPhoneLocal] = useState('');
  const [verifCode, setVerifCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Dynamic avatar options based on active country's flag
  const currentAvatarOptions = getAvatarOptionsForCountry(activeCountry.flag);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Update country and avatar
  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountryCode(country.code);
    setRegAvatar(country.flag);
    setIsCountryPickerOpen(false);
  };



  if (!isOpen) return null;

  // 1. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let loginIdentifier = '';

    if (loginInputMode === 'phone') {
      if (!loginPhoneLocal.trim()) {
        setErrorMsg(`Valid ${activeCountry.name} mobile number is required`);
        return;
      }

      // Validate and format phone number
      const dialCode = activeCountry.dialCode.replace('+', '');
      const validation = validateAndFormatPhoneNumber(loginPhoneLocal.trim(), dialCode, activeCountry.code);
      if (!validation.isValid) {
        setErrorMsg(validation.error);
        return;
      }
      loginIdentifier = validation.formatted;
    } else {
      if (!loginEmailOrPhone.trim()) {
        setErrorMsg('Please enter your username or email address');
        return;
      }
      loginIdentifier = loginEmailOrPhone.trim();
    }

    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('Authenticating...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/login`, {
        phone_number: loginIdentifier,
        password: loginPassword,
      });

      console.log('[AUTH] Login response:', data);

      // Store token & user data
      if (data.access_token) {
        localStorage.setItem('player_token', data.access_token);
      }
      if (data.user && typeof data.user === 'object') {
        localStorage.setItem('player_data', JSON.stringify(data.user));
      }

      setSuccessMsg('Welcome back! Signing in...');

      const newProfile: UserProfile = {
        ...userProfile,
        isLoggedIn: true,
        id: String((data.user && typeof data.user === 'object') ? data.user.id : '1'),
        name: (data.user && typeof data.user === 'object') ? data.user.name : loginIdentifier,
        email: (data.user && typeof data.user === 'object') ? data.user.email : '',
        phone: (data.user && typeof data.user === 'object') ? data.user.phone_number : loginIdentifier,
        country: userProfile.country || activeCountry.name,
        countryCode: userProfile.countryCode || activeCountry.code,
        currencySymbol: userProfile.currencySymbol || activeCountry.currency,
        avatar: userProfile.avatar || activeCountry.flag,
        emailVerified: (data.user && typeof data.user === 'object' && data.user.email_verified_at) ? true : true,
        // Use backend data - only fields that exist in database
        walletBalance: parseFloat((data.user && typeof data.user === 'object') ? data.user.balance : '0'),
      };

      console.log('[AUTH] Login profile created:', newProfile);

      localStorage.setItem('user_profile', JSON.stringify(newProfile));

      setTimeout(() => {
        onLogin(newProfile);
        setSuccessMsg('');
        onClose();
      }, 500);
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      setErrorMsg(error.message || 'Login failed. Please check your credentials.');
      setSuccessMsg('');
    }
  };

  // 2. Handle Initiate Registration
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg('Full name or username is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must accept the Terms and Conditions to continue');
      return;
    }

    // Validate and format phone number
    const dialCode = activeCountry.dialCode.replace('+', '');
    const validation = validateAndFormatPhoneNumber(regPhoneLocal.trim(), dialCode, activeCountry.code);
    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }
    const fullPhone = validation.formatted;

    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('Creating your account...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/register`, {
        name: regName.trim(),
        email: regEmail.trim(),
        phone_number: fullPhone,
        password: regPassword,
        referral_code: regReferralCode.trim() || undefined,
        accept_notifications: acceptNotifications,
      });

      console.log('[AUTH] Registration response:', data);

      setSuccessMsg('Account created successfully! Signing you in...');

      const newProfile: UserProfile = {
        ...userProfile,
        isLoggedIn: true,
        id: String((data.user && typeof data.user === 'object') ? data.user.id : Date.now()),
        name: (data.user && typeof data.user === 'object') ? data.user.name : regName.trim(),
        email: (data.user && typeof data.user === 'object') ? data.user.email : regEmail.trim(),
        phone: (data.user && typeof data.user === 'object') ? data.user.phone_number : fullPhone,
        country: activeCountry.name,
        countryCode: activeCountry.code,
        currencySymbol: activeCountry.currency,
        avatar: regAvatar || activeCountry.flag,
        emailVerified: true,
        // Use backend data - only fields that exist in database
        walletBalance: parseFloat((data.user && typeof data.user === 'object') ? data.user.balance : '0'),
        referralCode: data.referral_code || '',
      };

      console.log('[AUTH] New profile created:', newProfile);

      localStorage.setItem('player_token', data.access_token || `token_${Date.now()}`);
      localStorage.setItem('player_data', JSON.stringify(newProfile));
      localStorage.setItem('user_profile', JSON.stringify(newProfile));

      setTimeout(() => {
        onLogin(newProfile);
        setSuccessMsg('');
        onClose();
      }, 500);
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      if (errorMessage.includes('Phone number already registered') || errorMessage.includes('Phone number already in use')) {
        setErrorMsg('This phone number is already registered. Please use a different number or login.');
      } else if (errorMessage.includes('Email already registered') || errorMessage.includes('Email already in use')) {
        setErrorMsg('This email is already registered. Please use a different email or login.');
      } else {
        setErrorMsg(errorMessage);
      }
      setSuccessMsg('');
    }
  };

  // 3. Handle Verification Code Login
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifPhoneLocal.trim()) {
      setErrorMsg('Phone number is required');
      return;
    }

    // Validate and format phone number
    const dialCode = activeCountry.dialCode.replace('+', '');
    const validation = validateAndFormatPhoneNumber(verifPhoneLocal.trim(), dialCode, activeCountry.code);
    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }
    const fullPhone = validation.formatted;

    setErrorMsg('');
    setIsSendingCode(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/send-verification-code`, {
        phone_number: fullPhone,
      });

      setSuccessMsg(`Verification code sent! Code: ${data.verification_code} (expires in 15 minutes)`);
      setIsSendingCode(false);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send verification code');
      setIsSendingCode(false);
      setSuccessMsg('');
    }
  };

  const handleVerificationCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verifPhoneLocal.trim()) {
      setErrorMsg('Phone number is required');
      return;
    }

    if (!verifCode.trim()) {
      setErrorMsg('Verification code is required');
      return;
    }

    // Validate and format phone number
    const dialCode = activeCountry.dialCode.replace('+', '');
    const validation = validateAndFormatPhoneNumber(verifPhoneLocal.trim(), dialCode, activeCountry.code);
    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }
    const fullPhone = validation.formatted;

    setErrorMsg('');
    setIsVerifyingCode(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/login-with-verification`, {
        phone_number: fullPhone,
        verification_code: verifCode.trim(),
      });

      setSuccessMsg('Login successful!');

      const newProfile: UserProfile = {
        ...userProfile,
        isLoggedIn: true,
        id: String((data.user && typeof data.user === 'object') ? data.user.id : Date.now()),
        name: (data.user && typeof data.user === 'object') ? data.user.name : 'Player',
        email: (data.user && typeof data.user === 'object') ? data.user.email : '',
        phone: (data.user && typeof data.user === 'object') ? data.user.phone_number : fullPhone,
        country: activeCountry.name,
        countryCode: activeCountry.code,
        currencySymbol: activeCountry.currency,
        avatar: activeCountry.flag,
        emailVerified: true,
        walletBalance: parseFloat((data.user && typeof data.user === 'object') ? data.user.balance : '0'),
        referralCode: (data.user && typeof data.user === 'object') ? data.user.referral_code : '',
      };

      localStorage.setItem('player_token', data.access_token || `token_${Date.now()}`);
      localStorage.setItem('player_data', JSON.stringify(newProfile));
      localStorage.setItem('user_profile', JSON.stringify(newProfile));

      setTimeout(() => {
        onLogin(newProfile);
        setSuccessMsg('');
        onClose();
      }, 500);
    } catch (error: any) {
      setErrorMsg(error.message || 'Invalid or expired verification code');
      setIsVerifyingCode(false);
      setSuccessMsg('');
    }
  };

  // Handle Email Verification
  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setErrorMsg('Verification token not found. Please check your email link.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('Verifying your email...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/email/verify`, { token });

      setSuccessMsg(data.message || 'Email verified successfully! You can now login.');
      setMode('login');
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Verification failed. Please try again.');
      setSuccessMsg('');
    }
  };

  // Handle Resend Verification Email
  const handleResendVerification = async () => {
    setErrorMsg('');
    setSuccessMsg('Resending verification email...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/email/resend`, { email: regEmail });

      setSuccessMsg(data.message || 'Verification email sent! Please check your inbox.');
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to resend email. Please try again.');
      setSuccessMsg('');
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Facebook', action: 'login' | 'signup' = 'login') => {
    if (provider === 'Google') {
      // Redirect to Google OAuth with action parameter
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      window.location.href = `${apiUrl}/api/auth/google/redirect?action=${action}`;
    } else {
      setErrorMsg(`${provider} login is coming soon. Please sign in with your phone number or email.`);
    }
  };

  // Quick demo login removed - must use API-based login only
  // const handleQuickDemoLogin = () => { ... };

  // Forgot password handlers
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('Sending recovery code...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/forgot-password`, {
        email: forgotEmail.trim(),
      });

      setForgotStep('enter_new_password');
      setSuccessMsg(data.message || 'Recovery code sent! Enter the code and your new password.');
      if (data.otp_code) {
        setSuccessMsg(prev => prev + ` Your code is: ${data.otp_code}`);
      }
      setErrorMsg('');
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send recovery code');
      setSuccessMsg('');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    
    if (!forgotOtpCode || forgotOtpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit recovery code');
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    setSuccessMsg('Resetting your password...');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const data = await safeFetchJson(`${apiUrl}/api/player/reset-password`, {
        email: forgotEmail.trim(),
        password: newPassword,
        otp_code: forgotOtpCode,
      });

      setIsVerifying(false);
      setForgotStep('success');
      setSuccessMsg(data.message || 'Password successfully changed! You can now sign in.');
      setErrorMsg('');
    } catch (error: any) {
      setIsVerifying(false);
      setErrorMsg(error.message || 'Failed to reset password');
      setSuccessMsg('');
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md font-sans overflow-y-auto">
          
          {/* Main Card Container with 2-Column Desktop Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`w-full max-w-4xl rounded-3xl border shadow-2xl relative overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12 ${
              isDark
                ? 'bg-[#0B0E14] border-[#1A2332] text-[#F8FAFC]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-transform active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#182030]/80 border-[#222C3E] text-slate-400 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 shadow-xs'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT COLUMN: THE CLEAN, BRIGHT AUTH FORM (7 Cols on MD+) */}
            <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-center">
              
              {/* Header Title & Subtitle */}
              <div className="mb-5">
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none mb-1.5 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  {mode === 'login'
                    ? 'Welcome'
                    : mode === 'forgot_password'
                    ? 'Reset Password'
                    : 'Join Trivquest'}
                </h2>
                <p className={`text-xs sm:text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {mode === 'login'
                    ? 'We are glad to see you back with us'
                    : mode === 'forgot_password'
                    ? 'Enter your email to reset your password'
                    : 'Create your account to compete in live speed trivia'}
                </p>
              </div>

              {/* Mode Toggle Pills (Sign In / Register / Verification Login) */}
              {mode !== 'forgot_password' && (
                <div className={`grid grid-cols-3 gap-1 p-1 rounded-2xl mb-5 border ${
                  isDark ? 'bg-[#121722] border-[#222C3E]' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      mode === 'login'
                        ? isDark ? 'bg-[#1e2738] text-white shadow-sm' : 'bg-white text-slate-950 shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('verification_login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      mode === 'verification_login'
                        ? isDark ? 'bg-[#1e2738] text-white shadow-sm' : 'bg-white text-slate-950 shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    OTP Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      mode === 'register'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Sign Up (+100 XP)
                  </button>
                </div>
              )}

              {/* Alert / Error Banners */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* FORM VIEW: SIGN IN */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Interactive Country Selector with Flag */}
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Country &amp; Currency
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCountryPickerOpen(true)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group ${
                        isDark
                          ? 'bg-[#121722] border-[#222C3E] text-white hover:border-emerald-500/60 hover:bg-[#161D2B]'
                          : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-emerald-500/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl leading-none shrink-0 drop-shadow-xs">{activeCountry.flag}</span>
                        <div className="text-left min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold truncate flex items-center gap-1.5">
                            <span>{activeCountry.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                              {activeCountry.dialCode}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {activeCountry.currencyCode || activeCountry.currency} · {activeCountry.paymentMethod || 'Mobile Money / Card'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-emerald-500 font-bold text-xs">
                        <span className="hidden sm:inline">Change</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </button>
                  </div>

                  {/* Phone / Email Mode Toggle */}
                  <div className="flex gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginInputMode('phone');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginInputMode === 'phone'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-extrabold'
                          : isDark ? 'bg-[#121722] text-slate-400 border border-[#222C3E]' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Mobile Number</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginInputMode('email');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        loginInputMode === 'email'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-extrabold'
                          : isDark ? 'bg-[#121722] text-slate-400 border border-[#222C3E]' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Username / Email</span>
                    </button>
                  </div>

                  {/* Input Field: Mobile Number with Country Flag or Email/Username */}
                  {loginInputMode === 'phone' ? (
                    <div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCountryPickerOpen(true)}
                          className={`px-3 py-2.5 rounded-2xl border flex items-center gap-1.5 shrink-0 text-xs font-bold transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white hover:bg-[#182030]'
                              : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                          }`}
                          title="Click to search and select country flag & dial code"
                        >
                          <span className="text-base">{activeCountry.flag}</span>
                          <span>{activeCountry.dialCode}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input
                            type="tel"
                            value={loginPhoneLocal}
                            onChange={(e) => {
                              setLoginPhoneLocal(e.target.value);
                              setErrorMsg('');
                            }}
                            placeholder="712 345 678"
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                              isDark
                                ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={loginEmailOrPhone}
                          onChange={(e) => {
                            setLoginEmailOrPhone(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="Username or Email address"
                          className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Password"
                        className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                          isDark
                            ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <label className={`flex items-center gap-2 cursor-pointer font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <input type="checkbox" defaultChecked className="rounded accent-emerald-600" />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot_password');
                        setForgotStep('enter_email');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-emerald-500 hover:underline font-bold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* PROMINENT ACTION BUTTON (NEXT / SIGN IN) */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer mt-2"
                  >
                    SIGN IN
                  </button>

                  {/* Social Sign In Options */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google', 'login')}
                      className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.69-3.71 3.29-3.71h5.92c.13 0 .26-.01.38-.04.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 2.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.81-.62 1.48-1.38 2.06-2.24V5.38z"/>
                      </svg>
                      Sign in with Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Facebook', 'login')}
                      className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.228 2.686.228v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328c-.318 1.699-1.599 2.894-3.328 2.894-1.989 0-3.6-1.611-3.6-3.6V12.073z"/>
                      </svg>
                      Sign in with Facebook
                    </button>
                  </div>

                  {/* SIGN IN BUTTON ONLY - API-based login required */}
                </form>
              ) : mode === 'verification_login' ? (
                /* FORM VIEW: VERIFICATION CODE LOGIN */
                <form onSubmit={handleVerificationCodeLogin} className="space-y-3.5">
                  {/* Interactive Country Selector with Flag */}
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Country &amp; Currency
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCountryPickerOpen(true)}
                      className={`w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group ${
                        isDark
                          ? 'bg-[#121722] border-[#222C3E] text-white hover:border-emerald-500/60 hover:bg-[#161D2B]'
                          : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-emerald-500/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl leading-none shrink-0 drop-shadow-xs">{activeCountry.flag}</span>
                        <div className="text-left min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold truncate flex items-center gap-1.5">
                            <span>{activeCountry.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                              {activeCountry.dialCode}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {activeCountry.currencyCode || activeCountry.currency} · {activeCountry.paymentMethod || 'Mobile Money / Card'}
                          </div>
                        </div>
                      </div>
                      <Globe className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCountryPickerOpen(true)}
                        className={`px-3 py-2.5 rounded-2xl border flex items-center gap-1.5 shrink-0 text-xs font-bold transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#121722] border-[#222C3E] text-white hover:bg-[#182030]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base">{activeCountry.flag}</span>
                        <span>{activeCountry.dialCode}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="tel"
                          value={verifPhoneLocal}
                          onChange={(e) => {
                            setVerifPhoneLocal(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="712 345 678"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Send Code Button */}
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="w-full py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Send Verification Code'}
                  </button>

                  {/* Verification Code Input */}
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Verification Code
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={verifCode}
                        onChange={(e) => {
                          setVerifCode(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                          isDark
                            ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Login with Code Button */}
                  <button
                    type="submit"
                    disabled={isVerifyingCode}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isVerifyingCode ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Login with Code'}
                  </button>
                </form>
              ) : mode === 'register' ? (
                /* FORM VIEW: SIGN UP / REGISTER */
                <form onSubmit={handleInitiateRegistration} className="space-y-3">
                    {/* Interactive Country Selector with Flag */}
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Country &amp; Currency
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCountryPickerOpen(true)}
                        className={`w-full px-3.5 py-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group ${
                          isDark
                            ? 'bg-[#121722] border-[#222C3E] text-white hover:border-emerald-500/60 hover:bg-[#161D2B]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-emerald-500/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl leading-none shrink-0 drop-shadow-xs">{activeCountry.flag}</span>
                          <div className="text-left min-w-0">
                            <div className="text-xs sm:text-sm font-extrabold truncate flex items-center gap-1.5">
                              <span>{activeCountry.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold">
                                {activeCountry.dialCode}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {activeCountry.currencyCode || activeCountry.currency} · {activeCountry.paymentMethod || 'Mobile Money / Card'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-emerald-500 font-bold text-xs">
                          <span className="hidden sm:inline">Change</span>
                          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </button>
                    </div>

                    {/* Full Name / Username */}
                    <div>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => {
                            setRegName(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="Your Full Name / Username"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => {
                            setRegEmail(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="Email Address"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Phone with Country Code Flag */}
                    <div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCountryPickerOpen(true)}
                          className={`px-3 py-2.5 rounded-2xl border flex items-center gap-1.5 shrink-0 text-xs font-bold transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white hover:bg-[#182030]'
                              : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base">{activeCountry.flag}</span>
                          <span>{activeCountry.dialCode}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input
                            type="tel"
                            value={regPhoneLocal}
                            onChange={(e) => {
                              setRegPhoneLocal(e.target.value);
                              setErrorMsg('');
                            }}
                            placeholder="712 345 678 "
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                              isDark
                                ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => {
                            setRegPassword(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="Password (Min 4 chars)"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-2">
                      <label className={`flex items-start gap-2 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs">
                          I accept the <a href="/terms" target="_blank" className="text-emerald-500 hover:text-emerald-400 underline">Terms and Conditions</a> and <a href="/privacy" target="_blank" className="text-emerald-500 hover:text-emerald-400 underline">Privacy Policy</a>
                        </span>
                      </label>

                      <label className={`flex items-start gap-2 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <input
                          type="checkbox"
                          checked={acceptNotifications}
                          onChange={(e) => setAcceptNotifications(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs">
                          I agree to receive notifications about game updates, promotions, and rewards
                        </span>
                      </label>
                    </div>

                    {/* Referral Code (Optional) */}
                    <div>
                      <div className="relative">
                        <Zap className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={regReferralCode}
                          onChange={(e) => {
                            setRegReferralCode(e.target.value);
                            setErrorMsg('');
                          }}
                          placeholder="Referral Code (Optional)"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark
                              ? 'bg-[#121722] border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      <div className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 ${
                        isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-emerald-50 border-emerald-200'
                      }`}>
                        <Gift className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={`text-xs font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          Enter a friend's referral code to get KES 50 bonus!
                        </span>
                      </div>
                    </div>

                    {/* Submit Register Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer mt-2"
                    >
                      CREATE TRIVQUEST ACCOUNT
                    </button>

                    {/* Social Sign Up Options */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('Google', 'signup')}
                        className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.69-3.71 3.29-3.71h5.92c.13 0 .26-.01.38-.04.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 2.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.81-.62 1.48-1.38 2.06-2.24V5.38z"/>
                        </svg>
                        Sign up with Google
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('Facebook', 'signup')}
                        className={`py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                          isDark ? 'bg-[#121722] border-[#222C3E] text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.228 2.686.228v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328c-.318 1.699-1.599 2.894-3.328 2.894-1.989 0-3.6-1.611-3.6-3.6V12.073z"/>
                        </svg>
                        Sign up with Facebook
                      </button>
                    </div>
                  </form>
                ) : mode === 'email_verification' ? (
                // EMAIL VERIFICATION WORKFLOW
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-500 font-bold cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>

                  <div className="text-center py-4">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      Verify Your Email
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      We've sent a verification link to <span className="font-semibold text-emerald-500">{regEmail}</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-6">
                      Please check your inbox and click the link to verify your account. If you don't see it, check your spam folder.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-600 hover:text-white font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Resend Verification Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full py-2 px-4 rounded-2xl text-xs text-slate-500 hover:text-emerald-500 font-semibold cursor-pointer transition-colors"
                  >
                    Already verified? Sign In
                  </button>
                </div>
                ) : mode === 'forgot_password' ? (
                // FORGOT PASSWORD WORKFLOW
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-500 font-bold cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>

                  {forgotStep === 'enter_email' ? (
                    <form onSubmit={handleRequestPasswordReset} className="space-y-3.5">
                      <div>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => {
                              setForgotEmail(e.target.value);
                              setErrorMsg('');
                            }}
                            placeholder="Account Email Address"
                            className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                              isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Send Reset Code
                      </button>
                    </form>
                  ) : forgotStep === 'enter_new_password' ? (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                      <div>
                        <div className="relative">
                          <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                          <input
                            type="text"
                            value={forgotOtpCode}
                            onChange={(e) => setForgotOtpCode(e.target.value)}
                            placeholder="6-Digit Recovery Code"
                            maxLength={6}
                            className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                              isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-emerald-500 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all outline-none ${
                            isDark ? 'bg-[#121722] border-[#222C3E] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase cursor-pointer"
                      >
                        Update Password
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                      <p className="font-bold text-sm">Password Updated!</p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setForgotStep('enter_email');
                        }}
                        className="text-xs text-emerald-500 font-bold underline cursor-pointer"
                      >
                        Sign in with new password
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* RIGHT COLUMN: 3D TRIVIA HERO ARTWORK WITH BLACK NET THEME (5 Cols on MD+) */}
            <div className="hidden md:flex md:col-span-5 p-4 sm:p-5 flex-col items-center justify-between relative overflow-hidden">
              {/* Outer Container */}
              <div className="w-full h-full rounded-3xl bg-[#0D131F] border border-[#222C3E] p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
                
                {/* Top Badge: 254 Live Arena */}
                <div className="flex items-center justify-between z-10">
                  <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 border border-white/10 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>TRIVQUEST ARENA</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Central 3D Explorer & Floating Trivia Floating Elements */}
                <div className="my-auto py-6 flex flex-col items-center justify-center text-center relative z-10">
                  {/* Glowing 3D Explorer Avatar Box */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative flex items-center justify-center mb-4"
                  >
                    {/* Glowing Aura Ring */}
                    <div className="w-28 h-28 rounded-full bg-emerald-500/10 backdrop-blur-md flex items-center justify-center p-2 shadow-2xl border border-emerald-500/20">
                      <div className="w-full h-full rounded-full bg-[#121824] border border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner">
                        🧑‍🚀
                      </div>
                    </div>

                    {/* Floating Multiplier Badge Left */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -left-4 top-2 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-black tracking-wider flex items-center gap-1 border border-emerald-500/30 text-emerald-400"
                    >
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>12.5x</span>
                    </motion.div>

                    {/* Floating Prize Badge Right */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute -right-4 bottom-2 px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg font-bold"
                    >
                      <Trophy className="w-3 h-3" />
                      <span>KSh 5,000</span>
                    </motion.div>
                  </motion.div>

                  <h3 className="font-black text-lg sm:text-xl tracking-tight leading-tight mb-1 text-white">
                    Challenge Your Mind &amp; Win
                  </h3>
                  <p className="text-slate-400 text-xs font-medium max-w-[210px] leading-relaxed">
                    Play 12-second speed markets with real-time M-Pesa payouts.
                  </p>
                </div>

                {/* Bottom Trust Stat Bar */}
                <div className="grid grid-cols-3 gap-1 bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-[#222C3E] text-center z-10">
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-white">50K+</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Players</span>
                  </div>
                  <div className="border-x border-[#222C3E]">
                    <span className="block font-black text-xs sm:text-sm text-emerald-400">12 Sec</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Rounds</span>
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-white">Instant</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">M-Pesa</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={isCountryPickerOpen}
        onClose={() => setIsCountryPickerOpen(false)}
        selectedCountryCode={selectedCountryCode}
        onSelectCountry={handleSelectCountry}
        theme={theme}
      />
    </>
  );
};
