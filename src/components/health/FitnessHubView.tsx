import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Clock,
  Play,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FitnessHubView() {
  const { setIsWorkoutOpen, vitals } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Mobility');

  const categories = [
    { id: 'Walking', icon: '🚶‍♀️', desc: 'Low-impact cardiovascular baseline' },
    { id: 'Running', icon: '🏃‍♀️', desc: 'Aerobic threshold conditioning' },
    { id: 'Strength', icon: '🏋️‍♀️', desc: 'Bone density & muscle preservation' },
    { id: 'Yoga', icon: '🧘‍♀️', desc: 'Autonomic vagal nerve tone' },
    { id: 'Mobility', icon: '🤸‍♀️', desc: 'Pelvic floor & joint lubrication' },
    { id: 'Physiotherapy', icon: '🩺', desc: 'Postpartum & injury rehabilitation' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Movement & Adaptive Fitness Hub
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Workouts tailored to cycle phase, joint flexibility & recovery score
          </p>
        </div>
        <button
          onClick={() => setIsWorkoutOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 active:scale-95 transition-all min-h-[44px]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Workout</span>
        </button>
      </div>

      {/* Activity Summary Ring Card */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Daily Steps</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">6,842</p>
            <span className="text-[10px] text-emerald-600 font-semibold">68% of 10,000</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Calories</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">1,480</p>
            <span className="text-[10px] text-purple-600 font-semibold">Target 1,800 kcal</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workout Time</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">38 m</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Goal reached ✓</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Active Time</span>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">54 m</p>
            <span className="text-[10px] text-purple-600 font-semibold">Low joint strain</span>
          </div>
        </div>
      </div>

      {/* Curated Categories */}
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Exercise Modalities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-purple-100/60 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <span className="text-2xl mb-1 block">{cat.icon}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {cat.id}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug block mt-0.5">
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Program Banner */}
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-rose-50 dark:from-slate-800 dark:to-purple-950/30 border border-purple-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                Recommended Routine
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                18-Min Ovulation Phase Pelvic & Mobility Sequence
              </p>
              <span className="text-[10px] text-slate-500">5 Exercises · Low impact · Restorative</span>
            </div>
          </div>

          <button
            onClick={() => setIsWorkoutOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm min-h-[44px]"
          >
            Launch Player
          </button>
        </div>
      </div>
    </div>
  );
}
