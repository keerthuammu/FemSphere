import React, { useState } from 'react';
import { Heart, Activity, Watch, Droplet, Moon, Footprints, Flame, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';
import { 
  isPastOrToday, 
  isValidWater, 
  isValidSleep, 
  isValidHeartRate, 
  isValidBloodPressure 
} from '../../utils/validation';

export default function CaregiverTracker() {
  const {
    dependents,
    dependentTrackerLogs,
    addTrackerLog,
    deleteTrackerLog,
    bluetoothConnected,
    connectedDevice,
    smartwatchVitals,
    setShowBluetoothModal
  } = useCaregiver();

  const [trackerInput, setTrackerInput] = useState({
    dependent: dependents[0]?.name || '',
    date: new Date().toISOString().split('T')[0],
    weight: '',
    water: '',
    sleep: '',
    exercise: '',
    steps: '',
    bloodPressure: '',
    heartRate: '',
    foodLogged: '',
    symptoms: [] as string[],
    symptomSeverity: 'Mild',
    notes: ''
  });

  const [trackerSuccessMsg, setTrackerSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableSymptomsList = [
    'Fever', 'Fatigue', 'Cough', 'Headache', 'Mild Nausea',
    'Joint Pain', 'Pediatric Rash', 'Loss of Appetite', 'Chills', 'Dizziness'
  ];

  const toggleSymptom = (sym: string) => {
    setTrackerInput((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(sym)
        ? prev.symptoms.filter((s) => s !== sym)
        : [...prev.symptoms, sym]
    }));
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!trackerInput.dependent) {
      setErrorMsg('Please select a dependent.');
      return;
    }
    if (!trackerInput.date || !isPastOrToday(trackerInput.date)) {
      setErrorMsg('Log date cannot be in the future.');
      return;
    }

    // Biometric ranges (EXCLUDING Height and Weight)
    if (trackerInput.water.trim()) {
      const w = parseFloat(trackerInput.water);
      if (isNaN(w) || !isValidWater(w)) {
        setErrorMsg('Water intake must be between 0.1 and 10.0 Liters.');
        return;
      }
    }
    if (trackerInput.sleep.trim()) {
      const s = parseFloat(trackerInput.sleep);
      if (isNaN(s) || !isValidSleep(s)) {
        setErrorMsg('Sleep hours must be between 0.0 and 24.0 hours.');
        return;
      }
    }
    if (trackerInput.heartRate.trim()) {
      const hr = parseInt(trackerInput.heartRate, 10);
      if (isNaN(hr) || !isValidHeartRate(hr)) {
        setErrorMsg('Heart rate must be between 35 and 220 bpm.');
        return;
      }
    }
    if (trackerInput.bloodPressure.trim()) {
      const bp = isValidBloodPressure(trackerInput.bloodPressure);
      if (!bp.isValid) {
        setErrorMsg(bp.message);
        return;
      }
    }

    addTrackerLog(trackerInput);
    setTrackerSuccessMsg(true);
    setTimeout(() => setTrackerSuccessMsg(false), 3000);
  };

  const handleSyncWatch = () => {
    setTrackerInput((prev) => ({
      ...prev,
      heartRate: smartwatchVitals.heartRate.toString(),
      steps: smartwatchVitals.steps.toString(),
      exercise: '40',
      notes: prev.notes || `Live smartwatch vitals synced from ${connectedDevice || 'Bluetooth watch'}`
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-inter">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F472B6] mb-1">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Longitudinal Health Intelligence</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Dependent Health & Symptom Tracker</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Record daily biometric vitals, pediatric/elder symptoms, food nutrition, and sync directly with Bluetooth fitness wearables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {bluetoothConnected ? (
            <button
              onClick={handleSyncWatch}
              className="px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 cursor-pointer transition-all"
            >
              <Watch className="w-4 h-4 text-emerald-600" /> Sync Watch Vitals
            </button>
          ) : (
            <button
              onClick={() => setShowBluetoothModal(true)}
              className="px-4 py-2.5 bg-purple-50 text-[#7C3AED] border border-[#EDE9FE] rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-purple-100 cursor-pointer transition-all"
            >
              <Watch className="w-4 h-4 text-[#7C3AED]" /> Connect Watch
            </button>
          )}
        </div>
      </div>

      {trackerSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          Dependent health log & vitals entry saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-5">
          <h4 className="font-bold text-lg text-[#3a3135] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#7C3AED]" /> Log Daily Health Metrics
          </h4>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Select Dependent</label>
                <select
                  value={trackerInput.dependent}
                  onChange={(e) => setTrackerInput({ ...trackerInput, dependent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold text-xs"
                >
                  {dependents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Log Date</label>
                <input
                  type="date"
                  value={trackerInput.date}
                  onChange={(e) => setTrackerInput({ ...trackerInput, date: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold"
                  required
                />
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <label className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1">Weight (kg)</label>
                <input
                  type="text"
                  value={trackerInput.weight}
                  onChange={(e) => setTrackerInput({ ...trackerInput, weight: e.target.value })}
                  className="w-full bg-white p-2 rounded-lg border border-[#EDE9FE] font-bold text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <label className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-cyan-600" /> Water (L)
                </label>
                <input
                  type="text"
                  value={trackerInput.water}
                  onChange={(e) => setTrackerInput({ ...trackerInput, water: e.target.value })}
                  className="w-full bg-white p-2 rounded-lg border border-[#EDE9FE] font-bold text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <label className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1 flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-600" /> Sleep (hrs)
                </label>
                <input
                  type="text"
                  value={trackerInput.sleep}
                  onChange={(e) => setTrackerInput({ ...trackerInput, sleep: e.target.value })}
                  className="w-full bg-white p-2 rounded-lg border border-[#EDE9FE] font-bold text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <label className="text-[10px] font-bold text-[#7a6f75] uppercase block mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" /> Heart Rate (bpm)
                </label>
                <input
                  type="text"
                  value={trackerInput.heartRate}
                  onChange={(e) => setTrackerInput({ ...trackerInput, heartRate: e.target.value })}
                  className="w-full bg-white p-2 rounded-lg border border-[#EDE9FE] font-bold text-xs"
                />
              </div>
            </div>

            {/* Blood Pressure & Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={trackerInput.bloodPressure}
                  onChange={(e) => setTrackerInput({ ...trackerInput, bloodPressure: e.target.value })}
                  placeholder="e.g. 115/75"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" /> Daily Steps Walked
                </label>
                <input
                  type="text"
                  value={trackerInput.steps}
                  onChange={(e) => setTrackerInput({ ...trackerInput, steps: e.target.value })}
                  placeholder="e.g. 5400"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] font-medium text-xs"
                />
              </div>
            </div>

            {/* Symptoms Tags Selection */}
            <div>
              <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-2">Observed Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {availableSymptomsList.map((sym) => {
                  const isSelected = trackerInput.symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-[#FAF8FC] border border-[#EDE9FE] text-[#7a6f75] hover:border-[#7C3AED]/40'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Clinical / Care Notes</label>
              <textarea
                value={trackerInput.notes}
                onChange={(e) => setTrackerInput({ ...trackerInput, notes: e.target.value })}
                placeholder="Observed slight temperature rise after outdoor play, restful sleep..."
                rows={2}
                className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Dependent Health Log
            </button>
          </form>
        </div>

        {/* Recent Logs Timeline */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-4">
          <h4 className="font-bold text-lg text-[#3a3135]">Historical Health Logs</h4>

          {dependentTrackerLogs.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE] space-y-2">
              <Activity className="w-8 h-8 text-[#7C3AED] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[#3a3135]">No Health Logs Recorded</p>
              <p className="text-[11px] text-[#7a6f75]">Log daily biometric metrics and observed symptoms using the form.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dependentTrackerLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#7C3AED]">{log.dependent}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">{log.date}</span>
                    <button
                      onClick={() => deleteTrackerLog(log.id)}
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] text-[#3a3135] font-semibold">
                  <span>HR: {log.heartRate} bpm</span>
                  <span>BP: {log.bloodPressure}</span>
                  <span>Steps: {log.steps}</span>
                </div>

                {log.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.symptoms.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[9px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {log.notes && <p className="text-[11px] text-[#7a6f75] italic">{log.notes}</p>}
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
