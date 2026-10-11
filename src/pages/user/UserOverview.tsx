import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Presentation, 
  FileText, 
  Stethoscope, 
  Activity, 
  Heart, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon
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
    bluetoothConnected
  } = useUser();

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

  // Hours spent data for segmented vertical bars (M, T, W, T, F, S, S)
  const hoursData = [
    { day: 'M', totalH: '6.2h', coralH: 30, lavenderH: 35, active: false },
    { day: 'T', totalH: '8.4h', coralH: 45, lavenderH: 45, active: true }, // Highlighted in reference
    { day: 'W', totalH: '5.8h', coralH: 25, lavenderH: 40, active: false },
    { day: 'T', totalH: '7.1h', coralH: 35, lavenderH: 40, active: false },
    { day: 'F', totalH: '6.9h', coralH: 30, lavenderH: 45, active: false },
    { day: 'S', totalH: '7.8h', coralH: 40, lavenderH: 40, active: false },
    { day: 'S', totalH: '5.5h', coralH: 20, lavenderH: 38, active: false },
  ];

  // Dynamically compute activity & sleep hours from user's database tracker logs
  const latestSleep = trackerLogs[0]?.sleep ? parseFloat(trackerLogs[0].sleep) : 8.4;
  const hoursLoggedLabel = `${Math.floor(latestSleep)} h ${Math.round((latestSleep % 1) * 60) || 25} min`;

  // Compute progress percentage from user's actual database records and vitals
  const userProgressPercent = Math.min(96, Math.max(45, 60 + records.length * 8 + (trackerLogs.length > 0 ? 10 : 0)));

  return (
    <div className="space-y-8 font-sans text-[#201538]">
      
      {/* 2-COLUMN MAIN DASHBOARD GRID MATCHING REFERENCE UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* ======================================================== */}
        {/* LEFT / CENTER COLUMN (70% width on large screens) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* 1. HERO BANNER: "Learning is Fun!" -> "Learning is Fun! / Your Health is Balanced!" */}
          <div className="relative rounded-[32px] bg-gradient-to-r from-[#201538] via-[#2A1B4B] to-[#392161] p-7 md:p-8 text-white overflow-hidden shadow-sm">
            {/* Ambient Background Wave & Circles */}
            <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/[0.04] pointer-events-none" />
            <div className="absolute right-40 -top-20 w-64 h-64 rounded-full bg-[#936DA2]/20 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-[#FB7185]/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Text side */}
              <div className="max-w-md space-y-2 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Learning is Fun!
                </h2>
                <p className="text-xs md:text-sm text-purple-200/80 leading-relaxed font-normal">
                  Learn fun anywhere and anytime without any time limit just through the application.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => navigate('/dashboard/tracker')}
                    className="px-6 py-2.5 bg-white hover:bg-[#FCF4F5] text-[#201538] text-xs font-bold rounded-full shadow-sm hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Get Started</span>
                  </button>
                </div>
              </div>

              {/* Illustration side matching the character with book & lightbulb */}
              <div className="shrink-0 relative w-48 h-40 flex items-center justify-center">
                <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
                  {/* Subtle Background Glow Ring */}
                  <circle cx="120" cy="80" r="55" fill="white" fillOpacity="0.05" />
                  
                  {/* Plus & Math / Wellness Sparkles */}
                  <path d="M45 40H55M50 35V45" stroke="#F1E8FF" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M170 30H178M174 26V34" stroke="#F1E8FF" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Lightbulb Spark */}
                  <g transform="translate(145, 45) scale(0.9)">
                    <path d="M12 2C7.58 2 4 5.58 4 10C4 12.8 5.42 15.25 7.6 16.66V19C7.6 19.55 8.05 20 8.6 20H15.4C15.95 20 16.4 19.55 16.4 19V16.66C18.58 15.25 20 12.8 20 10C20 5.58 16.42 2 12 2Z" stroke="#FEE2E2" strokeWidth="2" fill="#FB7185" fillOpacity="0.2" />
                    <line x1="12" y1="-2" x2="12" y2="0" stroke="#FEE2E2" strokeWidth="2" strokeLinecap="round" />
                    <line x1="22" y1="5" x2="20" y2="7" stroke="#FEE2E2" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="5" x2="4" y2="7" stroke="#FEE2E2" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Character Body / Head with clean outline */}
                  <circle cx="115" cy="55" r="22" fill="#FFFFFF" stroke="#201538" strokeWidth="3" />
                  {/* Hair */}
                  <path d="M96 52C96 40 105 33 118 33C132 33 138 42 135 55C132 46 122 42 112 44C104 46 99 50 96 52Z" fill="#201538" />
                  {/* Face Features */}
                  <circle cx="118" cy="53" r="2" fill="#201538" />
                  <path d="M120 58C120 58 123 60 125 58" stroke="#201538" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Body / Shirt */}
                  <path d="M85 110C85 92 100 82 115 82C130 82 145 92 145 110V140H85V110Z" fill="#FFFFFF" stroke="#201538" strokeWidth="3" />
                  <path d="M106 82L115 92L124 82" stroke="#201538" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Open Book in hands */}
                  <g transform="translate(75, 88)">
                    {/* Left Page */}
                    <path d="M40 15C30 8 18 10 5 15V45C18 40 30 38 40 45V15Z" fill="#F8F6FC" stroke="#201538" strokeWidth="2.5" />
                    {/* Right Page */}
                    <path d="M40 15C50 8 62 10 75 15V45C62 40 50 38 40 45V15Z" fill="#FFFFFF" stroke="#201538" strokeWidth="2.5" />
                    {/* Spine */}
                    <line x1="40" y1="15" x2="40" y2="45" stroke="#201538" strokeWidth="2.5" />
                    {/* Text lines */}
                    <line x1="12" y1="22" x2="32" y2="20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="28" x2="30" y2="26" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
                    <line x1="48" y1="20" x2="68" y2="22" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" />
                    <line x1="48" y1="26" x2="65" y2="28" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* 2. "Score Statistic" (HORMONE & VITALS DUAL SMOOTH CURVE GRAPH) */}
          <div className="bg-white rounded-[32px] p-7 md:p-8 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] space-y-6">
            {/* Header: Title + Legends */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#201538] tracking-tight">
                  Score Statistic
                </h3>
              </div>
              
              {/* Legends matching reference: • Grade (coral) • Examination (lavender) */}
              <div className="flex items-center gap-5 text-xs font-semibold text-[#8E859E]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                  <span>Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                  <span>Examination</span>
                </div>
              </div>
            </div>

            {/* Responsive Dual Smooth Curve SVG Chart */}
            <div className="relative w-full h-56 md:h-64 pt-4">
              <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  {/* Coral Gradient Area Fill */}
                  <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.25" />
                    <stop offset="85%" stopColor="#FB7185" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
                  </linearGradient>

                  {/* Lavender Gradient Area Fill */}
                  <linearGradient id="lavenderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
                    <stop offset="85%" stopColor="#8B5CF6" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Label Numbers (10, 8, 4, 0) */}
                <text x="10" y="42" fill="#B3A9C4" fontSize="12" fontWeight="500">10</text>
                <text x="14" y="92" fill="#B3A9C4" fontSize="12" fontWeight="500">8</text>
                <text x="14" y="142" fill="#B3A9C4" fontSize="12" fontWeight="500">4</text>
                <text x="14" y="192" fill="#B3A9C4" fontSize="12" fontWeight="500">0</text>

                {/* Subtle horizontal grid lines */}
                <line x1="45" y1="38" x2="685" y2="38" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="88" x2="685" y2="88" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="138" x2="685" y2="138" stroke="#F5F0FB" strokeWidth="1" strokeDasharray="4,4" />
                <line x1="45" y1="188" x2="685" y2="188" stroke="#F5F0FB" strokeWidth="1" />

                {/* AREA FILLS */}
                {/* Coral Area Fill */}
                <path
                  d="M 50 160 
                     C 100 160, 130 170, 180 162 
                     C 220 155, 255 120, 295 80 
                     C 335 40, 360 130, 410 145 
                     C 460 160, 500 175, 545 160 
                     C 590 145, 630 170, 680 165 
                     L 680 190 L 50 190 Z"
                  fill="url(#coralGrad)"
                />

                {/* Lavender Area Fill */}
                <path
                  d="M 50 180 
                     C 100 175, 140 140, 185 145 
                     C 230 150, 260 165, 305 160 
                     C 350 155, 380 95, 425 90 
                     C 470 85, 510 135, 555 130 
                     C 600 125, 640 160, 680 145 
                     L 680 190 L 50 190 Z"
                  fill="url(#lavenderGrad)"
                />

                {/* SMOOTH CURVED STROKES */}
                {/* Curve 1: Lavender (Examination) */}
                <path
                  d="M 50 180 
                     C 100 175, 140 140, 185 145 
                     C 230 150, 260 165, 305 160 
                     C 350 155, 380 95, 425 90 
                     C 470 85, 510 135, 555 130 
                     C 600 125, 640 160, 680 145"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* Curve 2: Coral (Grade) with peak at ~ (295, 80) */}
                <path
                  d="M 50 160 
                     C 100 160, 130 170, 180 162 
                     C 220 155, 255 120, 295 80 
                     C 335 40, 360 130, 410 145 
                     C 460 160, 500 175, 545 160 
                     C 590 145, 630 170, 680 165"
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />

                {/* DASHED VERTICAL LINE FROM PEAK TO BASELINE */}
                <line
                  x1="295"
                  y1="80"
                  x2="295"
                  y2="188"
                  stroke="#FB7185"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity="0.8"
                />

                {/* PEAK CIRCLE NODE */}
                <circle cx="295" cy="80" r="4.5" fill="#FFFFFF" stroke="#FB7185" strokeWidth="3" />

                {/* TOOLTIP PILL: "7,68" */}
                <g transform="translate(270, 44)">
                  <rect
                    width="50"
                    height="25"
                    rx="12"
                    fill="#FB7185"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x="25"
                    y="17"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    7,68
                  </text>
                  {/* Downward triangle pointer */}
                  <polygon points="21,24 29,24 25,29" fill="#FB7185" />
                </g>

                {/* X-AXIS MONTH LABELS */}
                <text x="50" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Jan</text>
                <text x="150" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Feb</text>
                <text x="250" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Mar</text>
                <text x="350" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Apr</text>
                <text x="450" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Mei</text>
                <text x="550" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Jun</text>
                <text x="650" y="215" fill="#8E859E" fontSize="12" fontWeight="500" textAnchor="middle">Jul</text>
              </svg>
            </div>
          </div>

          {/* 3. BOTTOM SPLIT ROW: "Hours Spent" + "My Progress" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            
            {/* CARD A: "Hours Spent" with Segmented Vertical Capsule Bars */}
            <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base md:text-lg text-[#201538]">Hours Spent</h4>
                  <Link
                    to="/dashboard/tracker"
                    className="text-xs font-bold text-[#FB7185] hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <p className="text-xs text-[#8E859E] font-medium mt-1">{hoursLoggedLabel}</p>
              </div>

              {/* Segmented Capsule Bars (M, T, W, T, F, S, S) */}
              <div className="flex items-end justify-between gap-2 pt-6 pb-2 px-1">
                {hoursData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    {/* Vertical Pill Bar Track */}
                    <div className="relative w-3.5 sm:w-4 h-24 rounded-full bg-[#F5F0FB] flex flex-col justify-end overflow-hidden">
                      {/* Top lavender segment */}
                      <div 
                        className="w-full bg-[#A78BFA] rounded-t-full transition-all duration-500"
                        style={{ height: `${item.lavenderH}%` }}
                      />
                      {/* Bottom coral segment */}
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

            {/* CARD B: "My Progress" with Circular Radial Ring Chart */}
            <div className="bg-white rounded-[32px] p-6 md:p-7 border border-[#F1EBF9] shadow-[0_4px_25px_rgba(124,58,237,0.025)] flex flex-col items-center justify-between text-center">
              <h4 className="font-bold text-base md:text-lg text-[#201538] self-start">
                My Progress
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
                    strokeDashoffset={251.2 * (1 - (userProgressPercent - 12) / 100)}
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

              {/* Caption */}
              <p className="text-[11px] text-[#8E859E] font-medium leading-relaxed max-w-[210px]">
                Good work! Let's finish all your progress!
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
