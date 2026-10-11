import React, { useState } from 'react';
import { Flame, Moon, Heart, Sparkles, Activity, Plus, Clock, AlertCircle } from 'lucide-react';

interface VasomotorEpisode {
  id: string;
  type: 'Hot Flash' | 'Night Sweat';
  severity: 'Mild' | 'Moderate' | 'Severe';
  duration: string;
  trigger: string;
  time: string;
}

export default function MidlifeMenopauseModule() {
  const [episodes, setEpisodes] = useState<VasomotorEpisode[]>([
    { id: '1', type: 'Hot Flash', severity: 'Moderate', duration: '3 mins', trigger: 'Caffeine / Tea', time: '02:15 PM' },
    { id: '2', type: 'Night Sweat', severity: 'Mild', duration: '5 mins', trigger: 'Warm Bedroom', time: '03:40 AM' }
  ]);

  const [newType, setNewType] = useState<'Hot Flash' | 'Night Sweat'>('Hot Flash');
  const [newSeverity, setNewSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [newDuration, setNewDuration] = useState<string>('3 mins');
  const [newTrigger, setNewTrigger] = useState<string>('Stress / Work');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    const episode: VasomotorEpisode = {
      id: Date.now().toString(),
      type: newType,
      severity: newSeverity,
      duration: newDuration,
      trigger: newTrigger,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEpisodes(prev => [episode, ...prev]);
    setShowLogModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-sm space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4DDE2] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl shadow-xs">
            🔥
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Perimenopause & Menopausal Transition</h3>
            <p className="text-xs text-[#7a6f75]">Vasomotor symptom logger, sleep disruption analysis, and bone/cardiovascular longevity.</p>
          </div>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log Hot Flash / Night Sweat
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Hot Flash Tracker Box */}
        <div className="bg-[#FCF4F5] p-5 rounded-2xl border border-[#F4DDE2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Vasomotor Frequency
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              {episodes.length} Today
            </span>
          </div>

          <h4 className="font-bold text-sm text-[#3a3135]">Episode Timeline</h4>
          
          <div className="space-y-2 text-xs">
            {episodes.map(ep => (
              <div key={ep.id} className="bg-white p-3 rounded-xl border border-[#F4DDE2] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#3a3135]">{ep.type}</span>
                  <p className="text-[11px] text-[#7a6f75]">{ep.duration} • Trigger: {ep.trigger}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold block ${
                    ep.severity === 'Severe' 
                      ? 'bg-rose-100 text-rose-700' 
                      : ep.severity === 'Moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {ep.severity}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{ep.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Disruption Architecture */}
        <div className="bg-[#FCF4F5] p-5 rounded-2xl border border-[#F4DDE2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#936DA2] uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4" /> Sleep & Recovery
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#936DA2]">
              6h 40m
            </span>
          </div>

          <h4 className="font-bold text-sm text-[#3a3135]">Circadian Disruption</h4>
          <p className="text-xs text-[#64595e]">
            1 nighttime awakening logged at 03:40 AM due to vasomotor temperature surge. Magnesium glycinate supplementation logged.
          </p>

          <div className="bg-white p-3 rounded-xl border border-[#F4DDE2] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#7a6f75]">Deep Sleep Quality:</span>
              <span className="font-bold text-[#3a3135]">1h 14m (Adequate)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6f75]">Room Temp Target:</span>
              <span className="font-bold text-[#14B8A6]">18°C – 19°C (Cooling)</span>
            </div>
          </div>
        </div>

        {/* Bone & Longevity Health */}
        <div className="bg-[#FCF4F5] p-5 rounded-2xl border border-[#F4DDE2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4" /> Bone & Cardiovascular
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              Optimal
            </span>
          </div>

          <h4 className="font-bold text-sm text-[#3a3135]">Protective Micronutrients</h4>
          <p className="text-xs text-[#64595e]">
            1,200 mg Calcium and 2,000 IU Vitamin D3 logged. Resistance training suggested to preserve bone mineral density (DEXA T-score baseline: -0.6).
          </p>

          <div className="bg-white p-3 rounded-xl border border-[#F4DDE2] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#7a6f75]">Blood Pressure:</span>
              <span className="font-bold text-[#3a3135]">116/74 mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6f75]">Next DEXA Scan:</span>
              <span className="font-bold text-[#936DA2]">Nov 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Vasomotor Episode Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F4DDE2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4DDE2]">
              <h3 className="font-bold text-base text-[#3a3135]">Log Vasomotor Symptom</h3>
              <button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-black font-bold p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddEpisode} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Symptom Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hot Flash', 'Night Sweat'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewType(type)}
                      className={`p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                        newType === type ? 'bg-orange-100 border-orange-500 text-orange-800' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {type === 'Hot Flash' ? '🔥 Hot Flash' : '🌙 Night Sweat'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mild', 'Moderate', 'Severe'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewSeverity(sev)}
                      className={`p-2 rounded-xl border font-bold transition-all cursor-pointer ${
                        newSeverity === sev ? 'bg-rose-100 border-rose-500 text-rose-800' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Approximate Duration</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="1-2 mins">1–2 Minutes (Brief wave)</option>
                  <option value="3 mins">3–4 Minutes (Standard)</option>
                  <option value="5+ mins">5+ Minutes (Extended intense flushing)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Suspected Trigger (Optional)</label>
                <input
                  type="text"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="e.g. Stress, Warm Room, Caffeine, Spicy Meal"
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F4DDE2]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
