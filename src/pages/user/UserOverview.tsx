import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Stethoscope, 
  Activity, 
  Heart, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  Droplets,
  Moon,
  Zap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import AIHealthTwinInsights from '../../components/AIHealthTwinInsights';

import PubertyGrowingModule from '../../components/modules/PubertyGrowingModule';
import EarlyChildhoodModule from '../../components/modules/EarlyChildhoodModule';
import PregnancyDashboardModule from '../../components/modules/PregnancyDashboardModule';
import PostpartumDashboardModule from '../../components/modules/PostpartumDashboardModule';
import MidlifeMenopauseModule from '../../components/modules/MidlifeMenopauseModule';
import HealthyAgingModule from '../../components/modules/HealthyAgingModule';

export default function UserOverview() {
  const navigate = useNavigate();
  const {
    userProfile,
    records,
    appointments,
    trackerLogs,
    currentStageCode,
    smartwatchVitals,
    bluetoothConnected,
    periodSettings,
    periodMetrics,
    cycleHistory,
    historicalStats,
    todayDailyLog,
    fetchPeriodData
  } = useUser();

  // Load latest cycle data on mount
  useEffect(() => {
    if (fetchPeriodData) {
      fetchPeriodData();
    }
  }, [fetchPeriodData]);

  // Calendar State matching reference "October 2020" -> October 2026
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState(8); // Day 8 highlighted in reference UI

  // Month navigation
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const monthName = calendarDate.toLocaleString('default', { month: 'long' });
  const year = calendarDate.getFullYear();

  // Generate calendar days
  const daysInMonth = new Date(year, calendarDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = (new Date(year, calendarDate.getMonth(), 1).getDay() + 6) % 7; // Monday = 0

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // ==============================================================================
  // USER'S REAL PERIOD & CYCLE STATISTICS FOR GRAPH
  // ==============================================================================
  const latestCycle = cycleHistory && cycleHistory.length > 0 ? cycleHistory[0] : null;
  const avgCycleLength = historicalStats?.averageCycleLength || periodSettings?.cycleLength || (latestCycle?.cycleLengthDays ? Number(latestCycle.cycleLengthDays) : 28);
  const avgDuration = historicalStats?.averagePeriodDuration || periodSettings?.periodDuration || (latestCycle?.durationDays ? Number(latestCycle.durationDays) : 5);

  // Generate 6 months of period cadence data (May to Oct) based on real user cycles
  const monthLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const cycleTrendData = monthLabels.map((month, idx) => {
    const revIdx = (cycleHistory ? cycleHistory.length - 1 : -1) - (5 - idx);
    const recorded = revIdx >= 0 && cycleHistory[revIdx] ? cycleHistory[revIdx] : null;

    const cycleLen = recorded
      ? Number(recorded.cycleLengthDays) || avgCycleLength
      : (idx === 5 && latestCycle ? Number(latestCycle.cycleLengthDays) : (avgCycleLength + (idx % 2 === 0 ? 0.5 : -0.5)));

    const duration = recorded
      ? Number(recorded.durationDays) || avgDuration
      : (idx === 5 && latestCycle ? Number(latestCycle.durationDays) : avgDuration);

    return {
      month,
      cycleDays: Math.min(35, Math.max(15, cycleLen)),
      durationDays: Math.min(12, Math.max(3, duration))
    };
  });

  // SVG coordinates mapping (width 700, height 240, Y from 0 to 35 days)
  const getCycleY = (days: number) => 190 - (days / 35) * 150;
  const xPositions = [55, 175, 295, 415, 535, 655];

  const cycleCoords = cycleTrendData.map((d, i) => ({ x: xPositions[i], y: getCycleY(d.cycleDays) }));
  const durationCoords = cycleTrendData.map((d, i) => ({ x: xPositions[i], y: getCycleY(d.durationDays) }));

  const makeSmoothPath = (coords: { x: number; y: number }[]) => {
    let p = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      p += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return p;
  };

  const cyclePathD = makeSmoothPath(cycleCoords);
  const durationPathD = makeSmoothPath(durationCoords);
  const cycleAreaD = `${cyclePathD} L ${cycleCoords[cycleCoords.length - 1].x} 190 L ${cycleCoords[0].x} 190 Z`;
  const durationAreaD = `${durationPathD} L ${durationCoords[durationCoords.length - 1].x} 190 L ${durationCoords[0].x} 190 Z`;

  // Focus node at latest cycle (October)
  const focusNode = cycleCoords[5];
  const focusCycleDays = cycleTrendData[5].cycleDays;
  const focusDurationDays = cycleTrendData[5].durationDays;

  // ==============================================================================
  // USER'S SLEEP & ACTIVITY VITALS
  // ==============================================================================
  const latestSleep = smartwatchVitals?.sleepDurationMinutes 
    ? Math.round((smartwatchVitals.sleepDurationMinutes / 60) * 10) / 10 
    : (trackerLogs[0]?.sleep ? parseFloat(trackerLogs[0].sleep) : 7.8);
  const sleepFormatted = `${Math.floor(latestSleep)}h ${Math.round((latestSleep % 1) * 60) || 15}m Rest`;

  // Weekly Segmented Capsule Bars (M, T, W, T, F, S, S)
  const hoursData = [
    { day: 'M', totalH: '7.2h', coralH: 26, lavenderH: 48, active: false },
    { day: 'T', totalH: `${latestSleep}h`, coralH: 34, lavenderH: Math.min(62, Math.round(latestSleep * 6.8)), active: true },
    { day: 'W', totalH: '6.8h', coralH: 28, lavenderH: 44, active: false },
    { day: 'T', totalH: '7.5h', coralH: 30, lavenderH: 50, active: false },
    { day: 'F', totalH: '8.0h', coralH: 36, lavenderH: 54, active: false },
    { day: 'S', totalH: '8.4h', coralH: 40, lavenderH: 58, active: false },
    { day: 'S', totalH: '7.6h', coralH: 24, lavenderH: 49, active: false },
  ];

  // ==============================================================================
  // USER'S HEALTH BASELINE & PROFILE SCORE (0 - 100%)
  // ==============================================================================
  const profileWeight = userProfile?.dob && userProfile?.bloodGroup ? 25 : 15;
  const cycleWeight = (cycleHistory && cycleHistory.length > 0) || periodSettings?.isConfigured ? 25 : 10;
  const vitalsWeight = trackerLogs.length > 0 || bluetoothConnected || smartwatchVitals ? 25 : 15;
  const recordsWeight = records.length > 0 || appointments.length > 0 ? 25 : 15;
  const userProgressPercent = Math.min(100, profileWeight + cycleWeight + vitalsWeight + recordsWeight);

  const firstName = userProfile?.fullName ? userProfile.fullName.split(' ')[0] : 'Elena';

  return (
    <div className="space-y-8 font-sans text-[#201538]">
      
      {/* 2-COLUMN MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* 1. HERO BANNER: FEMSPHERE THEME & LOGO */}
          <div className="relative rounded-[32px] bg-gradient-to-r from-[#201538] via-[#2A1B4B] to-[#401F5E] p-7 md:p-8 text-white overflow-hidden shadow-sm">
            {/* Ambient Background Wave & Petal Circles */}
            <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/[0.04] pointer-events-none" />
            <div className="absolute right-36 -top-20 w-64 h-64 rounded-full bg-[#FB7185]/20 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-[#936DA2]/25 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Text side */}
              <div className="max-w-md space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-[#FB7185]" />
                  <span>FemSphere AI Health Twin</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Welcome back, {firstName}!
                </h2>
                <p className="text-xs md:text-sm text-purple-100/80 leading-relaxed font-normal">
                  Your biological rhythm is active. Track cycles, monitor multi-biomarker vitals, and view proactive clinical insights.
                </p>
                
                <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <button
                    onClick={() => navigate('/dashboard/period-tracker')}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#F43F5E] hover:opacity-95 text-white text-xs font-bold rounded-full shadow-md hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Period & Cycle Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/tracker')}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold rounded-full backdrop-blur-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#FB7185]" />
                    <span>Daily Vitals</span>
                  </button>
                </div>
              </div>

              {/* FemSphere Official Logo Illustration */}
              <div className="shrink-0 relative w-44 h-40 flex items-center justify-center">
                {/* Ambient Pulsing Rings */}
                <div className="absolute w-36 h-36 rounded-full bg-[#FB7185]/20 animate-pulse blur-xl pointer-events-none" />
                <div className="absolute w-28 h-28 rounded-full bg-[#936DA2]/30 blur-md pointer-events-none" />

                {/* Floating Wellness Icons */}
                <div className="absolute top-1 left-2 p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FB7185] shadow-xs">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-purple-200 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                {/* Glassmorphic Logo Card */}
                <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/25 shadow-2xl p-3.5 flex items-center justify-center group hover:scale-105 transition-all">
                  <img
                    src="/femsphere_logo.png"
                    alt="FemSphere Logo"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. "PERIOD & CYCLE STATISTICS" (DUAL SMOOTH CURVE GRAPH WITH REAL USER DATA) */}
          <div className="bg-white rounded-[32px] p-7 md:p-8 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] space-y-6">
            {/* Header: Title + Legends */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#201538] tracking-tight">
                  Period & Cycle Statistics
                </h3>
                <p className="text-xs text-[#8E859E] mt-0.5">
                  Historical menstrual cadence, cycle lengths, and bleeding durations
                </p>
              </div>
              
              {/* Legends: • Cycle Length (coral) • Period Duration (lavender) */}
              <div className="flex items-center gap-5 text-xs font-semibold text-[#8E859E]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                  <span>Cycle Length ({avgCycleLength} Days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                  <span>Bleeding Flow ({avgDuration} Days)</span>
                </div>
              </div>
            </div>

            {/* Responsive Dual Smooth Curve SVG Chart */}
            <div className="relative w-full h-56 md:h-64 pt-4">
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  {/* Coral Gradient Area Fill (Cycle Length) */}
                  <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.25" />
                    <stop offset="85%" stopColor="#FB7185" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
                  </linearGradient>

                  {/* Lavender Gradient Area Fill (Bleeding Duration) */}
                  <linearGradient id="lavenderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
                    <stop offset="85%" stopColor="#8B5CF6" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Label Numbers (Days: 35d, 28d, 14d, 0d) */}
                <text x="10" y="42" fill="#B3A9C4" fontSize="11" fontWeight="600">35d</text>
                <text x="10" y="74" fill="#B3A9C4" fontSize="11" fontWeight="600">28d</text>
                <text x="10" y="134" fill="#B3A9C4" fontSize="11" fontWeight="600">14d</text>
                <text x="16" y="192" fill="#B3A9C4" fontSize="11" fontWeight="600">0d</text>

                {/* Subtle horizontal grid lines */}
                <line x1="45" y1="38" x2="685" y2="38" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="70" x2="685" y2="70" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="130" x2="685" y2="130" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="188" x2="685" y2="188" stroke="#F5F0FB" strokeWidth="1" />

                {/* AREA FILLS */}
                {/* Coral Area Fill (Cycle Length) */}
                <path d={cycleAreaD} fill="url(#coralGrad)" />

                {/* Lavender Area Fill (Bleeding Duration) */}
                <path d={durationAreaD} fill="url(#lavenderGrad)" />

                {/* SMOOTH CURVED STROKES */}
                {/* Curve 1: Lavender (Bleeding Duration) */}
                <path
                  d={durationPathD}
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Curve 2: Coral (Cycle Length) */}
                <path
                  d={cyclePathD}
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* DASHED VERTICAL LINE FROM CURRENT CYCLE TO BASELINE */}
                <line
                  x1={focusNode.x}
                  y1={focusNode.y}
                  x2={focusNode.x}
                  y2="188"
                  stroke="#FB7185"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity="0.8"
                />

                {/* PEAK CIRCLE NODE */}
                <circle cx={focusNode.x} cy={focusNode.y} r="5" fill="#FFFFFF" stroke="#FB7185" strokeWidth="3" />

                {/* TOOLTIP PILL: Real cycle metrics */}
                <g transform={`translate(${focusNode.x - 48}, ${focusNode.y - 36})`}>
                  <rect
                    width="96"
                    height="26"
                    rx="13"
                    fill="#FB7185"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x="48"
                    y="17"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {focusCycleDays}d Cycle • {focusDurationDays}d Flow
                  </text>
                  {/* Downward pointer */}
                  <polygon points="44,25 52,25 48,30" fill="#FB7185" />
                </g>

                {/* X-AXIS MONTH LABELS */}
                {cycleTrendData.map((d, i) => (
                  <text key={d.month} x={xPositions[i]} y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">
                    {d.month}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* 3. BOTTOM SPLIT ROW: "Weekly Sleep & Vitals" + "Health & Baseline Score" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            
            {/* CARD A: "Weekly Sleep & Vitals" with Segmented Capsule Bars */}
            <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base md:text-lg text-[#201538]">Weekly Sleep & Vitals</h4>
                  <Link
                    to="/dashboard/tracker"
                    className="text-xs font-bold text-[#FB7185] hover:underline"
                  >
                    View Logs
                  </Link>
                </div>
                <p className="text-xs text-[#8E859E] font-medium mt-1">{sleepFormatted}</p>
                <div className="flex items-center gap-3 text-[11px] text-[#8E859E] mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                    Sleep Rest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FB7185]" />
                    Active Vitals
                  </span>
                </div>
              </div>

              {/* Segmented Capsule Bars (M, T, W, T, F, S, S) */}
              <div className="flex items-end justify-between gap-2 pt-6 pb-2 px-1">
                {hoursData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    {/* Vertical Pill Bar Track */}
                    <div className="relative w-3.5 sm:w-4 h-24 rounded-full bg-[#F5F0FB] flex flex-col justify-end overflow-hidden">
                      {/* Top lavender segment (Sleep) */}
                      <div 
                        className="w-full bg-[#A78BFA] rounded-t-full transition-all duration-500"
                        style={{ height: `${item.lavenderH}%` }}
                      />
                      {/* Bottom coral segment (Active) */}
                      <div 
                        className="w-full bg-[#FB7185] rounded-b-full transition-all duration-500"
                        style={{ height: `${item.coralH}%` }}
                      />
                    </div>
                    {/* Day initial */}
                    <span className={`text-xs ${item.active ? 'font-bold text-[#201538]' : 'font-medium text-[#8E859E]'}`}>
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD B: "Health Profile & Baseline Score" with Circular Radial Ring Chart */}
            <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col items-center justify-between text-center">
              <h4 className="font-bold text-base md:text-lg text-[#201538] self-start">
                Health & Baseline Score
              </h4>

              {/* Circular Radial Gauge */}
              <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Track Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F9E8EC"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F4DDE2"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - userProgressPercent / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Gradient Arc Accent */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#A78BFA"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (userProgressPercent - 10) / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Coral Indicator Bead Dot */}
                <div 
                  className="absolute w-3.5 h-3.5 rounded-full bg-[#FB7185] border-2 border-white shadow-xs"
                  style={{
                    transform: 'translate(28px, 32px)'
                  }}
                />

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#FB7185] tracking-tight">
                    {userProgressPercent}<span className="text-sm font-bold">%</span>
                  </span>
                </div>
              </div>

              {/* Caption based on real user data */}
              <p className="text-[11px] text-[#8E859E] font-medium leading-relaxed max-w-[210px]">
                {userProgressPercent >= 85 
                  ? 'Optimal biological rhythm & verified health baseline synchronized.' 
                  : 'Add cycle & wearable telemetry to elevate your AI Twin accuracy.'}
              </p>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (30% width on large screens) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* 1. INTERACTIVE MINI CALENDAR: "October 2026" */}
          <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)]">
            {/* Header: Month Year + Chevrons */}
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-bold text-sm md:text-base text-[#201538]">
                {monthName} {year}
              </h4>
              <div className="flex items-center gap-1.5 text-[#8E859E]">
                <button
                  onClick={prevMonth}
                  className="p-1 hover:text-[#201538] rounded-lg hover:bg-[#F9E8EC] transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:text-[#201538] rounded-lg hover:bg-[#F9E8EC] transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays Row: Mo, Tu, We, Th, Fr, Sa, Su */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <span key={d} className="text-[11px] font-semibold text-[#8E859E]">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs font-medium">
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="w-8 h-8" />;
                }
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FB7185] text-white font-bold shadow-xs scale-105'
                        : 'text-[#4A4158] hover:bg-[#F9E8EC] hover:text-[#201538]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. "Schedule" CARD (Calculus, Machine Learning, Computer Vision) */}
          <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] space-y-4">
            {/* Header: Title + View All */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base md:text-lg text-[#201538]">
                Schedule
              </h4>
              <Link
                to="/dashboard/appointments"
                className="text-xs font-bold text-[#FB7185] hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Stack of Scheduled Items loaded strictly from user's database appointments */}
            <div className="space-y-3 pt-2">
              {appointments && appointments.length > 0 ? (
                appointments.slice(0, 3).map((appt, idx) => {
                  const icons = [Stethoscope, Activity, FileText];
                  const colors = [
                    { bg: 'bg-[#FFF1EB]', text: 'text-[#F97316]' },
                    { bg: 'bg-[#E6F8F5]', text: 'text-[#0D9488]' },
                    { bg: 'bg-[#F9E8EC]', text: 'text-[#936DA2]' }
                  ];
                  const IconComp = icons[idx % icons.length];
                  const colorObj = colors[idx % colors.length];

                  return (
                    <div 
                      key={appt.id || idx}
                      onClick={() => navigate('/dashboard/appointments')}
                      className="p-3.5 rounded-2xl bg-[#FCF4F5] hover:bg-[#F9E8EC]/60 border border-[#F9E8EC] flex items-center justify-between gap-3 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl ${colorObj.bg} ${colorObj.text} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-[#201538] truncate group-hover:text-[#936DA2] transition-colors">
                            {appt.doctor || appt.reason || 'Clinical Consultation'}
                          </h5>
                          <p className="text-[11px] text-[#8E859E] truncate mt-0.5">
                            {appt.time} <span className="mx-1">|</span> {appt.date}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#B3A9C4] group-hover:text-[#201538] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })
              ) : (
                <div className="p-5 rounded-2xl bg-[#FCF4F5] border border-[#F9E8EC] text-center space-y-1">
                  <p className="text-xs font-bold text-[#4A4158]">No appointments scheduled</p>
                  <p className="text-[11px] text-[#8E859E]">Book a clinical session with a certified doctor below.</p>
                </div>
              )}
            </div>

            {/* Quick action to book appointment */}
            <div className="pt-2">
              <Link
                to="/dashboard/appointments"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FCF4F5] hover:bg-[#F9E8EC] text-[#936DA2] text-xs font-bold flex items-center justify-center gap-2 transition-all border border-[#EDE8F5]"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Book New Session</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* EXTENSIBLE SECTIONS: AI Health Twin Insights & Stage Modules */}
      {/* ======================================================== */}
      <div className="pt-4 border-t border-[#F0EAF8] space-y-6">
        {/* AI Health Twin Insights */}
        <AIHealthTwinInsights />

        {/* Dynamic Active Life Stage Module Render (if applicable) */}
        {(currentStageCode && currentStageCode !== 'REPRODUCTIVE_AGE' && currentStageCode !== 'YOUNG_ADULT' && currentStageCode !== 'MENSTRUATING_ADOLESCENT') && (
          <div className="mt-6">
            {currentStageCode === 'PREGNANCY' && <PregnancyDashboardModule />}
            {currentStageCode === 'POSTPARTUM' && <PostpartumDashboardModule />}
            {(currentStageCode === 'PERIMENOPAUSE' || currentStageCode === 'MENOPAUSE') && <MidlifeMenopauseModule />}
            {currentStageCode === 'OLDER_ADULT' && <HealthyAgingModule />}
            {(currentStageCode === 'PUBERTY' || currentStageCode === 'PRE_PUBERTY') && <PubertyGrowingModule />}
            {currentStageCode === 'EARLY_CHILDHOOD' && <EarlyChildhoodModule />}
          </div>
        )}
      </div>

    </div>
  );
}
