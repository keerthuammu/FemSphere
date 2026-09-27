import React from 'react';
import { ArrowUpRight, Info } from 'lucide-react';

interface HealthScoreRingProps {
  score?: number;
  label?: string;
  change?: string;
  onTap?: () => void;
}

export default function HealthScoreRing({
  score = 87,
  label = 'Overall Wellness',
  change = '+3 pts this week',
  onTap,
}: HealthScoreRingProps) {
  // SVG circular calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      onClick={onTap}
      className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left score and details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Your Health Twin</span>
            <span aria-hidden="true">·</span>
            <span>{label}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              / 100
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{change}</span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
            Multivariate digital twin index based on resting vitals, deep sleep, and cycle alignment.
          </p>
        </div>

        {/* Right circular ring */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              fill="transparent"
              className="text-purple-100 dark:text-slate-800"
            />
            {/* Dynamic Progress Stroke with Gradient */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
              OPTIMAL
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
              Twin Synced
            </span>
          </div>
        </div>
      </div>

      {/* Safety notice badge */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
        <Info className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Health score reflects wellness telemetry, not a medical diagnosis.</span>
      </div>
    </div>
  );
}
