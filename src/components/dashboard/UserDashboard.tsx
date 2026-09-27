import React from 'react';
import {
  Sparkles,
  Droplet,
  Activity,
  Heart,
  Calendar,
  Pill,
  ChevronRight,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import HealthScoreRing from '../common/HealthScoreRing';
import AIInsightCard from '../common/AIInsightCard';
import HealthTwinVisualizer from './HealthTwinVisualizer';
import TodaySnapshot from './TodaySnapshot';
import LifeStageTimeline from './LifeStageTimeline';
import SpecialtyModes from './SpecialtyModes';

export default function UserDashboard() {
  const { user, setActiveTab, setActiveSubView, setIsAIChatOpen, setIsWorkoutOpen } = useApp();

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
      {/* 1. Welcome Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-300">
            Digital Health Twin · Active Sync
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Good morning, {user.name.split(' ')[0]}</span>
            <span>🌸</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your biological twin is synchronized across Amazfit BLE and morning vitals.
          </p>
        </div>

        <button
          onClick={() => setIsAIChatOpen(true)}
          className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-colors min-h-[44px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* 2. Health Twin Overall Wellness Circular Score Ring (Prompt #8) */}
      <HealthScoreRing
        score={87}
        label="Overall Wellness"
        change="+3 pts vs last week"
        onTap={() => {
          setActiveTab('twin');
          setActiveSubView('overview');
        }}
      />

      {/* 3. Interactive Health Twin Visualization (Prompt #8) */}
      <HealthTwinVisualizer />

      {/* 4. Today's Health Snapshot (Prompt #9 - Horizontal Scrollable) */}
      <TodaySnapshot />

      {/* 5. Dedicated AI Health Insights Card (Prompt #10) */}
      <AIInsightCard
        title="✨ FemSphere AI Insight"
        insight="Your deep sleep was slightly lower than your weekly baseline (1h 22m vs 1h 45m). With active ovulation hormone shifts, an early chamomile infusion and 30-min earlier bedtime will optimize cellular recovery."
        confidence="High Precision (94%)"
        contextSource="Sleep Sensors + Cycle Day 14"
        onAskClick={() => setIsAIChatOpen(true)}
        onDetailsClick={() => {
          setActiveTab('health');
          setActiveSubView('vitals');
        }}
      />

      {/* 6. Specialty Modes Switcher (Pregnancy, Postpartum, Menopause) (Prompts #14, 15, 16) */}
      <SpecialtyModes />

      {/* 7. Life Stage Journey (10 Stages Timeline) (Prompt #12) */}
      <LifeStageTimeline />

      {/* 8. Quick Action Tiles Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveTab('health');
            setActiveSubView('cycle');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-purple-100/70 dark:border-slate-800 hover:border-purple-300 shadow-xs flex items-center gap-3 text-left transition-all min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Menstrual Cycle
            </span>
            <span className="text-[10px] text-slate-400">Day 14 Ovulation</span>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab('care');
            setActiveSubView('meds');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-purple-100/70 dark:border-slate-800 hover:border-purple-300 shadow-xs flex items-center gap-3 text-left transition-all min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-500 shrink-0">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Medications
            </span>
            <span className="text-[10px] text-slate-400">1 dose pending</span>
          </div>
        </button>

        <button
          onClick={() => setIsWorkoutOpen(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-purple-100/70 dark:border-slate-800 hover:border-purple-300 shadow-xs flex items-center gap-3 text-left transition-all col-span-2 sm:col-span-1 min-h-[44px]"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Movement Player
            </span>
            <span className="text-[10px] text-slate-400">18-min mobility session</span>
          </div>
        </button>
      </div>
    </div>
  );
}
