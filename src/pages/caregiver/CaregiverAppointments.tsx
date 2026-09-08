import React, { useState } from 'react';
import { Calendar, Plus, Clock, Stethoscope, CheckCircle2, X } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverAppointments() {
  const { appointments, bookAppointment, cancelAppointment, dependents } = useCaregiver();
  const [showAddAptModal, setShowAddAptModal] = useState(false);
  const [newAptForm, setNewAptForm] = useState({
    dependent: dependents[0]?.name || '',
    doctor: 'Dr. Sarah Jenkins (Pediatrics)',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: ''
  });

  let docSchedule = {
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:00 AM - 07:00 PM',
    shifts: [
      {
        id: 'SHIFT-01',
        name: 'Morning Clinical Session',
        fromTime: '09:00 AM',
        toTime: '12:00 PM',
        maxPatients: 6,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        mode: 'Both'
      },
      {
        id: 'SHIFT-02',
        name: 'Evening Telehealth Session',
        fromTime: '05:00 PM',
        toTime: '07:00 PM',
        maxPatients: 4,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        mode: 'Virtual Telehealth'
      }
    ],
    teleconsultFee: 75
  };

  try {
    const stored = localStorage.getItem('femsphere_doctor_schedule');
    if (stored) {
      const parsed = JSON.parse(stored);
      docSchedule = {
        ...docSchedule,
        ...parsed,
        shifts: parsed.shifts && parsed.shifts.length > 0 ? parsed.shifts : docSchedule.shifts
      };
    }
  } catch (e) {}

  const selectedDate = newAptForm.date || new Date().toISOString().split('T')[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptForm.date || !newAptForm.doctor) return;
    await bookAppointment(newAptForm);
    setNewAptForm({
      dependent: dependents[0]?.name || '',
      doctor: 'Dr. Sarah Jenkins (Pediatrics)',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reason: ''
    });
    setShowAddAptModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-inter">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-1">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Clinical Consultations</span>
          </div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Doctor Appointments</h3>
          <p className="text-xs text-[#7a6f75] mt-1">
            Schedule and oversee in-clinic reviews, maternal followups, and virtual consultations for your dependents.
          </p>
        </div>

        <button
          onClick={() => setShowAddAptModal(true)}
          className="px-5 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" /> Book Consultation
        </button>
      </div>

      {/* Shifts Capacity Banner */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 rounded-3xl border border-[#EDE9FE] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C3AED]" />
            <h4 className="font-bold text-sm text-[#3a3135]">Today's Shift Capacity & Clinic Timetable</h4>
          </div>
          <span className="text-xs font-bold text-[#7C3AED] bg-white px-3 py-1 rounded-full border border-[#EDE9FE]">
            Fee: ${docSchedule.teleconsultFee} / Session
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docSchedule.shifts.map((shift: any) => {
            const bookedInShift = appointments.filter(
              (a) =>
                a.date === selectedDate &&
                a.status !== 'Cancelled' &&
                a.time &&
                a.time >= shift.fromTime &&
                a.time <= shift.toTime
            ).length;
            const remaining = Math.max(0, shift.maxPatients - bookedInShift);
            const isFull = remaining <= 0;

            return (
              <div
                key={shift.id}
                className={`p-4 rounded-2xl border bg-white flex items-center justify-between transition-all ${
                  isFull ? 'border-red-200 bg-red-50/40' : 'border-[#EDE9FE] hover:border-[#7C3AED]/50'
                }`}
              >
                <div>
                  <h5 className="font-bold text-xs text-[#3a3135]">{shift.name}</h5>
                  <p className="text-[11px] text-[#7a6f75] mt-0.5">
                    {shift.fromTime} - {shift.toTime} ({shift.mode})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                    isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isFull ? 'Shift Full' : `${remaining} Slots Left`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List or Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EDE9FE] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Consultations Scheduled</h4>
          <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
            You currently have no scheduled appointments. Book routine health checkups, pediatrics, or specialist visits for your dependents above.
          </p>
          <button
            onClick={() => setShowAddAptModal(true)}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book First Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-3xl border border-[#EDE9FE] bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-[10px]">
                    {apt.dependent}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Cancelled'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-[#3a3135]">{apt.doctor}</h4>
                <p className="text-xs text-[#7a6f75]">{apt.reason}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EDE9FE]">
              <div className="sm:text-right">
                <span className="text-xs font-bold text-[#3a3135] block">{apt.date}</span>
                <span className="text-xs text-pink-600 font-bold block">{apt.time}</span>
              </div>
              {apt.status === 'Scheduled' && (
                <button
                  onClick={() => cancelAppointment(apt.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      {showAddAptModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EDE9FE] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center border border-[#EDE9FE]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Book Doctor Consultation</h3>
                  <p className="text-xs text-[#7a6f75]">Schedule clinical care for your dependent based on shift capacity</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAptModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Select Dependent</label>
                <select
                  value={newAptForm.dependent}
                  onChange={(e) => setNewAptForm({ ...newAptForm, dependent: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold text-[#3a3135] text-xs"
                >
                  {dependents.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Healthcare Specialist</label>
                <select
                  value={newAptForm.doctor}
                  onChange={(e) => setNewAptForm({ ...newAptForm, doctor: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] bg-white font-bold text-[#3a3135] text-xs"
                >
                  <option value="Dr. Sarah Jenkins (Pediatrics & Maternal Care)">Dr. Sarah Jenkins (Pediatrics & Maternal Care)</option>
                  <option value="Dr. Alan Vance (Geriatrics & Chronic Wellness)">Dr. Alan Vance (Geriatrics & Chronic Wellness)</option>
                  <option value="Dr. Emily Watson (Dermatology & Allergy Care)">Dr. Emily Watson (Dermatology & Allergy Care)</option>
                  <option value="Dr. Robert Miller (Cardiovascular & Vitals)">Dr. Robert Miller (Cardiovascular & Vitals)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">Date</label>
                <input
                  type="date"
                  value={newAptForm.date}
                  onChange={(e) => setNewAptForm({ ...newAptForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs font-bold text-[#3a3135]"
                  required
                />
              </div>

              {/* Consultation Shifts & Capacity Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#3a3135] uppercase text-[10px]">
                    Doctor's Consultation Shifts ({selectedDate})
                  </label>
                  <span className="text-[10px] font-bold text-[#7C3AED]">${docSchedule.teleconsultFee} / Session</span>
                </div>

                <div className="space-y-2">
                  {docSchedule.shifts.map((shift: any) => {
                    const bookedInShift = appointments.filter(
                      (a) =>
                        a.date === selectedDate &&
                        a.status !== 'Cancelled' &&
                        a.time &&
                        a.time >= shift.fromTime &&
                        a.time <= shift.toTime
                    ).length;
                    const remaining = Math.max(0, shift.maxPatients - bookedInShift);
                    const isFull = remaining <= 0;
                    const isSelected = newAptForm.time >= shift.fromTime && newAptForm.time <= shift.toTime;

                    return (
                      <div
                        key={shift.id}
                        onClick={() => {
                          if (!isFull) {
                            setNewAptForm({ ...newAptForm, time: shift.fromTime });
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isFull
                            ? 'bg-red-50/60 border-red-200 opacity-70 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-50 border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-xs'
                            : 'bg-[#FAF8FC] border-[#EDE9FE] hover:border-[#7C3AED]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-[#3a3135]">{shift.name}</span>
                            <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-100/70 px-2 py-0.5 rounded-full ml-2">
                              {shift.fromTime} - {shift.toTime}
                            </span>
                          </div>

                          <div>
                            {isFull ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                                🔴 FULL
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                🟢 {remaining} of {shift.maxPatients} Left
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3a3135] uppercase text-[10px] mb-1">
                  Reason for Visit / Symptoms
                </label>
                <input
                  type="text"
                  value={newAptForm.reason}
                  onChange={(e) => setNewAptForm({ ...newAptForm, reason: e.target.value })}
                  placeholder="e.g., Annual booster checkup, joint pain review"
                  className="w-full p-3 rounded-xl border border-[#EDE9FE] text-xs"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#EDE9FE]">
                <button
                  type="button"
                  onClick={() => setShowAddAptModal(false)}
                  className="flex-1 py-3 border border-[#EDE9FE] rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
