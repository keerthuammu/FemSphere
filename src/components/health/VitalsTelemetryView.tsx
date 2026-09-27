import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Wind,
  Moon,
  Droplet,
  Thermometer,
  Scale,
  Plus,
  TrendingUp,
  Info,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VitalsTelemetryView() {
  const { vitals, updateVital } = useApp();
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [selectedMetric, setSelectedMetric] = useState<string>('hr');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualValue, setManualValue] = useState('');

  // Trend mock points for charts
  const trendData: Record<string, number[]> = {
    hr: [68, 70, 74, 72, 71, 75, 72],
    bp: [116, 118, 120, 118, 117, 119, 118],
    spo2: [98, 98, 99, 97, 98, 98, 98],
    sleep: [7.2, 7.8, 6.9, 8.1, 7.4, 7.9, 7.7],
    steps: [6200, 7800, 5400, 9200, 8100, 6842, 7100],
    temp: [36.5, 36.6, 36.7, 36.8, 36.8, 36.7, 36.6],
  };

  const currentChartPoints = trendData[selectedMetric] || [68, 70, 72, 74, 71, 75, 72];
  const maxVal = Math.max(...currentChartPoints);
  const minVal = Math.min(...currentChartPoints);
  const range = maxVal - minVal || 1;

  const currentVital = vitals.find(v => v.id === selectedMetric) || vitals[0];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualValue.trim()) {
      updateVital(selectedMetric, manualValue);
      setManualValue('');
      setIsManualModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header with Filter Pills */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Vitals & Physiological Telemetry
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Real-time biometric signals from BLE wearable & clinical logs
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['Daily', 'Weekly', 'Monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
                timeFilter === tf
                  ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Chart Card */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                {currentVital.label} Trend ({timeFilter})
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full font-semibold">
                {currentVital.source === 'wearable' ? 'Optical Sensor BLE' : 'Manual Entry'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {currentVital.value}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {currentVital.unit}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-2">
                {currentVital.change}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Entry</span>
          </button>
        </div>

        {/* SVG Sparkline / Trend Graph */}
        <div className="h-40 w-full relative pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
            {/* Grid baseline lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="vitalsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area path */}
            {(() => {
              const points = currentChartPoints.map((val, idx) => {
                const x = (idx / (currentChartPoints.length - 1)) * 300;
                const normalizedY = 85 - ((val - minVal) / range) * 65;
                return `${x},${normalizedY}`;
              });
              const lineString = points.join(' L ');
              const areaString = `M 0,95 L ${lineString} L 300,95 Z`;

              return (
                <>
                  <path d={areaString} fill="url(#vitalsGrad)" />
                  <path d={`M ${lineString}`} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {currentChartPoints.map((val, idx) => {
                    const x = (idx / (currentChartPoints.length - 1)) * 300;
                    const y = 85 - ((val - minVal) / range) * 65;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3.5"
                        className="fill-purple-600 stroke-2 stroke-white dark:stroke-slate-900"
                      />
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] text-slate-400 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Today</span>
          </div>
        </div>

        {/* Normal-Range Indicator Box */}
        <div className="bg-purple-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-purple-100/60 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              Standard clinical reference range for resting female adults: <strong>60 – 100 BPM</strong>
            </span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            Within Target ✓
          </span>
        </div>
      </div>

      {/* Selectable Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vitals.map(v => {
          const isSelected = selectedMetric === v.id;
          return (
            <div
              key={v.id}
              onClick={() => setSelectedMetric(v.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-white dark:bg-slate-850 border-purple-100/70 dark:border-slate-800 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold uppercase truncate">{v.label}</span>
                <span>{v.lastUpdated}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {v.value}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">{v.unit}</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                {v.change || 'Standard range'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Log Manual Entry for {currentVital.label}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Recorded Value ({currentVital.unit})
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${currentVital.value}`}
                  value={manualValue}
                  onChange={e => setManualValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-purple-600"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Manual inputs are tagged with a "Manual" source badge to distinguish from optical wearable telemetry.
              </p>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all min-h-[44px]"
              >
                Update Metric
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
