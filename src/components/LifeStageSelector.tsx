import React, { useState } from 'react';
import { Sparkles, ChevronDown, Check, Shield } from 'lucide-react';

interface Props {
  currentStageCode: string;
  stageName: string;
  onSelectStage: (code: string) => void;
}

export default function LifeStageSelector({ currentStageCode, stageName, onSelectStage }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const stages = [
    { code: 'EARLY_CHILDHOOD', name: 'Early Childhood (0–5 yrs)' },
    { code: 'PRE_PUBERTY', name: 'Pre-Puberty (6–10 yrs)' },
    { code: 'PUBERTY', name: 'Puberty & Development (11–13 yrs)' },
    { code: 'MENSTRUATING_ADOLESCENT', name: 'Adolescent Health (14–17 yrs)' },
    { code: 'YOUNG_ADULT', name: 'Young Adult (18–24 yrs)' },
    { code: 'REPRODUCTIVE_AGE', name: 'Reproductive Age (25–39 yrs)' },
    { code: 'PREGNANCY', name: 'Pregnancy Journey' },
    { code: 'POSTPARTUM', name: 'Postpartum Recovery' },
    { code: 'PERIMENOPAUSE', name: 'Perimenopause' },
    { code: 'MENOPAUSE', name: 'Menopause Transition' },
    { code: 'OLDER_ADULT', name: 'Healthy Aging (60+ yrs)' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] hover:border-[#7C3AED] text-[#7C3AED] text-xs font-bold transition-all shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
        <span>Stage: {stageName || 'Reproductive Age'}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EDE9FE] p-2 z-50 animate-in fade-in zoom-in duration-150">
          <div className="px-3 py-2 border-b border-[#EDE9FE] mb-1">
            <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider block">Select Active Life Stage</span>
            <span className="text-[10px] text-[#7a6f75]">Adapts features and AI insights</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1">
            {stages.map((st) => {
              const isSelected = st.code === currentStageCode;
              return (
                <button
                  key={st.code}
                  onClick={() => {
                    onSelectStage(st.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#7C3AED] text-white font-bold'
                      : 'text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED]'
                  }`}
                >
                  <span>{st.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
