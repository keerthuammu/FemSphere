import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Activity,
  Users,
  Lock,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OnboardingFlow() {
  const { isOnboardingOpen, setIsOnboardingOpen, setIsAuthOpen, setAuthMode } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const screens = [
    {
      title: 'Your Lifetime Health Companion',
      subtitle: 'Understand. Track. Connect. Thrive.',
      description:
        'FemSphere supports female health across every biological stage of life—from early childhood development, reproductive fertility, and maternal care to perimenopause and active longevity.',
      icon: Heart,
      tag: '🌸 Across Every Life Stage',
      visualTheme: 'from-purple-600 via-rose-500 to-purple-400',
    },
    {
      title: 'Build Your Digital Health Twin',
      subtitle: 'One Unified Physiological Model',
      description:
        'Seamlessly combine live wearable telemetry (Apple Watch, Amazfit, Garmin), daily symptoms, diagnostic lab panels, medication regimens, and hydration into a single responsive digital twin.',
      icon: Activity,
      tag: '🩺 Multi-Frequency Biometrics',
      visualTheme: 'from-purple-700 via-indigo-600 to-rose-500',
    },
    {
      title: 'AI-Powered Health Intelligence',
      subtitle: 'Proactive Early Insights',
      description:
        'FemSphere AI continuously analyzes hormone transitions, sleep architecture anomalies, and lab trends to deliver contextual guidance and prepare clinical questions for your OB/GYN.',
      icon: Sparkles,
      tag: '✨ Intelligent Neural Guidance',
      visualTheme: 'from-rose-500 via-purple-600 to-sky-500',
    },
    {
      title: 'Stay Connected With Your Family',
      subtitle: 'Caregivers, Partners & Doctors',
      description:
        'Bridge the care gap: Coordinate dependent child pediatric milestones, monitor aging parents, sync fertility timing with your partner, and consult directly with certified physicians.',
      icon: Users,
      tag: '💗 Connected Family Ecosystem',
      visualTheme: 'from-purple-600 via-rose-500 to-amber-500',
    },
    {
      title: 'Your Data. Your Control.',
      subtitle: 'Cryptographic Privacy & Zero-Knowledge Isolation',
      description:
        'Every biomarker is encrypted. You grant granular access permissions to doctors, partners, or caregivers. Private medical records remain strictly inaccessible to third parties.',
      icon: Lock,
      tag: '🔒 Zero-Knowledge Security',
      visualTheme: 'from-emerald-600 via-purple-600 to-rose-600',
    },
  ];

  const current = screens[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < screens.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOnboardingOpen(false);
      setAuthMode('register');
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-md h-[92vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden relative">
        {/* Top skip & close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-serif text-sm font-bold text-slate-900 dark:text-white">FemSphere</span>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Skip
          </button>
        </div>

        {/* Visual Graphic Area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${current.visualTheme} text-white flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 transition-all duration-500`}
          >
            <Icon className="w-16 h-16 stroke-[1.6]" />
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 mb-2">
            {current.tag}
          </span>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {current.title}
          </h2>
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
            {current.subtitle}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mt-3">
            {current.description}
          </p>
        </div>

        {/* Step dots & CTA */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-1.5">
            {screens.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === i ? 'w-6 bg-purple-600' : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                }`}
              ></span>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all min-h-[44px]"
          >
            <span>{currentStep === screens.length - 1 ? 'Get Started · Create Twin' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
