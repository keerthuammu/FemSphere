import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Syringe, Bell, Calendar, FileText, ArrowRight, Heart, Activity } from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverOverview() {
  const { dependents, vaccinations, medications, appointments, dependentTrackerLogs } = useCaregiver();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#FAF8FC] p-6 md:p-8 rounded-3xl border border-[#EDE9FE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-white/80 text-[#7C3AED] rounded-full text-xs font-bold uppercase tracking-wider border border-[#EDE9FE]">
            Caregiver Command Center
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#3a3135] mt-2">Family & Dependent Care Hub</h2>
          <p className="text-xs text-[#7a6f75] mt-1 max-w-xl">
            Monitor vitals, track prescriptions, schedule consultations, and oversee health timelines for all your linked family members and dependents.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/caregiver-dashboard/dependents"
            className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" /> Manage Dependents
          </Link>
          <Link
            to="/caregiver-dashboard/appointments"
            className="px-4 py-2.5 bg-white text-[#7C3AED] hover:bg-purple-50 text-xs font-bold rounded-xl border border-[#EDE9FE] shadow-2xs flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" /> Book Visit
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase">Total Dependents</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{dependents.length}</h3>
          <p className="text-xs text-teal-600 font-bold mt-1">Care profiles linked in database</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase">Upcoming Vaccinations</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Syringe className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{vaccinations.length}</h3>
          <p className="text-xs text-purple-600 font-bold mt-1">Active vaccine tracker boosters</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase">Medication Reminders</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#F472B6] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-serif font-bold text-[#3a3135] mt-3">{medications.length} Active</h3>
          <p className="text-xs text-pink-600 font-bold mt-1">Scheduled daily prescriptions</p>
        </div>
      </div>

      {/* Linked Dependents Quick List & Next Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Dependents Overview */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#3a3135]">Linked Dependents</h3>
            <Link to="/caregiver-dashboard/dependents" className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {dependents.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
              <p className="text-xs text-[#7a6f75]">No dependents registered yet.</p>
              <Link to="/caregiver-dashboard/dependents" className="mt-2 inline-block text-xs font-bold text-[#7C3AED] hover:underline">
                + Add your first dependent
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dependents.map((dep) => (
                <div key={dep.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm">
                      {dep.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#3a3135]">{dep.name}</h4>
                      <p className="text-xs text-[#7a6f75]">{dep.relation} • Blood: {dep.bloodGroup}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-[#EDE9FE]">
                    DOB: {dep.dob}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Consultations */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#3a3135]">Upcoming Consultations</h3>
            <Link to="/caregiver-dashboard/appointments" className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
              <p className="text-xs text-[#7a6f75]">No upcoming consultations scheduled.</p>
              <Link to="/caregiver-dashboard/appointments" className="mt-2 inline-block text-xs font-bold text-[#7C3AED] hover:underline">
                + Book a doctor consultation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      {apt.dependent}
                    </span>
                    <h4 className="font-bold text-xs text-[#3a3135]">{apt.doctor}</h4>
                    <p className="text-[11px] text-[#7a6f75]">{apt.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#3a3135] block">{apt.date}</span>
                    <span className="text-[11px] text-pink-600 font-bold block">{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
