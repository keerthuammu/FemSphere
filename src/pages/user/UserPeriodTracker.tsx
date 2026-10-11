import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Droplet, Calendar, Sparkles, Heart, Check, Clock, AlertCircle, 
  ChevronRight, ChevronLeft, RefreshCw, Shield, Moon, Sun, 
  Activity, ArrowRight, CheckCircle2, Sliders, Info, Stethoscope,
  Baby, Play, Pause, RotateCcw, CheckSquare, Square, Plus,
  Trash2, Edit3, TrendingUp, BarChart3, Bell, Settings, X,
  Smile, Frown, Meh, Zap, Bed, Feather, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser, DailyLogItem, CycleHistoryItem } from '../../context/UserContext';

export default function UserPeriodTracker() {
  const {
    stageName,
    currentStageCode,
    isReproductiveAgeUser,
    isPeriodTrackerConfigured,
    periodSettings,
    periodMetrics,
    predictions,
    historicalStats,
    dailyLogs,
    todayDailyLog,
    periodReminders,
    cycleHistory,
    menstrualAffirmation,
    menstrualTips,
    isLoadingPeriodData,
    periodErrorMsg,
    setPeriodErrorMsg,
    fetchPeriodData,
    fetchDailyLogs,
    handleSavePeriodSetup,
    handleLogPeriodEntry,
    handleUpdatePeriodCycle,
    handleDeletePeriodCycle,
    handleSaveDailyLog,
    handleDeleteDailyLog,
    handleUpdatePeriodSettings,
    handleAdjustCycleDelay,
    handleActivatePregnancy,
    handleDeactivatePregnancy,
    userProfile
  } = useUser();

  // Active sub-tab: 'cycle' | 'calendar' | 'history' | 'analysis' | 'settings'
  const [activeTab, setActiveTab] = useState<'cycle' | 'calendar' | 'history' | 'analysis' | 'settings'>('cycle');

  // Month navigation for Calendar
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Setup / Baseline Form State
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({
    lastPeriodStart: new Date().toISOString().split('T')[0],
    periodDuration: 5,
    cycleLength: 28
  });

  // Log Cycle Modal State
  const [showLogCycleModal, setShowLogCycleModal] = useState(false);
  const [cycleLogForm, setCycleLogForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    durationDays: 5,
    flowIntensity: 'Medium',
    symptoms: ['Cramps'] as string[],
    mood: 'Calm',
    notes: ''
  });

  // Edit Cycle Modal State
  const [editingCycle, setEditingCycle] = useState<CycleHistoryItem | null>(null);
  const [editCycleForm, setEditCycleForm] = useState({
    startDate: '',
    durationDays: 5,
    cycleLengthDays: 28,
    flowIntensity: 'Medium',
    symptoms: [] as string[],
    mood: 'Calm'
  });

  // Delete Cycle Confirmation Modal
  const [deletingCycleId, setDeletingCycleId] = useState<number | string | null>(null);

  // Daily Symptom Logging Modal State
  const [showDailyLogModal, setShowDailyLogModal] = useState(false);
  const [dailyLogForm, setDailyLogForm] = useState<DailyLogItem>({
    date: new Date().toISOString().split('T')[0],
    isPeriodDay: false,
    flowIntensity: 'None',
    symptoms: [],
    mood: 'Calm',
    energyLevel: 'Medium',
    sleepQuality: 'Good',
    cervicalMucus: 'None',
    notes: ''
  });

  // Delay Adjustment Modal State
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [extendDays, setExtendDays] = useState(3);

  // Reminders Settings Form
  const [reminderForm, setReminderForm] = useState({
    periodDaysBefore: 2,
    periodEnabled: true,
    ovulationEnabled: false,
    dailyLoggingEnabled: false
  });
  const [isSavingReminders, setIsSavingReminders] = useState(false);

  // Maternity / Pregnancy Modals & State
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
  const [completedChecklistIds, setCompletedChecklistIds] = useState<number[]>([1, 2]);

  // Insights data
  const [insightsData, setInsightsData] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Tip Index
  const [tipIndex, setTipIndex] = useState(0);

  const isPregnant = Boolean(periodMetrics?.isPregnant || periodSettings?.isPregnant);

  // Fetch daily logs on month change
  useEffect(() => {
    const yearMonth = `${currentCalendarDate.getFullYear()}-${String(currentCalendarDate.getMonth() + 1).padStart(2, '0')}`;
    fetchDailyLogs(yearMonth);
  }, [currentCalendarDate, fetchDailyLogs]);

  // Sync reminders form from context
  useEffect(() => {
    if (periodReminders) {
      setReminderForm({
        periodDaysBefore: periodReminders.periodDaysBefore ?? 2,
        periodEnabled: periodReminders.periodEnabled ?? true,
        ovulationEnabled: periodReminders.ovulationEnabled ?? false,
        dailyLoggingEnabled: periodReminders.dailyLoggingEnabled ?? false
      });
    }
  }, [periodReminders]);

  // Fetch insights when Analysis tab is selected
  useEffect(() => {
    if (activeTab === 'analysis') {
      const fetchInsights = async () => {
        setIsLoadingInsights(true);
        try {
          const token = localStorage.getItem('femsphere_token');
          if (!token) return;
          const res = await fetch('/api/period-tracker/insights', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setInsightsData(data);
          }
        } catch (e) {
          console.error('Error fetching insights:', e);
        } finally {
          setIsLoadingInsights(false);
        }
      };
      fetchInsights();
    }
  }, [activeTab]);

  // Kick counter timer
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

  const availableSymptoms = [
    'Cramps', 'Headaches', 'Bloating', 'Breast Tenderness', 
    'Fatigue', 'Lower Back Ache', 'Acne', 'Mood Swings', 
    'Nausea', 'Sweet Cravings', 'Pelvic Pain', 'Insomnia'
  ];

  const moodOptions = ['Calm', 'Happy', 'Energetic', 'Sensitive', 'Irritable', 'Anxious', 'Low Energy'];
  const energyOptions = ['High', 'Medium', 'Low', 'Exhausted'];
  const sleepOptions = ['Restful', 'Good', 'Interrupted', 'Insomnia'];
  const mucusOptions = ['None', 'Dry', 'Sticky', 'Creamy', 'Egg White (Fertile)', 'Watery'];

  // Handle open daily log modal for specific date
  const openDailyLogForDate = (dateStr: string) => {
    const existing = dailyLogs.find(d => d.date === dateStr);
    if (existing) {
      setDailyLogForm({
        ...existing,
        symptoms: Array.isArray(existing.symptoms) ? existing.symptoms : []
      });
    } else {
      // Check if this date falls within a recorded period cycle
      const isPeriodDay = cycleHistory.some(c => {
        if (!c.startDate) return false;
        const start = new Date(c.startDate);
        const dur = c.durationDays || 5;
        const current = new Date(dateStr);
        const diff = Math.round((current.getTime() - start.getTime()) / 86400000);
        return diff >= 0 && diff < dur;
      });

      setDailyLogForm({
        date: dateStr,
        isPeriodDay,
        flowIntensity: isPeriodDay ? 'Medium' : 'None',
        symptoms: [],
        mood: 'Calm',
        energyLevel: 'Medium',
        sleepQuality: 'Good',
        cervicalMucus: 'None',
        notes: ''
      });
    }
    setShowDailyLogModal(true);
  };

  // Submit Daily Log
  const onSubmitDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSaveDailyLog(dailyLogForm);
    if (success) {
      setShowDailyLogModal(false);
    }
  };

  // Delete Daily Log
  const onDeleteDailyLog = async () => {
    if (!dailyLogForm.date) return;
    const success = await handleDeleteDailyLog(dailyLogForm.date);
    if (success) {
      setShowDailyLogModal(false);
    }
  };

  // Submit Cycle Baseline Setup
  const onSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSavePeriodSetup(setupForm);
    if (success) {
      setShowSetupModal(false);
    }
  };

  // Submit New Cycle Entry
  const onLogCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogPeriodEntry(cycleLogForm);
    if (success) {
      setShowLogCycleModal(false);
      setCycleLogForm({
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 5,
        flowIntensity: 'Medium',
        symptoms: ['Cramps'],
        mood: 'Calm',
        notes: ''
      });
    }
  };

  // Submit Cycle Edit
  const onEditCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    const success = await handleUpdatePeriodCycle(editingCycle.id, editCycleForm);
    if (success) {
      setEditingCycle(null);
    }
  };

  // Confirm Cycle Delete
  const onConfirmDeleteCycle = async () => {
    if (!deletingCycleId) return;
    const success = await handleDeletePeriodCycle(deletingCycleId);
    if (success) {
      setDeletingCycleId(null);
    }
  };

  // Save Reminders
  const onSaveReminders = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingReminders(true);
    await handleUpdatePeriodSettings(reminderForm);
    setIsSavingReminders(false);
  };

  // Pregnancy submissions
  const onActivatePregnancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPregnancy(true);
    const success = await handleActivatePregnancy(pregnancyLmp);
    setIsSubmittingPregnancy(false);
    if (success) setShowPregnancyModal(false);
  };

  const onResumeCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingResume(true);
    const success = await handleDeactivatePregnancy(resumePeriodDate);
    setIsSubmittingResume(false);
    if (success) setShowResumeModal(false);
  };

  const nextRandomTip = () => {
    if (menstrualTips.length > 0) {
      setTipIndex(prev => (prev + 1) % menstrualTips.length);
    }
  };

  const activeTip = menstrualTips[tipIndex] || {
    title: 'Hydration & Warm Herbal Infusions',
    category: 'Nutrition',
    tip: 'Sip warm chamomile, raspberry leaf, or ginger tea to gently soothe pelvic cramping.',
    icon: '☕'
  };

  // =========================================================================
  // CIRCULAR WHEEL GEOMETRY CALCULATIONS
  // =========================================================================
  const wheelData = useMemo(() => {
    const cycleLen = periodMetrics?.cycleLength || periodSettings?.cycleLength || 28;
    const duration = periodMetrics?.periodDuration || periodSettings?.periodDuration || 5;
    const currentDay = Math.max(1, Math.min(cycleLen, periodMetrics?.cycleDay || 1));
    const isDelayed = Boolean(periodMetrics?.isDelayed);
    const daysDelayed = periodMetrics?.daysDelayed || 0;

    // Dimensions
    const size = 320;
    const center = size / 2;
    const radius = 120;
    const strokeWidth = 18;

    // Convert polar angle (degrees, 0 = 12 o'clock / top, clockwise) to SVG coordinates
    const polarToCartesian = (deg: number, r: number) => {
      const rad = ((deg - 90) * Math.PI) / 180.0;
      return {
        x: center + r * Math.cos(rad),
        y: center + r * Math.sin(rad)
      };
    };

    // Build SVG Arc path description
    const describeArc = (startAngle: number, endAngle: number, r: number) => {
      const start = polarToCartesian(startAngle, r);
      const end = polarToCartesian(endAngle, r);
      const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
      return [
        'M', start.x, start.y,
        'A', r, r, 0, arcSweep, 1, end.x, end.y
      ].join(' ');
    };

    // Angle step per day
    const degPerDay = 360 / cycleLen;

    // 1. Period bleeding arc (Days 1 to duration)
    const periodStartDeg = 0;
    const periodEndDeg = Math.min(359.9, duration * degPerDay);
    const periodPath = describeArc(periodStartDeg, periodEndDeg, radius);

    // 2. Fertile window arc (Approx days: ovulation - 5 to ovulation + 1)
    const ovDay = Math.max(1, cycleLen - 14);
    const fertStartDay = Math.max(1, ovDay - 5);
    const fertEndDay = Math.min(cycleLen, ovDay + 1);
    const fertStartDeg = fertStartDay * degPerDay;
    const fertEndDeg = Math.min(359.9, fertEndDay * degPerDay);
    const fertilePath = describeArc(fertStartDeg, fertEndDeg, radius);

    // Ovulation marker position
    const ovDeg = ovDay * degPerDay;
    const ovPos = polarToCartesian(ovDeg, radius);

    // 3. Current Day indicator position (on perimeter)
    const currentDeg = currentDay * degPerDay;
    const currentPos = polarToCartesian(currentDeg, radius);

    // Progression arc from 0 to currentDay
    const progressEndDeg = Math.min(359.9, Math.max(2, currentDay * degPerDay));
    const progressPath = describeArc(0, progressEndDeg, radius);

    // Droplet icon position at 12 o'clock
    const dropPos = polarToCartesian(0, radius + 2);

    return {
      size,
      center,
      radius,
      strokeWidth,
      cycleLen,
      currentDay,
      duration,
      isDelayed,
      daysDelayed,
      periodPath,
      fertilePath,
      progressPath,
      ovPos,
      currentPos,
      dropPos
    };
  }, [periodMetrics, periodSettings]);

  // =========================================================================
  // CALENDAR DAYS MATRIX BUILDER
  // =========================================================================
  const calendarMonthData = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0: Sun, 1: Mon...

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isRecordedPeriod: boolean;
      isPredictedPeriod: boolean;
      isFertileWindow: boolean;
      isOvulationDay: boolean;
      hasDailyLog: boolean;
      flowIntensity?: string;
    }> = [];

    // Pre-calculate date classification maps
    // Recorded period dates set
    const recordedPeriodDates = new Set<string>();
    cycleHistory.forEach(cycle => {
      if (!cycle.startDate) return;
      const start = new Date(cycle.startDate);
      const dur = cycle.durationDays || 5;
      for (let i = 0; i < dur; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        recordedPeriodDates.add(d.toISOString().split('T')[0]);
      }
    });

    // Also include any daily logs with isPeriodDay = true
    dailyLogs.forEach(log => {
      if (log.isPeriodDay) {
        recordedPeriodDates.add(log.date);
      }
    });

    // Predicted period dates set
    const predictedPeriodDates = new Set<string>();
    if (predictions && predictions.nextPeriodStartDate) {
      const predStart = new Date(predictions.nextPeriodStartDate);
      const predDur = predictions.estimatedPeriodDuration || periodSettings?.periodDuration || 5;
      for (let i = 0; i < predDur; i++) {
        const d = new Date(predStart);
        d.setDate(predStart.getDate() + i);
        const str = d.toISOString().split('T')[0];
        if (!recordedPeriodDates.has(str)) {
          predictedPeriodDates.add(str);
        }
      }
    }

    // Fertile window dates set
    const fertileDates = new Set<string>();
    if (predictions && predictions.fertileWindowStartDate && predictions.fertileWindowEndDate) {
      const fStart = new Date(predictions.fertileWindowStartDate);
      const fEnd = new Date(predictions.fertileWindowEndDate);
      const cur = new Date(fStart);
      while (cur <= fEnd) {
        fertileDates.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Padding previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      const str = prevDate.toISOString().split('T')[0];
      days.push({
        dateStr: str,
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: str === todayStr,
        isRecordedPeriod: recordedPeriodDates.has(str),
        isPredictedPeriod: predictedPeriodDates.has(str),
        isFertileWindow: fertileDates.has(str),
        isOvulationDay: predictions?.estimatedOvulationDate === str,
        hasDailyLog: dailyLogs.some(l => l.date === str)
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const str = d.toISOString().split('T')[0];
      const log = dailyLogs.find(l => l.date === str);
      days.push({
        dateStr: str,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: str === todayStr,
        isRecordedPeriod: recordedPeriodDates.has(str),
        isPredictedPeriod: predictedPeriodDates.has(str),
        isFertileWindow: fertileDates.has(str),
        isOvulationDay: predictions?.estimatedOvulationDate === str,
        hasDailyLog: Boolean(log),
        flowIntensity: log?.flowIntensity
      });
    }

    // Padding next month to fill grid
    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      const str = nextDate.toISOString().split('T')[0];
      days.push({
        dateStr: str,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: str === todayStr,
        isRecordedPeriod: recordedPeriodDates.has(str),
        isPredictedPeriod: predictedPeriodDates.has(str),
        isFertileWindow: fertileDates.has(str),
        isOvulationDay: predictions?.estimatedOvulationDate === str,
        hasDailyLog: dailyLogs.some(l => l.date === str)
      });
    }

    return days;
  }, [currentCalendarDate, cycleHistory, dailyLogs, predictions, periodSettings]);

  // Selected date log item
  const selectedDateLog = useMemo(() => {
    return dailyLogs.find(d => d.date === selectedCalendarDate);
  }, [dailyLogs, selectedCalendarDate]);

  // Selected date cycle if recorded
  const selectedDateCycle = useMemo(() => {
    return cycleHistory.find(c => {
      if (!c.startDate) return false;
      const start = new Date(c.startDate);
      const dur = c.durationDays || 5;
      const current = new Date(selectedCalendarDate);
      const diff = Math.round((current.getTime() - start.getTime()) / 86400000);
      return diff >= 0 && diff < dur;
    });
  }, [cycleHistory, selectedCalendarDate]);

  // Non-reproductive stage guard
  if (!isReproductiveAgeUser) {
    const isAwaitingMenarche = userProfile.menarcheStarted === false && (userProfile.age || 0) < 18;

    return (
      <div className="space-y-6 font-inter animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#F4DDE2] shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#936DA2] flex items-center justify-center mx-auto border border-purple-100">
            {isAwaitingMenarche ? <Sparkles className="w-8 h-8 text-[#936DA2]" /> : <Shield className="w-8 h-8 text-[#936DA2]" />}
          </div>
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#936DA2] border border-purple-200">
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

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAwaitingMenarche && (
              <button
                type="button"
                onClick={() => setShowSetupModal(true)}
                className="px-6 py-3 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-current" />
                <span>Record First Period (Start Tracking)</span>
              </button>
            )}

            <Link
              to="/settings"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-[#936DA2] border border-[#F4DDE2] rounded-2xl font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
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
      
      {/* ===================================================================== */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                         */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                <><Droplet className="w-3 h-3 text-rose-600 fill-current" /> Menstrual Rhythm</>
              )}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#936DA2] uppercase tracking-wider border border-purple-200">
              {stageName || (isPregnant ? 'Pregnancy Journey' : 'Reproductive Age')}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Database Synced
            </span>
          </div>

          <h1 className="font-bold text-2xl md:text-3xl text-[#3a3135] tracking-tight">
            {isPregnant ? 'Maternity & Fetal Wellness Hub' : 'Period & Menstrual Cycle Tracker'}
          </h1>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-2xl leading-relaxed">
            {isPregnant ? (
              <>Track gestational age, fetal development milestones, active fetal kick counter, and prenatal clinical checklists.</>
            ) : (
              <>Track menstrual rhythm, predict fertility windows, log daily health symptoms, and view personal historical cycle trends.</>
            )}
          </p>
        </div>

        {/* Top Action Buttons */}
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
                  className="p-2.5 rounded-2xl bg-[#FCF4F5] hover:bg-purple-50 text-gray-700 border border-[#F4DDE2] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title="Calibrate Cycle Baseline"
                >
                  <Sliders className="w-4 h-4 text-[#936DA2]" />
                  <span className="hidden sm:inline">Baseline</span>
                </button>
              )}

              <button
                onClick={() => {
                  setPregnancyLmp(periodSettings?.lastPeriodStart || new Date().toISOString().split('T')[0]);
                  setShowPregnancyModal(true);
                }}
                className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#936DA2] border border-purple-200 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🤰 Maternity</span>
              </button>

              <button
                onClick={() => setShowLogCycleModal(true)}
                className="px-4 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-current" />
                <span>Log Period</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {periodErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{periodErrorMsg}</span>
          </div>
          <button 
            onClick={() => setPeriodErrorMsg(null)}
            className="text-red-500 hover:text-red-700 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MATERNITY VIEW (IF PREGNANT)                                       */}
      {/* ===================================================================== */}
      {isPregnant && periodMetrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-white via-purple-50/40 to-rose-50/30 rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                      🤰 Active Maternity Journey
                    </span>
                    <span className="text-xs font-bold text-gray-400">•</span>
                    <span className="text-xs font-bold text-[#936DA2]">
                      Menstrual Countdown Paused
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Healthy Gestation
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <span className="text-xs font-extrabold text-[#936DA2] uppercase tracking-wider">
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

              <div className="space-y-2 bg-white/90 p-4 rounded-2xl border border-purple-100 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-gray-600">Gestational Progress (40 Weeks)</span>
                  <span className="text-[#936DA2]">
                    {Math.min(100, Math.round(((periodMetrics.gestationalWeeks || 1) / 40) * 100))}% of pregnancy complete
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-[#936DA2]"
                    style={{ width: `${Math.min(100, Math.round(((periodMetrics.gestationalWeeks || 1) / 40) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                  <span>Conception / LMP ({periodMetrics.pregnancyStartDate || periodSettings?.pregnancyStartDate})</span>
                  <span>Estimated Due Date ({periodMetrics.edd})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Estimated Due Date</span>
                  <span className="text-sm font-black text-[#936DA2] mt-0.5 block">{periodMetrics.edd}</span>
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
                  <span className="text-[10px] text-gray-500">Anatomical milestone</span>
                </div>
              </div>
            </div>

            {/* Interactive Fetal Kick Counter */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-200 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#936DA2] flex items-center justify-center font-bold text-sm">
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
                  <div className="text-4xl font-black text-[#936DA2]">
                    {kickCount} <span className="text-sm text-gray-400 font-bold">/ 10 Kicks</span>
                  </div>
                  <p className="text-[11px] text-[#7a6f75] max-w-xs mx-auto">
                    ACOG recommends feeling 10 distinct movements within 2 hours. Tap the button each time you feel a movement.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isKickTimerRunning && kickCount === 0) setIsKickTimerRunning(true);
                      setKickCount(prev => Math.min(30, prev + 1));
                    }}
                    className="w-full py-4 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>+ Movement Felt</span>
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
                  onClick={() => {
                    setKickCount(0);
                    setKickTimerSeconds(0);
                    setIsKickTimerRunning(false);
                  }}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : !isPeriodTrackerConfigured ? (
        /* ===================================================================== */
        /* 3. INITIAL SETUP CALLOUT (IF NO DATA CONFIGURED YET)                   */
        /* ===================================================================== */
        <div className="bg-gradient-to-br from-purple-50 via-white to-rose-50 rounded-3xl p-8 border border-purple-200 shadow-sm text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-white text-[#936DA2] border border-purple-200 flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-xl text-[#3a3135]">Set Up Your Cycle Baseline</h3>
            <p className="text-xs text-[#7a6f75] leading-relaxed">
              Record the start date of your last period and typical cycle length. Our algorithm will calculate your active cycle phase, estimate your next period, and calculate your fertile window using your database records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSetupModal(true)}
            className="px-8 py-3.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Cycle Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* ===================================================================== */
        /* 4. MAIN PERIOD TRACKER TABS (CYCLE | CALENDAR | HISTORY | ANALYSIS)   */
        /* ===================================================================== */
        <div className="space-y-6">

          {/* SUB-NAVIGATION TAB BAR */}
          <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-1 overflow-x-auto gap-2">
            <div className="flex items-center gap-2">
              {[
                { key: 'cycle', label: 'Cycle Wheel', icon: Activity },
                { key: 'calendar', label: 'Menstrual Calendar', icon: Calendar },
                { key: 'history', label: 'Recorded Cycles', icon: Clock },
                { key: 'analysis', label: 'Insights & Trends', icon: BarChart3 },
                { key: 'settings', label: 'Reminders & Settings', icon: Settings },
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#936DA2] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-[#936DA2] border border-transparent'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => openDailyLogForDate(new Date().toISOString().split('T')[0])}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Log Daily Health</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: CYCLE WHEEL (CLUE-INSPIRED CIRCULAR INTERFACE)              */}
          {/* ================================================================= */}
          {activeTab === 'cycle' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* HERO CIRCLE WHEEL CARD (7 COLS) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm flex flex-col items-center justify-between relative overflow-hidden">
                  
                  {/* Top Mode Pill */}
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Your Current Cycle
                    </span>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#936DA2] text-[11px] font-bold">
                      <Droplet className="w-3 h-3 fill-current text-rose-500" />
                      <span>Mode: Menstrual Cycle</span>
                    </div>
                  </div>

                  {/* THE CIRCULAR CYCLE WHEEL (SVG) */}
                  <div className="relative my-2 flex items-center justify-center">
                    <svg
                      width={wheelData.size}
                      height={wheelData.size}
                      viewBox={`0 0 ${wheelData.size} ${wheelData.size}`}
                      className="transition-transform duration-700"
                    >
                      <defs>
                        {/* Period Gradient */}
                        <linearGradient id="periodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#BE123C" />
                          <stop offset="50%" stopColor="#E11D48" />
                          <stop offset="100%" stopColor="#FB7185" />
                        </linearGradient>

                        {/* Fertile Gradient */}
                        <linearGradient id="fertileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0D9488" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                      </defs>

                      {/* 1. Background Ring Track */}
                      <circle
                        cx={wheelData.center}
                        cy={wheelData.center}
                        r={wheelData.radius}
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth={wheelData.strokeWidth}
                        strokeLinecap="round"
                      />

                      {/* 2. Fertile Window Arc (Teal) */}
                      <path
                        d={wheelData.fertilePath}
                        fill="none"
                        stroke="url(#fertileGradient)"
                        strokeWidth={wheelData.strokeWidth}
                        strokeLinecap="round"
                        className="opacity-90"
                      />

                      {/* 3. Period Bleeding Arc (Rose Gradient) */}
                      <path
                        d={wheelData.periodPath}
                        fill="none"
                        stroke="url(#periodGradient)"
                        strokeWidth={wheelData.strokeWidth}
                        strokeLinecap="round"
                      />

                      {/* 4. Active Progression Arc Outline */}
                      <path
                        d={wheelData.progressPath}
                        fill="none"
                        stroke="#936DA2"
                        strokeWidth={3}
                        strokeDasharray="4 4"
                        className="opacity-60"
                      />

                      {/* 5. Ovulation Marker Dot in Fertile Arc */}
                      <circle
                        cx={wheelData.ovPos.x}
                        cy={wheelData.ovPos.y}
                        r={6}
                        fill="#FFFFFF"
                        stroke="#0D9488"
                        strokeWidth={3}
                      />

                      {/* 6. Period Droplet Icon at 12 o'clock */}
                      <circle
                        cx={wheelData.dropPos.x}
                        cy={wheelData.dropPos.y}
                        r={7}
                        fill="#BE123C"
                      />

                      {/* 7. Inner Symptom Log Dots */}
                      {dailyLogs.map((log) => {
                        if (!periodSettings?.lastPeriodStart) return null;
                        const start = new Date(periodSettings.lastPeriodStart);
                        const logD = new Date(log.date);
                        const diff = Math.round((logD.getTime() - start.getTime()) / 86400000);
                        if (diff < 0 || diff >= wheelData.cycleLen) return null;
                        const angle = diff * (360 / wheelData.cycleLen);
                        const rad = ((angle - 90) * Math.PI) / 180.0;
                        const dotR = wheelData.radius - 22;
                        const x = wheelData.center + dotR * Math.cos(rad);
                        const y = wheelData.center + dotR * Math.sin(rad);

                        return (
                          <circle
                            key={log.date}
                            cx={x}
                            cy={y}
                            r={3.5}
                            fill={log.isPeriodDay ? '#F43F5E' : '#936DA2'}
                            className="opacity-80"
                          />
                        );
                      })}
                    </svg>

                    {/* Floating "Day X" pill on perimeter */}
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-800 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md border border-gray-200 flex items-center gap-0.5"
                      style={{
                        left: `${wheelData.currentPos.x}px`,
                        top: `${wheelData.currentPos.y}px`
                      }}
                    >
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Day</span>
                      <span>{wheelData.currentDay}</span>
                    </div>

                    {/* CENTER INFORMATION CONTENT */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                      <span className="text-xs text-gray-400 font-semibold">
                        Today, {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>

                      {/* Main Countdown or Day Counter */}
                      {wheelData.isDelayed ? (
                        <div className="my-1.5">
                          <span className="text-2xl md:text-3xl font-black text-amber-600 tracking-tight block">
                            +{wheelData.daysDelayed} Days Late
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold">
                            Cycle running past expected {wheelData.cycleLen} days
                          </span>
                        </div>
                      ) : periodMetrics?.cycleDay && periodMetrics.cycleDay <= wheelData.duration ? (
                        <div className="my-1.5">
                          <span className="text-2xl md:text-3xl font-black text-rose-600 tracking-tight block">
                            Period Day {periodMetrics.cycleDay}
                          </span>
                          <span className="text-[11px] text-gray-500 font-semibold">
                            Day {periodMetrics.cycleDay} of {wheelData.duration} bleeding days
                          </span>
                        </div>
                      ) : (
                        <div className="my-1.5">
                          <span className="text-2xl md:text-3xl font-black text-[#3a3135] tracking-tight block">
                            {predictions?.daysUntilPeriod !== undefined 
                              ? `${predictions.daysUntilPeriod} days` 
                              : `${Math.max(0, wheelData.cycleLen - wheelData.currentDay)} days`}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            until your next period
                          </span>
                        </div>
                      )}

                      {/* Phase Badge */}
                      <span className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        periodMetrics?.phaseColor === 'rose'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : periodMetrics?.phaseColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-purple-50 text-[#936DA2] border-purple-200'
                      }`}>
                        {periodMetrics?.phaseName || 'Luteal Phase'}
                      </span>
                    </div>
                  </div>

                  {/* HOW DO YOU FEEL TODAY? QUICK LOG CARD (MATCHING REFERENCE IMAGE) */}
                  <div
                    onClick={() => openDailyLogForDate(new Date().toISOString().split('T')[0])}
                    className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-rose-50 to-purple-50 border border-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-400 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
                        😊
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm text-[#3a3135] block">
                          How do you feel today?
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {todayDailyLog ? (
                            <>Logged: {todayDailyLog.mood} • {todayDailyLog.symptoms?.length || 0} symptoms recorded</>
                          ) : (
                            <>Tap to log cramps, mood, energy & flow for today</>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-2xs group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>

                {/* SIDE STATS & CLINICAL PREDICTOR SUMMARY (5 COLS) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Key Cycle Dates Box */}
                  <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#936DA2]" />
                        <span>Cadence & Estimates</span>
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400">
                        {historicalStats?.confidenceLevel || 'Active'} Confidence
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase block">Next Expected Period</span>
                          <span className="text-sm font-black text-[#936DA2] mt-0.5 block">
                            {predictions?.nextPeriodStartDate || periodMetrics?.nextPeriodDateStr || 'Pending calculation'}
                          </span>
                          {predictions?.predictionRangeStart && (
                            <span className="text-[10px] text-gray-500">
                              Estimated Range: {predictions.predictionRangeStart} to {predictions.predictionRangeEnd}
                            </span>
                          )}
                        </div>
                        <Droplet className="w-5 h-5 text-rose-500" />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase block">Estimated Ovulation</span>
                          <span className="text-sm font-black text-teal-800 mt-0.5 block">
                            {predictions?.estimatedOvulationDate || periodMetrics?.ovulationDateStr || 'Day 14 of cycle'}
                          </span>
                          <span className="text-[10px] text-teal-700">
                            Fertile Window: {predictions?.fertileWindowStartDate || 'Day 9'} – {predictions?.fertileWindowEndDate || 'Day 15'}
                          </span>
                        </div>
                        <Sparkles className="w-5 h-5 text-teal-600" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block">Avg Cycle</span>
                          <span className="text-sm font-black text-gray-800 mt-0.5 block">
                            {historicalStats?.averageCycleLength || periodSettings?.cycleLength || 28} Days
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block">Bleeding Duration</span>
                          <span className="text-sm font-black text-gray-800 mt-0.5 block">
                            {historicalStats?.averagePeriodDuration || periodSettings?.periodDuration || 5} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delay Warning if running late */}
                    {wheelData.isDelayed && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Period Delayed by +{wheelData.daysDelayed} Days</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Your cycle has exceeded your standard cadence. You can calibrate the expected delay or log your period when bleeding starts.
                        </p>
                        <button
                          onClick={() => setShowDelayModal(true)}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold text-[11px] cursor-pointer"
                        >
                          Calibrate Delay
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mental Wellness Affirmation & Daily Tip */}
                  <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs">
                          ♥
                        </div>
                        <h4 className="font-bold text-xs text-[#3a3135]">Hormonal Rhythm Affirmation</h4>
                      </div>
                      <blockquote className="p-3 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] text-xs text-gray-700 italic leading-relaxed">
                        "{menstrualAffirmation || 'Your body is performing delicate, vital biological work. Be gentle with your energy and honor your rest.'}"
                      </blockquote>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{activeTip.icon}</span>
                        <div>
                          <span className="font-bold text-gray-800 block">{activeTip.title}</span>
                          <span className="text-[10px] text-gray-500">{activeTip.tip}</span>
                        </div>
                      </div>
                      <button
                        onClick={nextRandomTip}
                        className="p-1.5 text-[#936DA2] hover:bg-purple-50 rounded-lg cursor-pointer"
                        title="Next tip"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* CLINICAL SAFETY DISCLAIMER BANNER */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-[#936DA2] flex items-start gap-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#936DA2]" />
                <p className="leading-relaxed text-[11px] text-purple-900">
                  <b>Clinical Disclaimer:</b> Predictions, ovulation estimates, and fertile windows are calculated purely from your recorded dates and standard gynecological intervals. Biological variation occurs naturally. Calendar predictions must <b>NOT</b> be used as a method of contraception or as guaranteed medical certainty.
                </p>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: INTERACTIVE MENSTRUAL CALENDAR                              */}
          {/* ================================================================= */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CALENDAR GRID (8 COLS) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
                  
                  {/* Calendar Month Navigation Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-xl text-[#3a3135]">
                        {currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h2>
                      <p className="text-xs text-gray-400">Select any day to view or record menstrual and symptom data</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const prev = new Date(currentCalendarDate);
                          prev.setMonth(prev.getMonth() - 1);
                          setCurrentCalendarDate(prev);
                        }}
                        className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-[#936DA2] cursor-pointer"
                        title="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentCalendarDate(new Date())}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Today
                      </button>

                      <button
                        onClick={() => {
                          const next = new Date(currentCalendarDate);
                          next.setMonth(next.getMonth() + 1);
                          setCurrentCalendarDate(next);
                        }}
                        className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-[#936DA2] cursor-pointer"
                        title="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 text-center font-bold text-[11px] text-gray-400 uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Days Matrix */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarMonthData.map((dayItem, idx) => {
                      const isSelected = dayItem.dateStr === selectedCalendarDate;
                      
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedCalendarDate(dayItem.dateStr)}
                          className={`min-h-[64px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                            isSelected
                              ? 'ring-2 ring-[#936DA2] border-[#936DA2] bg-purple-50/40 shadow-xs'
                              : dayItem.isCurrentMonth
                              ? 'bg-white hover:bg-gray-50/80 border-gray-100'
                              : 'bg-gray-50/40 opacity-40 border-transparent'
                          }`}
                        >
                          {/* Day Number and Today Ring */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                              dayItem.isToday
                                ? 'bg-[#936DA2] text-white shadow-xs'
                                : dayItem.isRecordedPeriod
                                ? 'text-rose-700 font-black'
                                : 'text-gray-700'
                            }`}>
                              {dayItem.dayNumber}
                            </span>

                            {/* Small Ovulation Sparkle */}
                            {dayItem.isOvulationDay && (
                              <span className="w-2 h-2 rounded-full bg-teal-500" title="Estimated Ovulation" />
                            )}
                          </div>

                          {/* Indicators on Day Cell */}
                          <div className="flex flex-col gap-1 mt-1">
                            {/* Recorded Period Pill */}
                            {dayItem.isRecordedPeriod && (
                              <div className="h-2 rounded-full bg-rose-500 shadow-2xs flex items-center justify-center" title="Recorded Period" />
                            )}

                            {/* Predicted Period Pill */}
                            {!dayItem.isRecordedPeriod && dayItem.isPredictedPeriod && (
                              <div className="h-2 rounded-full border border-dashed border-rose-400 bg-rose-100" title="Predicted Period" />
                            )}

                            {/* Fertile Window Underlay */}
                            {!dayItem.isRecordedPeriod && !dayItem.isPredictedPeriod && dayItem.isFertileWindow && (
                              <div className="h-1.5 rounded-full bg-teal-200" title="Fertile Window" />
                            )}

                            {/* Daily Log Dot */}
                            {dayItem.hasDailyLog && (
                              <div className="flex justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#936DA2]" title="Daily Symptoms Logged" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ACCESSIBLE CALENDAR LEGEND */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                      <span className="font-semibold text-[11px]">Recorded Period</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-dashed border-rose-400 bg-rose-100" />
                      <span className="font-semibold text-[11px]">Predicted Period</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-teal-300" />
                      <span className="font-semibold text-[11px]">Fertile Window</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-teal-500" />
                      <span className="font-semibold text-[11px]">Ovulation Day</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#936DA2]" />
                      <span className="font-semibold text-[11px]">Symptoms Logged</span>
                    </div>
                  </div>

                </div>

                {/* SELECTED DATE DETAILS & QUICK LOG (4 COLS) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Selected Date</span>
                      <h3 className="font-bold text-base text-[#3a3135]">
                        {new Date(selectedCalendarDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h3>
                    </div>

                    <button
                      onClick={() => openDailyLogForDate(selectedCalendarDate)}
                      className="px-3 py-1.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{selectedDateLog ? 'Edit Log' : 'Log Day'}</span>
                    </button>
                  </div>

                  {/* Date Status Badges */}
                  <div className="space-y-3 text-xs">
                    {/* Period Status */}
                    {selectedDateCycle || selectedDateLog?.isPeriodDay ? (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <Droplet className="w-4 h-4 text-rose-600 fill-current" />
                          <span>Period Day Recorded</span>
                        </div>
                        <p className="text-[11px] text-rose-800">
                          Flow intensity: <b>{selectedDateLog?.flowIntensity || selectedDateCycle?.flowIntensity || 'Recorded'}</b>
                        </p>
                      </div>
                    ) : predictions?.estimatedOvulationDate === selectedCalendarDate ? (
                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-1">
                        <div className="flex items-center gap-2 font-bold">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          <span>Estimated Ovulation Day</span>
                        </div>
                        <p className="text-[11px] text-teal-800">
                          LH hormone surge estimate. Not contraception advice.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700">
                        <span className="font-semibold block">Non-Bleeding Phase</span>
                        <span className="text-[11px] text-gray-500">No menstrual bleeding recorded on this date.</span>
                      </div>
                    )}

                    {/* Recorded Symptoms Snapshot */}
                    {selectedDateLog ? (
                      <div className="space-y-3 pt-2">
                        <span className="font-bold text-gray-700 block">Logged Daily Health:</span>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                            <span className="text-gray-400 block text-[9px] uppercase font-bold">Mood</span>
                            <span className="font-bold text-[#936DA2]">{selectedDateLog.mood || 'Calm'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                            <span className="text-gray-400 block text-[9px] uppercase font-bold">Energy</span>
                            <span className="font-bold text-[#936DA2]">{selectedDateLog.energyLevel || 'Medium'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                            <span className="text-gray-400 block text-[9px] uppercase font-bold">Sleep</span>
                            <span className="font-bold text-[#936DA2]">{selectedDateLog.sleepQuality || 'Good'}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                            <span className="text-gray-400 block text-[9px] uppercase font-bold">Mucus</span>
                            <span className="font-bold text-[#936DA2]">{selectedDateLog.cervicalMucus || 'None'}</span>
                          </div>
                        </div>

                        {/* Symptoms Pills */}
                        {Array.isArray(selectedDateLog.symptoms) && selectedDateLog.symptoms.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Symptoms Felt</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedDateLog.symptoms.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-100 text-[#936DA2] text-[10px] font-semibold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {selectedDateLog.notes && (
                          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 italic">
                            "{selectedDateLog.notes}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-400">
                        No symptoms logged for this date. Tap "Log Day" to record how you felt.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: RECORDED CYCLES HISTORY (EDIT & DELETE CAPABILITY)          */}
          {/* ================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="font-bold text-xl text-[#3a3135]">
                      Recorded Cycle History & Records
                    </h2>
                    <p className="text-xs text-gray-500">
                      Manage past menstrual cycle start dates, durations, and flow. Edits dynamically recalibrate cycle baselines.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLogCycleModal(true)}
                    className="px-4 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Past Cycle</span>
                  </button>
                </div>

                {/* History Table */}
                {cycleHistory.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Clock className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-xs text-gray-500">
                      No cycle records found. Tap "Log Past Cycle" to record your history.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                          <th className="py-3 px-3">Start Date</th>
                          <th className="py-3 px-3">Bleeding Duration</th>
                          <th className="py-3 px-3">Cycle Gap</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">Flow</th>
                          <th className="py-3 px-3">Symptoms</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cycleHistory.map((cycle) => (
                          <tr key={cycle.id} className="hover:bg-[#FCF4F5] transition-colors">
                            <td className="py-3.5 px-3 font-bold text-[#3a3135]">
                              {cycle.startDate}
                            </td>
                            <td className="py-3.5 px-3 font-medium">
                              {cycle.durationDays} Days
                            </td>
                            <td className="py-3.5 px-3 font-medium">
                              {cycle.cycleLengthDays} Days
                            </td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                cycle.status.includes('Early')
                                  ? 'bg-rose-100 text-rose-800'
                                  : cycle.status.includes('Delayed')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {cycle.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-gray-700">
                              {cycle.flowIntensity || 'Medium'}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(cycle.symptoms) ? cycle.symptoms : []).slice(0, 2).map((s, i) => (
                                  <span key={i} className="bg-purple-50 text-[#936DA2] px-1.5 py-0.5 rounded text-[10px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingCycle(cycle);
                                    setEditCycleForm({
                                      startDate: cycle.startDate,
                                      durationDays: cycle.durationDays,
                                      cycleLengthDays: cycle.cycleLengthDays,
                                      flowIntensity: cycle.flowIntensity || 'Medium',
                                      symptoms: Array.isArray(cycle.symptoms) ? cycle.symptoms : [],
                                      mood: cycle.mood || 'Calm'
                                    });
                                  }}
                                  className="p-1.5 text-gray-500 hover:text-[#936DA2] hover:bg-purple-50 rounded-lg cursor-pointer"
                                  title="Edit Cycle Record"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingCycleId(cycle.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  title="Delete Cycle Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: HEALTH INSIGHTS, TRENDS & CHARTS                            */}
          {/* ================================================================= */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Stats Summary Cards */}
                <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recorded History</span>
                  <div className="text-3xl font-black text-[#936DA2]">
                    {historicalStats?.recordedCyclesCount || cycleHistory.length} Cycles
                  </div>
                  <p className="text-xs text-gray-500">
                    Statistics calculated dynamically from your actual recorded inter-cycle gaps in PostgreSQL database.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cycle Variability</span>
                  <div className="text-3xl font-black text-[#3a3135]">
                    ±{historicalStats?.cycleVariabilityDays ?? 0} Days
                  </div>
                  <p className="text-xs text-gray-500">
                    {historicalStats?.isIrregular 
                      ? 'Variability > 7 days indicates possible cycle irregularity.'
                      : 'Consistent cycle variation within regular physiological norms.'}
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Prediction Confidence</span>
                  <div className="text-3xl font-black text-emerald-800">
                    {historicalStats?.confidenceLevel || 'Moderate'}
                  </div>
                  <p className="text-xs text-gray-500">
                    Confidence improves as additional cycles are recorded over multiple months.
                  </p>
                </div>

              </div>

              {/* CHARTS CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Cycle Length Trends Bar Chart */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#3a3135]">Cycle Length Trends</h3>
                      <p className="text-[11px] text-gray-400">Duration in days between consecutive period start dates</p>
                    </div>
                    <span className="text-xs font-bold text-[#936DA2]">
                      Avg: {historicalStats?.averageCycleLength || 28}d
                    </span>
                  </div>

                  {cycleHistory.length < 2 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      Record at least 2 menstrual cycles to view cycle length trends.
                    </div>
                  ) : (
                    <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-[#FCF4F5] rounded-2xl border border-purple-100">
                      {cycleHistory.slice(-6).map((c, idx) => {
                        const len = c.cycleLengthDays || 28;
                        const maxLen = 45;
                        const heightPct = Math.min(100, Math.max(15, (len / maxLen) * 100));

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <span className="text-[10px] font-bold text-gray-700">{len}d</span>
                            <div 
                              className="w-full max-w-[36px] bg-gradient-to-t from-[#936DA2] to-purple-400 rounded-t-xl transition-all hover:opacity-90"
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[9px] text-gray-400 font-semibold truncate w-full text-center">
                              {c.startDate.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Bleeding Duration Trends */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-[#3a3135]">Period Duration Trends</h3>
                      <p className="text-[11px] text-gray-400">Bleeding days per recorded cycle</p>
                    </div>
                    <span className="text-xs font-bold text-rose-600">
                      Avg: {historicalStats?.averagePeriodDuration || 5}d
                    </span>
                  </div>

                  {cycleHistory.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      No period duration records available yet.
                    </div>
                  ) : (
                    <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-rose-50/30 rounded-2xl border border-rose-100">
                      {cycleHistory.slice(-6).map((c, idx) => {
                        const dur = c.durationDays || 5;
                        const maxDur = 10;
                        const heightPct = Math.min(100, Math.max(20, (dur / maxDur) * 100));

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <span className="text-[10px] font-bold text-rose-700">{dur}d</span>
                            <div 
                              className="w-full max-w-[36px] bg-gradient-to-t from-rose-500 to-rose-300 rounded-t-xl transition-all hover:opacity-90"
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[9px] text-gray-400 font-semibold truncate w-full text-center">
                              {c.startDate.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* 3. Top Symptoms & Mood Distribution */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-[#3a3135]">Most Frequent Recorded Symptoms</h3>
                  <span className="text-xs text-gray-400">Across daily logs and cycles</span>
                </div>

                {insightsData?.trends?.topSymptoms && insightsData.trends.topSymptoms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {insightsData.trends.topSymptoms.map((sym: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-800">{sym.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#936DA2] font-black text-[10px]">
                          {sym.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400">
                    Log daily symptoms to build your personal symptom frequency profile.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: REMINDERS & SETTINGS                                        */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Reminders Preferences Form */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#936DA2] flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-[#3a3135]">Period & Cycle Reminders</h2>
                    <p className="text-xs text-gray-400">Configure notifications for upcoming periods and tracking</p>
                  </div>
                </div>

                <form onSubmit={onSaveReminders} className="space-y-5 text-xs">
                  {/* Toggle 1: Upcoming Period Reminder */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2]">
                    <div>
                      <span className="font-bold text-gray-800 block">Upcoming Period Reminder</span>
                      <span className="text-[11px] text-gray-500">Alert me prior to estimated period start date</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={reminderForm.periodEnabled}
                      onChange={(e) => setReminderForm({ ...reminderForm, periodEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#936DA2] cursor-pointer"
                    />
                  </div>

                  {/* Days Before Selector */}
                  {reminderForm.periodEnabled && (
                    <div className="pl-4 space-y-1.5">
                      <label className="font-bold text-gray-700 block">Notify me before:</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 5].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setReminderForm({ ...reminderForm, periodDaysBefore: d })}
                            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                              reminderForm.periodDaysBefore === d
                                ? 'bg-[#936DA2] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {d} Days Before
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Toggle 2: Ovulation Reminder */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2]">
                    <div>
                      <span className="font-bold text-gray-800 block">Estimated Ovulation Reminder</span>
                      <span className="text-[11px] text-gray-500">Notify during peak estimated fertile window</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={reminderForm.ovulationEnabled}
                      onChange={(e) => setReminderForm({ ...reminderForm, ovulationEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#936DA2] cursor-pointer"
                    />
                  </div>

                  {/* Toggle 3: Daily Logging Reminder */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2]">
                    <div>
                      <span className="font-bold text-gray-800 block">Daily Health Logging Prompt</span>
                      <span className="text-[11px] text-gray-500">Gentle evening prompt to log mood & physical symptoms</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={reminderForm.dailyLoggingEnabled}
                      onChange={(e) => setReminderForm({ ...reminderForm, dailyLoggingEnabled: e.target.checked })}
                      className="w-4 h-4 accent-[#936DA2] cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingReminders}
                      className="px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold cursor-pointer shadow-sm flex items-center gap-2"
                    >
                      {isSavingReminders && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Save Reminder Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Cycle Baseline Recalibration Link */}
              <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#3a3135]">Cycle Baseline Calibration</h3>
                  <p className="text-xs text-gray-400">Current baseline: {periodSettings?.cycleLength || 28}d cycle, {periodSettings?.periodDuration || 5}d duration</p>
                </div>
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
                  className="px-4 py-2 border border-[#F4DDE2] hover:bg-purple-50 text-[#936DA2] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Adjust Baseline
                </button>
              </div>

              {/* Clinical Safety & Medical Attention Guidance */}
              <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-3 text-xs text-gray-700">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <Stethoscope className="w-4 h-4 text-rose-600" />
                  <span>When to Seek Medical Evaluation</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-600">
                  FemSphere tracks your reproductive cycle for personal lifestyle insight. Please consult a qualified gynecologist or healthcare provider if you experience:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-gray-600">
                  <li>Sudden absence of periods (amenorrhea) for 90+ days when not pregnant</li>
                  <li>Bleeding lasting longer than 8 consecutive days or unusually heavy flow (soaking through pads/tampons in 1-2 hours)</li>
                  <li>Severe pelvic pain that interferes with daily tasks or does not respond to standard pain relief</li>
                  <li>Bleeding between cycles or after intercourse</li>
                </ul>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* GLOBAL MODALS                                                         */}
      {/* ===================================================================== */}

      {/* 1. SETUP / BASELINE MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#F4DDE2] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#936DA2]" />
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
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
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
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
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
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
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
                  className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all"
                >
                  Save Baseline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOG NEW CYCLE MODAL */}
      {showLogCycleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#F4DDE2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600 fill-current" />
                <h3 className="font-bold text-base text-[#3a3135]">Log Menstrual Period Cycle</h3>
              </div>
              <button 
                onClick={() => setShowLogCycleModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onLogCycleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={cycleLogForm.startDate}
                    onChange={(e) => setCycleLogForm({ ...cycleLogForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Duration (Days of Bleeding)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={cycleLogForm.durationDays}
                    onChange={(e) => setCycleLogForm({ ...cycleLogForm, durationDays: parseInt(e.target.value, 10) || 5 })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Spotting', 'Light', 'Medium', 'Heavy'].map((flow) => (
                    <button
                      key={flow}
                      type="button"
                      onClick={() => setCycleLogForm({ ...cycleLogForm, flowIntensity: flow })}
                      className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        cycleLogForm.flowIntensity === flow
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
                <label className="block font-bold text-gray-700 mb-1">Symptoms Felt</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map((sym) => {
                    const isSelected = cycleLogForm.symptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setCycleLogForm({ ...cycleLogForm, symptoms: cycleLogForm.symptoms.filter(s => s !== sym) });
                          } else {
                            setCycleLogForm({ ...cycleLogForm, symptoms: [...cycleLogForm.symptoms, sym] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#936DA2] text-white shadow-xs'
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
                <label className="block font-bold text-gray-700 mb-1">Mood</label>
                <select
                  value={cycleLogForm.mood}
                  onChange={(e) => setCycleLogForm({ ...cycleLogForm, mood: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                >
                  {moodOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowLogCycleModal(false)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all"
                >
                  Save Cycle Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT CYCLE MODAL */}
      {editingCycle && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#F4DDE2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#936DA2]" />
                <h3 className="font-bold text-base text-[#3a3135]">Correct Cycle Record</h3>
              </div>
              <button 
                onClick={() => setEditingCycle(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onEditCycleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={editCycleForm.startDate}
                    onChange={(e) => setEditCycleForm({ ...editCycleForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={editCycleForm.durationDays}
                    onChange={(e) => setEditCycleForm({ ...editCycleForm, durationDays: parseInt(e.target.value, 10) || 5 })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Spotting', 'Light', 'Medium', 'Heavy'].map((flow) => (
                    <button
                      key={flow}
                      type="button"
                      onClick={() => setEditCycleForm({ ...editCycleForm, flowIntensity: flow })}
                      className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        editCycleForm.flowIntensity === flow
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCycle(null)}
                  className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DELETE CYCLE CONFIRMATION MODAL */}
      {deletingCycleId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-red-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Delete Cycle Record?</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete this recorded cycle? Deleting will remove it permanently and automatically recalibrate your historical predictions.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCycleId(null)}
                className="py-2 px-4 rounded-xl border text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteCycle}
                className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DAILY HEALTH & SYMPTOM LOGGING MODAL */}
      {showDailyLogModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#F4DDE2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base text-[#3a3135]">
                  Daily Health Log • {dailyLogForm.date}
                </h3>
              </div>
              <button 
                onClick={() => setShowDailyLogModal(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmitDailyLog} className="space-y-4 text-xs">
              {/* Date Selector */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Logging Date</label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={dailyLogForm.date}
                  onChange={(e) => openDailyLogForDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  required
                />
              </div>

              {/* Period Day & Flow Intensity */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-rose-600 fill-current" />
                    <span className="font-bold text-gray-800">Menstrual Flow on this Date</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyLogForm.isPeriodDay}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setDailyLogForm({
                        ...dailyLogForm,
                        isPeriodDay: isChecked,
                        flowIntensity: isChecked ? (dailyLogForm.flowIntensity === 'None' ? 'Medium' : dailyLogForm.flowIntensity) : 'None'
                      });
                    }}
                    className="w-4 h-4 accent-rose-600 cursor-pointer"
                  />
                </div>

                {dailyLogForm.isPeriodDay && (
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {['Spotting', 'Light', 'Medium', 'Heavy'].map((flow) => (
                      <button
                        key={flow}
                        type="button"
                        onClick={() => setDailyLogForm({ ...dailyLogForm, flowIntensity: flow })}
                        className={`py-1.5 rounded-xl font-bold text-[11px] cursor-pointer transition-all ${
                          dailyLogForm.flowIntensity === flow
                            ? 'bg-rose-500 text-white shadow-2xs'
                            : 'bg-white text-gray-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {flow}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Physical Symptoms */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Physical Symptoms</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map((sym) => {
                    const isSelected = Array.isArray(dailyLogForm.symptoms) && dailyLogForm.symptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(dailyLogForm.symptoms) ? dailyLogForm.symptoms : [];
                          if (isSelected) {
                            setDailyLogForm({ ...dailyLogForm, symptoms: current.filter(s => s !== sym) });
                          } else {
                            setDailyLogForm({ ...dailyLogForm, symptoms: [...current, sym] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#936DA2] text-white shadow-xs'
                            : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood & Energy Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Emotional Mood</label>
                  <select
                    value={dailyLogForm.mood}
                    onChange={(e) => setDailyLogForm({ ...dailyLogForm, mood: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  >
                    {moodOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Energy Level</label>
                  <select
                    value={dailyLogForm.energyLevel || 'Medium'}
                    onChange={(e) => setDailyLogForm({ ...dailyLogForm, energyLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  >
                    {energyOptions.map(eOpt => (
                      <option key={eOpt} value={eOpt}>{eOpt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sleep Quality & Cervical Mucus Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sleep Quality</label>
                  <select
                    value={dailyLogForm.sleepQuality || 'Good'}
                    onChange={(e) => setDailyLogForm({ ...dailyLogForm, sleepQuality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  >
                    {sleepOptions.map(sOpt => (
                      <option key={sOpt} value={sOpt}>{sOpt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cervical Mucus</label>
                  <select
                    value={dailyLogForm.cervicalMucus || 'None'}
                    onChange={(e) => setDailyLogForm({ ...dailyLogForm, cervicalMucus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  >
                    {mucusOptions.map(mOpt => (
                      <option key={mOpt} value={mOpt}>{mOpt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Daily Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional observations about hydration, stress, medications..."
                  value={dailyLogForm.notes || ''}
                  onChange={(e) => setDailyLogForm({ ...dailyLogForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {dailyLogs.some(l => l.date === dailyLogForm.date) ? (
                  <button
                    type="button"
                    onClick={onDeleteDailyLog}
                    className="py-2.5 px-3 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Log</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDailyLogModal(false)}
                    className="py-2.5 px-4 rounded-xl border font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all"
                  >
                    Save Daily Log
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CALIBRATE CYCLE DELAY MODAL */}
      {showDelayModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4DDE2] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
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

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!periodSettings) return;
              const newLen = periodSettings.cycleLength + extendDays;
              const success = await handleAdjustCycleDelay(newLen, extendDays);
              if (success) setShowDelayModal(false);
            }} className="space-y-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                If your cycle is running longer this month due to stress, travel, or hormonal shifts, you can extend your expected cycle duration to recalibrate predictions.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Extend expected cycle by:</label>
                <div className="flex items-center gap-2">
                  {[2, 3, 5, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        extendDays === d
                          ? 'bg-[#936DA2] text-white shadow-xs'
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
                  className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all"
                >
                  Confirm Recalibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ACTIVATE PREGNANCY / MATERNITY MODAL */}
      {showPregnancyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-purple-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#936DA2] flex items-center justify-center font-bold">
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
                  When you activate Maternity Mode, menstrual cycle countdowns and predictions will be safely paused. You will receive trimester milestones, weekly fetal growth metrics, an interactive kick counter, and prenatal visit checklists.
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
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
                  required
                />
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
                  className="py-2.5 px-6 rounded-xl bg-[#936DA2] text-white font-bold hover:bg-[#835A92] cursor-pointer shadow-sm transition-all flex items-center gap-2"
                >
                  {isSubmittingPregnancy && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Activate Maternity Mode</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. RESUME CYCLE / CONCLUDE PREGNANCY MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  🔄
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#3a3135]">Resume Menstrual Tracking</h3>
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
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] font-medium outline-none focus:border-[#936DA2]"
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
