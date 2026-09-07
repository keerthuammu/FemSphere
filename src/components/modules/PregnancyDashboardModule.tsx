import React, { useState } from 'react';
import { Calendar, Heart, Stethoscope, CheckSquare, Plus, Baby } from 'lucide-react';

export default function PregnancyDashboardModule() {
  const [gestationalWeeks] = useState(24);
  const [checklist, setChecklist] = useState([
    { text: 'Ask OB/GYN about glucose screening test', checked: true },
    { text: 'Log fetal movement count (Kick counter)', checked: true },
    { text: 'Discuss birth plan options for Q4', checked: false }
  ]);

  const toggleCheck = (idx: number) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            🤰
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Pregnancy Journey Dashboard</h3>
            <p className="text-xs text-[#7a6f75]">Gestational age timeline, week-by-week development, doctor checklist, and partner tasks.</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold">
          Week {gestationalWeeks} (Trimester 2)
        </span>
      </div>

      {/* Week Progress Bar */}
      <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-[#3a3135]">
          <span>Gestational Timeline: Week {gestationalWeeks} of 40</span>
          <span className="text-[#7C3AED] font-semibold">Baby size: Papaya (~600g)</span>
        </div>
        <div className="w-full bg-[#EDE9FE] h-3 rounded-full overflow-hidden">
          <div className="bg-[#7C3AED] h-full rounded-full transition-all duration-500" style={{ width: `${(gestationalWeeks / 40) * 100}%` }}></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Doctor Questions Checklist */}
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#7C3AED] uppercase tracking-wider">Questions for Upcoming OB/GYN Visit</h4>
            <Stethoscope className="w-4 h-4 text-[#7C3AED]" />
          </div>

          <div className="space-y-2 text-xs">
            {checklist.map((item, idx) => (
              <div key={idx} onClick={() => toggleCheck(idx)} className="bg-white p-3 rounded-xl border border-[#EDE9FE] flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.checked} readOnly className="rounded text-[#7C3AED]" />
                <span className={item.checked ? 'line-through text-gray-400' : 'text-[#3a3135] font-medium'}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kick Counter & Vitals */}
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-3">
          <h4 className="font-bold text-xs text-[#14B8A6] uppercase tracking-wider">Fetal Movement & Prenatal Vitals</h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#EDE9FE]">
              <span className="text-[10px] text-[#7a6f75] uppercase font-bold block">Kick Counter</span>
              <span className="font-bold text-base text-[#3a3135]">12 movements / hr</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#EDE9FE]">
              <span className="text-[10px] text-[#7a6f75] uppercase font-bold block">Maternal BP</span>
              <span className="font-bold text-base text-[#3a3135]">118/76 mmHg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
