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
      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
        <Trophy className="w-5 h-5 fill-emerald-500" />
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
        className="relative z-10 w-full max-w-lg rounded-2xl p-4 sm:p-6 border flex flex-col max-h-[90vh] overflow-hidden shadow-2xl transition-colors duration-200 bg-[var(--card)] border-[var(--border)] text-[var(--text-primary)]"
      >
        {/* 1. TOP HEADER */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative border border-[var(--border)] bg-[var(--surface)] text-[var(--accent-text)]">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white font-black text-[10px] flex items-center justify-center border-2 border-[var(--card)]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight leading-tight text-[var(--text-primary)]">
                Activity Notifications
              </h3>
              <p className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                {unreadCount > 0 ? `${unreadCount} Unread Alert${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[var(--border)] text-xs font-bold transition-all cursor-pointer shadow-xs bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
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
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[var(--border)] text-xs font-bold transition-all cursor-pointer shadow-xs bg-[var(--surface)] text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-[var(--border)] transition-all cursor-pointer ml-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. FILTER TABS & SIMULATE WIN BUTTON */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)] text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                filter === 'all'
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-black'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                filter === 'unread'
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-black'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            type="button"
            onClick={onAddTestNotification}
            className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs bg-[var(--accent-soft)] text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Win Alert</span>
          </button>
        </div>

        {/* 3. SCROLLABLE NOTIFICATIONS LIST */}
        <div className="overflow-y-auto py-2.5 space-y-2.5 flex-1 min-h-[220px]">
          {filteredList.length === 0 ? (
            <div className="py-14 text-center text-xs flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border border-[var(--border)] bg-[var(--surface)]">
                🔔
              </div>
              <p className="font-bold text-[var(--text-secondary)]">No notifications in this view.</p>
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
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--text-primary)] shadow-xs'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {getNotificationIcon(item)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm truncate text-[var(--text-primary)]">
                          {item.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 ring-2 ring-[var(--accent)]/30 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed font-normal text-[var(--text-secondary)]">
                        {item.message || item.description}
                      </p>
                      <span className="text-[10px] font-bold block mt-1.5 text-[var(--text-muted)]">
                        {item.time || item.timestamp || 'Just now'}
                      </span>
                    </div>
                  </div>

                  {isUnread && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--accent)] text-white shrink-0">
                      NEW
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 4. BROWSER PUSH FOOTER TOGGLE */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[var(--text-secondary)]">
            <Smartphone className="w-4 h-4 text-[var(--accent-text)]" />
            <span>Instant push notifications</span>
          </div>

          <button
            type="button"
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`px-3 py-1 rounded-xl border font-black text-xs transition-all cursor-pointer ${
              pushEnabled
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            {pushEnabled ? 'Enabled ✓' : 'Enable'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
