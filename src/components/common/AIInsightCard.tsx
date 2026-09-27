import React from 'react';
import { Sparkles, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIInsightCardProps {
  title?: string;
  insight?: string;
  confidence?: string;
  contextSource?: string;
  onAskClick?: () => void;
  onDetailsClick?: () => void;
}

export default function AIInsightCard({
  title = '✨ FemSphere AI',
  insight = 'Your overnight restorative sleep was slightly lower than your weekly average (68% vs 82%). Considering your active ovulation phase, a 30-minute earlier bedtime will optimize hormonal recovery tonight.',
  confidence = 'High Confidence (94%)',
  contextSource = 'Sleep Telemetry + Cycle Day 14',
  onAskClick,
  onDetailsClick,
}: AIInsightCardProps) {
  const { setIsAIChatOpen } = useApp();

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-rose-50/60 dark:from-slate-850 dark:via-slate-850 dark:to-purple-950/20 p-5 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 shadow-sm relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-medium text-purple-700 dark:text-purple-300">{confidence}</span>
          <span aria-hidden="true">·</span>
          <span>{contextSource}</span>
        </div>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal my-2.5">
        "{insight}"
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-100/60 dark:border-slate-800/80">
        <button
          onClick={() => {
            if (onDetailsClick) onDetailsClick();
          }}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors min-h-[44px]"
        >
          <span>View Biomarker Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (onAskClick) {
              onAskClick();
            } else {
              setIsAIChatOpen(true);
            }
          }}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 active:scale-95 transition-all min-h-[44px]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask FemSphere</span>
        </button>
      </div>
    </div>
  );
}
