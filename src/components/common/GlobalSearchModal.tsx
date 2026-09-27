import React, { useState } from 'react';
import {
  Search,
  X,
  Clock,
  Sparkles,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  Users,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setActiveTab,
    setActiveSubView,
    documents,
    appointments,
    medications,
    vitals,
    articles
  } = useApp();

  const [query, setQuery] = useState('');
  const recentSearches = ['Iron Bisglycinate', 'Metabolic Panel', 'Dr. Elena Vance', 'Ovulation window', 'Resting HR'];

  if (!isSearchOpen) return null;

  const handleSelectResult = (tab: string, subView: string) => {
    setActiveTab(tab);
    setActiveSubView(subView);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-lg h-[80vh] max-h-[600px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 border-b border-purple-100 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search doctors, lab reports, medications, vitals, articles..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
          {!query.trim() ? (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Recent Searches
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-purple-600 block">
                Matching Health Intelligence
              </span>

              {/* Doctors Match */}
              {appointments
                .filter(a => a.doctorName.toLowerCase().includes(query.toLowerCase()))
                .map(a => (
                  <div
                    key={a.id}
                    onClick={() => handleSelectResult('care', 'appointments')}
                    className="p-3 rounded-xl border border-purple-100 dark:border-slate-800 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{a.doctorName}</h4>
                        <span className="text-[10px] text-slate-400">{a.specialty}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}

              {/* Reports Match */}
              {documents
                .filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
                .map(d => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectResult('care', 'vault')}
                    className="p-3 rounded-xl border border-purple-100 dark:border-slate-800 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{d.title}</h4>
                        <span className="text-[10px] text-slate-400">{d.category} · {d.date}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}

              {/* Medications Match */}
              {medications
                .filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
                .map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectResult('care', 'meds')}
                    className="p-3 rounded-xl border border-purple-100 dark:border-slate-800 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Pill className="w-4 h-4 text-rose-500" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</h4>
                        <span className="text-[10px] text-slate-400">{m.dosage} · {m.frequency}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}

              {/* Vitals Match */}
              {vitals
                .filter(v => v.label.toLowerCase().includes(query.toLowerCase()))
                .map(v => (
                  <div
                    key={v.id}
                    onClick={() => handleSelectResult('health', 'vitals')}
                    className="p-3 rounded-xl border border-purple-100 dark:border-slate-800 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{v.label}</h4>
                        <span className="text-[10px] text-slate-400">{v.value} {v.unit}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-purple-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Unified global indexing across all patient, clinical, and family records.
        </div>
      </div>
    </div>
  );
}
