import React, { useState } from 'react';
import { Activity, Syringe, Calendar, FileText, CheckCircle2, Plus } from 'lucide-react';

export default function EarlyChildhoodModule() {
  const [growthLogs] = useState([
    { age: '12 Months', height: '75.0 cm', weight: '9.8 kg', milestone: 'Standing with support' },
    { age: '24 Months', height: '86.5 cm', weight: '12.2 kg', milestone: 'Speaking 50+ words' },
    { age: '36 Months', height: '95.0 cm', weight: '14.5 kg', milestone: 'Jumping with both feet' }
  ]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            👶
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Child Health Dashboard (0–5 Years)</h3>
            <p className="text-xs text-[#7a6f75]">Pediatric growth tracking, developmental milestones, and routine immunization care.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Growth & Milestones */}
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider">Pediatric Growth & Milestones</h4>
            <button className="text-[11px] text-[#7C3AED] font-bold hover:underline">+ Log Growth</button>
          </div>

          <div className="space-y-2">
            {growthLogs.map((g, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#3a3135]">{g.age}</span>
                  <p className="text-[11px] text-[#7a6f75]">H: {g.height} | W: {g.weight}</p>
                </div>
                <span className="text-[10px] bg-purple-50 text-[#7C3AED] px-2 py-0.5 rounded-md font-semibold">{g.milestone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immunization & Routine Checkups */}
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#14B8A6] uppercase tracking-wider">Preventive Care & Immunization</h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Up to Date</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3a3135]">MMR Vaccine (Dose 1)</span>
                <p className="text-[11px] text-gray-500">Administered: Feb 10, 2026</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#3a3135]">DTaP Booster (Dose 4)</span>
                <p className="text-[11px] text-amber-600 font-semibold">Next Due: Sep 01, 2026</p>
              </div>
              <Syringe className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
