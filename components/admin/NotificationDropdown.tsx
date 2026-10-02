'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Package,
  Star,
  AlertTriangle,
  Users,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAdminNotifications,
  getTimeAgo,
  AdminNotification,
} from '@/services/admin/notificationService';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Load notifications on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAdminNotifications();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;

  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  const markOneRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package size={16} className="text-brand-green" />;
      case 'review':
        return <Star size={16} className="text-brand-gold" />;
      case 'stock':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'customer':
        return <Users size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-brand-green" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-brand-green/10';
      case 'review':
        return 'bg-brand-gold/10';
      case 'stock':
        return 'bg-red-100';
      case 'customer':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-brand-text-dark" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-sm sm:text-base text-brand-green">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold rounded-full px-2 py-0.5">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-[10px] sm:text-xs font-medium text-brand-gold hover:text-brand-green transition-colors px-2 py-1"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-brand-text-muted" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-brand-green" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-3">
                    <Bell size={20} className="text-brand-text-muted" />
                  </div>
                  <p className="text-xs sm:text-sm text-brand-text-muted">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif, index) => {
                    const isRead = readIds.includes(notif.id);
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link
                          href={notif.link || '#'}
                          onClick={() => markOneRead(notif.id)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            !isRead ? 'bg-brand-cream/40' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(
                              notif.type
                            )}`}
                          >
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs sm:text-sm font-medium text-brand-text-dark line-clamp-1">
                                {notif.title}
                              </p>
                              {!isRead && (
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-brand-text-muted line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-brand-text-muted mt-1">
                              {getTimeAgo(notif.time)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
                <Link
                  href="/admin/orders"
                  onClick={() => setOpen(false)}
                  className="block text-center text-[10px] sm:text-xs font-medium text-brand-green hover:text-brand-gold transition-colors"
                >
                  View All Activity →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}