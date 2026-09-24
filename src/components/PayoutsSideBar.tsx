import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, RefreshCw, CheckCircle2, ArrowUpRight } from 'lucide-react';
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
  className?: string;
}

const isTestBotName = (name: unknown) => {
  const normalizedName = String(name ?? '').trim().toLowerCase();
  return normalizedName.includes('test bot') || normalizedName === 'test bo1';
};

const getTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Just now';
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  } catch {
    return 'Recently';
  }
};

const DEFAULT_SAMPLE_PAYOUTS: PayoutRecord[] = [
  { id: '1', maskedName: 'Faith K.', maskedPhone: '***892', amountKsh: 2450, category: 'Kenya Trivia', timeAgo: '2m ago', avatar: 'F', status: 'sent' },
  { id: '2', maskedName: 'Kevin M.', maskedPhone: '***411', amountKsh: 1200, category: 'Sports Speed', timeAgo: '4m ago', avatar: 'K', status: 'sent' },
  { id: '3', maskedName: 'Achieng O.', maskedPhone: '***603', amountKsh: 3500, category: 'Finance Quiz', timeAgo: '7m ago', avatar: 'A', status: 'sent' },
  { id: '4', maskedName: 'Brian W.', maskedPhone: '***219', amountKsh: 850, category: 'Tech Sprint', timeAgo: '11m ago', avatar: 'B', status: 'sent' },
];

export const PayoutsSideBar: React.FC<PayoutsSideBarProps> = ({ className = '' }) => {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(DEFAULT_SAMPLE_PAYOUTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRecentPayouts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/player/recent-withdrawals`);
      if (res.ok) {
        const data = await res.json();
        if (data.payouts && Array.isArray(data.payouts) && data.payouts.length > 0) {
          const formattedPayouts = data.payouts
            .map((p: any) => ({
              id: String(p.id),
              maskedName: p.player?.name || p.bot_name || 'Player',
              maskedPhone: p.player?.phone_number || '***',
              amountKsh: parseFloat(p.amount) || 0,
              category: p.type === 'win' ? 'Round Win' : 'Instant Cashout',
              timeAgo: getTimeAgo(p.created_at),
              avatar: (p.player?.name || 'P')[0].toUpperCase(),
              status: 'sent' as const,
            }))
            .filter((p: PayoutRecord) => !isTestBotName(p.maskedName));

          if (formattedPayouts.length > 0) {
            setPayouts(formattedPayouts);
          }
        }
      }
    } catch {
      // Use fallback
    }
  };

  useEffect(() => {
    fetchRecentPayouts();
    const interval = setInterval(fetchRecentPayouts, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`triv-card overflow-hidden select-none ${className}`}>
      {/* Header */}
      <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
            Live Cashouts
          </h3>
        </div>
        <span className="text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--success-soft)] text-[var(--success)] border border-[var(--border)]">
          Instant M-Pesa
        </span>
      </div>

      {/* Security badge note */}
      <div className="px-3.5 py-1.5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[var(--accent-text)]" />
          <span>Encrypted automated settlements</span>
        </div>
        <span className="font-mono text-[9px]">256-BIT</span>
      </div>

      {/* List */}
      <div className="p-2 space-y-1.5 max-h-[380px] overflow-y-auto no-scrollbar">
        {payouts.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[var(--card)] border border-[var(--border)] flex items-center justify-center font-bold text-[10px] text-[var(--text-primary)] shrink-0">
                {item.avatar}
              </div>
              <div className="truncate">
                <div className="font-medium text-[var(--text-primary)] truncate text-[11px]">
                  {item.maskedName}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {item.category} • {item.timeAgo}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono font-bold text-xs text-[var(--success)]">
                +KES {item.amountKsh.toLocaleString()}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                Processed
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)] text-center text-[11px] text-[var(--text-muted)]">
        <span>Average settlement time: </span>
        <span className="font-semibold text-[var(--text-primary)]">3.8 seconds</span>
      </div>
    </div>
  );
};
