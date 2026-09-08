import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  LogOut, 
  Stethoscope, 
  Building2, 
  FileBadge, 
  Mail, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export default function DoctorPendingApproval() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'warning'>('info');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('femsphere_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // If already approved, immediately proceed to dashboard
        if (parsed.role === 'Doctor' && parsed.doctor?.approval_status === 'Approved') {
          navigate('/doctor-dashboard', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    } catch (e) {
      console.error('Error parsing user session', e);
    }
  }, [navigate]);

  const checkStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    const token = localStorage.getItem('femsphere_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const updatedUser = data.user;
          setUser(updatedUser);
          localStorage.setItem('femsphere_user', JSON.stringify(updatedUser));

          const currentApproval = updatedUser.doctor?.approval_status;
          if (currentApproval === 'Approved') {
            setStatusType('success');
            setStatusMessage('Congratulations! Your medical profile has been accepted by the admin. Redirecting to your dashboard...');
            setTimeout(() => {
              navigate('/doctor-dashboard');
            }, 1200);
            return;
          } else if (currentApproval === 'Rejected') {
            setStatusType('warning');
            setStatusMessage('Your application was not approved. Please contact FemSphere administration for credential verification.');
          } else {
            setStatusType('info');
            setStatusMessage('Status is still Pending. Administrator review is currently in progress.');
          }
        } else {
          setStatusType('info');
          setStatusMessage('Application review still in progress.');
        }
      } else {
        setStatusType('info');
        setStatusMessage('Status check complete. Awaiting administrator review.');
      }
    } catch (err) {
      console.error('Check status error:', err);
      setStatusType('info');
      setStatusMessage('Unable to connect to server. Please try again in a few moments.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  const doctorInfo = user?.doctor || {};
  const profile = user?.profile || {};
  const doctorName = user?.fullName || profile?.full_name || user?.username || 'Doctor';

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col justify-between font-sans">
      {/* Header Bar */}
      <header className="px-6 py-4 bg-white border-b border-[#EDE9FE] shadow-sm flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-[#7C3AED]">FemSphere</span>
          <Sparkles className="w-4 h-4 text-[#14B8A6]" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-[#7a6f75] hover:text-red-600 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-[#EDE9FE] p-8 md:p-10 text-center space-y-6">
          
          {/* Animated Status Icon */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center relative">
            <Clock className="w-10 h-10 text-amber-600 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          {/* Core Title - Explicit User Requirement */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Admission Pending
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#3a3135] tracking-tight">
              Please wait till admin accepts this doctor
            </h1>
            <p className="text-[#64595e] text-base mt-2 max-w-lg mx-auto leading-relaxed">
              Your doctor registration has been received successfully. For clinical safety and compliance, an administrator must verify and admit your credentials before you can access the doctor dashboard.
            </p>
          </div>

          {/* Status Alert Notification if any */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 text-left transition-all ${
              statusType === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : statusType === 'warning'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {statusType === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              ) : statusType === 'warning' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              ) : (
                <Clock className="w-5 h-5 flex-shrink-0 text-amber-600" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Submitted Doctor Details Card */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE] p-5 text-left space-y-3">
            <h3 className="text-xs font-bold text-[#7a6f75] uppercase tracking-wider">Submitted Clinical Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-[#3a3135]">
                <Stethoscope className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                <span className="font-semibold">Dr. {doctorName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#3a3135]">
                <Mail className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                <span className="truncate">{user?.email || 'doctor@femsphere.health'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#3a3135]">
                <FileBadge className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                <span>License: <strong className="font-mono">{doctorInfo.license_number || 'Pending Verification'}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#3a3135]">
                <Building2 className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                <span className="truncate">{doctorInfo.hospital_clinic || 'FemSphere Health'}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#7a6f75]">
              <span>Specialization: <strong className="text-[#3a3135]">{doctorInfo.specialization || 'Obstetrics & Gynecology'}</strong></span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Pending Review</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Admission Status...' : 'Check Approval Status'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#EDE9FE] text-[#64595e] hover:bg-gray-50 font-semibold text-sm transition"
            >
              Sign Out
            </button>
          </div>

          {/* Reassurance Footer */}
          <p className="text-xs text-[#9c8e96] pt-4 border-t border-[#F3EEFA]">
            Need immediate administrative assistance? Contact <a href="mailto:admin@femsphere.health" className="text-[#7C3AED] underline">admin@femsphere.health</a> with your Medical License ID.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#9c8e96]">
        &copy; 2026 FemSphere Women's Health Intelligence Platform. All rights reserved.
      </footer>
    </div>
  );
}
