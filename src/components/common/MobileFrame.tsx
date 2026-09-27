import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sparkles, Smartphone, Maximize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const { isPhoneFrame, togglePhoneFrame } = useApp();
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="max-w-4xl mx-auto shadow-sm min-h-screen bg-white dark:bg-slate-900 border-x border-slate-200/80 dark:border-slate-800 relative pb-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F3F0F7] dark:bg-[#0B0912] flex flex-col items-center justify-start py-4 sm:py-8 px-2 transition-colors">
      {/* Device framing container */}
      <div className="relative w-full max-w-[428px] h-[890px] max-h-[96vh] rounded-[48px] bg-slate-900 dark:bg-slate-950 p-3 shadow-2xl shadow-purple-900/15 ring-1 ring-slate-800/60 flex flex-col overflow-hidden">
        {/* Outer Titanium Bezel Accent */}
        <div className="absolute inset-0 rounded-[48px] border-[3px] border-slate-700/40 pointer-events-none z-50"></div>

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full rounded-[40px] bg-white dark:bg-slate-900 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
          {/* Top Status Bar & Dynamic Island */}
          <div className="h-11 w-full bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between px-7 z-40 select-none">
            <span className="text-xs font-semibold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {time}
            </span>

            {/* Dynamic Island pill */}
            <div className="w-24 h-6 bg-slate-950 dark:bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse"></span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                <span className="text-[9px] font-bold text-slate-200">Twin</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">5G</span>
                <Battery className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* App Scrollable Content Viewport */}
          <div className="flex-1 w-full overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-slate-800">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>

      {/* Frame Helper Banner on Desktop */}
      <div className="mt-3 hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Previewing in Mobile Device Frame</span>
        <span aria-hidden="true">·</span>
        <button
          onClick={togglePhoneFrame}
          className="text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1 min-h-[44px]"
        >
          <Maximize2 className="w-3 h-3" /> Switch to Full Responsive View
        </button>
      </div>
    </div>
  );
}
