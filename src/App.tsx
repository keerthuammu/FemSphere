import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';

// Caregiver Sub-Pages & Layout
import { CaregiverProvider } from './context/CaregiverContext';
import CaregiverLayout from './pages/caregiver/CaregiverLayout';
import CaregiverOverview from './pages/caregiver/CaregiverOverview';
import CaregiverDependents from './pages/caregiver/CaregiverDependents';
import CaregiverRecords from './pages/caregiver/CaregiverRecords';
import CaregiverVaccinations from './pages/caregiver/CaregiverVaccinations';
import CaregiverMedications from './pages/caregiver/CaregiverMedications';
import CaregiverAppointments from './pages/caregiver/CaregiverAppointments';
import CaregiverTracker from './pages/caregiver/CaregiverTracker';
import CaregiverReports from './pages/caregiver/CaregiverReports';
import CaregiverProfilePage from './pages/caregiver/CaregiverProfilePage';

// Doctor Sub-Pages & Layout
import { DoctorProvider } from './context/DoctorContext';
import DoctorLayout from './pages/doctor/DoctorLayout';
import DoctorOverview from './pages/doctor/DoctorOverview';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorRecords from './pages/doctor/DoctorRecords';
import DoctorConsultations from './pages/doctor/DoctorConsultations';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import DoctorPendingApproval from './pages/DoctorPendingApproval';

// Guard: redirect to /login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('femsphere_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Guard: redirect to /login if not authenticated, or to /dashboard if wrong role
function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const token = localStorage.getItem('femsphere_token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(localStorage.getItem('femsphere_user') || '{}');
    const role: string = user.role || '';
    if (!allowedRoles.includes(role)) {
      // Redirect to the appropriate dashboard based on actual role
      if (role === 'Admin (Superuser)' || role === 'Administrator') return <Navigate to="/admin" replace />;
      if (role === 'Doctor') {
        if (user.doctor?.approval_status !== 'Approved') return <Navigate to="/doctor-pending" replace />;
        return <Navigate to="/doctor-dashboard" replace />;
      }
      if (role === 'Caregiver') return <Navigate to="/caregiver-dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }

    // Ensure pending doctors cannot access doctor routes even if allowedRoles includes 'Doctor'
    if (role === 'Doctor' && user.doctor?.approval_status !== 'Approved') {
      return <Navigate to="/doctor-pending" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Guard for the Doctor Pending Approval page
function DoctorPendingRoute() {
  const token = localStorage.getItem('femsphere_token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(localStorage.getItem('femsphere_user') || '{}');
    if (user.role !== 'Doctor') {
      return <Navigate to="/dashboard" replace />;
    }
    // If doctor has been approved by admin, send directly to dashboard
    if (user.doctor?.approval_status === 'Approved') {
      return <Navigate to="/doctor-dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <DoctorPendingApproval />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User (Female) / Myself dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['Myself', 'User (Female)']}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['Admin (Superuser)', 'Administrator']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Caregiver dashboard with nested modular sub-routes */}
        <Route
          path="/caregiver-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['Caregiver']}>
              <CaregiverProvider>
                <CaregiverLayout />
              </CaregiverProvider>
            </RoleProtectedRoute>
          }
        >
          <Route index element={<CaregiverOverview />} />
          <Route path="dependents" element={<CaregiverDependents />} />
          <Route path="records" element={<CaregiverRecords />} />
          <Route path="vaccinations" element={<CaregiverVaccinations />} />
          <Route path="medications" element={<CaregiverMedications />} />
          <Route path="appointments" element={<CaregiverAppointments />} />
          <Route path="tracker" element={<CaregiverTracker />} />
          <Route path="reports" element={<CaregiverReports />} />
          <Route path="profile" element={<CaregiverProfilePage />} />
        </Route>

        {/* Doctor dashboard with nested modular sub-routes */}
        <Route
          path="/doctor-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['Doctor']}>
              <DoctorProvider>
                <DoctorLayout />
              </DoctorProvider>
            </RoleProtectedRoute>
          }
        >
          <Route index element={<DoctorOverview />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="records" element={<DoctorRecords />} />
          <Route path="consultations" element={<DoctorConsultations />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="availability" element={<DoctorAvailability />} />
          <Route path="profile" element={<DoctorProfilePage />} />
        </Route>

        {/* Doctor pending approval waiting page */}
        <Route path="/doctor-pending" element={<DoctorPendingRoute />} />
      </Routes>
    </Router>
  );
}
