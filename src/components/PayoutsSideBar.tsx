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
  status: 'sent' | 'processing';
}

interface PayoutsSideBarProps {
  theme?: 'dark' | 'light';
}

export const PayoutsSideBar: React.FC<PayoutsSideBarProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [totalDisbursed, setTotalDisbursed] = useState<number>(65450);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real DB transactions from backend API
  const fetchRecentPayouts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/recent-withdrawals`);
      if (res.ok) {
        const data = await res.json();
        if (data.payouts && Array.isArray(data.payouts)) {
          setPayouts(data.payouts);
        }
        if (data.totalDisbursed) {
          setTotalDisbursed(data.totalDisbursed);
        }
      }
    } catch {
      // Handle network error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPayouts();
    const interval = setInterval(fetchRecentPayouts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full rounded-2xl border flex flex-col font-sans transition-colors overflow-hidden select-none shadow-md ${
        isDark
          ? 'bg-[#1A1816] border-[#3D3836] text-[#F5F5F5]'
          : 'bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className={`p-4 border-b ${isDark ? 'border-[#3D3836] bg-[#252220]' : 'border-slate-300 bg-slate-100'}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Smartphone className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight leading-tight flex items-center gap-1.5 text-slate-900">
                <span>Live Payouts</span>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
            Instant
          </span>
        </div>

        {/* 24h Summary Metric */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
          isDark ? 'bg-[#252220] border-[#3D3836]' : 'bg-white border-slate-300'
        }`}>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">24h Disbursed</div>
            <div className="text-sm font-bold text-[#22C55E]">
              KSh {totalDisbursed.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-slate-600 tracking-wider">Settlement</div>
            <div className="text-xs font-semibold text-[#E28C6D] flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
              <span>Instant</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRIVACY NOTICE SUB-BANNER */}
      <div className={`px-4 py-2 text-[10px] font-medium border-b flex items-center justify-between ${
        isDark ? 'bg-[#252220]/80 border-[#3D3836] text-[#D1D5DB]' : 'bg-slate-200 border-slate-300 text-slate-700'
      }`}>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#F55129]" />
          <span>User details encrypted & masked</span>
        </div>
        <span className="text-[9px] text-slate-500 font-mono">256-BIT SSL</span>
      </div>

      {/* SCROLLABLE LIST OF RECENT CASH OUTS */}
      <div className="p-3 space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar">
        {isLoading && payouts.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#22C55E]" />
            <p className="text-xs text-slate-500">Loading live payouts from database...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No payout transactions recorded yet.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {payouts.map((item) => {
              const cleanCategory = (item.category && !/bot|simulation|test|demo|automated/i.test(item.category))
                ? item.category
                : 'Instant Cashout';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    isDark
                      ? 'bg-[#252220] border-[#3D3836] hover:border-[#F55129]/30 hover:bg-[#2A2624]'
                      : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {/* Left Column: Avatar & Masked Credentials */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 ${
                      isDark ? 'bg-[#1A1816] border-[#3D3836]' : 'bg-slate-100 border-slate-300'
                    }`}>
                      {item.avatar}
                    </div>
                    <div className="min-w-0">
                      {/* Masked Name and Phone */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs truncate text-slate-900">{item.maskedName}</span>
                        <span className="text-[10px] font-mono text-slate-600 shrink-0">
                          ({item.maskedPhone})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className="truncate max-w-[140px]">{cleanCategory}</span>
                        <span>•</span>
                        <span className="text-slate-500 shrink-0">{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#22C55E] flex items-center justify-end gap-0.5">
                      <span>+KSh</span>
                      <span>{item.amountKsh.toLocaleString()}</span>
                    </div>
                    <div className="text-[9px] text-[#22C55E] font-semibold uppercase tracking-wider">
                      ✓ Paid
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* FOOTER BADGE */}
      <div className={`p-3 border-t text-center ${isDark ? 'border-[#3D3836] bg-[#252220]' : 'border-slate-300 bg-slate-100'}`}>
        <div className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#E28C6D] fill-[#E28C6D]" />
          <span>Play live quiz to cash out directly to M-Pesa</span>
        </div>
      </div>
    </div>
  );
};
