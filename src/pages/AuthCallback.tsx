import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserProfile } from '../types';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const action = searchParams.get('action');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error) {
      setStatus('error');
      setMessage(decodeURIComponent(error));
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('No authentication token received');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // Create user profile from token
    const userProfile: UserProfile = {
      id: '',
      isLoggedIn: true,
      name: 'User',
      phone: '',
      email: '',
      avatar: '👤',
      joinedDate: new Date().getFullYear().toString(),
      questionsAttempted: 0,
      questionsCorrect: 0,
      totalEarnedKsh: 0,
      quizzesPlayed: 0,
      rank: 0,
      walletBalance: 0,
      referralCode: '',
      emailVerified: true,
      country: 'KE',
      countryCode: 'KE',
      currencySymbol: 'KES',
    };

    // Save to localStorage
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    localStorage.setItem('player_token', token);

    setStatus('success');

    // Handle different scenarios
    if (message === 'existing_account') {
      setMessage('An account with this email already exists. You have been logged in.');
    } else if (message === 'new_account') {
      setMessage('New account created successfully! You have been logged in.');
    } else if (action === 'register') {
      setMessage('Account created successfully!');
    } else {
      setMessage('Logged in successfully!');
    }

    // Redirect to home after 2 seconds
    setTimeout(() => navigate('/'), 2000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="text-center p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl max-w-sm w-full mx-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-primary)] text-base font-semibold">Processing authentication...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[var(--text-primary)] text-base font-bold">{message}</p>
            <p className="text-[var(--text-muted)] text-xs">Redirecting to game arena...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-500 text-base font-bold">Authentication Error</p>
            <p className="text-[var(--text-secondary)] text-sm">{message}</p>
            <p className="text-[var(--text-muted)] text-xs">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
};
