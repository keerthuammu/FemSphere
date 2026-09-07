import React, { useState } from 'react';
import { Heart, Pill, Calendar, Shield, Users, Lock, Unlock } from 'lucide-react';

export default function HealthyAgingModule() {
  const [adultChildShared, setAdultChildShared] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center font-bold text-lg">
            👵
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Healthy Aging (Senior Wellness 60+)</h3>
            <p className="text-xs text-[#7a6f75]">Medication adherence, vital signs, mobility, and optional adult-child caregiver updates.</p>
          </div>
        </div>

        <button
          onClick={() => setAdultChildShared(!adultChildShared)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            adultChildShared
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {adultChildShared ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>{adultChildShared ? 'Adult-Child Caregiver Access Active' : 'Adult-Child Caregiver Private'}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-[#7C3AED] font-bold text-xs">
            <Pill className="w-4 h-4" />
            <span>Medication Schedule</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">3/3 Doses Confirmed Today</h4>
          <p className="text-xs text-[#64595e]">Calcium, BP Regulator, and Vitamin D taken on time.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-[#14B8A6] font-bold text-xs">
            <Heart className="w-4 h-4" />
            <span>Cardiovascular Vitals</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">BP: 124/78 | HR: 72 bpm</h4>
          <p className="text-xs text-[#64595e]">Vitals automatically synced via Bluetooth monitor at 09:00 AM.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
            <Calendar className="w-4 h-4" />
            <span>Upcoming Specialist Visit</span>
          </div>
          <h4 className="font-bold text-sm text-[#3a3135]">Geriatric Review • Aug 29</h4>
          <p className="text-xs text-[#64595e]">Dr. Alan Vance (Geriatrics) • 02:00 PM appointment scheduled.</p>
        </div>
      </div>
    </div>
  );
}
