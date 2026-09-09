import React from 'react';
import { 
  Activity, Edit3, Watch, RefreshCw, Utensils, Flame, 
  Footprints, HeartPulse, AlertCircle, Trash2, Plus 
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserTracker() {
  const {
    userProfile,
    bluetoothConnected,
    connectedDevice,
    smartwatchVitals,
    handleSyncWatchVitals,
    trackerLogs,
    trackerInput,
    setTrackerInput,
    editingTrackerId,
    setEditingTrackerId,
    trackerErrorMsg,
    handleSaveTrackerLog,
    handleEditTrackerLog,
    handleDeleteTrackerLog,
    symptomLogs,
    symptomInput,
    setSymptomInput,
    editingSymptomId,
    setEditingSymptomId,
    handleSaveSymptom,
    handleEditSymptom,
    handleDeleteSymptom
  } = useUser();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-8 font-inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Health Tracker</h3>
          <p className="text-xs text-[#7a6f75]">Manually log Food meals, Exercise workouts, Steps count, Water, Sleep, Vitals & Symptoms experienced</p>
        </div>
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] flex items-center gap-1.5 shadow-2xs">
          <Activity className="w-4 h-4 text-[#7C3AED]" /> Complete Health Logging Mode
        </span>
      </div>

      <div className="space-y-8">
        {/* Health Input Form */}
        <form onSubmit={handleSaveTrackerLog} className="bg-[#FAF8FC] p-6 rounded-3xl border border-[#EDE9FE] space-y-6">
          <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-3">
            <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#7C3AED]" />
              {editingTrackerId ? 'Edit Health Entry' : 'Manual & Watch Health Log Entry'}
            </h4>
            <span className="text-xs text-[#7a6f75] font-medium">Date: {new Date().toLocaleDateString()}</span>
          </div>

          {trackerErrorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {trackerErrorMsg}
            </div>
          )}

          {/* LIVE WATCH CONNECTED BANNER */}
          {bluetoothConnected && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-inter">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-700 shrink-0">
                  <Watch className="w-5 h-5 text-emerald-600 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                      Smartwatch Active: {connectedDevice}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      LIVE READINGS SYNCED
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Auto-filled metrics: <b>{smartwatchVitals.heartRate} bpm</b> • <b>{smartwatchVitals.steps} steps</b> • <b>{smartwatchVitals.calories} kcal burned</b> ({smartwatchVitals.battery}% Battery)
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleSyncWatchVitals} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-sync Watch
              </button>
            </div>
          )}

          {/* SECTION 1: FOOD & NUTRITION */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#7C3AED] flex items-center gap-1.5">
              <Utensils className="w-4 h-4" /> 1. Food & Calorie Intake
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-[#64595e] uppercase mb-1">Food / Meals Logged</label>
                <input 
                  type="text" 
                  placeholder="e.g. Oatmeal & Fruits (Breakfast), Salad (Lunch), Grilled Salmon (Dinner)" 
                  value={trackerInput.foodMeals} 
                  onChange={(e) => setTrackerInput({...trackerInput, foodMeals: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Calorie Intake (kcal)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1850" 
                  value={trackerInput.caloriesIntake} 
                  onChange={(e) => setTrackerInput({...trackerInput, caloriesIntake: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: EXERCISE & FITNESS */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#14B8A6] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#14B8A6]" /> 2. Exercise & Workout
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Exercise Activity</label>
                <input 
                  type="text" 
                  placeholder="e.g. Yoga, Morning Jog, Pilates, Gym" 
                  value={trackerInput.exerciseType} 
                  onChange={(e) => setTrackerInput({...trackerInput, exerciseType: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Duration (Minutes)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 35" 
                  value={trackerInput.exercise} 
                  onChange={(e) => setTrackerInput({...trackerInput, exercise: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#64595e] uppercase">Calories Burned (kcal)</label>
                  {bluetoothConnected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                    </span>
                  )}
                </div>
                <input 
                  type="number" 
                  placeholder="e.g. 250" 
                  value={trackerInput.caloriesBurned} 
                  onChange={(e) => setTrackerInput({...trackerInput, caloriesBurned: e.target.value})} 
                  className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: STEPS & DISTANCE */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#F472B6] flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-[#F472B6]" /> 3. Daily Steps & Distance
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#64595e] uppercase">Daily Steps Count</label>
                  {bluetoothConnected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                    </span>
                  )}
                </div>
                <input 
                  type="number" 
                  placeholder="e.g. 8420" 
                  value={trackerInput.steps} 
                  onChange={(e) => setTrackerInput({...trackerInput, steps: e.target.value})} 
                  className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#64595e] uppercase">Distance (Km)</label>
                  {bluetoothConnected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Watch Synced
                    </span>
                  )}
                </div>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g. 5.6" 
                  value={trackerInput.distanceKm} 
                  onChange={(e) => setTrackerInput({...trackerInput, distanceKm: e.target.value})} 
                  className={`w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-hidden ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: BODY VITALS & LIFESTYLE */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-purple-700" /> 4. Body Vitals & Lifestyle
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={trackerInput.weight} 
                  onChange={(e) => setTrackerInput({...trackerInput, weight: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Water (Liters)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={trackerInput.water} 
                  onChange={(e) => setTrackerInput({...trackerInput, water: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Sleep (Hours)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={trackerInput.sleep} 
                  onChange={(e) => setTrackerInput({...trackerInput, sleep: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Blood Pressure</label>
                <input 
                  type="text" 
                  placeholder="e.g. 120/78" 
                  value={trackerInput.bloodPressure} 
                  onChange={(e) => setTrackerInput({...trackerInput, bloodPressure: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#64595e] uppercase">Heart Rate (bpm)</label>
                  {bluetoothConnected && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Synced
                    </span>
                  )}
                </div>
                <input 
                  type="number" 
                  placeholder="e.g. 72" 
                  value={trackerInput.heartRate} 
                  onChange={(e) => setTrackerInput({...trackerInput, heartRate: e.target.value})} 
                  className={`w-full p-3 rounded-xl border bg-white ${bluetoothConnected ? 'border-emerald-300 bg-emerald-50/30' : 'border-[#EDE9FE]'}`} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Mood / Energy Level</label>
                <select 
                  value={trackerInput.mood} 
                  onChange={(e) => setTrackerInput({...trackerInput, mood: e.target.value})}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Energetic">✨ Energetic & Vibrant</option>
                  <option value="Good">😊 Good / Positive</option>
                  <option value="Normal">😐 Normal / Balanced</option>
                  <option value="Tired">😴 Tired / Sleepy</option>
                  <option value="Stressed">😰 Stressed / Anxious</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#64595e] uppercase mb-1">Health Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Completed hydration target, felt energized post morning workout..." 
                  value={trackerInput.notes} 
                  onChange={(e) => setTrackerInput({...trackerInput, notes: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE9FE]">
            {editingTrackerId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingTrackerId(null);
                  setTrackerInput({
                    weight: userProfile.weight,
                    water: '2.5',
                    sleep: '8.0',
                    exerciseType: 'Running & Cardio',
                    exercise: '30',
                    caloriesBurned: '250',
                    steps: '7500',
                    distanceKm: '5.0',
                    foodMeals: '',
                    caloriesIntake: '1800',
                    bloodPressure: '120/78',
                    heartRate: '72',
                    mood: 'Good',
                    notes: ''
                  });
                }}
                className="px-5 py-3 border border-[#EDE9FE] rounded-2xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="px-7 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer">
              {editingTrackerId ? 'Update Health Record' : 'Save Daily Health Record'}
            </button>
          </div>
        </form>

        {/* Health History List */}
        <div className="space-y-4">
          <h4 className="font-bold text-base text-[#3a3135]">Vitals & Activity History Logs</h4>
          {trackerLogs.map((log) => (
            <div key={log.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-white hover:bg-[#FAF8FC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-all shadow-2xs">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-[#7C3AED] text-sm bg-[#F5F3FF] px-3 py-1 rounded-xl border border-[#EDE9FE]">
                    {log.date}
                  </span>
                  {log.mood && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      Mood: {log.mood}
                    </span>
                  )}
                  {log.steps && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-emerald-600" /> {log.steps} steps ({log.distanceKm || '4.5'} km)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-[#3a3135]">
                  <div>💧 Water: <b>{log.water || '0'} L</b></div>
                  <div>🌙 Sleep: <b>{log.sleep || '0'} hrs</b></div>
                  <div>🏃 Exercise: <b>{log.exercise || '0'} mins</b> ({log.exerciseType || 'Workout'})</div>
                  <div>🔥 Calories: <b>{log.caloriesBurned || '0'} kcal</b></div>
                </div>

                {log.foodMeals && (
                  <p className="text-xs text-[#64595e]">
                    🥗 <b>Meals:</b> {log.foodMeals} {log.caloriesIntake ? `(${log.caloriesIntake} kcal)` : ''}
                  </p>
                )}

                {(log.bloodPressure || log.heartRate) && (
                  <p className="text-xs text-[#7a6f75]">
                    🩺 <b>Vitals:</b> BP {log.bloodPressure || '118/76'} • Heart Rate {log.heartRate || '72'} bpm • Weight {log.weight || '--'} kg
                  </p>
                )}

                {log.notes && <p className="text-xs text-[#7a6f75] italic">"{log.notes}"</p>}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button onClick={() => handleEditTrackerLog(log)} className="px-3.5 py-2 bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white font-bold rounded-xl transition-all cursor-pointer">
                  Edit
                </button>
                <button onClick={() => handleDeleteTrackerLog(log.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Delete Log">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {trackerLogs.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#EDE9FE] rounded-3xl text-[#7a6f75] text-xs">
              No health logs recorded yet. Use the form above to record your daily hydration, sleep, exercise, and vitals.
            </div>
          )}
        </div>

        {/* SECTION 5: SYMPTOMS TRACKER */}
        <div className="pt-6 border-t border-[#EDE9FE] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Logged Symptoms
              </h4>
              <p className="text-xs text-[#7a6f75]">Record headaches, cramps, nausea, or mood shifts for longitudinal AI tracking</p>
            </div>
          </div>

          <form onSubmit={handleSaveSymptom} className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Symptom Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Migraine, Abdominal Cramps, Fatigue"
                  value={symptomInput.symptomName}
                  onChange={(e) => setSymptomInput({...symptomInput, symptomName: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Severity</label>
                <select 
                  value={symptomInput.severity}
                  onChange={(e) => setSymptomInput({...symptomInput, severity: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#64595e] uppercase mb-1">Onset Date</label>
                <input 
                  type="date" 
                  value={symptomInput.date}
                  onChange={(e) => setSymptomInput({...symptomInput, date: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#64595e] uppercase mb-1">Notes / Description</label>
              <input 
                type="text" 
                placeholder="e.g. Mild headache post workout, subsided with hydration"
                value={symptomInput.description}
                onChange={(e) => setSymptomInput({...symptomInput, description: e.target.value})}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              {editingSymptomId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingSymptomId(null);
                    setSymptomInput({ symptomName: '', severity: 'Low', date: new Date().toISOString().split('T')[0], description: '' });
                  }}
                  className="px-4 py-2 border border-[#EDE9FE] rounded-xl font-bold cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold cursor-pointer"
              >
                {editingSymptomId ? 'Update Symptom' : 'Add Symptom'}
              </button>
            </div>
          </form>

          {/* Symptoms List */}
          <div className="space-y-3">
            {symptomLogs.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-[#EDE9FE] bg-white flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3a3135] text-sm">{s.symptomName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.severity === 'Critical' || s.severity === 'High' ? 'bg-red-100 text-red-800' : s.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.severity}
                    </span>
                    <span className="text-[#7a6f75]">{s.date}</span>
                  </div>
                  {s.description && <p className="text-[#7a6f75] mt-1">{s.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEditSymptom(s)} className="px-3 py-1.5 bg-[#EDE9FE] text-[#7C3AED] rounded-lg font-bold hover:bg-[#7C3AED] hover:text-white transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteSymptom(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {symptomLogs.length === 0 && (
              <p className="text-xs text-[#7a6f75] italic text-center py-4">No symptoms logged.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
