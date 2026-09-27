import React from 'react';
import {
  Home,
  Activity,
  Sparkles,
  HeartPulse,
  User,
  Users,
  Stethoscope,
  Shield,
  FileText,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { role, activeTab, setActiveTab, setIsAIChatOpen } = useApp();

  // Custom tab configurations based on active role
  const getTabs = () => {
    switch (role) {
      case 'caregiver':
        return [
          { id: 'home', label: 'Dependents', icon: Users },
          { id: 'health', label: 'Vitals & Meds', icon: HeartPulse },
          { id: 'twin', label: 'Twin AI', icon: Sparkles, isCenter: true },
          { id: 'care', label: 'Vaccines & Care', icon: Calendar },
          { id: 'profile', label: 'Settings', icon: User },
        ];
      case 'doctor':
        return [
          { id: 'home', label: 'Clinical Feed', icon: Stethoscope },
          { id: 'health', label: 'Patient Twins', icon: Activity },
          { id: 'twin', label: 'Clinical AI', icon: Sparkles, isCenter: true },
          { id: 'care', label: 'Schedule', icon: Calendar },
          { id: 'profile', label: 'Dr. Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Platform', icon: Shield },
          { id: 'health', label: 'Verifications', icon: Stethoscope },
          { id: 'twin', label: 'Health Twin', icon: Sparkles, isCenter: true },
          { id: 'care', label: 'Articles CMS', icon: FileText },
          { id: 'profile', label: 'Directory', icon: Users },
        ];
      case 'patient':
      default:
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'health', label: 'Health', icon: Activity },
          { id: 'twin', label: 'Health Twin', icon: Sparkles, isCenter: true },
          { id: 'care', label: 'Care & Vault', icon: HeartPulse },
          { id: 'profile', label: 'Profile', icon: User },
        ];
    }
  };

  const tabs = getTabs();

  return (
    <nav
      aria-label="Bottom navigation bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-purple-100/80 dark:border-slate-800 transition-colors shadow-lg shadow-purple-900/5 max-w-md mx-auto sm:max-w-none"
    >
      <div className="flex items-center justify-around h-16 px-3 max-w-xl mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative -top-3.5 flex flex-col items-center">
                <button
                  onClick={() => {
                    setActiveTab('twin');
                    setIsAIChatOpen(true);
                  }}
                  className="w-13 h-13 rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-purple-400 p-0.5 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
                  aria-label="Open Health Twin AI"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </button>
                <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors min-h-[44px] ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
