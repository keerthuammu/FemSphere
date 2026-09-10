import React, { useState, useEffect } from 'react';
import { 
  X, Droplet, Calendar, Clock, AlertCircle, CheckCircle2, 
  Sparkles, RefreshCw, Activity, ArrowRight, ShieldCheck 
} from 'lucide-react';

interface DoctorPatientCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: number;
  fetchPatientCycleProfile: (id: number) => Promise<any>;
}

export default function DoctorPatientCycleModal({
  isOpen,
  onClose,
  patientName,
  patientId,
  fetchPatientCycleProfile
}: DoctorPatientCycleModalProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && patientId) {
      let isMounted = true;
      setLoading(true);
      setError(null);

      fetchPatientCycleProfile(patientId)
        .then((res) => {
          if (!isMounted) return;
          if (res) {
            setData(res);
          } else {
            setError('Could not retrieve cycle telemetry for this patient.');
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err.message || 'Error communicating with medical records system.');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setData(null);
    }
  }, [isOpen, patientId, fetchPatientCycleProfile]);

  if (!isOpen) return null;

  const metrics = data?.metrics;
  const settings = data?.settings;
  const history = data?.cycleHistory || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#EDE9FE] overflow-hidden my-8 max-h-[90vh] flex flex-col font-inter">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Droplet className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#3a3135]">Patient Menstrual & Cycle Profile</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                  Clinical Telemetry
                </span>
              </div>
              <p className="text-xs text-[#7a6f75] mt-0.5">
                Attending Physician Assessment for <b className="text-[#3a3135]">{patientName}</b> (Patient #{patientId})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#7a6f75]">Retrieving verified cycle analytics & records...</p>
            </div>
          ) : error ? (
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold text-sm">Telemetry Query Restricted</p>
                <p className="text-xs mt-1 text-rose-700">{error}</p>
              </div>
            </div>
          ) : !data?.hasCycleData ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE] space-y-3">
              <Droplet className="w-10 h-10 text-gray-400 mx-auto opacity-40" />
              <h4 className="font-serif text-lg font-bold text-[#3a3135]">Cycle Profile Not Configured</h4>
              <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
                {data?.message || 'This patient has not yet completed their period cycle setup or is outside active reproductive tracking age.'}
              </p>
              {data?.lifeStage && (
                <p className="text-xs font-semibold text-[#7C3AED]">
                  Registered Life Stage: {data.lifeStage}
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Biological Phase Primary Hero Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 border border-rose-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{metrics.phaseIcon || '🩸'}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Current Biological Phase</span>
                      <h4 className="font-serif text-2xl font-bold text-[#3a3135]">{metrics.phaseName}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white rounded-full border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
                      Cycle Day {metrics.cycleDay} of {metrics.totalCycleDays}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      metrics.isDelayed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {metrics.phaseBadge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4a4145] leading-relaxed">
                  {metrics.phaseDescription}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-[#7a6f75] block font-medium">Hormonal Profile</span>
                    <span className="text-xs font-bold text-[#3a3135] block truncate mt-0.5">{metrics.hormonalState || 'Active Estrogen/LH'}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-[#7a6f75] block font-medium">Next Expected Menses</span>
                    <span className="text-xs font-bold text-rose-600 block truncate mt-0.5">{metrics.nextPeriodDate}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-[#7a6f75] block font-medium">Estimated Ovulation</span>
                    <span className="text-xs font-bold text-purple-700 block truncate mt-0.5">{metrics.ovulationDate}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-[#7a6f75] block font-medium">Fertile Window</span>
                    <span className="text-xs font-bold text-teal-700 block truncate mt-0.5">{metrics.fertileWindow}</span>
                  </div>
                </div>
              </div>

              {/* Baseline Clinical Settings */}
              <div className="bg-[#FAF8FC] p-4 rounded-2xl border border-[#EDE9FE] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#7a6f75] block">Baseline Cycle Length</span>
                  <span className="font-bold text-[#3a3135]">{settings?.cycleLength || 28} Days</span>
                </div>
                <div>
                  <span className="text-[#7a6f75] block">Flow Duration</span>
                  <span className="font-bold text-[#3a3135]">{settings?.periodDuration || 5} Days</span>
                </div>
                <div>
                  <span className="text-[#7a6f75] block">Last Period Start</span>
                  <span className="font-mono font-bold text-[#7C3AED]">{settings?.lastPeriodStart}</span>
                </div>
                <div>
                  <span className="text-[#7a6f75] block">Cycle Health Classification</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Clinical Reproductive Range
                  </span>
                </div>
              </div>

              {/* Past Cycle History & Variance Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#3a3135] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C3AED]" /> Past Menstrual Cycles & Timing History
                  </h4>
                  <span className="text-xs text-[#7a6f75]">{history.length} recorded cycles</span>
                </div>

                {history.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-[#EDE9FE] text-xs text-[#7a6f75]">
                    No previous dynamic cycle logs found. Baseline setup active since {settings?.lastPeriodStart}.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-[#EDE9FE] bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] uppercase text-[10px] font-bold">
                        <tr>
                          <th className="p-3">Period Start</th>
                          <th className="p-3">Flow Duration</th>
                          <th className="p-3">Cycle Length</th>
                          <th className="p-3">Timing & Variance</th>
                          <th className="p-3">Flow / Mood</th>
                          <th className="p-3">Reported Symptoms</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDE9FE]">
                        {history.map((item: any, idx: number) => {
                          const varianceBadge = item.varianceDays < 0 
                            ? { label: `${Math.abs(item.varianceDays)}d Early`, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
                            : item.varianceDays > 0
                            ? { label: `+${item.varianceDays}d Delayed`, color: 'bg-amber-50 text-amber-800 border-amber-200' }
                            : { label: 'On Time (0d)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };

                          return (
                            <tr key={item.id || idx} className="hover:bg-[#FAF8FC]/50 transition-colors">
                              <td className="p-3 font-mono font-bold text-[#3a3135]">
                                {item.startDate}
                              </td>
                              <td className="p-3 text-[#3a3135]">
                                {item.durationDays ? `${item.durationDays} Days` : '—'}
                              </td>
                              <td className="p-3 text-[#3a3135] font-semibold">
                                {item.cycleLengthDays ? `${item.cycleLengthDays} Days` : '—'}
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${varianceBadge.color}`}>
                                  {varianceBadge.label}
                                </span>
                              </td>
                              <td className="p-3 text-[#4a4145]">
                                <span className="font-semibold">{item.flowIntensity || 'Moderate'}</span>
                                {item.mood && <span className="text-[11px] text-[#7a6f75] block">Mood: {item.mood}</span>}
                              </td>
                              <td className="p-3 text-[#4a4145]">
                                {item.symptoms && item.symptoms.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {item.symptoms.map((s: string, i: number) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[#7C3AED] text-[10px] font-medium border border-purple-100">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[#a89cb5] italic">None recorded</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EDE9FE] bg-[#FAF8FC] flex justify-end">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Close Telemetry Review
          </button>
        </div>

      </div>
    </div>
  );
}
