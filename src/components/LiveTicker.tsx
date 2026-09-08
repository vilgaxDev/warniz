import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export interface LiveTickerItem {
  id: string;
  user: string;
  avatar: string;
  category: string;
  amountKsh: number;
  timeAgo: string;
}

interface LiveTickerProps {
  theme?: 'dark' | 'light';
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [tickerItems, setTickerItems] = useState<LiveTickerItem[]>([]);

  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/recent-withdrawals`);
        if (res.ok) {
          const data = await res.json();
          if (data.payouts && Array.isArray(data.payouts)) {
            const mapped = data.payouts.map((p: any) => ({
              id: p.id,
              user: p.maskedName,
              avatar: p.avatar || '🇰🇪',
              category: p.category || 'Live Market Cashout',
              amountKsh: p.amountKsh || 500,
              timeAgo: p.timeAgo || 'Just now',
            }));
            setTickerItems(mapped);
          }
        }
      } catch {
        // Silence fetch error
      }
    };

    fetchLiveItems();
    const interval = setInterval(fetchLiveItems, 10000);
    return () => clearInterval(interval);
  }, []);

  if (tickerItems.length === 0) return null;

  return (
    <div
      className={`w-full py-2 px-3 sm:px-4 rounded-xl border flex items-center gap-3 overflow-hidden select-none transition-colors ${
        isDark
          ? 'bg-[#0e1524] border-slate-800/80 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
      }`}
    >
      {/* Live Badge Label */}
      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-700/60">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-400 flex items-center gap-1">
          <Zap className="w-3 h-3 fill-emerald-400" />
          Live Payouts
        </span>
      </div>

      {/* Horizontal Sliding Ticker Stream */}
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
        {tickerItems.concat(tickerItems).map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center gap-2 shrink-0">
            <span className="text-sm">{item.avatar}</span>
            <span className="font-semibold text-xs">{item.user}</span>
            <span className="text-[11px] text-slate-400 font-normal">won</span>
            <span className="font-bold text-xs text-emerald-400 font-mono-numbers">
              +KSh {item.amountKsh.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">({item.category})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
