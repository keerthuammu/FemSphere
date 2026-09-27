import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Trash2,
  Heart,
  Pill,
  Calendar,
  Watch,
  Sparkles,
  Users,
  Stethoscope,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

export default function NotificationCenterModal() {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  if (!isNotificationOpen) return null;

  const categories = ['All', 'Health', 'Medication', 'Appointment', 'Wearable', 'Cycle', 'Caregiver'];

  const filteredNotifs = notifications.filter(n =>
    activeFilter === 'All' ? true : n.category === activeFilter
  );

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'Health':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Medication':
        return <Pill className="w-4 h-4 text-purple-600" />;
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'Wearable':
        return <Watch className="w-4 h-4 text-emerald-500" />;
      case 'Cycle':
        return <Sparkles className="w-4 h-4 text-pink-500" />;
      case 'Caregiver':
        return <Users className="w-4 h-4 text-amber-500" />;
      case 'Doctor':
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-lg h-[84vh] max-h-[640px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications & Clinical Alerts
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors min-h-[44px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 min-h-[44px] ${
                activeFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5 scrollbar-thin">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">No alerts in this category</p>
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-white dark:bg-slate-850 border-purple-50 dark:border-slate-800 opacity-75'
                    : 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60 shadow-xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-purple-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>{notifications.filter(n => !n.read).length} unread updates</span>
          <button
            onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
}
