import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  ChevronRight,
  User,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentItem } from '../../types';

export default function AppointmentsView() {
  const { appointments, bookAppointment, startTelehealthSession } = useApp();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Booking state
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Elena Vance');
  const [selectedDate, setSelectedDate] = useState('2026-08-04');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [appointmentType, setAppointmentType] = useState<'video' | 'in_person'>('video');
  const [consultReason, setConsultReason] = useState('Routine Maternal Progress Check');

  const upcomingApts = appointments.filter(a => a.status === 'upcoming');
  const pastApts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  const displayedApts = filter === 'upcoming' ? upcomingApts : pastApts;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      doctorName: selectedDoctor,
      specialty: selectedDoctor.includes('Vance')
        ? 'Obstetrics & Gynecology (OB/GYN)'
        : 'Clinical Endocrinology',
      avatar: selectedDoctor.includes('Vance')
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming',
      type: appointmentType,
      hospital: 'Mercy Telehealth Suite',
      notes: consultReason,
    });
    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Clinical Consultations & Telehealth
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Certified OB/GYN, endocrinologists, and specialized maternal physicians
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm min-h-[44px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Consult</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
            filter === 'upcoming'
              ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming ({upcomingApts.length})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
            filter === 'past'
              ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Past Visits ({pastApts.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {displayedApts.map(apt => (
          <div
            key={apt.id}
            className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={apt.avatar}
                  alt={apt.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-purple-100 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {apt.doctorName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        apt.type === 'video'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {apt.type === 'video' ? 'Video Telehealth' : 'In-Person Clinic'}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                    {apt.specialty}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {apt.hospital || 'Mercy Health Pavilion'}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {apt.date}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {apt.time}
                </span>
              </div>
            </div>

            {apt.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-purple-50 dark:border-slate-800">
                <strong>Visit Focus:</strong> {apt.notes}
              </p>
            )}

            {/* Actions for Upcoming Consultations */}
            {apt.status === 'upcoming' && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-50 dark:border-slate-800">
                <button
                  onClick={() => alert(`Reschedule request initiated for ${apt.doctorName}.`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => alert(`Appointment cancelled.`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 min-h-[44px]"
                >
                  Cancel
                </button>
                {apt.type === 'video' && (
                  <button
                    onClick={() =>
                      startTelehealthSession({
                        name: apt.doctorName,
                        specialty: apt.specialty,
                        avatar: apt.avatar,
                      })
                    }
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm min-h-[44px]"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Consultation</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Book Consult Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Book Medical Consultation
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Specialist
                </label>
                <select
                  value={selectedDoctor}
                  onChange={e => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option>Dr. Elena Vance (OB/GYN - Maternal & Fetal Health)</option>
                  <option>Dr. Marcus Reed (Clinical Endocrinologist)</option>
                  <option>Dr. Sophia Chen (Maternal-Fetal Sonologist)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>11:00 AM</option>
                    <option>02:15 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Consultation Medium
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('video')}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 min-h-[44px] ${
                      appointmentType === 'video'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>HD Telehealth Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType('in_person')}
                    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 min-h-[44px] ${
                      appointmentType === 'in_person'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Clinic Visit</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Consultation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discuss second-trimester iron levels"
                  value={consultReason}
                  onChange={e => setConsultReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                Confirm Appointment Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
