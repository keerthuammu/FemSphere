import React from 'react';
import { Activity, Stethoscope, FileText, Heart, Shield } from 'lucide-react';

export default function PcosEndometriosisModule() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
            🧬
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">PCOS & Endometriosis Specialized Journey</h3>
            <p className="text-xs text-[#7a6f75]">Symptom severity mapping, pelvic pain tracking, treatment history, and clinical report exports.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">Pelvic Pain Mapping</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Cyclic Flare-Ups</h4>
          <p className="text-xs text-[#64595e]">3 mild pain episodes logged during luteal phase. Heat therapy applied.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Hormonal & Insulin Indicators</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Metabolic Health</h4>
          <p className="text-xs text-[#64595e]">Low-glycemic nutrition plan logged for 21 days with stable energy levels.</p>
        </div>

        <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] space-y-2">
          <span className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider">Doctor Report Ready</span>
          <h4 className="font-bold text-sm text-[#3a3135]">Symptom Timeline Export</h4>
          <p className="text-xs text-[#64595e]">Automated summary ready for your next Gynecologist or Specialist consult.</p>
        </div>
      </div>
    </div>
  );
}
