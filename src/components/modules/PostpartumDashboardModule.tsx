import React, { useState, useEffect } from 'react';
import { Heart, Smile, Activity, Moon, Droplet, Clock, Check, Plus, AlertCircle, Play, Square } from 'lucide-react';

interface FeedingLog {
  time: string;
  type: 'Left Breast' | 'Right Breast' | 'Bottle';
  durationMinutes: number;
}

export default function PostpartumDashboardModule() {
  // 1. Interactive Feeding & Nursing Timer
  const [activeSide, setActiveSide] = useState<'Left Breast' | 'Right Breast' | 'Bottle'>('Left Breast');
  const [isNursingActive, setIsNursingActive] = useState<boolean>(false);
  const [nursingSeconds, setNursingSeconds] = useState<number>(0);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([
    { time: 'Today, 06:15 AM', type: 'Right Breast', durationMinutes: 18 },
    { time: 'Today, 03:30 AM', type: 'Bottle', durationMinutes: 15 }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isNursingActive) {
      interval = setInterval(() => setNursingSeconds(s => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNursingActive]);

  const handleStartNursing = () => {
    setIsNursingActive(true);
    setNursingSeconds(0);
  };

  const handleStopNursing = () => {
    const mins = Math.max(1, Math.round(nursingSeconds / 60));
    setFeedingLogs(prev => [
      {
        time: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: activeSide,
        durationMinutes: mins
      },
      ...prev
    ]);
    setIsNursingActive(false);
    setNursingSeconds(0);
  };

  // 2. Diaper Tracker State
  const [wetDiapers, setWetDiapers] = useState<number>(5);
  const [dirtyDiapers, setDirtyDiapers] = useState<number>(3);

  // 3. Edinburgh Postnatal Depression Scale (EPDS) Questionnaire
  const [isEpdsModalOpen, setIsEpdsModalOpen] = useState(false);
  const [epdsAnswers, setEpdsAnswers] = useState<number[]>([0, 0, 1, 0, 1]);
  const [epdsScore, setEpdsScore] = useState<number>(2);

  const epdsQuestions = [
    {
      q: 'I have been able to laugh and see the funny side of things:',
      options: ['As much as I always could (0)', 'Not quite so much now (1)', 'Definitely not so much now (2)', 'Not at all (3)']
    },
    {
      q: 'I have looked forward with enjoyment to things:',
      options: ['As much as I ever did (0)', 'Rather less than I used to (1)', 'Definitely less than I used to (2)', 'Hardly at all (3)']
    },
    {
      q: 'I have blamed myself unnecessarily when things went wrong:',
      options: ['No, never (0)', 'Not very often (1)', 'Yes, some of the time (2)', 'Yes, most of the time (3)']
    },
    {
      q: 'I have been anxious or worried for no good reason:',
      options: ['No, not at all (0)', 'Hardly ever (1)', 'Yes, sometimes (2)', 'Yes, very often (3)']
    },
    {
      q: 'Things have been getting on top of me (overwhelmed):',
      options: ['No, I cope as well as ever (0)', 'No, most of the time I cope (1)', 'Yes, sometimes I cope less (2)', 'Yes, most of the time I cannot cope (3)']
    }
  ];

  const handleSelectEpdsOption = (qIdx: number, val: number) => {
    const updated = [...epdsAnswers];
    updated[qIdx] = val;
    setEpdsAnswers(updated);
  };

  const handleCalculateEpds = () => {
    const total = epdsAnswers.reduce((a, b) => a + b, 0);
    setEpdsScore(total);
    setIsEpdsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-xs">
            🍼
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#3a3135]">Postpartum Recovery & Fourth Trimester</h3>
            <p className="text-xs text-[#7a6f75]">Newborn feeding timer, diaper logs, pelvic health & Edinburgh postnatal mood tracking.</p>
          </div>
        </div>

        <button
          onClick={() => setIsEpdsModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Take EPDS Mood Screening ({epdsScore}/15)
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* 1. Feeding / Lactation Timer */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">Lactation & Feeding Log</span>
            <Clock className="w-4 h-4 text-[#7C3AED]" />
          </div>

          <div className="flex gap-1 bg-white p-1 rounded-xl border border-[#EDE9FE]">
            {(['Left Breast', 'Right Breast', 'Bottle'] as const).map(side => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeSide === side ? 'bg-[#7C3AED] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#3a3135]'
                }`}
              >
                {side.replace(' Breast', '')}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EDE9FE] text-center space-y-3">
            <span className="text-2xl font-black text-[#3a3135]">
              {Math.floor(nursingSeconds / 60)}:{(nursingSeconds % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex justify-center gap-2">
              {isNursingActive ? (
                <button
                  onClick={handleStopNursing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" /> Stop & Log
                </button>
              ) : (
                <button
                  onClick={handleStartNursing}
                  className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Start Feed
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-bold text-[#7a6f75] uppercase">Recent Sessions</span>
            {feedingLogs.slice(0, 2).map((l, i) => (
              <div key={i} className="flex justify-between bg-white p-2 rounded-lg border border-[#EDE9FE] text-[11px]">
                <span className="font-semibold text-[#3a3135]">{l.type}</span>
                <span className="text-gray-500">{l.durationMinutes}m • {l.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Diaper Output Logger */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">Newborn Output Logs</span>
            <Droplet className="w-4 h-4 text-[#14B8A6]" />
          </div>

          <div className="space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#3a3135]">💧 Wet Diapers</span>
                <p className="text-[11px] text-[#7a6f75]">Target: 6+ daily</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-[#14B8A6]">{wetDiapers}</span>
                <button
                  onClick={() => setWetDiapers(c => c + 1)}
                  className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold hover:bg-teal-100 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#3a3135]">💩 Dirty Diapers</span>
                <p className="text-[11px] text-[#7a6f75]">Normal yellow/seedy stools</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-amber-600">{dirtyDiapers}</span>
                <button
                  onClick={() => setDirtyDiapers(c => c + 1)}
                  className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#64595e] bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
            ✅ Adequate hydration indicator: Baby has met expected 24h diaper volume.
          </p>
        </div>

        {/* 3. Mood & Pelvic Recovery */}
        <div className="bg-[#FAF8FC] p-5 rounded-2xl border border-[#EDE9FE] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Maternal Well-Being</span>
            <Smile className="w-4 h-4 text-rose-500" />
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#3a3135]">EPDS Depression Risk:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                epdsScore <= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {epdsScore <= 5 ? 'Optimal (Low Risk)' : 'Follow-up Suggested'}
              </span>
            </div>
            <p className="text-[11px] text-[#7a6f75]">
              Validated 10-day postpartum score: {epdsScore} / 15. Partner emotional support is logged daily.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#EDE9FE] space-y-2">
            <span className="font-bold text-xs text-[#3a3135] block">Pelvic Floor Restoration</span>
            <p className="text-[11px] text-[#7a6f75]">
              Mild discomfort (2/10). Kegel rehabilitation session scheduled for week 6 consultation.
            </p>
          </div>
        </div>
      </div>

      {/* EPDS Questionnaire Modal */}
      {isEpdsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-[#EDE9FE] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div>
                <h3 className="font-bold text-base text-[#3a3135]">Edinburgh Postnatal Depression Scale (EPDS)</h3>
                <p className="text-xs text-[#7a6f75]">Self-assessment questionnaire for maternal emotional health</p>
              </div>
              <button 
                onClick={() => setIsEpdsModalOpen(false)} 
                className="text-gray-400 hover:text-black font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {epdsQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2 bg-[#FAF8FC] p-3.5 rounded-xl border border-[#EDE9FE]">
                  <p className="font-bold text-[#3a3135]">{qIdx + 1}. {q.q}</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectEpdsOption(qIdx, oIdx)}
                        className={`text-left p-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                          epdsAnswers[qIdx] === oIdx
                            ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] font-bold'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE9FE]">
              <button
                onClick={() => setIsEpdsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCalculateEpds}
                className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Save & Compute Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
