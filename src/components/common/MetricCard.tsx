import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  status?: 'normal' | 'optimal' | 'warning' | 'alert';
  change?: string;
  source?: 'wearable' | 'manual' | 'lab';
  onClick?: () => void;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  iconBgColor = 'bg-purple-100 dark:bg-purple-950/60',
  iconColor = 'text-purple-600 dark:text-purple-300',
  status = 'optimal',
  change,
  source = 'wearable',
  onClick,
}: MetricCardProps) {
  const statusColors = {
    optimal: 'text-emerald-700 dark:text-emerald-400',
    normal: 'text-purple-700 dark:text-purple-400',
    warning: 'text-amber-700 dark:text-amber-400',
    alert: 'text-rose-700 dark:text-rose-400',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-w-[140px] group"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={`w-9 h-9 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          {source === 'wearable' && <span>Live BLE</span>}
          {source === 'manual' && <span>Manual</span>}
          {source === 'lab' && <span>Lab Verified</span>}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      {change && (
        <p className={`text-[10px] font-semibold mt-2 truncate ${statusColors[status]}`}>
          {change}
        </p>
      )}
    </div>
  );
}
