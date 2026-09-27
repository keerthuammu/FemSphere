import React, { useState } from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Heart,
  Droplet,
  Flame,
  Moon,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MenstrualCycleView() {
  const { cycleData, logSymptom } = useApp();
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(cycleData.currentDay);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState<'Spotting' | 'Light' | 'Medium' | 'Heavy'>('Light');

  const SYMPTOM_OPTIONS = [
    { label: 'Cramps', emoji: '⚡' },
    { label: 'Headache', emoji: '🤕' },
    { label: 'Acne', emoji: '✨' },
    { label: 'Mood Swings', emoji: '🎭' },
    { label: 'Bloating', emoji: '🎈' },
    { label: 'Back Pain', emoji: '🦴' },
    { label: 'Breast Tenderness', emoji: '🌸' },
    { label: 'Fatigue', emoji: '😴' },
    { label: 'Cravings', emoji: '🍫' },
    { label: 'High Energy', emoji: '⚡' },
    { label: 'Clear Skin', emoji: '🌟' },
  ];

  // Circular calculations for 28-day cycle wheel
  const daysInCycle = 28;
  const currentDayAngle = (cycleData.currentDay / daysInCycle) * 360;

  return (
    <div className="space-y-4">
      {/* 1. Cycle Dashboard Header & Circular Wheel */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        {/* Soft background ambient halo */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-300/10 dark:bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-full flex items-center justify-between mb-2">
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Menstrual Cycle Dashboard</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Synchronized hormonal telemetry & fertile window
            </p>
          </div>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1 border border-purple-200 dark:border-purple-800 min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Symptoms</span>
          </button>
        </div>

        {/* Circular Cycle Visualization */}
        <div className="relative w-56 h-56 my-3 flex items-center justify-center">
          {/* SVG Ring with multi-colored segments */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-purple-50 dark:text-slate-800"
            />
            {/* Menstrual Phase (Days 1 - 5) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F43F5E"
              strokeWidth="6"
              strokeDasharray="45 206"
              strokeDashoffset="0"
              fill="transparent"
              className="opacity-80"
            />
            {/* Fertile Window / Ovulation (Days 11 - 16) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#A855F7"
              strokeWidth="7"
              strokeDasharray="45 206"
              strokeDashoffset="-90"
              fill="transparent"
              className="opacity-90"
            />
            {/* Luteal Phase (Days 17 - 28) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#818CF8"
              strokeWidth="6"
              strokeDasharray="100 151"
              strokeDashoffset="-150"
              fill="transparent"
              className="opacity-70"
            />
          </svg>

          {/* Central Information Stack */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {cycleData.currentPhase} Phase
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                Day {cycleData.currentDay}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              of {cycleData.cycleLength}-day cycle
            </span>
            <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
              High Fertility
            </div>
          </div>
        </div>

        {/* Cycle Key Indicators */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 font-semibold block">Next Period</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">In 14 days</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 font-semibold block">Fertile Window</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Days 11 - 16</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 font-semibold block">Ovulation</span>
            <span className="text-xs font-bold text-rose-500">Day 14 (Today)</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Calendar Matrix */}
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Cycle Calendar · July / August 2026
            </h3>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days grid 1 to 28 */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <span key={i} className="text-[10px] font-bold text-slate-400 pb-1">
              {day}
            </span>
          ))}

          {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
            const isPeriod = day <= 5;
            const isFertile = day >= 11 && day <= 16;
            const isOvulation = day === 14;
            const isSelected = selectedCalendarDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedCalendarDay(day)}
                className={`h-9 rounded-xl flex flex-col items-center justify-center relative font-semibold text-xs transition-all ${
                  isSelected
                    ? 'ring-2 ring-purple-600 bg-purple-600 text-white font-bold scale-105 z-10'
                    : isOvulation
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                    : isFertile
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                    : isPeriod
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{day}</span>
                {isOvulation && (
                  <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-1"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Period Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-rose-200"></span>
            <span>Ovulation Day</span>
          </div>
        </div>
      </div>

      {/* 3. Logged Symptoms of the Day */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Active Logged Symptoms (Day {selectedCalendarDay})
          </span>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold cursor-pointer" onClick={() => setIsLogModalOpen(true)}>
            Edit Chips +
          </span>
        </div>

        {cycleData.recentSymptoms.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No symptoms logged for this day. Tap "Log Symptoms" to add.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {cycleData.recentSymptoms.map(sym => (
              <span
                key={sym}
                className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-900 flex items-center gap-1.5"
              >
                <span>{sym}</span>
                <button
                  onClick={() => logSymptom(sym)}
                  className="hover:text-rose-500 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Log Symptoms Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Log Day {selectedCalendarDay} Symptoms & Flow
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select all that apply to calibrate your Health Twin model
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Flow Intensity Selector */}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                Flow Intensity
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Spotting', 'Light', 'Medium', 'Heavy'] as const).map(flow => (
                  <button
                    key={flow}
                    onClick={() => setActiveFlow(flow)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      activeFlow === flow
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>

            {/* Selectable Symptom Chips */}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Physical & Emotional Symptoms
              </span>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {SYMPTOM_OPTIONS.map(opt => {
                  const isSelected = cycleData.recentSymptoms.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      onClick={() => logSymptom(opt.label)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all min-h-[44px] ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-purple-100 dark:border-slate-700 hover:border-purple-300'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsLogModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all min-h-[44px]"
            >
              Save Symptoms to Health Twin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
