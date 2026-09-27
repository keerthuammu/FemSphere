import React from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ShieldAlert,
  Smartphone,
  Maximize2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export default function TopAppBar() {
  const {
    role,
    setRole,
    isDark,
    toggleTheme,
    isPhoneFrame,
    togglePhoneFrame,
    notifications,
    setIsNotificationOpen,
    setIsSearchOpen,
    setIsEmergencyOpen,
    user
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    patient: { label: 'Patient View', badge: '🌸 Patient', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
    caregiver: { label: 'Caregiver Portal', badge: '💗 Caregiver', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
    doctor: { label: 'Doctor Portal', badge: '🩺 Doctor', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' },
    admin: { label: 'Admin Portal', badge: '🛡️ Admin', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-purple-100/70 dark:border-slate-800 px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand & Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-rose-500 to-purple-400 flex items-center justify-center text-white shadow-sm shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              FemSphere
            </span>
          </div>

          {/* Quick Role Selector Dropdown */}
          <div className="relative group ml-1">
            <button
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${roleLabels[role].color}`}
              title="Switch user role view"
            >
              <span>{roleLabels[role].badge}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-purple-100 dark:border-slate-700 py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Switch Role View
              </div>
              {(['patient', 'caregiver', 'doctor', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-purple-50 dark:hover:bg-slate-700/60 transition-colors ${
                    role === r ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-slate-700/30' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {role === r && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search records and insights"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setIsEmergencyOpen(true)}
            aria-label="Emergency SOS information"
            className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors relative"
            title="Emergency Medical Info"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            aria-label="View notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Light Theme' : 'Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Frame Toggle (Phone frame / Full width) */}
          <button
            onClick={togglePhoneFrame}
            aria-label={isPhoneFrame ? 'Switch to responsive view' : 'Switch to mobile phone frame view'}
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            title={isPhoneFrame ? 'Expand to Full View' : 'Switch to Phone View'}
          >
            {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Profile mini avatar */}
          <div
            onClick={() => {
              // open profile tab
              window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'profile' }));
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-rose-200 dark:from-purple-900 dark:to-rose-900 border-2 border-white dark:border-slate-700 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs cursor-pointer shadow-sm ml-0.5"
            title={user.name}
          >
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
