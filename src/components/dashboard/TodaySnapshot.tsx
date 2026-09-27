import React from 'react';
import { Heart, Flame, Moon, Droplet, Activity, Wind, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TodaySnapshot() {
  const { vitals, waterGlasses, addWaterGlass, setActiveTab, setActiveSubView } = useApp();

  const handleCardClick = (subView: string) => {
    setActiveTab('health');
    setActiveSubView(subView);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
          Today's Health Snapshot
        </h2>
        <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold cursor-pointer" onClick={() => handleCardClick('vitals')}>
          All Biometrics →
        </span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {/* Heart Rate */}
        <div
          onClick={() => handleCardClick('vitals')}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Heart Rate</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">72</span>
            <span className="text-[11px] font-semibold text-slate-400">BPM</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <span>Resting Normal</span>
            <span className="text-slate-400">Live</span>
          </div>
        </div>

        {/* Steps */}
        <div
          onClick={() => handleCardClick('fitness')}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Steps</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">6,842</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">
            <span>Goal: 10,000</span>
            <span className="text-slate-400">68%</span>
          </div>
        </div>

        {/* Sleep */}
        <div
          onClick={() => handleCardClick('vitals')}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Sleep</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">7h 42m</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <span>Deep 1h 35m</span>
            <span className="text-slate-400">Optimum</span>
          </div>
        </div>

        {/* Water / Hydration */}
        <div
          onClick={addWaterGlass}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          title="Click to log a glass of water"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Hydration</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center group-hover:bg-sky-100">
              <Droplet className="w-3.5 h-3.5 text-sky-500 fill-sky-500/20" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">{waterGlasses}</span>
            <span className="text-[11px] font-semibold text-slate-400">/ 8 glasses</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-sky-600 dark:text-sky-400 font-medium mt-1">
            <span>Tap to +1 glass</span>
            <Plus className="w-3 h-3 text-sky-500" />
          </div>
        </div>

        {/* Calories */}
        <div
          onClick={() => handleCardClick('nutrition')}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Calories</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">1,480</span>
            <span className="text-[11px] font-semibold text-slate-400">kcal</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            <span>Burned today</span>
            <span className="text-slate-400">Target 1.8k</span>
          </div>
        </div>

        {/* SpO2 */}
        <div
          onClick={() => handleCardClick('vitals')}
          className="shrink-0 w-36 bg-white dark:bg-slate-850 p-3.5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">SpO2 Oxygen</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center">
              <Wind className="w-3.5 h-3.5 text-cyan-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">98%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <span>Normal Range</span>
            <span className="text-slate-400">BLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
