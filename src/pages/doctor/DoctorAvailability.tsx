import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Trash2, Plus, ShieldCheck, CheckSquare, 
  Sparkles, Calendar, Sunrise, Sun, Moon, RefreshCw, AlertCircle, X 
} from 'lucide-react';
import { useDoctor, parseTimeToMinutes, formatMinutesToTime, generateSlotsBetween } from '../../context/DoctorContext';
import { isValidPatientCapacity } from '../../utils/validation';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = [
  '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', 
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
];

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
    handleSaveSchedule,
    toggleDay,
    setAllWorkingDays,
    customSlotInput,
    setCustomSlotInput,
    addCustomSlot,
    addSlot,
    removeSlot,
    clearAllSlots,
    generateSlotsForShifts
  } = useDoctor();

  const [slotGenerationStep, setSlotGenerationStep] = useState<number>(30);
  const [newSlotTime, setNewSlotTime] = useState<string>('09:00 AM');
  const [isSaving, setIsSaving] = useState(false);

  // Group active slots into time of day
  const morningSlots = scheduleSettings.availableSlots.filter(s => parseTimeToMinutes(s) < 12 * 60);
  const afternoonSlots = scheduleSettings.availableSlots.filter(s => {
    const m = parseTimeToMinutes(s);
    return m >= 12 * 60 && m < 17 * 60;
  });
  const eveningSlots = scheduleSettings.availableSlots.filter(s => parseTimeToMinutes(s) >= 17 * 60);

  const handleQuickAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlotTime) {
      addSlot(newSlotTime);
    }
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    await handleSaveSchedule();
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-inter">
      
      {/* 1. Header & Live Status Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Live Schedule Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-bold">
              {scheduleSettings.shifts.length} Shifts • {scheduleSettings.availableSlots.length} Bookable Slots
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              {scheduleSettings.shifts.reduce((acc, s) => acc + s.maxPatients, 0)} Daily Patient Quota
            </span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135] mt-2">Consultation Shifts & Slots Manager</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Configure shifts, create and customize appointment booking slots, set patient accommodation limits, and publish live availability.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => generateSlotsForShifts(30)}
            className="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            title="Automatically compute slots for all configured shifts in 30-min intervals"
          >
            <Sparkles className="w-4 h-4 text-[#7C3AED]" /> Auto-Generate Slots
          </button>

          <button 
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {scheduleSaveMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {scheduleSaveMsg}
        </div>
      )}

      {/* 2. Weekly Practice Days Selector */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-4">
          <div>
            <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7C3AED]" /> Weekly Working Practice Days
            </h4>
            <p className="text-xs text-[#7a6f75]">Select which days of the week your clinic / telehealth practice is open for bookings.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setAllWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer transition-colors"
            >
              Mon – Fri
            </button>
            <button
              type="button"
              onClick={() => setAllWorkingDays([...DAYS_OF_WEEK])}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-semibold cursor-pointer transition-colors"
            >
              All 7 Days
            </button>
            <button
              type="button"
              onClick={() => setAllWorkingDays([])}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {DAYS_OF_WEEK.map(day => {
            const isSelected = scheduleSettings.availableDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs' 
                    : 'bg-[#FAF8FC] text-gray-500 border-[#EDE9FE] hover:border-purple-200 hover:bg-white'
                }`}
              >
                <span>{day.slice(0, 3)}</span>
                <span className={`text-[10px] font-semibold ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                  {isSelected ? '✓ Open' : 'Off'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Consultation Shifts & Patient Capacity Quota Engine */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
          <div>
            <h4 className="font-bold text-base text-[#3a3135]">Consultation Shifts & Shift Windows</h4>
            <p className="text-xs text-[#7a6f75]">
              Define practice windows (From - To), set consultation mode, and cap maximum patient capacity per shift.
            </p>
          </div>
        </div>

        {/* Active Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduleSettings.shifts.map(shift => {
            const shiftSlots = generateSlotsBetween(shift.fromTime, shift.toTime, 30);
            return (
              <div 
                key={shift.id}
                className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED]/30 transition-all space-y-4 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      shift.mode === 'Virtual Telehealth' ? 'bg-purple-100 text-[#7C3AED]' :
                      shift.mode === 'In-Clinic' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
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
                    <span className="text-xs font-semibold text-[#3a3135]">Accommodation limit</span>
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
                      max={100}
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

                {/* Live Slot Preview for this shift */}
                <div className="pt-2 border-t border-[#EDE9FE]/80">
                  <div className="flex items-center justify-between text-[11px] text-[#7a6f75] mb-1.5">
                    <span className="font-semibold">Shift Slots Preview:</span>
                    <span className="font-mono font-bold text-[#7C3AED]">{shiftSlots.length} slots generated</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {shiftSlots.map(slot => (
                      <span 
                        key={slot} 
                        className="px-2 py-0.5 rounded-lg bg-white border border-[#EDE9FE] text-[10px] font-mono font-bold text-[#4a4145]"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Shift Window Form */}
        <div className="p-6 rounded-2xl bg-white border border-dashed border-[#7C3AED]/40 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-[#3a3135] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#7C3AED]" /> Add New Consultation Shift / Time Range
            </h5>
            <span className="text-[11px] text-[#7a6f75]">Adds the shift and automatically populates its time slots</span>
          </div>

          {shiftErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{shiftErrorMsg}</span>
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
                placeholder="e.g., Morning Clinic" 
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Consultation Mode</label>
              <select
                value={newShiftForm.mode}
                onChange={(e) => setNewShiftForm({ ...newShiftForm, mode: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                <option value="Both">Both (Virtual & In-Clinic)</option>
                <option value="Virtual Telehealth">Virtual Telehealth Only</option>
                <option value="In-Clinic">In-Clinic Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">From Time</label>
              <select 
                value={newShiftForm.fromTime} 
                onChange={(e) => setNewShiftForm({ ...newShiftForm, fromTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-mono font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">To Time</label>
              <select 
                value={newShiftForm.toTime} 
                onChange={(e) => setNewShiftForm({ ...newShiftForm, toTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] font-mono font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#7a6f75] uppercase text-[10px] mb-1">Max Patient Quota</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={newShiftForm.maxPatients} 
                  onChange={(e) => {
                    setNewShiftForm({ ...newShiftForm, maxPatients: Number(e.target.value) });
                    if (shiftErrorMsg) setShiftErrorMsg(null);
                  }}
                  min={1} 
                  max={100}
                  className="w-20 p-2.5 rounded-xl border border-[#EDE9FE] font-bold text-[#7C3AED] bg-[#FAF8FC] outline-none focus:border-[#7C3AED]"
                  required
                />
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 4. DEDICATED SLOTS MANAGEMENT & GENERATION HUB ("Make Slots") */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-[#3a3135] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7C3AED]" /> Consultation Appointment Slots ({scheduleSettings.availableSlots.length})
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Bookable by Patients
              </span>
            </div>
            <p className="text-xs text-[#7a6f75] mt-1">
              Patients select from these exact slot times when booking consultations. Add custom slots, generate slots across your shifts, or remove slots anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => generateSlotsForShifts(15)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-[#7C3AED] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              15m Slots
            </button>
            <button
              type="button"
              onClick={() => generateSlotsForShifts(30)}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#7C3AED] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              30m Slots (Default)
            </button>
            <button
              type="button"
              onClick={() => generateSlotsForShifts(45)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-[#7C3AED] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              45m Slots
            </button>
            <button
              type="button"
              onClick={() => generateSlotsForShifts(60)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-[#7C3AED] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              60m Slots
            </button>
            <button
              type="button"
              onClick={clearAllSlots}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Add Individual Custom Slot Form */}
        <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#3a3135]">Make / Add Specific Slot:</span>
            <span className="text-[11px] text-[#7a6f75]">Select or type any custom consultation time</span>
          </div>

          <form onSubmit={handleQuickAddSlot} className="flex items-center gap-2">
            <select
              value={newSlotTime}
              onChange={(e) => setNewSlotTime(e.target.value)}
              className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-mono font-bold text-xs text-[#3a3135] outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          </form>
        </div>

        {/* Interactive Slots Categorized by Time of Day */}
        {scheduleSettings.availableSlots.length === 0 ? (
          <div className="p-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE] space-y-3">
            <Clock className="w-10 h-10 text-gray-400 mx-auto opacity-50" />
            <h4 className="font-serif text-lg font-bold text-[#3a3135]">No Slots Currently Configured</h4>
            <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
              You haven't generated any consultation slots yet. Click below to automatically generate slots based on your active shifts, or add custom slots above.
            </p>
            <button
              type="button"
              onClick={() => generateSlotsForShifts(30)}
              className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#6D28D9] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate 30-min Shift Slots
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Morning Section */}
            {morningSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3a3135]">
                  <Sunrise className="w-4 h-4 text-amber-500" />
                  <span>Morning Slots ({morningSlots.length})</span>
                  <span className="text-[10px] text-gray-400 font-normal">Before 12:00 PM</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {morningSlots.map(slot => (
                    <div
                      key={slot}
                      className="group px-3 py-2 rounded-xl bg-white border border-[#EDE9FE] hover:border-purple-300 shadow-2xs flex items-center gap-2 text-xs font-mono font-bold text-[#3a3135] transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot)}
                        className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5 rounded cursor-pointer"
                        title="Remove slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon Section */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3a3135]">
                  <Sun className="w-4 h-4 text-orange-500" />
                  <span>Afternoon Slots ({afternoonSlots.length})</span>
                  <span className="text-[10px] text-gray-400 font-normal">12:00 PM – 05:00 PM</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {afternoonSlots.map(slot => (
                    <div
                      key={slot}
                      className="group px-3 py-2 rounded-xl bg-white border border-[#EDE9FE] hover:border-purple-300 shadow-2xs flex items-center gap-2 text-xs font-mono font-bold text-[#3a3135] transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot)}
                        className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5 rounded cursor-pointer"
                        title="Remove slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evening Section */}
            {eveningSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3a3135]">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Evening Slots ({eveningSlots.length})</span>
                  <span className="text-[10px] text-gray-400 font-normal">After 05:00 PM</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {eveningSlots.map(slot => (
                    <div
                      key={slot}
                      className="group px-3 py-2 rounded-xl bg-white border border-[#EDE9FE] hover:border-purple-300 shadow-2xs flex items-center gap-2 text-xs font-mono font-bold text-[#3a3135] transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => removeSlot(slot)}
                        className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5 rounded cursor-pointer"
                        title="Remove slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Practice Timing & Teleconsultation Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Overall Working Hours Window</label>
          <input 
            type="text" 
            value={scheduleSettings.workingHours} 
            onChange={(e) => setScheduleSettings({ ...scheduleSettings, workingHours: e.target.value })}
            className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED]"
            placeholder="e.g., 09:00 AM - 07:00 PM"
          />
          <p className="text-[11px] text-[#7a6f75]">Overall clinic and online practice envelope</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Default Slot Duration</label>
          <select 
            value={scheduleSettings.slotDuration} 
            onChange={(e) => {
              const newDur = e.target.value;
              setScheduleSettings({ ...scheduleSettings, slotDuration: newDur });
              const step = newDur.includes('15') ? 15 : newDur.includes('45') ? 45 : newDur.includes('60') ? 60 : 30;
              setSlotGenerationStep(step);
            }}
            className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED] cursor-pointer"
          >
            <option value="15 Minutes">15 Minutes / Session</option>
            <option value="30 Minutes">30 Minutes / Session (Standard)</option>
            <option value="45 Minutes">45 Minutes / Session</option>
            <option value="60 Minutes">60 Minutes / Session</option>
          </select>
          <p className="text-[11px] text-[#7a6f75]">Duration allocated per patient consultation</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-3">
          <label className="block font-bold uppercase text-[10px] text-[#7a6f75]">Telehealth Consultation Fee ($)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[#7a6f75] font-bold text-xs">$</span>
            <input 
              type="number" 
              value={scheduleSettings.teleconsultFee} 
              onChange={(e) => setScheduleSettings({ ...scheduleSettings, teleconsultFee: Number(e.target.value) })}
              className="w-full pl-8 p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135] bg-[#FAF8FC] outline-none focus:border-[#7C3AED]"
            />
          </div>
          <p className="text-[11px] text-[#7a6f75]">Per-session rate for virtual video consultations</p>
        </div>
      </div>

      {/* 6. Emergency / Urgent Telehealth Walk-ins */}
      <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-sm text-[#3a3135]">Emergency / Urgent Telehealth Walk-ins</h5>
            <p className="text-xs text-[#7a6f75]">Allow patients with critical biomarker alerts or acute pain to request immediate priority slots</p>
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
