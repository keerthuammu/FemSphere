import React from 'react';
import { CaregiverProvider } from '../context/CaregiverContext';
import CaregiverLayout from './caregiver/CaregiverLayout';

/**
 * CaregiverDashboard
 * 
 * Note: The Caregiver Dashboard has been modularized into separate sub-pages:
 * - src/pages/caregiver/CaregiverOverview.tsx
 * - src/pages/caregiver/CaregiverDependents.tsx
 * - src/pages/caregiver/CaregiverRecords.tsx
 * - src/pages/caregiver/CaregiverVaccinations.tsx
 * - src/pages/caregiver/CaregiverMedications.tsx
 * - src/pages/caregiver/CaregiverAppointments.tsx
 * - src/pages/caregiver/CaregiverTracker.tsx
 * - src/pages/caregiver/CaregiverReports.tsx
 * - src/pages/caregiver/CaregiverProfilePage.tsx
 * 
 * All routed under /caregiver-dashboard/* in src/App.tsx
 */
export default function CaregiverDashboard() {
  return (
    <CaregiverProvider>
      <CaregiverLayout />
    </CaregiverProvider>
  );
}
