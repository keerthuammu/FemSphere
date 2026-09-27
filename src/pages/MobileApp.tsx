import React from 'react';
import { useApp } from '../context/AppContext';
import MobileFrame from '../components/common/MobileFrame';
import TopAppBar from '../components/common/TopAppBar';
import BottomNav from '../components/common/BottomNav';
import UserDashboard from '../components/dashboard/UserDashboard';
import MenstrualCycleView from '../components/health/MenstrualCycleView';
import VitalsTelemetryView from '../components/health/VitalsTelemetryView';
import FitnessHubView from '../components/health/FitnessHubView';
import NutritionHydrationView from '../components/health/NutritionHydrationView';
import WearablesHubView from '../components/wearables/WearablesHubView';
import MedicalVaultView from '../components/vault/MedicalVaultView';
import MedicationsView from '../components/care/MedicationsView';
import AppointmentsView from '../components/care/AppointmentsView';
import TelehealthView from '../components/care/TelehealthView';
import PartnerSyncView from '../components/family/PartnerSyncView';
import CaregiverPortalView from '../components/family/CaregiverPortalView';
import DoctorPortalView from '../components/clinical/DoctorPortalView';
import AdminPortalView from '../components/admin/AdminPortalView';
import ProfileSettingsView from '../components/profile/ProfileSettingsView';
import AIChatSheet from '../components/twin/AIChatSheet';
import WorkoutPlayerModal from '../components/health/WorkoutPlayerModal';
import GlobalSearchModal from '../components/common/GlobalSearchModal';
import NotificationCenterModal from '../components/common/NotificationCenterModal';
import PrivacyCenterView from '../components/security/PrivacyCenterView';
import EmergencyScreenView from '../components/security/EmergencyScreenView';
import OnboardingFlow from '../components/auth/OnboardingFlow';
import AuthModal from '../components/auth/AuthModal';

export default function MobileApp() {
  const { role, activeTab, activeSubView, setActiveSubView } = useApp();

  // Render content according to user role and active navigation
  const renderMainContent = () => {
    // 1. Caregiver Role Experience
    if (role === 'caregiver') {
      return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <CaregiverPortalView />
        </div>
      );
    }

    // 2. Doctor Role Experience
    if (role === 'doctor') {
      return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <DoctorPortalView />
        </div>
      );
    }

    // 3. Admin Role Experience
    if (role === 'admin') {
      return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <AdminPortalView />
        </div>
      );
    }

    // 4. Primary Patient Experience by Tabs:
    switch (activeTab) {
      case 'home':
        return <UserDashboard />;

      case 'health':
        return (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
            {/* Sub-navigation bar inside Health */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {[
                { id: 'cycle', label: '🌸 Cycle' },
                { id: 'vitals', label: '🩺 Vitals' },
                { id: 'fitness', label: '🏃 Movement' },
                { id: 'nutrition', label: '🥗 Nutrition' },
                { id: 'wearables', label: '⌚ Wearables' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubView(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                    activeSubView === sub.id || (activeSubView === 'overview' && sub.id === 'cycle')
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-view switches */}
            {activeSubView === 'cycle' || activeSubView === 'overview' ? <MenstrualCycleView /> : null}
            {activeSubView === 'vitals' && <VitalsTelemetryView />}
            {activeSubView === 'fitness' && <FitnessHubView />}
            {activeSubView === 'nutrition' && <NutritionHydrationView />}
            {activeSubView === 'wearables' && <WearablesHubView />}
          </div>
        );

      case 'twin':
        return (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
            <div className="bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                  FemSphere Neural Core
                </span>
                <h2 className="text-xl font-bold tracking-tight">
                  Your Lifetime AI Health Twin
                </h2>
                <p className="text-xs text-purple-100 max-w-md leading-relaxed">
                  Continuously fusing circadian temperature, heart rate variability, sleep stages, and laboratory panels into an actionable predictive health model.
                </p>
              </div>
            </div>

            <VitalsTelemetryView />
          </div>
        );

      case 'care':
        return (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
            {/* Sub-navigation bar inside Care */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {[
                { id: 'appointments', label: '📅 Consultations' },
                { id: 'vault', label: '📁 Medical Vault' },
                { id: 'meds', label: '💊 Medications' },
                { id: 'partner', label: '💗 Partner Sync' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubView(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                    activeSubView === sub.id || (activeSubView === 'overview' && sub.id === 'appointments')
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {activeSubView === 'appointments' || activeSubView === 'overview' ? <AppointmentsView /> : null}
            {activeSubView === 'vault' && <MedicalVaultView />}
            {activeSubView === 'meds' && <MedicationsView />}
            {activeSubView === 'partner' && <PartnerSyncView />}
          </div>
        );

      case 'profile':
        return (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <ProfileSettingsView />
          </div>
        );

      default:
        return <UserDashboard />;
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-full flex flex-col justify-between">
        {/* Top App Bar with Search, SOS, Notifications & Theme Toggle */}
        <TopAppBar />

        {/* Dynamic App Content Body */}
        <main className="flex-1 w-full pb-6">
          {renderMainContent()}
        </main>

        {/* Bottom Navigation with Role Adapters */}
        <BottomNav />

        {/* Global Overlays & Modals */}
        <AIChatSheet />
        <WorkoutPlayerModal />
        <GlobalSearchModal />
        <NotificationCenterModal />
        <PrivacyCenterView />
        <EmergencyScreenView />
        <OnboardingFlow />
        <AuthModal />
        <TelehealthView />
      </div>
    </MobileFrame>
  );
}
