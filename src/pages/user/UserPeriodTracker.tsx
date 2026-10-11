import React, { useState, useEffect } from 'react';
import { 
  Droplet, Calendar, Sparkles, Heart, Check, Clock, AlertCircle, 
  ChevronRight, RefreshCw, Shield, HelpCircle, Flame, Moon, Sun, 
  Activity, ArrowRight, CheckCircle2, Sliders, Info, Stethoscope,
  Baby, Play, Pause, RotateCcw, Award, CheckSquare, Square
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { isPastOrToday, isChronological } from '../../utils/validation';

export default function UserPeriodTracker() {
  const {
    stageName,
    currentStageCode,
    isReproductiveAgeUser,
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
    handleAdjustCycleDelay,
    handleActivatePregnancy,
    handleDeactivatePregnancy,
    userProfile
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

  // Pregnancy / Maternity Modals
  const [showPregnancyModal, setShowPregnancyModal] = useState(false);
  const [pregnancyLmp, setPregnancyLmp] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingPregnancy, setIsSubmittingPregnancy] = useState(false);

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumePeriodDate, setResumePeriodDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingResume, setIsSubmittingResume] = useState(false);

  // Interactive Fetal Kick Counter State
  const [kickCount, setKickCount] = useState(0);
  const [kickTimerSeconds, setKickTimerSeconds] = useState(0);
  const [isKickTimerRunning, setIsKickTimerRunning] = useState(false);

  // Local Prenatal Checklist State
  const [completedChecklistIds, setCompletedChecklistIds] = useState<number[]>([1, 2]);

  // Random healthy tip index
  const [tipIndex, setTipIndex] = useState(0);

  const isPregnant = Boolean(periodMetrics?.isPregnant || periodSettings?.isPregnant);

  // Timer effect for Kick Counter
  useEffect(() => {
    let interval: any;
    if (isKickTimerRunning) {
      interval = setInterval(() => {
        setKickTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isKickTimerRunning]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const handleRecordKick = () => {
    if (!isKickTimerRunning && kickCount === 0) {
      setIsKickTimerRunning(true);
    }
    setKickCount(prev => Math.min(20, prev + 1));
  };

  const handleResetKicks = () => {
    setKickCount(0);
    setKickTimerSeconds(0);
    setIsKickTimerRunning(false);
  };

  const toggleChecklistItem = (id: number) => {
    setCompletedChecklistIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const availableSymptoms = [
    'Cramps', 'Fatigue', 'Bloating', 'Headache', 'Lower Back Ache', 
    'Acne', 'Tender Breasts', 'Mood Swings', 'Nausea', 'Sweet Cravings'
  ];

  const moodOptions = ['Calm', 'Energetic', 'Sensitive', 'Tired', 'Irritable', 'Anxious', 'Happy'];

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

  // Handle Activate Pregnancy
  const onActivatePregnancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPregnancy(true);
    const success = await handleActivatePregnancy(pregnancyLmp);
    setIsSubmittingPregnancy(false);
    if (success) {
      setShowPregnancyModal(false);
    }
  };

  // Handle Deactivate Pregnancy / Resume Cycle
  const onResumeCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingResume(true);
    const success = await handleDeactivatePregnancy(resumePeriodDate);
    setIsSubmittingResume(false);
    if (success) {
      setShowResumeModal(false);
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

  // 1. REPRODUCTIVE AGE GUARD: Adolescent awaiting menarche OR non-reproductive stage
  if (!isReproductiveAgeUser) {
    const isAwaitingMenarche = userProfile.menarcheStarted === false && (userProfile.age || 0) < 18;

    return (
      <div className="space-y-6 font-inter animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#EDE9FE] shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto border border-purple-100">
            {isAwaitingMenarche ? <Sparkles className="w-8 h-8 text-[#7C3AED]" /> : <Shield className="w-8 h-8 text-[#7C3AED]" />}
          </div>
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#7C3AED] border border-purple-200">
              {isAwaitingMenarche ? '🌱 Pubertal Preparation Mode' : 'Clinical Stage Calibration'}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3a3135]">
              {isAwaitingMenarche ? 'Awaiting Menarche (First Period)' : 'Period Tracker Paused for Life Stage'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7a6f75] leading-relaxed">
              {isAwaitingMenarche ? (
                <>Your profile is set to <b>Puberty & Development</b> with first menses (menarche) not yet commenced. Menstrual cycle countdowns are paused until your first period arrives.</>
              ) : (
                <>Your active health stage is currently calibrated to <b>{stageName || 'your current life stage'}</b> ({currentStageCode}), calculated dynamically from your Date of Birth ({userProfile.dob}). Menstrual cycle tracking is paused for this stage.</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] text-left text-xs space-y-2 text-gray-700">
            <div className="flex items-center gap-2 font-bold text-[#3a3135]">
              <Info className="w-4 h-4 text-[#7C3AED]" />
              <span>{isAwaitingMenarche ? 'Has your first period arrived?' : 'Need to adjust your Date of Birth or Onset?'}</span>
            </div>
            <p className="text-[#7a6f75]">
              {isAwaitingMenarche ? (
                <>When your first period begins, you can enable active cycle tracking anytime by recording your first period start or updating the Menarche toggle in your Profile Settings.</>
              ) : (
                <>You can adjust your Date of Birth or biological indicators anytime in Profile Settings. If you are pregnant, you can also activate Maternity Mode.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAwaitingMenarche && (
              <button
                type="button"
                onClick={() => setShowSetupModal(true)}
                className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-current" />
                <span>Record First Period (Start Tracking)</span>
              </button>
            )}

            <Link
              to="/settings"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#7C3AED] border border-[#EDE9FE] rounded-2xl font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Calibrate in Settings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-inter animate-in fade-in duration-200">
      
      {/* PAGE HEADER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
              isPregnant 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : 'bg-rose-100 text-rose-700 border-rose-200'
            }`}>
              {isPregnant ? (
                <>🤰 Maternity & Fetal Journey</>
              ) : (
                <><Droplet className="w-3 h-3 text-rose-600 fill-current" /> Biological Menstrual Rhythm</>
              )}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] uppercase tracking-wider border border-purple-200">
              {stageName || (isPregnant ? 'Pregnancy Journey' : 'Reproductive Age')}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Doctor Synced
            </span>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl text-[#3a3135] tracking-tight">
            {isPregnant ? 'Maternity & Fetal Wellness Hub' : 'Period & Menstrual Cycle Intelligence'}
          </h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-2xl leading-relaxed">
            {isPregnant ? (
              <>Menstrual cycle calculations are safely paused. Track gestational age, fetal development milestones, active fetal kick counter, and prenatal clinical checklists.</>
            ) : (
              <>Track biological phases, predict fertility & PMS windows, dynamically calibrate early or delayed cycles, or enter Maternity Mode if you test positive for pregnancy.</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isPregnant ? (
            <button
              onClick={() => setShowResumeModal(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Conclude Pregnancy / Resume Cycle</span>
            </button>
          ) : (
            <>
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
                onClick={() => {
                  setPregnancyLmp(periodSettings?.lastPeriodStart || new Date().toISOString().split('T')[0]);
                  setShowPregnancyModal(true);
                }}
                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🤰 Log Pregnancy</span>
              </button>

              <button
                onClick={() => setShowLogModal(true)}
                className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-current" />
                <span>Log Period Started</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {periodErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{periodErrorMsg}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MATERNITY & PREGNANCY MODE VIEW (CYCLE PAUSED)                     */}
      {/* ===================================================================== */}
      {isPregnant && periodMetrics ? (
        <div className="space-y-6">
          
          {/* MATERNITY BANNER & GESTATIONAL AGE DIAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Gestational Progress Hero (2 Cols) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white via-purple-50/40 to-rose-50/30 rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                      🤰 Active Maternity Journey
                    </span>
                    <span className="text-xs font-bold text-gray-400">•</span>
                    <span className="text-xs font-bold text-[#7C3AED]">
                      Menstrual Countdown Paused
                    </span>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Healthy Gestation
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <span className="text-xs font-extrabold text-[#7C3AED] uppercase tracking-wider">
                    {periodMetrics.trimesterName || 'Second Trimester (Weeks 13–27)'}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-[#3a3135] tracking-tight">
                    Week {periodMetrics.gestationalWeeks ?? 14}, Day {periodMetrics.gestationalDays ?? 2}
                  </h3>
                  <p className="text-xs md:text-sm text-[#7a6f75] leading-relaxed max-w-xl">
                    {periodMetrics.phaseDescription}
                  </p>
                </div>
              </div>

              {/* Fetal Progress Metrics Bar */}
              <div className="space-y-2 bg-white/90 p-4 rounded-2xl border border-purple-100 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-600">Gestational Progress (40 Weeks)</span>
                  <span className="text-[#7C3AED]">
                    {Math.min(100, Math.round(((periodMetrics.gestationalWeeks || 1) / 40) * 100))}% of pregnancy complete
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-[#7C3AED]"
                    style={{ width: `${Math.min(100, Math.round(((periodMetrics.gestationalWeeks || 1) / 40) * 100))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                  <span>Conception / LMP ({periodMetrics.pregnancyStartDate || periodSettings?.pregnancyStartDate})</span>
                  <span>Estimated Due Date ({periodMetrics.edd})</span>
                </div>
              </div>

              {/* Due Date & Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Estimated Due Date</span>
                  <span className="text-sm font-black text-[#7C3AED] mt-0.5 block">{periodMetrics.edd}</span>
                  <span className="text-[10px] text-gray-500">40 Gestational Weeks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Days Remaining</span>
                  <span className="text-sm font-black text-rose-600 mt-0.5 block">{periodMetrics.daysRemaining} Days</span>
                  <span className="text-[10px] text-gray-500">Countdown to delivery</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Fetal Size Comparison</span>
                  <span className="text-sm font-black text-emerald-800 mt-0.5 block flex items-center gap-1">
                    <span>{periodMetrics.babyIcon}</span>
                    <span>{periodMetrics.babySize}</span>
                  </span>
                  <span className="text-[10px] text-gray-500">Clinical anatomical milestone</span>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Fetal Kick Counter (1 Col) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm">
                      👣
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#3a3135]">Fetal Kick Counter</h4>
                      <p className="text-[10px] text-gray-500">ACOG Daily Movement Monitor</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded-lg text-gray-700">
                    ⏱️ {formatTimer(kickTimerSeconds)}
                  </span>
                </div>

                <div className="text-center py-4 space-y-3">
                  <div className="text-4xl font-black text-[#7C3AED]">
                    {kickCount} <span className="text-sm text-gray-400 font-bold">/ 10 Kicks</span>
                  </div>

                  <p className="text-[11px] text-[#7a6f75] max-w-xs mx-auto">
                    ACOG recommends feeling 10 distinct movements or kicks within 2 hours. Tap the button each time you feel a movement.
                  </p>

                  <button
                    type="button"
                    onClick={handleRecordKick}
                    className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>+ Kick Felt</span>
                    <span className="text-lg">🦶</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setIsKickTimerRunning(prev => !prev)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                >
                  {isKickTimerRunning ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isKickTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetKicks}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRENATAL CLINICAL CHECKLIST */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#3a3135]">Prenatal Clinical Checklist & Ultrasounds</h4>
                  <p className="text-[11px] text-gray-500">Standard OB/GYN screenings for your gestational journey</p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                {completedChecklistIds.length} of {periodMetrics.prenatalChecklist?.length || 6} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {(periodMetrics.prenatalChecklist || [
                { id: 1, week: '8-12w', title: 'First Trimester Ultrasound & Viability Screen' },
                { id: 2, week: '10-13w', title: 'Nuchal Translucency & Cell-Free DNA Screen' },
                { id: 3, week: '18-22w', title: 'Anatomy Ultrasound & Fetal Echocardiogram' },
                { id: 4, week: '24-28w', title: 'Gestational Diabetes Glucose Screen' },
                { id: 5, week: '28-36w', title: 'Daily Fetal Movement & Kick Counting' },
                { id: 6, week: '35-37w', title: 'Group B Strep (GBS) Screening & Birth Plan' },
              ]).map((item: any) => {
                const isChecked = completedChecklistIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked 
                        ? 'bg-purple-50/60 border-purple-200 text-purple-900' 
                        : 'bg-[#FAF8FC] border-gray-200 text-gray-700 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold block">{item.title}</span>
                        <span className="text-[10px] text-gray-500">Recommended window: {item.week}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-purple-200 text-purple-900' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isChecked ? 'Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* ===================================================================== */
        /* 3. NORMAL MENSTRUAL TRACKER VIEW                                      */
        /* ===================================================================== */
        <>
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
                        className="text-[11px] font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Show another healthy tip</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4 BIOLOGICAL PHASES ARCHITECTURE CARDS */}
              {periodMetrics && periodMetrics.phasesOverview && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base md:text-lg text-[#3a3135]">
                      The 4 Biological Phases of Your Menstrual Cycle
                    </h3>
                    <span className="text-xs text-gray-500">Clinically mapped to your body's rhythm</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {periodMetrics.phasesOverview.map((phase) => (
                      <div
                        key={phase.id}
                        className={`rounded-3xl p-5 border transition-all ${
                          phase.isActive
                            ? 'bg-white border-[#7C3AED] shadow-md ring-2 ring-[#7C3AED]/20'
                            : 'bg-[#FAF8FC] border-[#EDE9FE] opacity-90 hover:opacity-100 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                            {phase.days}
                          </span>
                          {phase.isActive && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#7C3AED] text-white">
                              Active Now
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-base text-[#3a3135]">{phase.name}</h4>
                        <span className="text-xs font-semibold text-[#7C3AED] block mb-3">{phase.badge}</span>

                        <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase block">Dominant Hormones</span>
                            <span className="font-semibold text-gray-800 text-[11px]">{phase.hormone}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase block">How You Might Feel</span>
                            <span className="text-[11px] leading-tight block">{phase.feelings}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase block">Optimal Nutrition</span>
                            <span className="text-[11px] leading-tight block text-emerald-800">{phase.foods}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[10px] text-gray-400 uppercase block">Best Movement</span>
                            <span className="text-[11px] leading-tight block text-purple-900">{phase.workouts}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CYCLE HISTORY TIMELINE LOGS */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-[#3a3135]">
                      Recorded Menstrual Cycles History
                    </h3>
                    <p className="text-xs text-gray-500">Track cycle variance, flow intensity & symptoms across months</p>
                  </div>
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-xl font-bold text-xs border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Droplet className="w-3.5 h-3.5 fill-current" />
                    <span>Log New Cycle</span>
                  </button>
                </div>

                {cycleHistory.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500">
                    No cycle history logged yet. Tap "Log New Cycle" to add your first entry.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Start Date</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Cycle Length</th>
                          <th className="py-2.5 px-3">Cadence Status</th>
                          <th className="py-2.5 px-3">Flow</th>
                          <th className="py-2.5 px-3">Logged Symptoms</th>
                          <th className="py-2.5 px-3">Mood</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cycleHistory.map((c) => (
                          <tr key={c.id} className="hover:bg-[#FAF8FC] transition-colors">
                            <td className="py-3 px-3 font-bold text-[#3a3135]">{c.startDate}</td>
                            <td className="py-3 px-3 font-medium">{c.durationDays} Days</td>
                            <td className="py-3 px-3 font-medium">{c.cycleLengthDays} Days</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                c.status.includes('Early')
                                  ? 'bg-rose-100 text-rose-800'
                                  : c.status.includes('Delayed')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-gray-700">{c.flowIntensity}</td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(c.symptoms) ? c.symptoms : []).slice(0, 3).map((sym, idx) => (
                                  <span key={idx} className="bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded text-[10px]">
                                    {sym}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-gray-600">{c.mood}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* GLOBAL MODALS                                                         */}
      {/* ===================================================================== */}

      {/* 1. SETUP / RECALIBRATE MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="font-bold text-base text-[#3a3135]">Configure Menstrual Cycle</h3>
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
                  Start Date of Last Period <span className="text-red-500">*</span>
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
                <label className="block font-bold text-gray-700 mb-1">
                  Average Period Duration (Days of Bleeding)
                </label>
                <input
                  type="number"
                  min="2"
                  max="14"
                  value={setupForm.periodDuration}
                  onChange={(e) => setSetupForm({ ...setupForm, periodDuration: parseInt(e.target.value, 10) || 5 })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Average Cycle Length (Days from Start to Next Start)
                </label>
                <input
                  type="number"
                  min="21"
                  max="45"
                  value={setupForm.cycleLength}
                  onChange={(e) => setSetupForm({ ...setupForm, cycleLength: parseInt(e.target.value, 10) || 28 })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
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
                  Save Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOG PERIOD MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#EDE9FE] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600 fill-current" />
                <h3 className="font-bold text-base text-[#3a3135]">Log New Menstrual Period</h3>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onLogSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={logForm.startDate}
                    onChange={(e) => setLogForm({ ...logForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={logForm.durationDays}
                    onChange={(e) => setLogForm({ ...logForm, durationDays: parseInt(e.target.value, 10) || 5 })}
                    className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Spotting', 'Light', 'Medium', 'Heavy'].map(flow => (
                    <button
                      key={flow}
                      type="button"
                      onClick={() => setLogForm({ ...logForm, flowIntensity: flow })}
                      className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        logForm.flowIntensity === flow
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Symptoms</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map(sym => {
                    const isSelected = logForm.symptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setLogForm({ ...logForm, symptoms: logForm.symptoms.filter(s => s !== sym) });
                          } else {
                            setLogForm({ ...logForm, symptoms: [...logForm.symptoms, sym] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white shadow-xs'
                            : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mood State</label>
                <select
                  value={logForm.mood}
                  onChange={(e) => setLogForm({ ...logForm, mood: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                >
                  {moodOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Personal Cycle Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes regarding cramping, energy levels, or hydration..."
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

      {/* 4. ACTIVATE PREGNANCY / MATERNITY MODE MODAL */}
      {showPregnancyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-purple-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
                  🤰
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#3a3135]">Enter Maternity Mode</h3>
                  <p className="text-[10px] text-gray-500">Pauses cycle tracking & enables fetal hub</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPregnancyModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onActivatePregnancySubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-purple-950">
                <span className="font-bold block">Congratulations!</span>
                <p className="text-[11px] leading-relaxed text-purple-900">
                  When you activate Maternity Mode, menstrual cycle countdowns and predictions will be paused. You will receive trimester milestones, weekly fetal growth metrics, an interactive kick counter, and prenatal visit checklists.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  First Day of Last Menstrual Period (LMP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={pregnancyLmp}
                  onChange={(e) => setPregnancyLmp(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Clinically, your Estimated Due Date (EDD) is calculated as 280 days (40 weeks) from this date.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPregnancyModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  disabled={isSubmittingPregnancy}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPregnancy}
                  className="py-2.5 px-6 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] cursor-pointer shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmittingPregnancy && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Activate Maternity Mode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. RESUME MENSTRUAL CYCLE / CONCLUDE PREGNANCY MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  🔄
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#3a3135]">Resume Menstrual Cycle Tracking</h3>
                  <p className="text-[10px] text-gray-500">Conclude maternity mode and restart period rhythm</p>
                </div>
              </div>
              <button 
                onClick={() => setShowResumeModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onResumeCycleSubmit} className="space-y-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                This will conclude active Maternity Mode and recalibrate your biological tracker back to normal menstrual and ovulation phase predictions.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Start Date of Resumed Period (or Today)
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={resumePeriodDate}
                  onChange={(e) => setResumePeriodDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-medium outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  disabled={isSubmittingResume}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResume}
                  className="py-2.5 px-6 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmittingResume && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm & Resume Cycle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
