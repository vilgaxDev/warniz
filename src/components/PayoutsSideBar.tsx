import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Smartphone, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PayoutRecord {
  id: string;
  maskedName: string;
  maskedPhone: string;
  amountKsh: number;
  category: string;
  timeAgo: string;
  avatar: string;
  status: 'sent' | 'processing' | 'waiting';
  type?: string;
  isCurrentUser?: boolean;
}

interface PayoutsSideBarProps {
  theme?: 'dark' | 'light';
}

const isTestBotName = (name: unknown) => {
  const normalizedName = String(name ?? '').trim().toLowerCase();
  return normalizedName.includes('test bot') || normalizedName === 'test bo1';
};

export const PayoutsSideBar: React.FC<PayoutsSideBarProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [totalDisbursed, setTotalDisbursed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real DB transactions from backend API
  const fetchRecentPayouts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/player/recent-withdrawals`);
      if (res.ok) {
        const data = await res.json();
        
        // Handle new response format with payouts array and totalDisbursed
        if (data.payouts && Array.isArray(data.payouts)) {
          let formattedPayouts = data.payouts.map((p: any) => ({
            id: String(p.id),
            maskedName: p.player?.name || p.bot_name || 'Unknown',
            maskedPhone: p.player?.phone_number || '0000000000',
            amountKsh: parseFloat(p.amount) || 0,
            category: p.type === 'win' ? 'Quiz Winnings' : p.type === 'loss' ? 'Quiz Loss' : 'Instant Cashout',
            timeAgo: getTimeAgo(p.created_at),
            avatar: p.type === 'win' ? '🏆' : p.type === 'loss' ? '❌' : '💰',
            status: 'sent' as const,
            type: p.type,
            isSimulated: (p.player?.is_simulated ?? false) || (p.bot_name ? true : false)
          })).filter((p: PayoutRecord) => !isTestBotName(p.maskedName));
          
          // Add current user if they're in lobby (waiting) - only for real players
          const token = localStorage.getItem('player_token');
          if (token) {
            try {
              const lobbyRes = await fetch(`${baseUrl}/api/lobby/my-status`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                },
              });
              if (lobbyRes.ok) {
                const lobbyData = await lobbyRes.json();
                if (lobbyData.in_lobby && lobbyData.status) {
                  const maskPhone = (phone: string) => {
                    if (!phone) return '0000000000';
                    const cleaned = phone.replace(/[^0-9]/g, '');
                    if (cleaned.length < 4) return '*'.repeat(cleaned.length);
                    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
                  };
                  
                  const currentUserEntry = {
                    id: 'current-user',
                    maskedName: lobbyData.status.name,
                    maskedPhone: maskPhone(lobbyData.status.phone_number),
                    amountKsh: lobbyData.status.balance,
                    category: 'Waiting',
                    timeAgo: 'Just now',
                    avatar: '👤',
                    status: 'waiting' as const,
                    type: 'waiting',
                    isCurrentUser: true,
                    isSimulated: false
                  };
                  
                  // Add current user at the top (only if not already in payouts)
                  const alreadyInPayouts = formattedPayouts.some((p: PayoutRecord) => 
                    p.maskedName === currentUserEntry.maskedName
                  );
                  
                  if (!alreadyInPayouts) {
                    formattedPayouts.unshift(currentUserEntry);
                  }
                }
              }
            } catch (error) {
              // Ignore lobby fetch errors
            }
          }
          
          setPayouts(formattedPayouts);
        } else if (Array.isArray(data)) {
          // Handle case where API returns array directly
          const formattedPayouts = data.map((p: any) => ({
            id: String(p.id),
            maskedName: p.player?.name || p.bot_name || 'Unknown',
            maskedPhone: p.player?.phone_number || '0000000000',
            amountKsh: parseFloat(p.amount) || 0,
            category: p.type === 'win' ? 'Quiz Winnings' : p.type === 'loss' ? 'Quiz Loss' : 'Instant Cashout',
            timeAgo: getTimeAgo(p.created_at),
            avatar: p.type === 'win' ? '🏆' : p.type === 'loss' ? '❌' : '💰',
            status: 'sent' as const,
            type: p.type,
            isSimulated: (p.player?.is_simulated ?? false) || (p.bot_name ? true : false)
          })).filter((p: PayoutRecord) => !isTestBotName(p.maskedName));
          setPayouts(formattedPayouts);
        }
        
        if (data.totalDisbursed !== undefined) {
          setTotalDisbursed(data.totalDisbursed);
        }
      }
    } catch (error) {
      // Silent fail - will retry on next interval
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  useEffect(() => {
    fetchRecentPayouts();
    const interval = setInterval(fetchRecentPayouts, 2000); // Update every 2 seconds for faster refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full rounded-2xl border flex flex-col font-sans transition-colors overflow-hidden select-none shadow-md ${
        isDark
          ? 'bg-[#0E121B] border-[#222C3E] text-[#F8FAFC]'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className={`p-4 border-b ${isDark ? 'border-[#222C3E] bg-[#141A26]' : 'border-slate-200 bg-slate-50/70'}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Smartphone className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h3 className={`font-bold text-sm tracking-tight leading-tight flex items-center gap-1.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>Live Payouts</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            Instant
          </span>
        </div>


      </div>

      {/* PRIVACY NOTICE SUB-BANNER */}
      <div className={`px-4 py-2 text-[10px] font-medium border-b flex items-center justify-between ${
        isDark ? 'bg-[#141A26]/80 border-[#222C3E] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>User details encrypted & masked</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">256-BIT SSL</span>
      </div>

      {/* SCROLLABLE LIST OF RECENT CASH OUTS */}
      <div className="p-3 space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar">
        {isLoading && payouts.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#10B981]" />
            <p className="text-xs text-slate-500">Loading live payouts from database...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No payout transactions recorded yet.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {payouts.map((item) => {
              const cleanCategory = item.category || 'Instant Cashout';
              const isCurrentUser = item.isCurrentUser;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isCurrentUser
                      ? 'bg-yellow-500/10 border-yellow-500/50'
                      : isDark
                      ? 'bg-[#141A26] border-[#222C3E] hover:border-emerald-500/40 hover:bg-[#182030]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Left Column: Avatar & Masked Credentials */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 ${
                      isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {item.avatar}
                    </div>
                    <div className="min-w-0">
                      {/* Masked Name - Phone Hidden */}
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold text-xs truncate ${
                          isCurrentUser 
                            ? 'text-yellow-500' 
                            : isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {isCurrentUser ? 'You' : item.maskedName}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500 text-yellow-900 rounded font-medium">
                            Waiting
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="truncate max-w-[140px]">{cleanCategory}</span>
                        {!isCurrentUser && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 shrink-0">{item.timeAgo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount */}
                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                      isCurrentUser 
                        ? 'text-yellow-500' 
                        : item.category === 'Quiz Loss' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      <span>KES {item.amountKsh.toLocaleString()}</span>
                    </div>
                    <div className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isCurrentUser 
                        ? 'text-yellow-500' 
                        : item.category === 'Quiz Loss' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {isCurrentUser ? 'Balance' : item.category === 'Quiz Loss' ? 'Lost' : 'Paid'}
                    </div>
                    {isCurrentUser && (
                      <div className="text-[9px] text-yellow-500 font-mono">
                        {item.maskedPhone}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* FOOTER BADGE */}
      <div className={`p-3 border-t text-center ${isDark ? 'border-[#222C3E] bg-[#141A26]' : 'border-slate-200 bg-slate-100'}`}>
        <div className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Play live quiz to cash out directly to M-Pesa</span>
        </div>
      </div>
    </div>
  );
};
