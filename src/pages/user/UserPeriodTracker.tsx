import React, { useState } from 'react';
import { 
  Droplet, Calendar, Sparkles, Heart, Check, Clock, AlertCircle, 
  ChevronRight, RefreshCw, Shield, HelpCircle, Flame, Moon, Sun, 
  Activity, ArrowRight, CheckCircle2, Sliders, Info, Stethoscope
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { isPastOrToday, isChronological } from '../../utils/validation';

export default function UserPeriodTracker() {
  const {
    stageName,
    currentStageCode,
    isReproductiveAgeUser,
    setShowLifeStageModal,
    isPeriodTrackerConfigured,
    periodSettings,
    periodMetrics,
    cycleHistory,
    menstrualAffirmation,
    menstrualTips,
    isLoadingPeriodData,
    periodErrorMsg,
    setPeriodErrorMsg,
    handleSavePeriodSetup,
    handleLogPeriodEntry,
    handleAdjustCycleDelay
  } = useUser();

  // Setup Form State
  const [setupForm, setSetupForm] = useState({
    lastPeriodStart: new Date().toISOString().split('T')[0],
    periodDuration: 5,
    cycleLength: 28
  });
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Log Period Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    durationDays: 5,
    flowIntensity: 'Medium',
    symptoms: ['Cramps'] as string[],
    mood: 'Calm',
    notes: ''
  });

  // Delay Adjustment Modal State
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [extendDays, setExtendDays] = useState(3);

  // Random healthy tip index
  const [tipIndex, setTipIndex] = useState(0);

  const availableSymptoms = [
    'Cramps', 'Fatigue', 'Bloating', 'Headache', 'Lower Back Ache', 
    'Acne', 'Tender Breasts', 'Mood Swings', 'Nausea', 'Sweet Cravings'
  ];

  const moodOptions = ['Calm', 'Energetic', 'Sensitive', 'Tired', 'Irritable', 'Anxious', 'Happy'];

  // 1. REPRODUCTIVE AGE GUARD: Filter out children and menopause
  if (!isReproductiveAgeUser) {
    return (
      <div className="space-y-6 font-inter animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#EDE9FE] shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto border border-purple-100">
            <Shield className="w-8 h-8 text-[#7C3AED]" />
          </div>
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#7C3AED] border border-purple-200">
              Clinical Stage Filtering Active
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3a3135]">
              Period Tracker Inactive for Current Stage
            </h2>
            <p className="text-xs sm:text-sm text-[#7a6f75] leading-relaxed">
              Your active health profile is currently calibrated to <b>{stageName || 'your current life stage'}</b> ({currentStageCode}).
              To adhere to clinical guidelines, biological menstrual cycle tracking is reserved exclusively for women in their reproductive years and is hidden for pediatric development, pregnancy, and menopause stages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] text-left text-xs space-y-2 text-gray-700">
            <div className="flex items-center gap-2 font-bold text-[#3a3135]">
              <Info className="w-4 h-4 text-[#7C3AED]" />
              <span>Are you in your reproductive years?</span>
            </div>
            <p className="text-[#7a6f75]">
              If your life stage changed or was misselected during onboarding, you can update your active life stage to <b>Reproductive Age (25–39 yrs)</b> or <b>Young Adult (18–24 yrs)</b> at any time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLifeStageModal(true)}
            className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Switch Active Life Stage</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle saving setup
  const onSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSavePeriodSetup(setupForm);
    if (success) {
      setShowSetupModal(false);
    }
  };

  // Handle logging new period
  const onLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogPeriodEntry(logForm);
    if (success) {
      setShowLogModal(false);
      setLogForm({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        durationDays: 5,
        flowIntensity: 'Medium',
        symptoms: ['Cramps'],
        mood: 'Calm',
        notes: ''
      });
    }
  };

  // Handle adjusting delay
  const onDelaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodSettings) return;
    const newLen = periodSettings.cycleLength + extendDays;
    const success = await handleAdjustCycleDelay(newLen, extendDays);
    if (success) {
      setShowDelayModal(false);
    }
  };

  const nextRandomTip = () => {
    if (menstrualTips.length > 0) {
      setTipIndex((prev) => (prev + 1) % menstrualTips.length);
    }
  };

  const activeTip = menstrualTips[tipIndex] || {
    title: 'Hydration & Warm Tea',
    category: 'Nutrition',
    tip: 'Sip warm chamomile or ginger tea to naturally ease pelvic contractions.',
    icon: '☕'
  };

  return (
    <div className="space-y-6 font-inter animate-in fade-in duration-200">
      
      {/* PAGE HEADER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase tracking-wider flex items-center gap-1 border border-rose-200">
              <Droplet className="w-3 h-3 text-rose-600 fill-current" /> Biological Menstrual Rhythm
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] uppercase tracking-wider border border-purple-200">
              {stageName || 'Reproductive Age'}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Doctor Synced
            </span>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-[#3a3135] tracking-tight">
            Period & Menstrual Cycle Intelligence
          </h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-2xl leading-relaxed">
            Track biological phases, predict fertility & PMS windows, dynamically calibrate early or delayed cycles, and share verified hormonal data with your attending physicians.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isPeriodTrackerConfigured && (
            <button
              onClick={() => {
                if (periodSettings) {
                  setSetupForm({
                    lastPeriodStart: periodSettings.lastPeriodStart,
                    periodDuration: periodSettings.periodDuration,
                    cycleLength: periodSettings.cycleLength
                  });
                }
                setShowSetupModal(true);
              }}
              className="p-2.5 rounded-2xl bg-[#FAF8FC] hover:bg-purple-50 text-gray-700 border border-[#EDE9FE] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Edit Cycle Baseline Setup"
            >
              <Sliders className="w-4 h-4 text-[#7C3AED]" />
              <span className="hidden sm:inline">Recalibrate</span>
            </button>
          )}

          <button
            onClick={() => setShowLogModal(true)}
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Droplet className="w-4 h-4 fill-current" />
            <span>Log Period Started</span>
          </button>
        </div>
      </div>

      {/* ERROR ALERT */}
      {periodErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{periodErrorMsg}</span>
        </div>
      )}

      {/* INITIAL SETUP CALLOUT (IF NOT CONFIGURED) */}
      {!isPeriodTrackerConfigured ? (
        <div className="bg-gradient-to-br from-purple-50 via-white to-rose-50 rounded-3xl p-8 border border-purple-200 shadow-sm text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-white text-[#7C3AED] border border-purple-200 flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl text-[#3a3135]">Set Up Your Cycle Baseline</h3>
            <p className="text-xs text-[#7a6f75] leading-relaxed">
              Tell us the start date of your last period and typical cycle duration. Our biological engine will predict your active phase, hormonal rhythm, and next fertile window.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSetupModal(true)}
            className="px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Cycle Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* ACTIVE CYCLE PHASE HERO DIAL & PREDICTOR */}
          {periodMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1 & 2: Current Phase Dial (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        Current Menstrual Cycle
                      </span>
                      <span className="text-xs font-bold text-gray-400">•</span>
                      <span className="text-xs font-bold text-[#7C3AED]">
                        Day {periodMetrics.cycleDay} of {periodMetrics.cycleLength}
                      </span>
                    </div>

                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      periodMetrics.phaseColor === 'rose' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : periodMetrics.phaseColor === 'emerald'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : periodMetrics.phaseColor === 'purple'
                        ? 'bg-purple-50 text-[#7C3AED] border-purple-200'
                        : periodMetrics.phaseColor === 'amber'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {periodMetrics.phaseBadge}
                    </span>
                  </div>

                  {/* Main Phase Banner */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black text-[#3a3135] tracking-tight">
                      {periodMetrics.phaseName}
                    </h3>
                    <p className="text-xs md:text-sm text-[#7a6f75] leading-relaxed">
                      {periodMetrics.phaseDescription}
                    </p>
                  </div>
                </div>

                {/* Visual Cycle Day Progress Bar */}
                <div className="space-y-2 bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-600">Cycle Day {periodMetrics.cycleDay}</span>
                    <span className="text-[#7C3AED]">{periodMetrics.cycleProgressPercent}% of cycle complete</span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        periodMetrics.phaseColor === 'rose'
                          ? 'bg-rose-500'
                          : periodMetrics.phaseColor === 'emerald'
                          ? 'bg-emerald-500'
                          : periodMetrics.phaseColor === 'purple'
                          ? 'bg-[#7C3AED]'
                          : periodMetrics.phaseColor === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${periodMetrics.cycleProgressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                    <span>Day 1 (Period Start: {periodMetrics.lastPeriodStart})</span>
                    <span>Day {periodMetrics.cycleLength} (Expected Next: {periodMetrics.nextPeriodDateStr})</span>
                  </div>
                </div>

                {/* Key Biological Dates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Next Expected Period</span>
                    <span className="text-sm font-black text-[#7C3AED] mt-0.5 block">{periodMetrics.nextPeriodDateStr}</span>
                    <span className="text-[10px] text-gray-500">Based on {periodMetrics.cycleLength}-day cadence</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Estimated Ovulation</span>
                    <span className="text-sm font-black text-rose-600 mt-0.5 block">{periodMetrics.ovulationDateStr}</span>
                    <span className="text-[10px] text-gray-500">LH surge & egg release</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Fertile Conception Window</span>
                    <span className="text-sm font-black text-indigo-700 mt-0.5 block">{periodMetrics.fertileWindowStr}</span>
                    <span className="text-[10px] text-gray-500">Highest conception probability</span>
                  </div>
                </div>

                {/* Delay Alert & Adjustment Action (If delayed) */}
                {periodMetrics.isDelayed && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-black text-amber-900 block">Cycle Running Late (+{periodMetrics.daysDelayed} Days)</span>
                        <p className="text-amber-800 text-[11px]">Period has not arrived by day {periodMetrics.cycleLength}. You can adjust expected duration or log when bleeding commences.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDelayModal(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer shrink-0"
                    >
                      Calibrate Delay
                    </button>
                  </div>
                )}
              </div>

              {/* Card 3: Menstrual Phase Mental Wellness & Healthy Tips (1 Col) */}
              <div className="bg-gradient-to-b from-rose-50/80 via-white to-purple-50/80 rounded-3xl p-6 md:p-8 border border-rose-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      ♥
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#3a3135]">Mental & Emotional Support</h4>
                      <span className="text-[10px] text-gray-500">Gentle hormonal wellness affirmation</span>
                    </div>
                  </div>

                  <blockquote className="p-4 rounded-2xl bg-white border border-rose-100 text-xs text-rose-950 font-medium italic leading-relaxed shadow-2xs">
                    "{menstrualAffirmation || 'Your body is performing sacred, restorative work right now. Give yourself permission to slow down and rest.'}"
                  </blockquote>
                </div>

                {/* Randomized Healthy Tip Box */}
                <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeTip.icon}</span>
                      <span className="font-bold text-xs text-[#3a3135]">{activeTip.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {activeTip.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {activeTip.tip}
                  </p>

                  <button
                    type="button"
                    onClick={nextRandomTip}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-purple-200"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>New Healthy Tip</span>
                  </button>
                </div>

                {/* Doctor Note */}
                <div className="flex items-center gap-2 text-[11px] text-[#7a6f75] pt-1 border-t border-rose-100">
                  <Stethoscope className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                  <span>Attending doctors can view your active phase during consultations.</span>
                </div>
              </div>
            </div>
          )}

          {/* ALL 4 PHASES OF CYCLE VISUAL BREAKDOWN */}
          {periodMetrics && periodMetrics.phasesOverview && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Biological Cycle Map
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-medium">All 4 Phases Based on Your {periodMetrics.cycleLength}-Day Rhythm</span>
                </div>
                <h3 className="text-xl font-bold text-[#3a3135]">Hormonal Waves & Phase Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {periodMetrics.phasesOverview.map((ph) => (
                  <div
                    key={ph.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                      ph.isActive
                        ? 'bg-purple-50/70 border-[#7C3AED] ring-2 ring-purple-300 shadow-sm'
                        : 'bg-[#FAF8FC] border-[#EDE9FE] hover:border-purple-200'
                    }`}
                  >
                    {ph.isActive && (
                      <span className="absolute -top-2.5 right-4 bg-[#7C3AED] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        Active Now
                      </span>
                    )}

                    <div className="border-b border-gray-200/60 pb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">{ph.days}</span>
                      <h4 className="font-bold text-sm text-[#3a3135]">{ph.name}</h4>
                      <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">{ph.badge}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-gray-500 text-[10px] uppercase block">Hormones:</span>
                        <p className="font-semibold text-gray-800">{ph.hormone}</p>
                      </div>

                      <div>
                        <span className="font-bold text-gray-500 text-[10px] uppercase block">Typical Sensations:</span>
                        <p className="text-gray-700">{ph.feelings}</p>
                      </div>

                      <div>
                        <span className="font-bold text-emerald-700 text-[10px] uppercase block">Ideal Foods:</span>
                        <p className="text-gray-700">{ph.foods}</p>
                      </div>

                      <div>
                        <span className="font-bold text-purple-700 text-[10px] uppercase block">Optimal Workouts:</span>
                        <p className="text-gray-700">{ph.workouts}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAST CYCLE HISTORY TABLE */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
              <div>
                <h3 className="font-bold text-xl text-[#3a3135]">Cycle History & Predictor Variations</h3>
                <p className="text-xs text-[#7a6f75]">Recorded menstrual cycle periods, duration, and cadence variations visible to doctors</p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] self-start sm:self-center">
                {cycleHistory.length} Cycles Recorded
              </span>
            </div>

            {cycleHistory.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-[#EDE9FE] text-xs text-gray-500">
                No past cycles logged yet. Use "Log Period Started" whenever a new period begins to build your clinical history.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EDE9FE] text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Cycle Dates</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Cycle Length</th>
                      <th className="py-3 px-4">Cadence Status</th>
                      <th className="py-3 px-4">Flow & Symptoms</th>
                      <th className="py-3 px-4">Mood</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cycleHistory.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF8FC] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#3a3135]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                            <span>{c.startDate} {c.endDate ? `➔ ${c.endDate}` : ''}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {c.durationDays} Days
                        </td>

                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {c.cycleLengthDays} Days
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            c.status === 'On Time' || c.status === 'Baseline Setup'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status.toLowerCase().includes('early')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="font-bold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-200">
                              {c.flowIntensity}
                            </span>
                            {c.symptoms && c.symptoms.map((s, idx) => (
                              <span key={idx} className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gray-600 font-medium">
                          {c.mood || 'Calm'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 1. SETUP CYCLE MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-bold text-base text-[#3a3135]">Menstrual Cycle Setup</h3>
              </div>
              <button 
                onClick={() => setShowSetupModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSetupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  When did your last period start?
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={setupForm.lastPeriodStart}
                  onChange={(e) => setSetupForm({ ...setupForm, lastPeriodStart: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">Period Bleeding Duration</label>
                  <span className="font-black text-[#7C3AED]">{setupForm.periodDuration} Days</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={setupForm.periodDuration}
                  onChange={(e) => setSetupForm({ ...setupForm, periodDuration: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>2 Days</span>
                  <span>5 Days (Typical)</span>
                  <span>10 Days</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">Average Cycle Length (Day 1 to Next Day 1)</label>
                  <span className="font-black text-[#7C3AED]">{setupForm.cycleLength} Days</span>
                </div>
                <input
                  type="range"
                  min="21"
                  max="45"
                  value={setupForm.cycleLength}
                  onChange={(e) => setSetupForm({ ...setupForm, cycleLength: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>21 Days</span>
                  <span>28 Days (Standard)</span>
                  <span>45 Days</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] cursor-pointer shadow-sm transition-all"
                >
                  Save & Calculate Rhythm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOG NEW PERIOD MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600 fill-current" />
                <h3 className="font-bold text-base text-[#3a3135]">Log Period Started</h3>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onLogSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Period Start Date</label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={logForm.startDate}
                  onChange={(e) => setLogForm({ ...logForm, startDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Flow Intensity</label>
                  <select
                    value={logForm.flowIntensity}
                    onChange={(e) => setLogForm({ ...logForm, flowIntensity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none"
                  >
                    <option value="Light">Light Flow</option>
                    <option value="Medium">Medium Flow</option>
                    <option value="Heavy">Heavy Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mood</label>
                  <select
                    value={logForm.mood}
                    onChange={(e) => setLogForm({ ...logForm, mood: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none"
                  >
                    {moodOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Symptoms & Sensations</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map(sym => {
                    const isChecked = logForm.symptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => {
                          if (isChecked) {
                            setLogForm({ ...logForm, symptoms: logForm.symptoms.filter(s => s !== sym) });
                          } else {
                            setLogForm({ ...logForm, symptoms: [...logForm.symptoms, sym] });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#7C3AED] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Came 2 days early, mild cramps eased with heat"
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] cursor-pointer shadow-sm transition-all"
                >
                  Log Period & Update Cadence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CALIBRATE CYCLE DELAY MODAL */}
      {showDelayModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-[#3a3135]">Calibrate Cycle Delay</h3>
              </div>
              <button 
                onClick={() => setShowDelayModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onDelaySubmit} className="space-y-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                If your cycle is running longer this month due to stress, travel, or hormonal shifts, you can extend your expected cycle duration to recalibrate predictions.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Extend expected cycle by:
                </label>
                <div className="flex items-center gap-3">
                  {[2, 3, 5, 7].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        extendDays === d
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      +{d} Days
                    </button>
                  ))}
                </div>
              </div>

              {periodSettings && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  New expected cycle length: <b>{periodSettings.cycleLength + extendDays} days</b>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDelayModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] cursor-pointer shadow-sm transition-all"
                >
                  Confirm Recalibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
