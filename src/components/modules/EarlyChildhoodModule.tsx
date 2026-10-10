import React, { useState } from 'react';
import { Activity, Syringe, Calendar, FileText, CheckCircle2, Plus, Calculator, Baby } from 'lucide-react';

interface GrowthEntry {
  age: string;
  height: string;
  weight: string;
  headCirc: string;
  milestone: string;
  percentile: string;
}

export default function EarlyChildhoodModule() {
  const [growthLogs, setGrowthLogs] = useState<GrowthEntry[]>([
    { age: '12 Months', height: '75.0 cm', weight: '9.8 kg', headCirc: '46.0 cm', milestone: 'Standing with support', percentile: '50th Percentile' },
    { age: '24 Months', height: '86.5 cm', weight: '12.2 kg', headCirc: '48.5 cm', milestone: 'Speaking 50+ words', percentile: '65th Percentile' },
    { age: '36 Months', height: '95.0 cm', weight: '14.5 kg', headCirc: '50.0 cm', milestone: 'Jumping with both feet', percentile: '55th Percentile' }
  ]);

  // Calculator State
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcAgeMonths, setCalcAgeMonths] = useState<number>(24);
  const [calcGender, setCalcGender] = useState<'Female' | 'Male'>('Female');
  const [calcHeight, setCalcHeight] = useState<string>('86.5');
  const [calcWeight, setCalcWeight] = useState<string>('12.2');
  const [calcHeadCirc, setCalcHeadCirc] = useState<string>('48.5');
  const [calcMilestone, setCalcMilestone] = useState<string>('Parallel play, climbing stairs');

  // WHO Growth Percentile Estimation
  const computeWhoPercentiles = () => {
    const w = parseFloat(calcWeight) || 12;
    const h = parseFloat(calcHeight) || 86;
    // Standard reference 50th percentile for 24 months: weight ~11.5kg female, height ~86cm
    const expectedWeight = 3.3 + (calcAgeMonths * 0.38);
    const ratio = w / expectedWeight;
    
    let percentile = '50th Percentile (Ideal Median)';
    let badgeColor = 'bg-emerald-100 text-emerald-800';

    if (ratio >= 1.2) {
      percentile = '90th–97th Percentile (Higher Weight)';
      badgeColor = 'bg-amber-100 text-amber-800';
    } else if (ratio >= 1.08) {
      percentile = '75th–85th Percentile (Healthy Robust)';
      badgeColor = 'bg-teal-100 text-teal-800';
    } else if (ratio >= 0.92) {
      percentile = '50th Percentile (WHO Standard Median)';
      badgeColor = 'bg-emerald-100 text-emerald-800';
    } else if (ratio >= 0.8) {
      percentile = '15th–25th Percentile (Slim Build)';
      badgeColor = 'bg-blue-100 text-blue-800';
    } else {
      percentile = '< 5th Percentile (Pediatric Review)';
      badgeColor = 'bg-rose-100 text-rose-800';
    }

    return { percentile, badgeColor };
  };

  const handleSaveGrowthLog = (e: React.FormEvent) => {
    e.preventDefault();
    const { percentile } = computeWhoPercentiles();
    const newLog: GrowthEntry = {
      age: `${calcAgeMonths} Months`,
      height: `${calcHeight} cm`,
      weight: `${calcWeight} kg`,
      headCirc: `${calcHeadCirc} cm`,
      milestone: calcMilestone || 'Consistent developmental pace',
      percentile: percentile.split(' (')[0]
    };
    setGrowthLogs([newLog, ...growthLogs]);
    setShowCalcModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shadow-xs">
            👶
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Pediatric Wellness & Early Growth (0–5 Years)</h3>
            <p className="text-xs text-[#7a6f75]">WHO percentile curves, developmental milestones, head circumference & immunization records.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCalcModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white rounded-xl font-bold text-xs shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Calculator className="w-4 h-4" /> WHO Growth Calculator
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Growth & Milestones Records */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-[#7C3AED]" /> WHO Growth & Milestone Timeline
            </h4>
            <span className="text-[11px] font-bold text-[#7C3AED]">
              {growthLogs.length} Checkpoints Logged
            </span>
          </div>

          <div className="space-y-2.5">
            {growthLogs.map((g, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#3a3135]">{g.age}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                      {g.percentile}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7a6f75] mt-0.5">
                    Height: <span className="font-semibold text-gray-800">{g.height}</span> • Weight: <span className="font-semibold text-gray-800">{g.weight}</span> • Head: <span className="font-semibold text-gray-800">{g.headCirc}</span>
                  </p>
                </div>
                <span className="text-[11px] bg-purple-50 text-[#7C3AED] px-2.5 py-1 rounded-lg font-bold border border-purple-100 max-w-[140px] truncate text-right">
                  {g.milestone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immunization & Routine Checkups */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#14B8A6] uppercase tracking-wider flex items-center gap-1.5">
              <Syringe className="w-4 h-4 text-[#14B8A6]" /> Pediatric Immunization Schedule
            </h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
              Up to Date
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3a3135]">MMR Vaccine (Measles, Mumps, Rubella)</span>
                <p className="text-[11px] text-gray-500">Administered at 12 Months • Batch: MMR-2026-X1</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3a3135]">Varicella (Chickenpox Dose 1)</span>
                <p className="text-[11px] text-gray-500">Administered at 15 Months</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3a3135]">DTaP Booster (Dose 4)</span>
                <p className="text-[11px] text-amber-600 font-semibold">Next Scheduled Dose: Sep 2026</p>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-md border border-amber-200">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WHO Calculator Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="font-bold text-base text-[#3a3135]">WHO Child Growth Calculator</h3>
                <p className="text-xs text-[#7a6f75]">World Health Organization growth standards computation</p>
              </div>
              <button onClick={() => setShowCalcModal(false)} className="text-gray-400 hover:text-black font-bold p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveGrowthLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age (Months: 0–60)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={calcAgeMonths}
                    onChange={(e) => setCalcAgeMonths(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={calcGender}
                    onChange={(e) => setCalcGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Head Circ (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcHeadCirc}
                    onChange={(e) => setCalcHeadCirc(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Milestones Noted</label>
                <input
                  type="text"
                  value={calcMilestone}
                  onChange={(e) => setCalcMilestone(e.target.value)}
                  placeholder="e.g. Walking steadily, stacks 6 blocks"
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                />
              </div>

              {/* Live Computed Percentile Box */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                <span className="font-bold text-[#7C3AED] block mb-1">Calculated WHO Percentile:</span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold ${computeWhoPercentiles().badgeColor}`}>
                  {computeWhoPercentiles().percentile}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE9FE]">
                <button
                  type="button"
                  onClick={() => setShowCalcModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save to Growth Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
