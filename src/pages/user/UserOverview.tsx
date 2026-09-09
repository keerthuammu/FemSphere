import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Calendar, Heart } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import AIHealthTwinInsights from '../../components/AIHealthTwinInsights';

import PubertyGrowingModule from '../../components/modules/PubertyGrowingModule';
import EarlyChildhoodModule from '../../components/modules/EarlyChildhoodModule';
import PregnancyDashboardModule from '../../components/modules/PregnancyDashboardModule';
import PostpartumDashboardModule from '../../components/modules/PostpartumDashboardModule';
import MidlifeMenopauseModule from '../../components/modules/MidlifeMenopauseModule';
import HealthyAgingModule from '../../components/modules/HealthyAgingModule';

export default function UserOverview() {
  const {
    userProfile,
    records,
    appointments,
    trackerLogs,
    currentStageCode
  } = useUser();

  const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;
  const latestVital = trackerLogs[0];

  return (
    <div className="space-y-8 font-inter">
      
      {/* TOP 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: User Profile Summary */}
        <div className="bg-[#7C3AED] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10">
            <User className="w-24 h-24" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Profile Summary
            </span>
            <h3 className="text-2xl font-bold mt-3 truncate">{userProfile.fullName || 'User Profile'}</h3>
            <p className="text-sm text-purple-100 mt-1 font-medium">
              {userProfile.bloodGroup || 'Blood Group N/A'} • {userProfile.height ? `${userProfile.height}cm` : '--'} / {userProfile.weight ? `${userProfile.weight}kg` : '--'}
            </p>
          </div>
          <Link 
            to="/dashboard/profile"
            className="mt-4 text-sm font-bold text-white hover:underline flex items-center gap-1"
          >
            View Full Profile →
          </Link>
        </div>

        {/* Card 2: Total Uploaded Medical Records */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Medical Records</span>
            <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold text-[#3a3135]">{records.length}</h3>
            <p className="text-sm text-[#7a6f75] font-medium mt-1">Uploaded to Vault</p>
          </div>
          <Link 
            to="/dashboard/records" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Manage Records →
          </Link>
        </div>

        {/* Card 3: Total Appointments */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Appointments</span>
            <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold text-[#3a3135]">{appointments.length}</h3>
            <p className="text-sm text-[#7C3AED] font-bold mt-1">
              {scheduledCount} Scheduled
            </p>
          </div>
          <Link 
            to="/dashboard/appointments" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            View Appointments →
          </Link>
        </div>

        {/* Card 4: Latest Vitals Update */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Latest Vitals</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Heart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-[#3a3135]">
              {latestVital?.water || '0'}L Water • {latestVital?.sleep || '0'}h Sleep
            </h3>
            <p className="text-sm text-emerald-600 font-bold mt-1">
              BP: {latestVital?.bloodPressure || '120/78'} • HR: {latestVital?.heartRate || '72'} bpm
            </p>
          </div>
          <Link 
            to="/dashboard/tracker" 
            className="mt-3 text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
          >
            Open Health Tracker →
          </Link>
        </div>
      </div>

      {/* AI Health Twin Insights Widget */}
      <AIHealthTwinInsights />

      {/* Dynamic Active Life Stage Module Render */}
      {(currentStageCode && currentStageCode !== 'REPRODUCTIVE_AGE' && currentStageCode !== 'YOUNG_ADULT' && currentStageCode !== 'MENSTRUATING_ADOLESCENT') && (
        <div className="mt-6">
          {currentStageCode === 'PREGNANCY' && <PregnancyDashboardModule />}
          {currentStageCode === 'POSTPARTUM' && <PostpartumDashboardModule />}
          {(currentStageCode === 'PERIMENOPAUSE' || currentStageCode === 'MENOPAUSE') && <MidlifeMenopauseModule />}
          {currentStageCode === 'OLDER_ADULT' && <HealthyAgingModule />}
          {(currentStageCode === 'PUBERTY' || currentStageCode === 'PRE_PUBERTY') && <PubertyGrowingModule />}
          {currentStageCode === 'EARLY_CHILDHOOD' && <EarlyChildhoodModule />}
        </div>
      )}

    </div>
  );
}
