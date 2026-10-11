import React, { useState, useMemo } from 'react';
import { 
  Activity, Edit3, Watch, RefreshCw, Utensils, Flame, 
  Footprints, HeartPulse, AlertCircle, Trash2, Plus, 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, 
  Droplets, Moon, CheckCircle2, TrendingUp, Sparkles, 
  CalendarX, Info, Smile, ChevronDown, ChevronUp
} from 'lucide-react';
import { useUser, HealthTrackerLog } from '../../context/UserContext';

type MetricType = 'sleep' | 'water' | 'steps' | 'heartRate';

interface MetricInfo {
  label: string;
  unit: string;
  color: string;
  gradientId: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRIC_CONFIG: Record<MetricType, MetricInfo> = {
  sleep: { 
    label: 'Sleep Duration', 
    unit: 'hrs', 
    color: '#936DA2', 
    gradientId: 'grad-sleep',
    icon: Moon 
  },
  water: { 
    label: 'Water Intake', 
    unit: 'L', 
    color: '#0284C7', 
    gradientId: 'grad-water',
    icon: Droplets 
  },
  steps: { 
    label: 'Daily Steps', 
    unit: 'steps', 
    color: '#059669', 
    gradientId: 'grad-steps',
    icon: Footprints 
  },
  heartRate: { 
    label: 'Heart Rate', 
    unit: 'bpm', 
    color: '#E11D48', 
    gradientId: 'grad-hr',
    icon: HeartPulse 
  }
};

export default function UserTracker() {
  const {
    userProfile,
    bluetoothConnected,
    connectedDevice,
    smartwatchVitals,
    handleSyncWatchVitals,
    trackerLogs,
    trackerInput,
    setTrackerInput,
    editingTrackerId,
    setEditingTrackerId,
    trackerErrorMsg,
    handleSaveTrackerLog,
    handleEditTrackerLog,
    handleDeleteTrackerLog,
    symptomLogs,
    symptomInput,
    setSymptomInput,
    editingSymptomId,
    setEditingSymptomId,
    handleSaveSymptom,
    handleEditSymptom,
    handleDeleteSymptom
  } = useUser();

  // Selected date (ISO string YYYY-MM-DD, defaults to today)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Month navigation state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  // Modal states
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [showSymptomsSection, setShowSymptomsSection] = useState(false);

  // Interactive Graph state
  const [activeMetric, setActiveMetric] = useState<MetricType>('sleep');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // Set of dates with recorded logs
  const reportedDatesSet = useMemo(() => {
    return new Set(trackerLogs.map(l => l.date).filter(Boolean));
  }, [trackerLogs]);

  // Calendar days generation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prefix previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({ 
        dateStr: `${prevDate.getFullYear()}-${mStr}-${dStr}`, 
        dayNum: d, 
        isCurrentMonth: false 
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({ 
        dateStr: `${year}-${mStr}-${dStr}`, 
        dayNum: d, 
        isCurrentMonth: true 
      });
    }

    // Suffix next month days to complete week rows
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({ 
        dateStr: `${nextDate.getFullYear()}-${mStr}-${dStr}`, 
        dayNum: d, 
        isCurrentMonth: false 
      });
    }

    return days;
  }, [currentMonthDate]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(todayStr);
  };

  // Find record for currently selected date
  const selectedDayRecord = useMemo(() => {
    return trackerLogs.find(l => l.date === selectedDate) || null;
  }, [trackerLogs, selectedDate]);

  // Format date helper
  const formatPrettyDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Open modal to log new activity
  const handleOpenNewLogModal = (presetDate?: string) => {
    const targetDate = presetDate || selectedDate || todayStr;
    setEditingTrackerId(null);
    setTrackerInput({
      date: targetDate,
      weight: userProfile.weight || '',
      water: '',
      sleep: '',
      exerciseType: '',
      exercise: '',
      caloriesBurned: '',
      steps: '',
      distanceKm: '',
      foodMeals: '',
      caloriesIntake: '',
      bloodPressure: '',
      heartRate: '',
      mood: 'Good',
      symptomName: '',
      symptomSeverity: 'Low',
      notes: ''
    });
    setIsActivityModalOpen(true);
  };

  // Open modal to edit existing record
  const handleOpenEditModal = (log: HealthTrackerLog) => {
    handleEditTrackerLog(log);
    setIsActivityModalOpen(true);
  };

  // Form submit handler with auto-close
  const handleActivityFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveTrackerLog(e);
    setIsActivityModalOpen(false);
  };

  // Quick sync watch data into the modal inputs
  const handleApplyWatchVitalsToForm = () => {
    if (!bluetoothConnected) return;
    setTrackerInput((prev: any) => ({
      ...prev,
      heartRate: smartwatchVitals.heartRate ? String(smartwatchVitals.heartRate) : prev.heartRate,
      steps: smartwatchVitals.steps ? String(smartwatchVitals.steps) : prev.steps,
      caloriesBurned: smartwatchVitals.calories ? String(smartwatchVitals.calories) : prev.caloriesBurned
    }));
  };

  // Interactive Graph: Data calculation strictly from stored records
  const graphData = useMemo(() => {
    return trackerLogs
      .filter(l => Boolean(l.date))
      .map(l => {
        let val: number | null = null;
        if (activeMetric === 'sleep' && l.sleep) {
          const parsed = parseFloat(l.sleep);
          if (!isNaN(parsed) && parsed > 0) val = parsed;
        } else if (activeMetric === 'water' && l.water) {
          const parsed = parseFloat(l.water);
          if (!isNaN(parsed) && parsed > 0) val = parsed;
        } else if (activeMetric === 'steps' && l.steps) {
          const parsed = parseInt(l.steps, 10);
          if (!isNaN(parsed) && parsed > 0) val = parsed;
        } else if (activeMetric === 'heartRate' && l.heartRate) {
          const parsed = parseInt(l.heartRate, 10);
          if (!isNaN(parsed) && parsed > 0) val = parsed;
        }
        return { date: l.date, value: val };
      })
      .filter((pt): pt is { date: string; value: number } => pt.value !== null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // plot up to the last 14 stored days
  }, [trackerLogs, activeMetric]);

  // Graph metrics stats
  const graphStats = useMemo(() => {
    if (graphData.length === 0) return null;
    const values = graphData.map(d => d.value);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const latest = values[values.length - 1];
    return { avg, max, min, latest, count: values.length };
  }, [graphData]);

  // SVG Coordinates calculation
  const svgMetrics = useMemo(() => {
    if (graphData.length < 2) return null;

    const width = 520;
    const height = 210;
    const padLeft = 45;
    const padRight = 25;
    const padTop = 30;
    const padBottom = 35;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const values = graphData.map(d => d.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);

    // Padding on Y scale
    const range = rawMax - rawMin;
    const yMin = Math.max(0, rawMin - (range > 0 ? range * 0.15 : rawMin * 0.1));
    const yMax = rawMax + (range > 0 ? range * 0.15 : rawMax * 0.1 || 10);
    const ySpan = yMax - yMin || 1;

    const points = graphData.map((pt, i) => {
      const x = padLeft + (i / (graphData.length - 1)) * chartW;
      const y = padTop + chartH - ((pt.value - yMin) / ySpan) * chartH;
      return { ...pt, x, y };
    });

    // Build smooth curve path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    // Build area fill path
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

    return {
      width,
      height,
      padLeft,
      padTop,
      chartW,
      chartH,
      yMin,
      yMax,
      points,
      pathD,
      areaD
    };
  }, [graphData]);

  // Symptoms logged for selected date
  const selectedDateSymptoms = useMemo(() => {
    return symptomLogs.filter(s => s.date === selectedDate);
  }, [symptomLogs, selectedDate]);

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center border border-[#F4DDE2]">
              <Activity className="w-4 h-4 text-[#936DA2]" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#201538]">Daily Health & Activity Tracker</h2>
          </div>
          <p className="text-xs text-[#7a6f75] mt-1">
            Navigate your previous daily records with the calendar and explore personalized health trends
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {bluetoothConnected && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
              <Watch className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Smartwatch Synced</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => handleOpenNewLogModal()}
            className="px-5 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Activity</span>
          </button>
        </div>
      </div>

      {/* 2-Column Top Section: Calendar (Left) & Interactive Trend Graph (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: Calendar Navigation (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Calendar Month Navigation Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1EBF9]">
              <div>
                <h3 className="font-bold text-base text-[#201538]">
                  {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-[11px] text-[#7a6f75]">Select a date to view activities</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#F4DDE2] text-[#936DA2] hover:bg-[#FCF4F5] cursor-pointer transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="p-1.5 rounded-lg border border-[#F4DDE2] text-[#7a6f75] hover:text-[#936DA2] hover:bg-[#FCF4F5] cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="p-1.5 rounded-lg border border-[#F4DDE2] text-[#7a6f75] hover:text-[#936DA2] hover:bg-[#FCF4F5] cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold text-[#7a6f75] uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isSelected = day.dateStr === selectedDate;
                const isToday = day.dateStr === todayStr;
                const hasRecord = reportedDatesSet.has(day.dateStr);

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#936DA2] text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-[#F9E8EC] text-[#936DA2] font-bold border border-[#F4DDE2]'
                        : day.isCurrentMonth
                        ? 'text-[#201538] hover:bg-[#FCF4F5] font-medium'
                        : 'text-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs leading-none">{day.dayNum}</span>

                    {/* LAVENDER SQUARE MARKER: indicates that daily activities have been reported */}
                    {hasRecord && (
                      <span
                        className={`w-1.5 h-1.5 rounded-[2px] mt-1 transition-all ${
                          isSelected ? 'bg-white shadow-2xs' : 'bg-[#936DA2]'
                        }`}
                        title="Daily activity reported"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="pt-3 border-t border-[#F1EBF9] flex items-center justify-between text-[11px] text-[#7a6f75]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-[#936DA2] inline-block shrink-0" />
              <span className="font-medium">Lavender square = Reported activity</span>
            </div>
            <span className="text-[10px] font-semibold text-[#936DA2]">
              {reportedDatesSet.size} {reportedDatesSet.size === 1 ? 'day' : 'days'} logged
            </span>
          </div>
        </div>

        {/* COLUMN 2: Interactive Trend Graph (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Graph Header with Metric Switcher Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EBF9]">
              <div>
                <h3 className="font-bold text-base text-[#201538] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#936DA2]" />
                  Health Trends
                </h3>
                <p className="text-[11px] text-[#7a6f75]">Plotting actual recorded values from your database</p>
              </div>

              {/* Metric Toggle Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#FCF4F5] rounded-xl border border-[#F4DDE2] overflow-x-auto max-w-full">
                {(['sleep', 'water', 'steps', 'heartRate'] as MetricType[]).map((metricKey) => {
                  const cfg = METRIC_CONFIG[metricKey];
                  const Icon = cfg.icon;
                  const isActive = activeMetric === metricKey;
                  return (
                    <button
                      key={metricKey}
                      type="button"
                      onClick={() => {
                        setActiveMetric(metricKey);
                        setHoveredPoint(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#936DA2] text-white shadow-2xs'
                          : 'text-[#64595e] hover:text-[#936DA2] hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cfg.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Graph Area */}
            <div className="pt-2">
              {graphData.length < 2 || !svgMetrics ? (
                /* Clear empty state when no actual data exists */
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 bg-[#FCF4F5] rounded-2xl border border-dashed border-[#F4DDE2] space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center border border-[#F4DDE2]">
                    <TrendingUp className="w-5 h-5 text-[#936DA2]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#201538]">
                    No trend data available for {METRIC_CONFIG[activeMetric].label}
                  </h4>
                  <p className="text-[11px] text-[#7a6f75] max-w-sm">
                    Log your daily {METRIC_CONFIG[activeMetric].label.toLowerCase()} across at least 2 days to generate an interactive trend line. Only actual stored records are displayed.
                  </p>
                </div>
              ) : (
                /* Interactive SVG Curve Graph with Hover Tooltip */
                <div className="relative">
                  <svg
                    viewBox={`0 0 ${svgMetrics.width} ${svgMetrics.height}`}
                    className="w-full h-48 select-none overflow-visible"
                  >
                    <defs>
                      <linearGradient id={METRIC_CONFIG[activeMetric].gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={METRIC_CONFIG[activeMetric].color} stopOpacity="0.32" />
                        <stop offset="100%" stopColor={METRIC_CONFIG[activeMetric].color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                      const y = svgMetrics.padTop + svgMetrics.chartH * (1 - ratio);
                      const val = svgMetrics.yMin + (svgMetrics.yMax - svgMetrics.yMin) * ratio;
                      return (
                        <g key={idx}>
                          <line
                            x1={svgMetrics.padLeft}
                            y1={y}
                            x2={svgMetrics.padLeft + svgMetrics.chartW}
                            y2={y}
                            stroke="#F1EBF9"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={svgMetrics.padLeft - 6}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="9"
                            fill="#9ca3af"
                            fontWeight="500"
                          >
                            {val.toFixed(activeMetric === 'water' ? 1 : 0)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradient Area under curve */}
                    <path
                      d={svgMetrics.areaD}
                      fill={`url(#${METRIC_CONFIG[activeMetric].gradientId})`}
                    />

                    {/* Curve Path Line */}
                    <path
                      d={svgMetrics.pathD}
                      fill="none"
                      stroke={METRIC_CONFIG[activeMetric].color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Interactive Data Dots */}
                    {svgMetrics.points.map((pt, i) => {
                      const isHovered = hoveredPoint?.date === pt.date;
                      const isPointSelected = pt.date === selectedDate;

                      return (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered || isPointSelected ? 5.5 : 3.5}
                            fill={isPointSelected ? '#936DA2' : '#ffffff'}
                            stroke={METRIC_CONFIG[activeMetric].color}
                            strokeWidth={isHovered || isPointSelected ? 2.5 : 2}
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredPoint(pt)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            onClick={() => setSelectedDate(pt.date)}
                          />

                          {/* X-axis date labels */}
                          {(i === 0 || i === svgMetrics.points.length - 1 || i % Math.ceil(svgMetrics.points.length / 5) === 0) && (
                            <text
                              x={pt.x}
                              y={svgMetrics.padTop + svgMetrics.chartH + 18}
                              textAnchor="middle"
                              fontSize="9"
                              fill="#9ca3af"
                              fontWeight="600"
                            >
                              {pt.date.slice(5)}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Hover Tooltip Overlay */}
                  {hoveredPoint && (
                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 bg-[#201538] text-white text-[11px] font-bold rounded-xl shadow-lg border border-purple-400/20 whitespace-nowrap z-10"
                      style={{
                        left: `${(hoveredPoint.x / (svgMetrics?.width || 520)) * 100}%`,
                        top: `${(hoveredPoint.y / (svgMetrics?.height || 210)) * 100 - 8}%`
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-300">{hoveredPoint.date}</span>
                        <span>•</span>
                        <span className="font-extrabold text-white">
                          {hoveredPoint.value} {METRIC_CONFIG[activeMetric].unit}
                        </span>
                      </div>
                      <span className="text-[9px] text-purple-200 block text-center mt-0.5">Click to view date record</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Metric Summary Badges */}
          {graphStats && (
            <div className="pt-3 border-t border-[#F1EBF9] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] text-[#7a6f75] uppercase block font-semibold">Average</span>
                <span className="font-bold text-[#201538]">
                  {graphStats.avg.toFixed(1)} {METRIC_CONFIG[activeMetric].unit}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] text-[#7a6f75] uppercase block font-semibold">Highest</span>
                <span className="font-bold text-[#201538]">
                  {graphStats.max} {METRIC_CONFIG[activeMetric].unit}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] text-[#7a6f75] uppercase block font-semibold">Latest</span>
                <span className="font-bold text-[#201538]">
                  {graphStats.latest} {METRIC_CONFIG[activeMetric].unit}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] text-[#7a6f75] uppercase block font-semibold">Recorded Days</span>
                <span className="font-bold text-[#936DA2]">
                  {graphStats.count} entries
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM SECTION: Date-Filtered Daily Activity Record */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1EBF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center border border-[#F4DDE2] shrink-0">
              <CalendarIcon className="w-5 h-5 text-[#936DA2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#201538]">
                  {formatPrettyDate(selectedDate)}
                </h3>
                {selectedDate === todayStr && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#936DA2]">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7a6f75]">
                {selectedDayRecord ? 'Daily activity record found for this date' : 'No activity logged for this date'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {selectedDayRecord ? (
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleOpenEditModal(selectedDayRecord)}
                className="px-4 py-2 bg-[#F9E8EC] hover:bg-[#F4DDE2] text-[#936DA2] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete the activity record for this day?')) {
                    handleDeleteTrackerLog(selectedDayRecord.id);
                  }
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenNewLogModal(selectedDate)}
              className="px-4 py-2 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log for this Date</span>
            </button>
          )}
        </div>

        {/* Content: Record Exists VS No Record */}
        {selectedDayRecord ? (
          <div className="space-y-6">
            
            {/* Vitals & Metrics 6-Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Card 1: Hydration */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-[#0284C7]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Water</span>
                  <Droplets className="w-4 h-4 text-[#0284C7]" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.water ? `${selectedDayRecord.water} L` : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75]">Hydration target</p>
              </div>

              {/* Card 2: Sleep */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-[#936DA2]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Sleep</span>
                  <Moon className="w-4 h-4 text-[#936DA2]" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.sleep ? `${selectedDayRecord.sleep} hrs` : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75]">Night rest</p>
              </div>

              {/* Card 3: Steps */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Steps</span>
                  <Footprints className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.steps ? Number(selectedDayRecord.steps).toLocaleString() : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75]">
                  {selectedDayRecord.distanceKm ? `${selectedDayRecord.distanceKm} km` : 'Daily count'}
                </p>
              </div>

              {/* Card 4: Exercise */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-rose-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Exercise</span>
                  <Flame className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.exercise ? `${selectedDayRecord.exercise} min` : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75] truncate">
                  {selectedDayRecord.exerciseType || 'Workout'}
                </p>
              </div>

              {/* Card 5: Heart Rate & BP */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Vitals</span>
                  <HeartPulse className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.heartRate ? `${selectedDayRecord.heartRate} bpm` : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75]">
                  BP: {selectedDayRecord.bloodPressure || '--'}
                </p>
              </div>

              {/* Card 6: Weight */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Weight</span>
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-base font-extrabold text-[#201538]">
                  {selectedDayRecord.weight ? `${selectedDayRecord.weight} kg` : '--'}
                </div>
                <p className="text-[10px] text-[#7a6f75]">Body mass</p>
              </div>

            </div>

            {/* Additional details: Meals, Mood, and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Meals & Nutrition */}
              <div className="p-4 rounded-2xl border border-[#F4DDE2] bg-[#FCF4F5] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#201538] flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-[#936DA2]" />
                    Meals & Calorie Intake
                  </span>
                  {selectedDayRecord.caloriesIntake && (
                    <span className="font-extrabold text-[#936DA2] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px]">
                      {selectedDayRecord.caloriesIntake} kcal
                    </span>
                  )}
                </div>
                <p className="text-[#64595e]">
                  {selectedDayRecord.foodMeals || 'No specific meals logged for this date.'}
                </p>
              </div>

              {/* Mood & Journal Notes */}
              <div className="p-4 rounded-2xl border border-[#F4DDE2] bg-[#FCF4F5] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#201538] flex items-center gap-1.5">
                    <Smile className="w-4 h-4 text-amber-500" />
                    Mood & Reflections
                  </span>
                  {selectedDayRecord.mood && (
                    <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px]">
                      {selectedDayRecord.mood}
                    </span>
                  )}
                </div>
                <p className="text-[#64595e] italic">
                  {selectedDayRecord.notes ? `"${selectedDayRecord.notes}"` : 'No health notes entered for this date.'}
                </p>
              </div>

            </div>

          </div>
        ) : (
          /* Clear message when no record exists for selected date */
          <div className="py-12 px-6 rounded-2xl bg-[#FCF4F5] border border-dashed border-[#F4DDE2] text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4DDE2] flex items-center justify-center text-[#936DA2] shadow-2xs">
              <CalendarX className="w-6 h-6 text-[#936DA2]" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#201538]">
                No Activity Recorded for {formatPrettyDate(selectedDate)}
              </h4>
              <p className="text-xs text-[#7a6f75] max-w-sm mt-1">
                You haven't logged meals, sleep, hydration, or vitals for this day. Click below to add a new record.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenNewLogModal(selectedDate)}
              className="mt-2 px-5 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Activity for this Date</span>
            </button>
          </div>
        )}

      </div>

      {/* SYMPTOMS SECTION (Minimal secondary section with toggle) */}
      <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-[#201538]">Logged Symptoms</h3>
              <p className="text-[11px] text-[#7a6f75]">Record headaches, cramps, or fatigue for longitudinal health correlation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingSymptomId(null);
                setSymptomInput({
                  symptomName: '',
                  severity: 'Low',
                  date: selectedDate || todayStr,
                  description: ''
                });
                setIsSymptomModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#FCF4F5] hover:bg-[#F9E8EC] border border-[#F4DDE2] text-[#936DA2] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Symptom
            </button>

            <button
              type="button"
              onClick={() => setShowSymptomsSection(!showSymptomsSection)}
              className="p-1.5 rounded-xl border border-[#F4DDE2] text-[#7a6f75] hover:text-[#201538] transition-colors cursor-pointer"
              title={showSymptomsSection ? 'Hide symptoms list' : 'Show symptoms list'}
            >
              {showSymptomsSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Symptoms content */}
        {showSymptomsSection && (
          <div className="pt-2 border-t border-[#F1EBF9] space-y-3">
            {symptomLogs.length === 0 ? (
              <p className="text-xs text-[#7a6f75] italic py-3 text-center">No symptoms recorded yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {symptomLogs.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl border border-[#F4DDE2] bg-[#FCF4F5] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#201538]">{s.symptomName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.severity === 'Critical' || s.severity === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : s.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {s.severity}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7a6f75] block">{formatPrettyDate(s.date)}</span>
                      {s.description && <p className="text-[#64595e] text-[11px] mt-0.5">{s.description}</p>}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          handleEditSymptom(s);
                          setIsSymptomModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#F9E8EC] border border-[#F4DDE2] text-[#936DA2] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSymptom(s.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Symptom"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: DAILY ACTIVITY FORM MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#F4DDE2] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#201538] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#936DA2]" />
                  {editingTrackerId ? 'Edit Daily Activity Record' : 'Log Daily Activity Record'}
                </h3>
                <p className="text-xs text-[#7a6f75] mt-0.5">
                  Record your vitals, workouts, sleep, and meals for the chosen date
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActivityModalOpen(false)}
                className="p-2 rounded-xl text-[#7a6f75] hover:text-[#201538] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner if any */}
            {trackerErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{trackerErrorMsg}</span>
              </div>
            )}

            {/* Live Watch sync quick bar */}
            {bluetoothConnected && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Watch className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="font-semibold text-emerald-900">
                    Smartwatch Active ({connectedDevice}): {smartwatchVitals.heartRate} bpm • {smartwatchVitals.steps} steps
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyWatchVitalsToForm}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                >
                  Apply Watch Data
                </button>
              </div>
            )}

            {/* Main Modal Form */}
            <form onSubmit={handleActivityFormSubmit} className="space-y-5 text-xs">
              
              {/* Date Input */}
              <div>
                <label className="block font-bold text-[#64595e] uppercase tracking-wider mb-1.5">
                  Activity Date
                </label>
                <input
                  type="date"
                  value={trackerInput.date || selectedDate}
                  onChange={(e) => setTrackerInput({ ...trackerInput, date: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-[#F4DDE2] bg-[#FCF4F5] focus:bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden font-medium"
                  required
                />
              </div>

              {/* Section 1: Water & Sleep */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#936DA2] flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" /> 1. Hydration & Sleep
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Water Intake (Liters)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={trackerInput.water}
                      onChange={(e) => setTrackerInput({ ...trackerInput, water: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Sleep Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 8.0"
                      value={trackerInput.sleep}
                      onChange={(e) => setTrackerInput({ ...trackerInput, sleep: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Steps & Movement */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-emerald-600" /> 2. Steps & Distance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Daily Steps Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 8250"
                      value={trackerInput.steps}
                      onChange={(e) => setTrackerInput({ ...trackerInput, steps: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Distance (Kilometers)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 5.2"
                      value={trackerInput.distanceKm}
                      onChange={(e) => setTrackerInput({ ...trackerInput, distanceKm: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Exercise & Workout */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" /> 3. Exercise & Workout
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Exercise Activity</label>
                    <input
                      type="text"
                      placeholder="e.g. Yoga, Jogging, Pilates"
                      value={trackerInput.exerciseType}
                      onChange={(e) => setTrackerInput({ ...trackerInput, exerciseType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      value={trackerInput.exercise}
                      onChange={(e) => setTrackerInput({ ...trackerInput, exercise: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Calories Burned (kcal)</label>
                    <input
                      type="number"
                      placeholder="e.g. 240"
                      value={trackerInput.caloriesBurned}
                      onChange={(e) => setTrackerInput({ ...trackerInput, caloriesBurned: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Body Vitals & Weight */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-purple-700" /> 4. Vitals & Weight
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={trackerInput.heartRate}
                      onChange={(e) => setTrackerInput({ ...trackerInput, heartRate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      placeholder="e.g. 120/80"
                      value={trackerInput.bloodPressure}
                      onChange={(e) => setTrackerInput({ ...trackerInput, bloodPressure: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 58.5"
                      value={trackerInput.weight}
                      onChange={(e) => setTrackerInput({ ...trackerInput, weight: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Meals & Nutrition */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-700" /> 5. Food & Nutrition
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#64595e] mb-1">Meals Logged</label>
                    <input
                      type="text"
                      placeholder="e.g. Oatmeal bowl (Breakfast), Salad (Lunch), Grilled Chicken (Dinner)"
                      value={trackerInput.foodMeals}
                      onChange={(e) => setTrackerInput({ ...trackerInput, foodMeals: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Calorie Intake (kcal)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1800"
                      value={trackerInput.caloriesIntake}
                      onChange={(e) => setTrackerInput({ ...trackerInput, caloriesIntake: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Mood & Reflections */}
              <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-indigo-700" /> 6. Mood & Reflections
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#64595e] mb-1">Daily Mood</label>
                    <select
                      value={trackerInput.mood}
                      onChange={(e) => setTrackerInput({ ...trackerInput, mood: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white font-medium"
                    >
                      <option value="Energetic">✨ Energetic & Vibrant</option>
                      <option value="Good">😊 Good / Positive</option>
                      <option value="Normal">😐 Normal / Balanced</option>
                      <option value="Tired">😴 Tired / Sleepy</option>
                      <option value="Stressed">😰 Stressed / Anxious</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#64595e] mb-1">Journal Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Felt great after morning walk, drank 2.5L water..."
                      value={trackerInput.notes}
                      onChange={(e) => setTrackerInput({ ...trackerInput, notes: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#F4DDE2]">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-5 py-2.5 border border-[#F4DDE2] rounded-2xl font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {editingTrackerId ? 'Update Record' : 'Save Daily Record'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: SYMPTOM FORM MODAL */}
      {isSymptomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#F4DDE2] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F4DDE2] pb-3">
              <h3 className="font-bold text-base text-[#201538] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                {editingSymptomId ? 'Edit Symptom' : 'Log Health Symptom'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSymptomModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                await handleSaveSymptom(e);
                setIsSymptomModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Symptom Name</label>
                <input
                  type="text"
                  placeholder="e.g. Migraine, Cramps, Nausea"
                  value={symptomInput.symptomName}
                  onChange={(e) => setSymptomInput({ ...symptomInput, symptomName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-[#FCF4F5] focus:bg-white focus:ring-2 focus:ring-[#936DA2] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#64595e] mb-1">Severity</label>
                  <select
                    value={symptomInput.severity}
                    onChange={(e) => setSymptomInput({ ...symptomInput, severity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-[#FCF4F5] font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#64595e] mb-1">Date</label>
                  <input
                    type="date"
                    value={symptomInput.date}
                    onChange={(e) => setSymptomInput({ ...symptomInput, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-[#FCF4F5]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Mild headache post workout, subsided with water"
                  value={symptomInput.description}
                  onChange={(e) => setSymptomInput({ ...symptomInput, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2] bg-[#FCF4F5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F4DDE2]">
                <button
                  type="button"
                  onClick={() => setIsSymptomModalOpen(false)}
                  className="px-4 py-2 border border-[#F4DDE2] rounded-xl font-bold cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {editingSymptomId ? 'Update Symptom' : 'Save Symptom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
