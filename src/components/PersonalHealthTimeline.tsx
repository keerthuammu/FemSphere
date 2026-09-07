import React, { useState, useEffect } from 'react';
import { 
  Activity, Calendar, Heart, Pill, FileText, Sparkles, Filter, Plus, Droplet, Clock
} from 'lucide-react';

interface EventItem {
  id: string;
  event_type: string;
  event_date: string;
  title: string;
  metadata?: any;
  source?: string;
}

export default function PersonalHealthTimeline() {
  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Symptom', 'Lifestyle', 'MedicalRecord', 'Appointment', 'AIInsight'];

  useEffect(() => {
    fetchTimeline();
  }, [filter]);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch(`/api/health/timeline?category=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.timeline || []);
      }
    } catch (e) {
      console.error('Error fetching health timeline', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Symptom': return <Activity className="w-4 h-4 text-rose-500" />;
      case 'Cycle': return <Droplet className="w-4 h-4 text-pink-500" />;
      case 'Lifestyle': return <Heart className="w-4 h-4 text-emerald-500" />;
      case 'Medication': return <Pill className="w-4 h-4 text-purple-500" />;
      case 'MedicalRecord': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Appointment': return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'AIInsight': return <Sparkles className="w-4 h-4 text-violet-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED]">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold text-lg text-[#3a3135]">Unified Personal Health Timeline</h3>
          </div>
          <p className="text-xs text-[#7a6f75] mt-0.5">Chronological record of your symptoms, vitals, records, and appointments.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-[#F5F3FF] text-[#64595e] hover:bg-[#EDE9FE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading health timeline...</div>
      ) : events.length === 0 ? (
        <div className="py-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
          <Clock className="w-8 h-8 text-[#7C3AED]/40 mx-auto mb-2" />
          <p className="text-xs font-bold text-[#3a3135]">No timeline events recorded yet</p>
          <p className="text-[11px] text-[#7a6f75] mt-1">Log symptoms, daily vitals, or documents to populate your personal timeline.</p>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-[#EDE9FE] space-y-6 my-2">
          {events.map((evt, idx) => {
            const dateStr = evt.event_date ? new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today';
            return (
              <div key={evt.id || idx} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-[35px] top-0.5 w-7 h-7 rounded-full bg-white border-2 border-[#EDE9FE] group-hover:border-[#7C3AED] flex items-center justify-center shadow-xs transition-all">
                  {getEventIcon(evt.event_type)}
                </div>

                <div className="bg-[#FAF8FC] hover:bg-[#F5F3FF] p-4 rounded-2xl border border-[#EDE9FE] transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">{evt.event_type} • {evt.source || 'FemSphere'}</span>
                    <span className="text-xs text-[#7a6f75] font-medium">{dateStr}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#3a3135]">{evt.title}</h4>
                  
                  {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-[#64595e] flex flex-wrap gap-3 font-mono bg-white p-2 rounded-xl border border-[#EDE9FE]">
                      {Object.entries(evt.metadata).map(([k, v]) => (
                        <span key={k}><strong className="text-[#3a3135]">{k}:</strong> {String(v)}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
