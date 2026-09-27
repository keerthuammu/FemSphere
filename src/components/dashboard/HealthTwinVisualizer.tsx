import React, { useState } from 'react';
import { Heart, Moon, Flame, Droplet, Sparkles, Brain, Activity, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HealthTwinVisualizer() {
  const { setActiveTab, setActiveSubView, setIsAIChatOpen, vitals, cycleData, waterGlasses } = useApp();
  const [selectedNode, setSelectedNode] = useState<string>('heart');

  const nodes = [
    {
      id: 'heart',
      label: 'Heart & Vitals',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900',
      activeColor: 'bg-rose-500 text-white',
      badge: '72 BPM',
      status: 'Resting Normal',
      tabTarget: 'health',
      subView: 'vitals',
      description: 'Cardiovascular synchrony is optimal. Resting heart rate 72 bpm with high vagal heart rate variability.',
    },
    {
      id: 'cycle',
      label: 'Menstrual Cycle',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900',
      activeColor: 'bg-purple-600 text-white',
      badge: `Day ${cycleData.currentDay} · ${cycleData.currentPhase}`,
      status: 'Ovulation Phase',
      tabTarget: 'health',
      subView: 'cycle',
      description: 'Luteinizing hormone surge predicted within 24h. Basal body temperature curve aligned with fertile peak.',
    },
    {
      id: 'sleep',
      label: 'Sleep Recovery',
      icon: Moon,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900',
      activeColor: 'bg-indigo-500 text-white',
      badge: '7h 42m',
      status: '84% Quality',
      tabTarget: 'health',
      subView: 'vitals',
      description: 'REM cycles normal (1h 38m). Deep slow-wave sleep reached 1h 22m, facilitating cellular and hormone repair.',
    },
    {
      id: 'activity',
      label: 'Activity & Movement',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      activeColor: 'bg-amber-500 text-white',
      badge: '6,842 Steps',
      status: '68% Daily Goal',
      tabTarget: 'health',
      subView: 'fitness',
      description: '38 active minutes logged today. Low joint impact exercise suggested to match current cycle phase.',
    },
    {
      id: 'hydration',
      label: 'Hydration & Fuel',
      icon: Droplet,
      color: 'text-sky-500 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-900',
      activeColor: 'bg-sky-500 text-white',
      badge: `${waterGlasses} / 8 Glasses`,
      status: `${waterGlasses >= 6 ? 'On Track' : 'Drink 500ml'}`,
      tabTarget: 'health',
      subView: 'nutrition',
      description: 'Electrolyte balance supported by regular fluid intake. Target 2.4L total fluid for pregnancy/cycle hydration.',
    },
    {
      id: 'wellness',
      label: 'Mental Wellness',
      icon: Brain,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900',
      activeColor: 'bg-emerald-500 text-white',
      badge: 'Balanced',
      status: 'Low Stress Index',
      tabTarget: 'twin',
      subView: 'overview',
      description: 'HRV metrics indicate a calm parasympathetic state. Evening breathwork or gentle meditation recommended.',
    },
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  const handleOpenDetail = (tab: string, subView: string) => {
    setActiveTab(tab);
    setActiveSubView(subView);
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-2xl border border-purple-100/70 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span>Digital Health Twin</span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tap biometrics on your avatar to view synchronized physiological models
          </p>
        </div>
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-0.5"
        >
          <span>Ask Twin</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Avatar Anatomy Container */}
      <div className="relative w-full h-56 bg-gradient-to-b from-purple-50/50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-2xl border border-purple-100/50 dark:border-slate-800/80 flex items-center justify-center overflow-hidden my-3">
        {/* Subtle Silhouette Graphic */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70 dark:opacity-40 pointer-events-none">
          <svg className="w-36 h-48 text-purple-200 dark:text-slate-700" viewBox="0 0 200 300" fill="currentColor">
            {/* Elegant stylized female figure silhouette */}
            <circle cx="100" cy="45" r="24" />
            <path d="M78 80 C78 72, 122 72, 122 80 L136 140 C140 160, 144 190, 134 250 L128 290 L110 290 L114 200 L86 200 L90 290 L72 290 L66 250 C56 190, 60 160, 64 140 Z" />
          </svg>
        </div>

        {/* Ambient pulse waves */}
        <div className="absolute w-44 h-44 rounded-full border border-purple-300/30 dark:border-purple-600/20 animate-ping pointer-events-none"></div>

        {/* Interactive Floating Hotspots */}
        {/* 1. Mental Wellness (Brain / Head) */}
        <button
          onClick={() => setSelectedNode('wellness')}
          aria-label="Wellness telemetry node"
          className={`absolute top-4 left-[46%] -translate-x-1/2 p-2 rounded-full transition-all shadow-md ${
            selectedNode === 'wellness' ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-200 dark:ring-emerald-900' : 'bg-white dark:bg-slate-800 text-emerald-600 shadow-emerald-500/10 hover:scale-105'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
        </button>

        {/* 2. Heart (Chest) */}
        <button
          onClick={() => setSelectedNode('heart')}
          aria-label="Cardiovascular telemetry node"
          className={`absolute top-16 left-[48%] -translate-x-1/2 p-2.5 rounded-full transition-all shadow-md ${
            selectedNode === 'heart' ? 'bg-rose-500 text-white scale-110 ring-4 ring-rose-200 dark:ring-rose-900' : 'bg-white dark:bg-slate-800 text-rose-500 shadow-rose-500/10 hover:scale-105'
          }`}
        >
          <Heart className="w-4 h-4 fill-current animate-pulse" />
        </button>

        {/* 3. Menstrual Cycle (Pelvic Core) */}
        <button
          onClick={() => setSelectedNode('cycle')}
          aria-label="Menstrual cycle telemetry node"
          className={`absolute top-30 left-[48%] -translate-x-1/2 p-2.5 rounded-full transition-all shadow-md ${
            selectedNode === 'cycle' ? 'bg-purple-600 text-white scale-110 ring-4 ring-purple-200 dark:ring-purple-900' : 'bg-white dark:bg-slate-800 text-purple-600 shadow-purple-500/10 hover:scale-105'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* 4. Sleep (Left Orbit) */}
        <button
          onClick={() => setSelectedNode('sleep')}
          aria-label="Sleep telemetry node"
          className={`absolute top-12 left-6 p-2 rounded-2xl border transition-all shadow-sm flex items-center gap-1.5 ${
            selectedNode === 'sleep' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white/90 dark:bg-slate-800/90 text-indigo-600 border-indigo-100 dark:border-indigo-950'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Sleep</span>
        </button>

        {/* 5. Hydration (Right Orbit) */}
        <button
          onClick={() => setSelectedNode('hydration')}
          aria-label="Hydration telemetry node"
          className={`absolute top-12 right-6 p-2 rounded-2xl border transition-all shadow-sm flex items-center gap-1.5 ${
            selectedNode === 'hydration' ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white/90 dark:bg-slate-800/90 text-sky-500 border-sky-100 dark:border-sky-950'
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Water</span>
        </button>

        {/* 6. Activity (Bottom Orbit) */}
        <button
          onClick={() => setSelectedNode('activity')}
          aria-label="Physical activity telemetry node"
          className={`absolute bottom-4 right-8 p-2 rounded-2xl border transition-all shadow-sm flex items-center gap-1.5 ${
            selectedNode === 'activity' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white/90 dark:bg-slate-800/90 text-amber-600 border-amber-100 dark:border-amber-950'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Steps</span>
        </button>
      </div>

      {/* Selected Node Realtime Telemetry Card */}
      <div className="bg-purple-50/50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-purple-100 dark:border-slate-800 transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {activeNodeData.label}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 font-semibold text-purple-700 dark:text-purple-300 shadow-xs border border-purple-100 dark:border-slate-600">
              {activeNodeData.badge}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {activeNodeData.status}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
          {activeNodeData.description}
        </p>

        <button
          onClick={() => handleOpenDetail(activeNodeData.tabTarget, activeNodeData.subView)}
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1"
        >
          <span>Explore Detailed Trends</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
