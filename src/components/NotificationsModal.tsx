import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Check, Trash2, X, Smartphone, Sparkles, Trophy, Flame,
  DollarSign, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
  onAddTestNotification: () => void;
  theme?: 'dark' | 'light';
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onClearAll,
  onMarkRead,
  onAddTestNotification,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pushEnabled, setPushEnabled] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredList = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const getNotificationIcon = (item: NotificationItem) => {
    if (item.icon) return <span className="text-xl">{item.icon}</span>;
    if (item.type === 'streak' || item.title.includes('Streak')) {
      return (
        <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
          <Flame className="w-5 h-5 fill-rose-500" />
        </div>
      );
    }
    if (item.type === 'withdrawal' || item.type === 'deposit' || item.title.includes('M-Pesa') || item.title.includes('Payout')) {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      );
    }
    if (item.title.includes('Live Quiz') || item.title.includes('Minute')) {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
          <Zap className="w-5 h-5 fill-amber-500" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
        <Trophy className="w-5 h-5 fill-blue-500" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className={`relative z-10 w-full max-w-lg rounded-2xl p-4 sm:p-6 border flex flex-col max-h-[90vh] overflow-hidden shadow-2xl transition-colors duration-200 ${
          isDark
            ? 'bg-[#121722] border-[#222C3E] text-[#F8FAFC]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* 1. TOP HEADER */}
        <div className={`flex items-center justify-between pb-3.5 border-b ${
          isDark ? 'border-[#222C3E]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center relative shadow-md shadow-blue-500/20">
              <Bell className="w-5 h-5 fill-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-[#121722]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className={`font-extrabold text-base tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Activity Notifications
              </h3>
              <p className={`text-[11px] uppercase tracking-wider font-bold ${
                unreadCount > 0 ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {unreadCount} Unread Alert{unreadCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isDark
                    ? 'border-[#222C3E] text-slate-300 bg-[#182030] hover:text-white hover:border-blue-500/40'
                    : 'border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read All</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isDark
                    ? 'border-[#222C3E] text-slate-400 bg-[#182030] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-800'
                    : 'border-slate-200 text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                }`}
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all cursor-pointer ml-1 ${
                isDark
                  ? 'border-[#222C3E] text-slate-400 hover:text-white bg-[#182030] hover:bg-[#222C3E]'
                  : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. FILTER TABS & SIMULATE WIN BUTTON */}
        <div className={`flex items-center justify-between py-3 border-b text-xs font-bold ${
          isDark ? 'border-[#222C3E]' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                filter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 font-black'
                  : isDark
                    ? 'bg-[#182030] text-slate-400 border-[#222C3E] hover:text-slate-200 hover:border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white border-blue-600 font-black'
                  : isDark
                    ? 'bg-[#182030] text-slate-400 border-[#222C3E] hover:text-slate-200 hover:border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            type="button"
            onClick={onAddTestNotification}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
              isDark
                ? 'bg-[#182030] border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white'
                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Win Alert</span>
          </button>
        </div>

        {/* 3. SCROLLABLE NOTIFICATIONS LIST */}
        <div className="overflow-y-auto py-2.5 space-y-2.5 flex-1 custom-scrollbar min-h-[220px]">
          {filteredList.length === 0 ? (
            <div className={`py-14 text-center text-xs flex flex-col items-center justify-center gap-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${
                isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-slate-100 border-slate-200'
              }`}>
                🔔
              </div>
              <p className="font-bold">No notifications in this view.</p>
              <p className="text-[11px] opacity-75">Click "Simulate Win Alert" to trigger live alerts!</p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isUnread = !item.read;

              return (
                <div
                  key={item.id}
                  onClick={() => onMarkRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 relative group ${
                    isUnread
                      ? isDark
                        ? 'bg-[#182030] border-blue-500/40 text-white shadow-md'
                        : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-xs'
                      : isDark
                        ? 'bg-[#121722]/80 border-[#222C3E]/70 text-slate-400 hover:bg-[#182030] hover:text-slate-200'
                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {getNotificationIcon(item)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-xs sm:text-sm truncate ${
                          isUnread
                            ? isDark ? 'text-white' : 'text-slate-900'
                            : isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {item.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-500/30 animate-pulse" />
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed font-normal ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {item.message || item.description}
                      </p>
                      <span className={`text-[10px] font-bold block mt-1.5 ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {item.time || item.timestamp || 'Just now'}
                      </span>
                    </div>
                  </div>

                  {isUnread && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-500 border border-blue-500/30 shrink-0">
                      NEW
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 4. BROWSER PUSH FOOTER TOGGLE */}
        <div className={`pt-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-[#222C3E]' : 'border-slate-100'
        }`}>
          <div className={`flex items-center gap-2 font-bold ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Instant push notifications</span>
          </div>

          <button
            type="button"
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`px-3 py-1 rounded-xl border font-black text-xs transition-all cursor-pointer ${
              pushEnabled
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                : isDark
                  ? 'bg-[#182030] text-slate-300 border-[#222C3E] hover:text-white'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {pushEnabled ? 'Enabled ✓' : 'Enable'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
