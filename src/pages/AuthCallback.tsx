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
      isLoggedIn: true,
      name: 'User',
      phone: '',
      email: '',
      balance: 0,
      avatar: '',
      referralCode: '',
      isVerified: true,
      country: 'KE',
      currency: 'KES',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900">
      <div className="text-center p-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg font-semibold">Processing authentication...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold">{message}</p>
            <p className="text-slate-400 text-sm">Redirecting to home...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold">Authentication Error</p>
            <p className="text-slate-400 text-sm">{message}</p>
            <p className="text-slate-500 text-xs">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
};
