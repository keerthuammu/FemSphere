import React, { useState } from 'react';
import { Plus, Calendar, Clock, Stethoscope, Trash2, XCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserAppointments() {
  const {
    appointments,
    setShowBookModal,
    handleCancelAppointment,
    handleDeleteAppointment
  } = useUser();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Scheduled' | 'Completed' | 'Cancelled'>('All');

  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div>
          <h3 className="font-bold text-xl text-[#3a3135]">Appointments Management</h3>
          <p className="text-xs text-[#7a6f75]">Book doctor consultations and review appointment history</p>
        </div>
        <button 
          onClick={() => setShowBookModal(true)} 
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-[#EDE9FE] pb-2 text-xs">
        {(['All', 'Scheduled', 'Completed', 'Cancelled'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === filter
                ? 'bg-[#7C3AED] text-white shadow-2xs'
                : 'text-[#7a6f75] hover:bg-[#FAF8FC] hover:text-[#3a3135]'
            }`}
          >
            {filter} ({filter === 'All' ? appointments.length : appointments.filter(a => a.status === filter).length})
          </button>
        ))}
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="space-y-3">
        {filteredAppointments.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs transition-all shadow-2xs">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  a.status === 'Scheduled' 
                    ? 'bg-purple-100 text-[#7C3AED]' 
                    : a.status === 'Completed' || a.status === 'Accepted'
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {a.status}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED]">
                  {a.type || 'Virtual Telehealth'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <Stethoscope className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <p className="font-bold text-[#3a3135] text-sm">{a.doctor}</p>
              </div>

              <p className="text-[#64595e]"><b>Reason:</b> {a.reason}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#7a6f75]">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {a.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {a.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {a.status === 'Scheduled' && (
                <button 
                  onClick={() => handleCancelAppointment(a.id)} 
                  className="px-3.5 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
              <button 
                onClick={() => handleDeleteAppointment(a.id)} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Delete Appointment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[#EDE9FE] rounded-3xl text-[#7a6f75] text-xs">
            No appointments found in this view. Click "Book Appointment" to schedule your clinical consultation.
          </div>
        )}
      </div>
    </div>
  );
}
