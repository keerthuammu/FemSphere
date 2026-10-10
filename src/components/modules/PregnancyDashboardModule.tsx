import React, { useState } from 'react';
import { Calendar, Heart, Stethoscope, CheckSquare, Plus, Baby, Play, Square, RotateCcw, Sparkles } from 'lucide-react';

interface KickSession {
  time: string;
  count: number;
  durationMinutes: number;
}

export default function PregnancyDashboardModule() {
  // Gestational Age & LMP / EDD Calculator
  const [lmpDate, setLmpDate] = useState<string>('2026-04-20');
  
  // Calculate Gestational Weeks from LMP
  const calculateGestationalInfo = (lmp: string) => {
    const lmpTime = new Date(lmp).getTime();
    const now = new Date('2026-10-09').getTime(); // Using consistent current platform date
    const diffDays = Math.max(0, Math.floor((now - lmpTime) / (1000 * 60 * 60 * 24)));
    const weeks = Math.min(42, Math.max(1, Math.floor(diffDays / 7)));
    const days = diffDays % 7;
    
    // Estimated Due Date: LMP + 280 days
    const edd = new Date(lmpTime + 280 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Trimester
    let trimester = 'Trimester 1';
    if (weeks >= 28) trimester = 'Trimester 3';
    else if (weeks >= 14) trimester = 'Trimester 2';

    // Baby Size Analogy
    let babySize = 'Poppy Seed (~1mm)';
    if (weeks >= 40) babySize = 'Watermelon (~3.5kg)';
    else if (weeks >= 36) babySize = 'Honeydew Melon (~2.6kg)';
    else if (weeks >= 32) babySize = 'Pineapple (~1.7kg)';
    else if (weeks >= 28) babySize = 'Eggplant (~1kg)';
    else if (weeks >= 24) babySize = 'Papaya (~600g)';
    else if (weeks >= 20) babySize = 'Banana (~300g)';
    else if (weeks >= 16) babySize = 'Avocado (~100g)';
    else if (weeks >= 12) babySize = 'Lime (~14g)';
    else if (weeks >= 8) babySize = 'Raspberry (~1g)';

    return { weeks, days, edd, trimester, babySize };
  };

  const gestationalInfo = calculateGestationalInfo(lmpDate);

  // Doctor checklist
  const [checklist, setChecklist] = useState([
    { text: 'Ask OB/GYN about glucose screening test (24–28w)', checked: true },
    { text: 'Log fetal movement count (Kick counter session)', checked: true },
    { text: 'Discuss Tdap vaccination and birth plan options for Q4', checked: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Interactive Fetal Kick Counter State
  const [kickCount, setKickCount] = useState<number>(0);
  const [isCounterActive, setIsCounterActive] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [kickHistory, setKickHistory] = useState<KickSession[]>([
    { time: 'Yesterday, 8:30 PM', count: 10, durationMinutes: 28 },
    { time: 'Oct 07, 2:15 PM', count: 12, durationMinutes: 34 }
  ]);

  // Timer effect for active kick counter session
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCounterActive) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounterActive]);

  const handleStartKickSession = () => {
    setIsCounterActive(true);
    setKickCount(0);
    setSessionSeconds(0);
  };

  const handleRegisterKick = () => {
    if (!isCounterActive) setIsCounterActive(true);
    setKickCount(prev => prev + 1);
  };

  const handleFinishKickSession = () => {
    if (kickCount > 0) {
      const minutes = Math.max(1, Math.round(sessionSeconds / 60));
      setKickHistory(prev => [
        {
          time: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          count: kickCount,
          durationMinutes: minutes
        },
        ...prev
      ]);
    }
    setIsCounterActive(false);
    setKickCount(0);
    setSessionSeconds(0);
  };

  const toggleCheck = (idx: number) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist(prev => [...prev, { text: newChecklistText.trim(), checked: false }]);
    setNewChecklistText('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shadow-xs">
            🤰
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Pregnancy Journey & Fetal Telemetry</h3>
            <p className="text-xs text-[#7a6f75]">Dynamic gestational age calculator, WHO development milestones, kick timer & clinical prep.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold shadow-2xs">
            Week {gestationalInfo.weeks} + {gestationalInfo.days}d ({gestationalInfo.trimester})
          </span>
        </div>
      </div>

      {/* LMP & Dynamic Gestational Timeline Calculator */}
      <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-[#7C3AED]" />
            <span className="font-bold text-[#3a3135]">Last Menstrual Period (LMP):</span>
            <input 
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="px-2.5 py-1 bg-white border border-[#EDE9FE] rounded-lg text-xs font-semibold text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>
          <div className="text-xs font-semibold text-[#64595e]">
            Estimated Due Date: <span className="font-bold text-[#7C3AED]">{gestationalInfo.edd}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#3a3135]">
            <span>Timeline: Week {gestationalInfo.weeks} of 40</span>
            <span className="text-[#7C3AED] font-semibold flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5" /> Baby size: {gestationalInfo.babySize}
            </span>
          </div>
          <div className="w-full bg-[#EDE9FE] h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (gestationalInfo.weeks / 40) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Interactive Fetal Kick Counter */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Interactive Fetal Kick Counter
              </h4>
              <p className="text-[11px] text-[#7a6f75]">American College of Obstetricians recommends tracking 10 kicks in 2 hours</p>
            </div>
            {isCounterActive && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold animate-pulse">
                Active Session
              </span>
            )}
          </div>

          {/* Kick Counter Tap Surface */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE9FE] text-center space-y-4 shadow-2xs">
            <div className="flex items-center justify-center gap-6">
              <div>
                <span className="text-3xl font-extrabold text-[#7C3AED]">{kickCount}</span>
                <span className="text-[11px] text-[#7a6f75] block font-semibold">Kicks Logged</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <span className="text-xl font-bold text-[#3a3135]">
                  {Math.floor(sessionSeconds / 60)}:{(sessionSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#7a6f75] block font-semibold">Duration</span>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={handleRegisterKick}
                className="px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                👣 Tap on Movement
              </button>
              {isCounterActive ? (
                <button
                  type="button"
                  onClick={handleFinishKickSession}
                  className="px-3.5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" /> Log
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartKickSession}
                  className="px-3.5 py-3 bg-purple-100 hover:bg-purple-200 text-[#7C3AED] rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Start
                </button>
              )}
            </div>

            {kickCount >= 10 && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                🎉 Reached 10 movements! Normal fetal reactivity achieved.
              </div>
            )}
          </div>

          {/* Recent Kick Sessions */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase text-[#7a6f75] tracking-wider">Past Movement Sessions</span>
            {kickHistory.map((s, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs">
                <span className="text-[#3a3135] font-semibold">{s.time}</span>
                <span className="text-[#7C3AED] font-bold">{s.count} kicks in {s.durationMinutes} min</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Questions Checklist */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#7C3AED]" /> OB/GYN Consultation Checklist
              </h4>
              <span className="text-[10px] text-[#7a6f75] font-bold">
                {checklist.filter(c => c.checked).length}/{checklist.length} Completed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {checklist.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleCheck(idx)} 
                  className="bg-white p-3 rounded-xl border border-[#EDE9FE] flex items-center gap-2.5 cursor-pointer hover:border-purple-200 transition-colors shadow-2xs"
                >
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    onChange={() => {}} 
                    className="rounded text-[#7C3AED] cursor-pointer" 
                  />
                  <span className={item.checked ? 'line-through text-gray-400 font-normal' : 'text-[#3a3135] font-medium'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Checklist Form */}
          <form onSubmit={handleAddChecklist} className="flex gap-2 pt-2">
            <input 
              type="text"
              placeholder="Add question for next consultation..."
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#EDE9FE] rounded-xl text-xs text-[#3a3135] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
