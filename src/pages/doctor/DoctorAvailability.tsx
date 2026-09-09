import { 
  CheckCircle2, Clock, Trash2, Plus, ShieldCheck, CheckSquare 
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { isValidPatientCapacity } from '../../utils/validation';

export default function DoctorAvailability() {
  const {
    scheduleSettings,
    setScheduleSettings,
    scheduleSaveMsg,
    newShiftForm,
    setNewShiftForm,
    handleAddShift,
    shiftErrorMsg,
    setShiftErrorMsg,
    handleUpdateShiftMaxPatients,
    handleSetShiftMaxPatients,
    handleDeleteShift,
    handleSaveSchedule
  } = useDoctor();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Status Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Dynamic Capacity Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-bold">
              {scheduleSettings.shifts.length} Active Shifts • {scheduleSettings.shifts.reduce((acc, s) => acc + s.maxPatients, 0)} Total Daily Capacity
            </span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135] mt-2">Consultation Shifts & Patient Capacity Limits</h3>
          <p className="text-xs text-[#7a6f75] mt-1">Configure consultation time ranges (e.g., 9 to 12 or 5 to 7) and set the maximum patient quota allowed per window.</p>
        </div>

        <button 
          onClick={handleSaveSchedule}
          className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <CheckSquare className="w-4 h-4" /> Save & Publish Schedule
        </button>
      </div>

      {scheduleSaveMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {scheduleSaveMsg}
        </div>
      )}

      {/* 1. Consultation Time Shifts & Patient Capacity Quota Engine */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
          <div>
            <h4 className="font-bold text-base text-[#3a3135]">1. Consultation Shifts & Max Patient Limits</h4>
            <p className="text-xs text-[#7a6f75]">Set your time ranges (From - To) and adjust the maximum patient capacity. Booking closes automatically when limit is reached.</p>
          </div>
        </div>

        {/* Active Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleSettings.shifts.map(shift => (
            <div 
              key={shift.id}
              className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED]/30 transition-all space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#7C3AED]">
                    {shift.mode}
                  </span>
                  <h5 className="font-bold text-base text-[#3a3135] mt-1">{shift.name}</h5>
                  <p className="text-xs font-bold text-[#7C3AED] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {shift.fromTime} ➔ {shift.toTime}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleDeleteShift(shift.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete shift"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Capacity Stepper */}
              <div className="p-3 bg-white rounded-xl border border-[#EDE9FE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Max Patient Quota</span>
                  <span className="text-xs font-semibold text-[#3a3135]">Allowed bookings per day</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => handleUpdateShiftMaxPatients(shift.id, -1)}
                    className="w-8 h-8 rounded-lg bg-[#FAF8FC] hover:bg-purple-100 text-[#7C3AED] font-bold flex items-center justify-center border border-[#EDE9FE] cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={shift.maxPatients} 
                    onChange={(e) => handleSetShiftMaxPatients(shift.id, Number(e.target.value))}
                    min={1}
                    className="w-14 text-center font-bold text-sm text-[#7C3AED] py-1 border border-[#EDE9FE] rounded-lg"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleUpdateShiftMaxPatients(shift.id, 1)}
                    className="w-8 h-8 rounded-lg bg-[#FAF8FC] hover:bg-purple-100 text-[#7C3AED] font-bold flex items-center justify-center border border-[#EDE9FE] cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs font-bold text-[#7a6f75]">Patients</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Shift Window Form */}
        <div className="p-5 rounded-2xl bg-white border border-dashed border-[#7C3AED]/40 space-y-4">
          <h5 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#7C3AED]" /> Add New Consultation Shift / Time Range
          </h5>

          {shiftErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl">
              {shiftErrorMsg}
            </div>
          )}

          <form onSubmit={handleAddShift} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Shift Name</label>
              <input 
                type="text" 
                value={newShiftForm.name} 
                onChange={(e) => {
                  setNewShiftForm({ ...newShiftForm, name: e.target.value });
                  if (shiftErrorMsg) setShiftErrorMsg(null);
                }}
                placeholder="e.g., Evening Clinic" 
                className={`w-full p-2.5 rounded-xl border ${newShiftForm.name && newShiftForm.name.trim().length > 0 && newShiftForm.name.trim().length < 2 ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} font-bold text-[#3a3135]`}
                required
              />
              {newShiftForm.name && newShiftForm.name.trim().length > 0 && newShiftForm.name.trim().length < 2 && (
                <p className="text-[10px] text-red-500 mt-1">Min 2 characters</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">From Time</label>
              <input 
                type="text" 
                value={newShiftForm.fromTime} 
                onChange={(e) => setNewShiftForm({ ...newShiftForm, fromTime: e.target.value })}
                placeholder="09:00 AM" 
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-mono text-[#3a3135]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">To Time</label>
              <input 
                type="text" 
                value={newShiftForm.toTime} 
                onChange={(e) => setNewShiftForm({ ...newShiftForm, toTime: e.target.value })}
                placeholder="12:00 PM" 
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-mono text-[#3a3135]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Max Patients</label>
              <input 
                type="number" 
                value={newShiftForm.maxPatients} 
                onChange={(e) => {
                  setNewShiftForm({ ...newShiftForm, maxPatients: Number(e.target.value) });
                  if (shiftErrorMsg) setShiftErrorMsg(null);
                }}
                min={1} 
                max={100}
                className={`w-full p-2.5 rounded-xl border ${newShiftForm.maxPatients !== undefined && !isValidPatientCapacity(Number(newShiftForm.maxPatients)) ? 'border-rose-400 bg-rose-50/20' : 'border-[#EDE9FE]'} font-bold text-[#7C3AED]`}
                required
              />
              {newShiftForm.maxPatients !== undefined && !isValidPatientCapacity(Number(newShiftForm.maxPatients)) && (
                <p className="text-[10px] text-red-500 mt-1">Between 1 and 100</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Action</label>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                + Add Shift
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Practice Timing & Teleconsultation Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Overall Working Hours Window</label>
          <input 
            type="text" 
            value={scheduleSettings.workingHours} 
            onChange={(e) => setScheduleSettings({ ...scheduleSettings, workingHours: e.target.value })}
            className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135]"
            placeholder="e.g., 09:00 AM - 07:00 PM"
          />
          <p className="text-[11px] text-[#7a6f75]">Clinic and online practice envelope</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Consultation Slot Duration</label>
          <select 
            value={scheduleSettings.slotDuration} 
            onChange={(e) => setScheduleSettings({ ...scheduleSettings, slotDuration: e.target.value })}
            className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135] bg-white cursor-pointer"
          >
            <option value="15 Minutes">15 Minutes / Session</option>
            <option value="30 Minutes">30 Minutes / Session (Recommended)</option>
            <option value="45 Minutes">45 Minutes / Session</option>
            <option value="60 Minutes">60 Minutes / Session</option>
          </select>
          <p className="text-[11px] text-[#7a6f75]">Length allocated for each health twin review</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Telehealth Consultation Fee ($)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[#7a6f75] font-bold text-xs">$</span>
            <input 
              type="number" 
              value={scheduleSettings.teleconsultFee} 
              onChange={(e) => setScheduleSettings({ ...scheduleSettings, teleconsultFee: Number(e.target.value) })}
              className="w-full pl-8 p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135]"
            />
          </div>
          <p className="text-[11px] text-[#7a6f75]">Per-session rate for virtual consultations</p>
        </div>
      </div>

      {/* 3. Emergency / Urgent Telehealth Walk-ins */}
      <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-sm text-[#3a3135]">Emergency / Urgent Telehealth Walk-ins</h5>
            <p className="text-xs text-[#7a6f75]">Allow patients with critical biomarker alerts to request priority immediate slots</p>
          </div>
        </div>
        <input 
          type="checkbox" 
          checked={scheduleSettings.isUrgentCareOpen}
          onChange={(e) => setScheduleSettings({ ...scheduleSettings, isUrgentCareOpen: e.target.checked })}
          className="w-5 h-5 text-[#7C3AED] rounded-md cursor-pointer accent-[#7C3AED]"
        />
      </div>
    </div>
  );
}
