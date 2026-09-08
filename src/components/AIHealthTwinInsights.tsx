import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface InsightItem {
  id?: number;
  insight_type: string;
  title: string;
  content: string;
  severity: string;
}

export default function AIHealthTwinInsights() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/health/insights', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights || []);
      }
    } catch (e) {
      console.error('Error loading AI insights', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFresh = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('femsphere_token');
      const res = await fetch('/api/health/insights/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights || []);
      }
    } catch (e) {
      console.error('Error generating AI insights', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F3FF] via-white to-[#FAF8FC] rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">AI Health Twin Intelligence</h3>
            <p className="text-xs text-[#7a6f75]">Pattern correlation engine for cycle, symptoms, mood, and vitals.</p>
          </div>
        </div>

        <button
          onClick={handleGenerateFresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EDE9FE] hover:border-[#7C3AED] text-[#7C3AED] text-xs font-bold transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Synthesize Patterns</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-gray-400">Synthesizing personal health patterns...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {insights.filter(i => i.insight_type !== 'DOCTOR_PREP').map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#EDE9FE] space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">{item.insight_type} PATTERN</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.severity === 'Notice' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.severity}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#3a3135]">{item.title}</h4>
              <p className="text-xs text-[#64595e] leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

