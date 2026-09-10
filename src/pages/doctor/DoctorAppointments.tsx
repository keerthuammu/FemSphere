import React, { useState } from 'react';
import { Plus, Calendar, Clock, Menu, Droplet } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { isAppointmentSlotActive } from '../../utils/appointmentSlot';
import DoctorPatientCycleModal from '../../components/DoctorPatientCycleModal';

export default function DoctorAppointments() {
  const {
    appointments,
    appointmentFilter,
    setAppointmentFilter,
    setShowBookAppointmentModal,
    handleStartDoctorCall,
    handleUpdateAppointmentStatus,
    handleOpenPrescribeForAppointment,
    fetchPatientCycleProfile
  } = useDoctor();

  const [selectedCyclePatient, setSelectedCyclePatient] = useState<{ id: number; name: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(a => {
    if (appointmentFilter === 'All') return true;
    if (appointmentFilter === 'Upcoming') {
      return a.date > todayStr || (a.date === todayStr && a.status === 'Scheduled');
    }
    if (appointmentFilter === 'Today') {
      return a.date === todayStr;
    }
    return a.status === appointmentFilter;
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#EDE9FE] shadow-xs space-y-4 font-inter">
      {/* MINIMAL HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-3.5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3a3135]">Appointments</h2>
          <p className="text-xs text-[#7a6f75] mt-0.5">Manage consultation slots, telehealth calls, and prescriptions</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <select 
            value={appointmentFilter} 
            onChange={(e) => setAppointmentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FC] text-xs font-semibold text-[#4a4145] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="All">All ({appointments.length})</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Today">Today</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            onClick={() => setShowBookAppointmentModal(true)} 
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Book Appointment
          </button>
        </div>
      </div>

      {/* APPOINTMENT LIST */}
      {filteredAppointments.length === 0 ? (
        <div className="py-12 text-center bg-[#FAF8FC] rounded-xl border border-dashed border-[#EDE9FE] space-y-2">
          <Calendar className="w-8 h-8 text-[#7C3AED] mx-auto opacity-40" />
          <h4 className="font-bold text-sm text-[#3a3135]">No Appointments Found</h4>
          <p className="text-xs text-[#7a6f75]">No consultation bookings match the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredAppointments.map(apt => (
            <div 
              key={apt.id} 
              className="p-4 rounded-xl border border-[#EDE9FE] bg-white hover:border-[#7C3AED]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              {/* PATIENT DETAILS */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#3a3135]">{apt.patient}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF8FC] border border-[#EDE9FE] text-[#7C3AED] font-semibold text-[10px]">
                    {apt.type}
                  </span>
                  {apt.cycleBadge && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px] flex items-center gap-1">
                      <Droplet className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                      {apt.cycleBadge}
                    </span>
                  )}
                </div>
                {apt.reason && (
                  <p className="text-[#7a6f75] text-xs">{apt.reason}</p>
                )}
                <p className="text-[11px] text-[#7a6f75] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3 h-3 text-[#7C3AED]" />
                  <span>{apt.date}</span>
                  <span>•</span>
                  <b className="text-[#3a3135]">{apt.time}</b>
                </p>
              </div>

              {/* STATUS & HAMBURGER ACTION MENU */}
              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                  apt.status === 'Accepted' || apt.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                  apt.status === 'Completed' ? 'bg-purple-100 text-[#7C3AED]' : 'bg-rose-100 text-rose-800'
                }`}>
                  {apt.status}
                </span>

                {/* HAMBURGER MENU BUTTON */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === apt.id ? null : apt.id)}
                    className="p-1.5 rounded-lg border border-[#EDE9FE] bg-white hover:bg-[#FAF8FC] hover:border-[#7C3AED]/40 text-[#4A3B42] transition-colors cursor-pointer shadow-2xs"
                    title="Actions"
                    aria-label="Actions menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>

                  {/* ACTION DROPDOWN (NO ICONS AS REQUESTED) */}
                  {openMenuId === apt.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-[#EDE9FE] shadow-lg py-1 z-40 text-xs font-medium divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-100">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              const numId = parseInt(String(apt.patientId).replace(/\D/g, '')) || apt.numericId;
                              setSelectedCyclePatient({ id: numId, name: apt.patient });
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF8FC] hover:text-[#7C3AED] transition-colors cursor-pointer"
                          >
                            Cycle Profile
                          </button>

                          {apt.type === 'Virtual Telehealth' && (
                            <button
                              onClick={() => {
                                const slotStatus = isAppointmentSlotActive(apt.date, apt.time);
                                if (slotStatus.isActive) {
                                  handleStartDoctorCall(apt);
                                } else {
                                  alert(`Telehealth call can only be started during the scheduled slot.\n\n${slotStatus.reason}`);
                                }
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF8FC] hover:text-[#7C3AED] transition-colors cursor-pointer"
                            >
                              {isAppointmentSlotActive(apt.date, apt.time).isActive ? 'Start Call' : 'Call (Slot Inactive)'}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleOpenPrescribeForAppointment(apt);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF8FC] hover:text-[#7C3AED] transition-colors cursor-pointer"
                          >
                            Prescribe Rx & Exercise
                          </button>
                        </div>

                        {(apt.status !== 'Completed' || apt.status === 'Scheduled') && (
                          <div className="py-1">
                            {apt.status !== 'Completed' && (
                              <button
                                onClick={() => {
                                  handleUpdateAppointmentStatus(apt.id, 'Completed');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3.5 py-1.5 text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}

                            {apt.status === 'Scheduled' && (
                              <button
                                onClick={() => {
                                  handleUpdateAppointmentStatus(apt.id, 'Rejected');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attending Physician Patient Cycle Modal */}
      {selectedCyclePatient && (
        <DoctorPatientCycleModal
          isOpen={Boolean(selectedCyclePatient)}
          onClose={() => setSelectedCyclePatient(null)}
          patientId={selectedCyclePatient.id}
          patientName={selectedCyclePatient.name}
          fetchPatientCycleProfile={fetchPatientCycleProfile}
        />
      )}
    </div>
  );
}
