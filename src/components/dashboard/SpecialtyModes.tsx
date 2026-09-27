import React, { useState } from 'react';
import {
  Baby,
  Heart,
  Calendar,
  Sparkles,
  ShieldAlert,
  Flame,
  Moon,
  Activity,
  CheckCircle,
  AlertTriangle,
  Smile,
  Thermometer,
  Pill,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SpecialtyModes() {
  const { activeMode, setActiveMode, user } = useApp();
  const [kickCount, setKickCount] = useState(12);
  const [hotFlashesToday, setHotFlashesToday] = useState(2);
  const [postpartumMood, setPostpartumMood] = useState<'Serene' | 'Fatigued' | 'Overwhelmed' | 'Content'>('Content');

  if (activeMode === 'standard') {
    return (
      <div className="bg-purple-50/60 dark:bg-slate-800/40 p-4 rounded-2xl border border-purple-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Specialized Care Modes Available
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Transform dashboard for Pregnancy, Postpartum, or Menopause
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveMode('pregnancy')}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-600 hover:bg-purple-50 min-h-[44px]"
          >
            Pregnancy
          </button>
          <button
            onClick={() => setActiveMode('postpartum')}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-slate-600 hover:bg-rose-50 min-h-[44px]"
          >
            Postpartum
          </button>
          <button
            onClick={() => setActiveMode('menopause')}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-slate-600 hover:bg-amber-50 min-h-[44px]"
          >
            Menopause
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Navigation Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-850 p-2 rounded-xl border border-purple-100/70 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
          Specialty Dashboard Mode:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveMode('pregnancy')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeMode === 'pregnancy'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            Pregnancy
          </button>
          <button
            onClick={() => setActiveMode('postpartum')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeMode === 'postpartum'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800'
            }`}
          >
            Postpartum
          </button>
          <button
            onClick={() => setActiveMode('menopause')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeMode === 'menopause'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-800'
            }`}
          >
            Menopause
          </button>
          <button
            onClick={() => setActiveMode('standard')}
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px]"
            title="Reset to Standard Dashboard"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 1. PREGNANCY MODE */}
      {activeMode === 'pregnancy' && (
        <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50/50 dark:from-slate-850 dark:via-slate-850 dark:to-purple-950/20 p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pregnancy Companion · Week 24
                </h3>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                  Second Trimester (Month 6) · 112 Days to Due Date
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Fetal Vitals Stable
            </span>
          </div>

          {/* Baby Development Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3.5 border border-purple-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-900 dark:text-white">Baby Development & Size</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Size of an Ear of Corn (~30 cm, 600g)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your baby’s inner ear is now fully developed and can recognize your voice and heartbeat. Nostrils are opening, and rapid lung capillary development is underway.
            </p>
            <div className="mt-3 flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Fetal Kicks:</span>
                <span className="font-bold text-purple-700 dark:text-purple-300 tabular-nums">{kickCount} recorded</span>
              </div>
              <button
                onClick={() => setKickCount(prev => prev + 1)}
                className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] min-h-[44px]"
              >
                + Log Kick
              </button>
            </div>
          </div>

          {/* Maternal Vitals & Clinical Protocols */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-purple-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Maternal BP Target</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">118 / 76 mmHg</p>
              <span className="text-[10px] text-emerald-600 font-medium">Optimal systolic baseline</span>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-purple-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Next Clinical Screen</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Glucose Test</p>
              <span className="text-[10px] text-purple-600 font-medium">Week 26 (In 14 days)</span>
            </div>
          </div>

          {/* Calming Clinical Doctor Guidance */}
          <div className="bg-rose-50/60 dark:bg-slate-800/60 p-3 rounded-xl border border-rose-100 dark:border-slate-700 flex items-start gap-2 text-xs">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900 dark:text-rose-200">OB/GYN Dr. Vance's Note:</span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                "Keep supplementing with 25mg chelated iron with citrus. Pelvic floor stretching 10 minutes every evening will ease lower back tension."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. POSTPARTUM MODE */}
      {activeMode === 'postpartum' && (
        <div className="bg-gradient-to-br from-rose-50 via-white to-purple-50/50 dark:from-slate-850 dark:via-slate-850 dark:to-rose-950/20 p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Postpartum Recovery Companion · Week 6
                </h3>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                  Fourth Trimester Restorative Phase · Pelvic & Mood Support
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
              Postpartum Week 6
            </span>
          </div>

          {/* Recovery & Mood Check */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3.5 border border-rose-100 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Emotional & Mood Check-In</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{postpartumMood}</span>
            </div>
            <div className="flex items-center gap-2">
              {(['Serene', 'Content', 'Fatigued', 'Overwhelmed'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPostpartumMood(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all min-h-[44px] ${
                    postpartumMood === m
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Edinburgh Postnatal Depression scale screening is scheduled for your upcoming 6-week OB visit.
            </p>
          </div>

          {/* Postpartum Telemetry metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-rose-100 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">Pelvic Health</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">Stage 3 Rehab</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-rose-100 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">Lactation Hydr.</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">2.8L Logged</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-rose-100 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">Sleep Windows</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">3 Intervals</p>
            </div>
          </div>

          {/* Warning Signs Education */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900 flex items-start gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200">Red Flag Symptoms to Report:</span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Heavy bleeding filling more than 1 pad/hour, fever over 38°C, sudden severe headache, or severe calf pain. Contact doctor immediately if observed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. MENOPAUSE MODE */}
      {activeMode === 'menopause' && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-purple-50/50 dark:from-slate-850 dark:via-slate-850 dark:to-amber-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Menopause & Hormonal Balance Companion
                </h3>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  Vasomotor Tracking · Bone Mineral Density & Cardiovascular Focus
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
              Hormone Synthesis Active
            </span>
          </div>

          {/* Hot Flash Frequency Tracker */}
          <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3.5 border border-amber-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Vasomotor Flush Events Today
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Logged episodes with ambient temperature correlation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {hotFlashesToday}
              </span>
              <button
                onClick={() => setHotFlashesToday(prev => prev + 1)}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs min-h-[44px]"
              >
                + Log Event
              </button>
            </div>
          </div>

          {/* Bone & Cardiovascular Pillars */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-amber-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Bone Density (DEXA)</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">T-Score: -0.6</p>
              <span className="text-[10px] text-emerald-600 font-medium">Normal bone mineral mass</span>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-amber-100 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Endocrine Protocol</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">D3 + K2 + Mg</p>
              <span className="text-[10px] text-amber-600 font-medium">Morning schedule</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
