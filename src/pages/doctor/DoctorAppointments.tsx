import React from 'react';
import { Plus, Video, Users, Clock, Calendar } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';

export default function DoctorAppointments() {
  const {
    appointments,
    appointmentFilter,
    setAppointmentFilter,
    setShowBookAppointmentModal,
    setActiveTelehealthSession,
    handleUpdateAppointmentStatus
  } = useDoctor();

  const filteredAppointments = appointments.filter(
    a => appointmentFilter === 'All' || a.status === appointmentFilter
  );

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE9FE] pb-5">
        <div>
          <h3 className="font-serif text-3xl font-bold text-[#3a3135]">Clinical Appointment Hub</h3>
          <p className="text-xs text-[#7a6f75] mt-1">Manage consultation slots, in-clinic visits, and telehealth calls</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={appointmentFilter} 
            onChange={(e) => setAppointmentFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[#EDE9FE] bg-white text-xs font-bold text-[#4a4145] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            onClick={() => setShowBookAppointmentModal(true)} 
            className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE] space-y-3">
          <Calendar className="w-10 h-10 text-[#7C3AED] mx-auto opacity-50" />
          <h4 className="font-serif text-xl font-bold text-[#3a3135]">No Appointments Found</h4>
          <p className="text-xs text-[#7a6f75] max-w-sm mx-auto">No consultation bookings match the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map(apt => (
            <div key={apt.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-[#7C3AED]/30 transition-all shadow-2xs">
              <div className="flex items-start md:items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  apt.type === 'Virtual Telehealth' ? 'bg-purple-100 text-[#7C3AED]' : 'bg-teal-100 text-[#14B8A6]'
                }`}>
                  {apt.type === 'Virtual Telehealth' ? <Video className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#3a3135] text-sm">{apt.patient}</p>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#EDE9FE] text-[#7C3AED] font-bold text-[10px]">
                      {apt.type}
                    </span>
                  </div>
                  <p className="text-[#7a6f75] mt-0.5">{apt.reason}</p>
                  <p className="text-[11px] font-mono text-[#7a6f75] flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#7C3AED]" /> {apt.date} at <b className="text-[#3a3135]">{apt.time}</b>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                  apt.status === 'Accepted' || apt.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                  apt.status === 'Completed' ? 'bg-purple-100 text-[#7C3AED]' : 'bg-rose-100 text-rose-800'
                }`}>
                  {apt.status}
                </span>

                {apt.type === 'Virtual Telehealth' && (
                  <button 
                    onClick={() => setActiveTelehealthSession(apt)} 
                    className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" /> Teleconsult
                  </button>
                )}

                {apt.status !== 'Completed' && (
                  <button 
                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')} 
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Mark Completed
                  </button>
                )}

                {apt.status === 'Scheduled' && (
                  <button 
                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'Rejected')} 
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl cursor-pointer"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
