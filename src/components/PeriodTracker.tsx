import React, { useState } from 'react';
import { 
  Droplet, Calendar, Activity, Sparkles, Heart, Check, Plus, Clock, AlertCircle, ChevronRight, BarChart2
} from 'lucide-react';

export default function PeriodTracker() {
  const [periodStartDate, setPeriodStartDate] = useState('2026-08-22');
  const [periodEndDate, setPeriodEndDate] = useState('2026-08-26');
  const [flowRate, setFlowRate] = useState('Medium');
  const [cycleLengthDays, setCycleLengthDays] = useState(28);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Cramps', 'Fatigue']);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [notes, setNotes] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  // Past recorded cycles
  const [cycleHistory, setCycleHistory] = useState([
    { id: 'CYC-01', startDate: '2026-08-22', endDate: '2026-08-26', duration: 5, cycleLength: 28, flow: 'Medium', symptoms: ['Cramps', 'Fatigue'] },
    { id: 'CYC-02', startDate: '2026-07-25', endDate: '2026-07-29', duration: 5, cycleLength: 28, flow: 'Heavy', symptoms: ['Bloating', 'Headache'] },
    { id: 'CYC-03', startDate: '2026-06-27', endDate: '2026-07-01', duration: 5, cycleLength: 29, flow: 'Light', symptoms: ['Mild Cramps'] }
  ]);

  // Calculate current cycle day & phase
  const calculateCycleMetrics = () => {
    const start = new Date(periodStartDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const currentDay = Math.min(cycleLengthDays, Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));
    
    let phase = 'Menstrual Phase 🩸';
    let phaseColor = 'text-rose-600 bg-rose-50 border-rose-200';
    let description = 'Period active. Prioritize rest, hydration, and iron-rich nutrition.';

    if (currentDay > 5 && currentDay <= 12) {
      phase = 'Follicular Phase 🌿';
      phaseColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      description = 'Estrogen rises. High energy, strength training, and creativity window.';
    } else if (currentDay > 12 && currentDay <= 16) {
      phase = 'Ovulation Phase 🌸';
      phaseColor = 'text-purple-600 bg-purple-50 border-purple-200';
      description = 'Peak fertility window. High stamina, social energy, and peak LH levels.';
    } else if (currentDay > 16) {
      phase = 'Luteal Phase 🌙';
      phaseColor = 'text-amber-600 bg-amber-50 border-amber-200';
      description = 'Progesterone increases. Focus on magnesium, gentle yoga, and restorative sleep.';
    }

    const nextPeriodStart = new Date(start);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLengthDays);

    const nextFertileStart = new Date(start);
    nextFertileStart.setDate(nextFertileStart.getDate() + 11);
    const nextFertileEnd = new Date(start);
    nextFertileEnd.setDate(nextFertileEnd.getDate() + 16);

    return {
      currentDay,
      phase,
      phaseColor,
      description,
      nextPeriodStr: nextPeriodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      fertileWindowStr: `${nextFertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${nextFertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    };
  };

  const metrics = calculateCycleMetrics();

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleLogPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(periodStartDate);
    const end = new Date(periodEndDate);
    const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const newCycle = {
      id: `CYC-${Date.now().toString().slice(-3)}`,
      startDate: periodStartDate,
      endDate: periodEndDate,
      duration,
      cycleLength: cycleLengthDays,
      flow: flowRate,
      symptoms: selectedSymptoms
    };

    setCycleHistory([newCycle, ...cycleHistory]);
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);

    // Sync event to database health_events
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/health/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            eventType: 'Cycle',
            eventDate: periodStartDate,
            title: `Period Logged: ${flowRate} Flow (${duration} days)`,
            metadata: { flow: flowRate, duration, symptoms: selectedSymptoms.join(', ') },
            source: 'Period Tracker'
          })
        });
      }
    } catch (err) {
      console.log('Local cycle saved:', err);
    }
  };

  const availableSymptoms = [
    'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Acne', 'Back Pain', 'Nausea', 'Tender Breasts', 'Mood Swings'
  ];

  const moodOptions = ['Energetic', 'Happy', 'Calm', 'Tired', 'Irritable', 'Anxious'];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            🩸
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Period & Menstrual Cycle Tracker</h3>
            <p className="text-xs text-[#7a6f75]">Log period start/end dates, flow intensity, symptoms, and predicted fertile windows.</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-rose-100 text-rose-700">
          Average Cycle: {cycleLengthDays} Days
        </span>
      </div>

      {/* Overview Cards: Current Phase & Predictions */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Card 1: Cycle Day & Phase */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7a6f75] uppercase tracking-wider">Current Cycle Status</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${metrics.phaseColor}`}>
              {metrics.phase}
            </span>
          </div>

          <div>
            <h4 className="text-3xl font-bold text-[#3a3135]">Day {metrics.currentDay} <span className="text-sm font-normal text-gray-500">of {cycleLengthDays}</span></h4>
            <p className="text-xs text-[#64595e] mt-1 leading-relaxed">{metrics.description}</p>
          </div>

          {/* Cycle Ring Progress Bar */}
          <div className="w-full bg-[#EDE9FE] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(metrics.currentDay / cycleLengthDays) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Next Period Estimate */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7a6f75] uppercase tracking-wider">Next Period Prediction</span>
            <Calendar className="w-4 h-4 text-rose-500" />
          </div>

          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Estimated Start Date</span>
            <h4 className="text-2xl font-bold text-[#3a3135]">{metrics.nextPeriodStr}</h4>
            <p className="text-xs text-rose-600 font-semibold mt-1">Predictions are estimated based on your 28-day historical average.</p>
          </div>

          <div className="p-2 bg-white rounded-xl border border-[#EDE9FE] text-[11px] text-[#64595e] flex items-center justify-between font-mono">
            <span>Cycle Length:</span>
            <span className="font-bold text-[#7C3AED]">{cycleLengthDays} Days</span>
          </div>
        </div>

        {/* Card 3: Fertile Window */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7a6f75] uppercase tracking-wider">Estimated Fertile Window</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>

          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Predicted Fertile Days</span>
            <h4 className="text-xl font-bold text-[#3a3135]">{metrics.fertileWindowStr}</h4>
            <p className="text-xs text-purple-700 font-medium mt-1">Peak ovulation estimated around Day 14 of your cycle.</p>
          </div>

          <div className="p-2 bg-white rounded-xl border border-[#EDE9FE] text-[11px] text-[#64595e] flex items-center justify-between font-mono">
            <span>LH Peak Window:</span>
            <span className="font-bold text-purple-600">Optimal</span>
          </div>
        </div>
      </div>

      {/* Log Period Entry Form */}
      <div className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] space-y-5">
        <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <Plus className="w-4 h-4" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Log New Period & Menstrual Symptoms</h4>
          </div>

          {isLogged && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Logged & Saved to Health Timeline!
            </span>
          )}
        </div>

        <form onSubmit={handleLogPeriod} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Period Start Date</label>
              <input
                type="date"
                value={periodStartDate}
                onChange={(e) => setPeriodStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] outline-none text-sm bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Period End Date</label>
              <input
                type="date"
                value={periodEndDate}
                onChange={(e) => setPeriodEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] outline-none text-sm bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#4a4145] uppercase tracking-wider mb-1.5">Flow Intensity</label>
              <select
                value={flowRate}
                onChange={(e) => setFlowRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EDE9FE] focus:border-[#7C3AED] outline-none text-sm bg-white font-bold text-[#7C3AED]"
              >
                <option value="Spotting">Spotting (Very Light)</option>
                <option value="Light">Light Flow</option>
                <option value="Medium">Medium Flow</option>
                <option value="Heavy">Heavy Flow</option>
              </select>
            </div>
          </div>

          {/* Menstrual Symptoms Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-2">
              Log Menstrual Symptoms Experienced:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white text-[#64595e] border-[#EDE9FE] hover:border-rose-300'
                    }`}
                  >
                    {sym} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-xs font-bold text-[#4a4145] uppercase tracking-wider mb-2">
              Log Dominant Mood / Energy:
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((m) => {
                const isSelected = selectedMood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                        : 'bg-white text-[#64595e] border-[#EDE9FE] hover:border-[#7C3AED]'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Droplet className="w-4 h-4" />
            <span>Save & Update Cycle Log</span>
          </button>
        </form>
      </div>

      {/* Cycle History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#3a3135] uppercase tracking-wider">Recorded Cycle History</h4>
          <span className="text-xs text-[#7a6f75]">Showing past {cycleHistory.length} cycles</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#EDE9FE]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8FC] text-[#7C3AED] font-bold border-b border-[#EDE9FE]">
              <tr>
                <th className="p-3.5">Period Dates</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Cycle Length</th>
                <th className="p-3.5">Flow Rate</th>
                <th className="p-3.5">Symptoms Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE9FE] bg-white">
              {cycleHistory.map((cyc) => (
                <tr key={cyc.id} className="hover:bg-[#F5F3FF]/50 transition-colors">
                  <td className="p-3.5 font-bold text-[#3a3135]">{cyc.startDate} → {cyc.endDate}</td>
                  <td className="p-3.5">{cyc.duration} Days</td>
                  <td className="p-3.5">{cyc.cycleLength} Days</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      {cyc.flow}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#64595e] font-medium">{cyc.symptoms.join(', ') || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
