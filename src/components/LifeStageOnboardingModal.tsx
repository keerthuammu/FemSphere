import React, { useState } from 'react';
import { Sparkles, Heart, Check, X, Shield, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveStage: (stageCode: string, selectedModules: string[]) => void;
}

export default function LifeStageOnboardingModal({ isOpen, onClose, onSaveStage }: Props) {
  const [selectedFocus, setSelectedFocus] = useState<string>('I\'m managing my own health');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'General Health', 'Cycle & Periods', 'Personal Insights'
  ]);

  if (!isOpen) return null;

  const focusOptions = [
    { label: "I'm managing my own health", code: 'REPRODUCTIVE_AGE' },
    { label: "I'm a parent/guardian managing a child", code: 'EARLY_CHILDHOOD' },
    { label: "I'm supporting another person (Caregiver)", code: 'OLDER_ADULT' },
    { label: "I'm pregnant", code: 'PREGNANCY' },
    { label: "I'm planning pregnancy", code: 'REPRODUCTIVE_AGE' },
    { label: "I'm postpartum", code: 'POSTPARTUM' },
    { label: "I'm experiencing perimenopause / menopause", code: 'PERIMENOPAUSE' },
    { label: "Prefer not to say", code: 'REPRODUCTIVE_AGE' },
  ];

  const moduleOptions = [
    'General Health',
    'Cycle & Periods',
    'Reproductive Health',
    'Pregnancy Care',
    'Postpartum Recovery',
    'PCOS Journey',
    'Endometriosis Journey',
    'Midlife & Menopause',
    'Healthy Aging (60+)',
    'Child & Pediatric Care'
  ];

  const toggleModule = (mod: string) => {
    if (selectedModules.includes(mod)) {
      setSelectedModules(selectedModules.filter(m => m !== mod));
    } else {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  const handleComplete = () => {
    const matched = focusOptions.find(f => f.label === selectedFocus);
    const stageCode = matched ? matched.code : 'REPRODUCTIVE_AGE';
    onSaveStage(stageCode, selectedModules);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#EDE9FE] relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#3a3135]">Tell us about your current health stage</h2>
            <p className="text-xs text-[#7a6f75]">FemSphere adapts its intelligence and features to match your life stage.</p>
          </div>
        </div>

        <div className="space-y-6 my-6">
          {/* Step 1: Life Stage Focus */}
          <div>
            <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-2.5">
              1. What best describes your primary goal today?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {focusOptions.map((opt, idx) => {
                const isSelected = selectedFocus === opt.label;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFocus(opt.label)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED] shadow-sm'
                        : 'border-[#EDE9FE] bg-white text-[#3a3135] hover:border-[#7C3AED]/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#7C3AED]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Focus Modules */}
          <div>
            <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-2.5">
              2. What modules would you like to enable? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {moduleOptions.map((mod, idx) => {
                const isChecked = selectedModules.includes(mod);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isChecked
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                        : 'bg-white text-[#64595e] border-[#EDE9FE] hover:border-[#7C3AED]'
                    }`}
                  >
                    {mod} {isChecked ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EDE9FE] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7a6f75]">
            <Shield className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Privacy First: You can adjust or change your life stage anytime.</span>
          </div>

          <button
            onClick={handleComplete}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all"
          >
            <span>Activate My Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
