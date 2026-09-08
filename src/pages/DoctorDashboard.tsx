import React from 'react';
import { DoctorProvider } from '../context/DoctorContext';
import DoctorLayout from './doctor/DoctorLayout';

/**
 * DoctorDashboard
 * 
 * Note: The Doctor Dashboard has been modularized into separate dedicated sub-pages:
 * - src/pages/doctor/DoctorOverview.tsx       -> /doctor-dashboard
 * - src/pages/doctor/DoctorPatients.tsx       -> /doctor-dashboard/patients
 * - src/pages/doctor/DoctorRecords.tsx        -> /doctor-dashboard/records
 * - src/pages/doctor/DoctorConsultations.tsx  -> /doctor-dashboard/consultations
 * - src/pages/doctor/DoctorAppointments.tsx   -> /doctor-dashboard/appointments
 * - src/pages/doctor/DoctorAvailability.tsx   -> /doctor-dashboard/availability
 * - src/pages/doctor/DoctorProfilePage.tsx    -> /doctor-dashboard/profile
 * 
 * All routed under /doctor-dashboard/* in src/App.tsx with DoctorProvider
 */
export default function DoctorDashboard() {
  return (
    <DoctorProvider>
      <DoctorLayout />
    </DoctorProvider>
  );
}
