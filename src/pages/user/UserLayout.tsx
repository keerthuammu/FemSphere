import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, Heart, Calendar, FileText, 
  LogOut, Bell, Watch, Bluetooth, Wifi, RefreshCw, 
  Battery, CheckCircle2, Clock, Printer, Camera, 
  X, FileCheck, Scan, User, Sliders, Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff,
  MapPin, Search, Stethoscope, AlertCircle, AlertTriangle, ShieldCheck, Users, ChevronRight, Droplet, Upload,
  Smartphone
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import LifeStageSelector from '../../components/LifeStageSelector';
import LifeStageOnboardingModal from '../../components/LifeStageOnboardingModal';
import ConnectDeviceModal from '../../components/wearables/ConnectDeviceModal';
import { isFutureDate } from '../../utils/validation';

export default function UserLayout() {
  const navigate = useNavigate();
  const {
    userProfile,
    currentStageCode,
    stageName,
    showLifeStageModal,
    setShowLifeStageModal,
    handleSelectStage,
    currentTime,
    showBluetoothModal,
    setShowBluetoothModal,
    showConnectDeviceModal,
    setShowConnectDeviceModal,
    bluetoothConnected,
    connectedDevice,
    wearableDevices,
    isScanning,
    foundDevices,
    smartwatchVitals,
    handleScanBluetoothDevices,
    handlePairDevice,
    handleDisconnectBluetooth,
    handleSyncWatchVitals,
    records,
    isScanningDoc,
    scanningProgress,
    scanningRecordTitle,
    viewingScanRecordModal,
    setViewingScanRecordModal,
    showUploadModal,
    setShowUploadModal,
    newRecord,
    setNewRecord,
    selectedRecordFile,
    setSelectedRecordFile,
    uploadErrorMsg,
    handleUploadRecord,
    trackerLogs,
    symptomLogs,
    appointments,
    doctorsList,
    availableDoctors,
    isLoadingAvailableDoctors,
    availableSearchFilters,
    setAvailableSearchFilters,
    fetchAvailableDoctors,
    showBookModal,
    setShowBookModal,
    newAppointment,
    setNewAppointment,
    appointmentErrorMsg,
    setAppointmentErrorMsg,
    handleBookAppointment,
    notifications,
    unreadCount,
    showPhotoModal,
    setShowPhotoModal,
    tempAvatarUrl,
    setTempAvatarUrl,
    tempAvatarBg,
    setTempAvatarBg,
    handleSaveProfilePhoto,
    handleFilePhotoChange,
    showPasswordModal,
    setShowPasswordModal,
    passwordData,
    setPasswordData,
    passwordMsg,
    handleChangePassword,
    showReportPreview,
    setShowReportPreview,
    handlePrintPDFReport,
    incomingCall,
    activeVideoConsultation,
    handleAcceptCall,
    handleDeclineCall,
    handleEndUserCall,
    isReproductiveAgeUser,
    handleLogout
  } = useUser();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isPatientMicOn, setIsPatientMicOn] = useState(true);
  const [isPatientVideoOn, setIsPatientVideoOn] = useState(true);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  useEffect(() => {
    if (showBookModal) {
      fetchAvailableDoctors();
    }
  }, [showBookModal, fetchAvailableDoctors]);

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    end?: boolean;
    iconColor?: string;
    badge?: number | string;
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity, end: true },
    { name: 'Smartwatch Vitals', path: '/dashboard/devices', icon: Watch, iconColor: 'text-[#936DA2]' },
    { name: 'Medical Records', path: '/dashboard/records', icon: FileText },
    { name: 'Health Tracker', path: '/dashboard/tracker', icon: Heart, iconColor: 'text-[#F472B6]' },
    ...(isReproductiveAgeUser ? [
      { name: 'Period Tracker', path: '/dashboard/period-tracker', icon: Droplet, iconColor: 'text-rose-500' }
    ] : []),
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Health Reports', path: '/dashboard/reports', icon: Printer, iconColor: 'text-[#14B8A6]' },
    { name: 'Prescribed Fitness', path: '/dashboard/fitness', icon: Activity, iconColor: 'text-emerald-600' },
    { name: 'Partner Mode', path: '/dashboard/partner', icon: Heart, iconColor: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FCF4F5] flex font-sans text-[#201538]">
      
      {/* --- SIDEBAR --- Elegant minimal lavender theme matching reference UI */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-64 z-40 bg-[#FCF4F5] border-r border-[#F0EAF8] p-5 overflow-y-auto print:hidden">
        <div className="space-y-6">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 px-1 py-1">
            <img
              src="/femsphere_logo.png"
              alt="FemSphere Logo"
              className="w-10 h-10 rounded-full object-contain shadow-xs"
            />
            <div>
              <span className="font-sans text-xl font-extrabold tracking-tight text-[#201538] block leading-none">FemSphere</span>
              <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-widest block mt-0.5">Health Portal</span>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                      isActive 
                        ? 'bg-white text-[#201538] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#EDE8F5]' 
                        : 'text-[#8A8197] hover:bg-white/60 hover:text-[#201538]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FB7185] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Connect Device in nav */}
            <button 
              onClick={() => setShowConnectDeviceModal(true)} 
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer bg-white/70 hover:bg-white text-[#936DA2] hover:text-[#835A92] border border-[#E9D5FF] shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <Watch className="w-4 h-4 shrink-0 text-[#936DA2] group-hover:scale-110 transition-transform" />
                <span className="truncate">Connect Device</span>
              </div>
              <span className="text-[10px] bg-[#F4DDE2] text-[#936DA2] px-2 py-0.5 rounded-full font-bold">
                {wearableDevices.length > 0 ? `${wearableDevices.length} Active` : '+ Add'}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Upgrade Promotion Card + User Identity */}
        <div className="pt-4 space-y-4">
          {/* FemSphere Mobile Watch Cloud Sync Status Card */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE8F5] shadow-[0_4px_20px_rgba(124,58,237,0.03)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Watch Cloud Sync</span>
              </div>
              <Smartphone className="w-3.5 h-3.5 text-[#936DA2]" />
            </div>

            <p className="text-[11px] text-[#4A4158] leading-tight font-medium">
              HealthKit & Health Connect continuously push your watch vitals to this dashboard.
            </p>

            <button
              onClick={() => setShowConnectDeviceModal(true)}
              className="w-full py-1.5 px-3 bg-[#FCF4F5] hover:bg-[#F9E8EC] border border-[#F0EAF8] rounded-xl text-[11px] font-bold text-[#936DA2] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Watch className="w-3.5 h-3.5" />
              <span>{wearableDevices.length > 0 ? `${wearableDevices.length} Connected` : 'Pair via Mobile App'}</span>
            </button>
          </div>

          {/* User Profile Pill & Actions */}
          <div className="pt-3 border-t border-[#F0EAF8] space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0 border border-white"
                style={{ backgroundColor: userProfile.avatarBg || '#936DA2' }}
              >
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="font-bold text-xs text-[#201538] truncate">{userProfile.fullName || 'User'}</h4>
                <p className="text-[10px] text-[#8E859E] truncate">{stageName || 'Patient'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/profile"
                className="flex-1 flex items-center justify-center py-1.5 px-2.5 bg-white hover:bg-white/80 border border-[#EDE8F5] rounded-xl text-xs font-semibold text-[#6E6480] hover:text-[#201538] transition-all cursor-pointer shadow-2xs"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 bg-white hover:bg-rose-50 border border-[#EDE8F5] hover:border-rose-200 rounded-xl text-xs font-semibold text-rose-600 transition-all cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:ml-64">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#F0EAF8] px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          {/* Left: Wide Search Pill matching reference UI */}
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9E95AD]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search for class, task, etc..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FCF4F5] border border-[#EDE8F5] text-xs font-medium text-[#201538] placeholder-[#9E95AD] focus:outline-none focus:ring-2 focus:ring-[#936DA2]/20 focus:border-[#936DA2] focus:bg-white transition-all shadow-2xs"
            />
          </div>
          
          {/* Right: Stage selector, Notifications, User Avatar */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Life Stage Selector */}
            <LifeStageSelector
              currentStageCode={currentStageCode}
              stageName={stageName}
              onSelectStage={handleSelectStage}
            />

            {/* Notification Bell */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2.5 rounded-full bg-white text-[#6E6480] hover:text-[#936DA2] hover:bg-[#F9E8EC] transition-colors border border-[#EDE8F5] cursor-pointer shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FB7185] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </Link>

          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-[#FCF4F5] border-b border-[#EDE8F5]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#201538] shadow-xs border border-[#EDE8F5]'
                    : 'text-[#8A8197] hover:bg-white/40'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* SUB-PAGE VIEW ROUTE OUTLET */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <Outlet />
        </main>
      </div>

      {/* ===================================================================== */}
      {/* GLOBAL MODALS (Life Stage, Bluetooth, Photo, Password, Upload, Book, Scan, Report) */}
      {/* ===================================================================== */}

      {/* 1. Life Stage Onboarding Modal */}
      {showLifeStageModal && (
        <LifeStageOnboardingModal
          isOpen={showLifeStageModal}
          onClose={() => setShowLifeStageModal(false)}
          onSaveStage={(code) => {
            handleSelectStage(code);
            setShowLifeStageModal(false);
          }}
        />
      )}

      {/* 2. Connect Device Modal */}
      <ConnectDeviceModal 
        isOpen={showConnectDeviceModal} 
        onClose={() => setShowConnectDeviceModal(false)} 
      />

      {/* 3. Upload Medical Record Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] p-6 sm:p-7 max-w-md w-full border border-[#F1EBF9] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1EBF9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#201538]">Upload Medical Report</h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="p-1 rounded-full text-[#8E859E] hover:text-[#201538] hover:bg-[#F9E8EC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadErrorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {uploadErrorMsg}
              </div>
            )}

            <form onSubmit={handleUploadRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#201538] mb-1">
                  Select File (PDF Recommended, Max 10MB)
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedRecordFile(file);
                    const cleanName = file?.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : '';
                    setNewRecord(prev => ({
                      ...prev,
                      fileName: file?.name || '',
                      title: prev.title.trim() ? prev.title : cleanName
                    }));
                  }}
                  className="w-full text-xs text-[#8E859E] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F9E8EC] file:text-[#936DA2] file:cursor-pointer p-2 rounded-2xl border border-[#F1EBF9] bg-[#FCF4F5]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#201538] mb-1">Report Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Complete Blood Count (CBC) Panel" 
                  value={newRecord.title} 
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})} 
                  className="w-full p-2.5 rounded-2xl border border-[#F1EBF9] bg-[#FCF4F5] focus:bg-white focus:outline-none focus:border-[#936DA2] text-xs font-medium text-[#201538]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-[#201538] mb-1">Category</label>
                <select 
                  value={newRecord.category} 
                  onChange={(e) => setNewRecord({...newRecord, category: e.target.value})} 
                  className="w-full p-2.5 rounded-2xl border border-[#F1EBF9] bg-[#FCF4F5] focus:bg-white focus:outline-none focus:border-[#936DA2] font-semibold text-xs text-[#201538]"
                >
                  <option value="Lab Results">Lab Results</option>
                  <option value="Blood Work">Blood Work</option>
                  <option value="Imaging & Scans">Imaging & Scans</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Doctor Notes">Doctor Notes</option>
                  <option value="Vaccination Record">Vaccination Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#201538] mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Diagnostic lab analysis from Clinic" 
                  value={newRecord.description} 
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} 
                  className="w-full p-2.5 rounded-2xl border border-[#F1EBF9] bg-[#FCF4F5] focus:bg-white focus:outline-none focus:border-[#936DA2] text-xs font-medium text-[#201538]" 
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white font-bold rounded-full cursor-pointer shadow-xs transition-all text-xs"
                >
                  Upload & Scan PDF
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)} 
                  className="py-2.5 px-5 border border-[#F1EBF9] bg-white hover:bg-[#FCF4F5] text-[#6E6480] font-bold rounded-full cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Book Appointment Modal - Doctor Availability & Capacity Booking Hub */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 font-inter overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-4xl w-full border border-[#F4DDE2] shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F4DDE2] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#936DA2] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#3a3135]">Find & Book Available Doctors</h3>
                  <p className="text-xs text-[#7a6f75]">Live shift capacity, real-time accommodations & instant slot reservation</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowBookModal(false);
                  setAppointmentErrorMsg(null);
                }} 
                className="p-1.5 rounded-xl hover:bg-gray-100 text-[#7a6f75] hover:text-black cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Alert notification */}
            {appointmentErrorMsg && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{appointmentErrorMsg}</span>
              </div>
            )}

            {/* SEARCH & FILTER BAR */}
            <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-3 shrink-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3a3135] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#936DA2]" /> Filter Available Shifts & Accommodations
                </span>
                {availableSearchFilters.date && (
                  <span className="text-[11px] font-bold text-[#936DA2] bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {new Date(availableSearchFilters.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {/* 1. Date Picker */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Appointment Date</label>
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={availableSearchFilters.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setAvailableSearchFilters(prev => ({ ...prev, date: newDate }));
                      setNewAppointment(prev => ({ ...prev, date: newDate }));
                      fetchAvailableDoctors({ date: newDate });
                    }}
                    className="w-full p-2 rounded-xl border border-[#F4DDE2] bg-white font-medium focus:border-[#936DA2] outline-none"
                    required
                  />
                </div>

                {/* 2. Clinic / Place / Location */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Clinic / Place</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input 
                      type="text"
                      placeholder="e.g. Center, Memorial..."
                      value={availableSearchFilters.place}
                      onChange={(e) => {
                        const newPlace = e.target.value;
                        setAvailableSearchFilters(prev => ({ ...prev, place: newPlace }));
                        fetchAvailableDoctors({ place: newPlace });
                      }}
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-[#F4DDE2] bg-white font-medium focus:border-[#936DA2] outline-none"
                    />
                  </div>
                </div>

                {/* 3. Time Window */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time Window</label>
                  <select
                    value={availableSearchFilters.time}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      setAvailableSearchFilters(prev => ({ ...prev, time: newTime }));
                      fetchAvailableDoctors({ time: newTime });
                    }}
                    className="w-full p-2 rounded-xl border border-[#F4DDE2] bg-white font-medium focus:border-[#936DA2] outline-none"
                  >
                    <option value="">All Shift Times</option>
                    <option value="09:00 AM">Morning (08:00 AM - 12:00 PM)</option>
                    <option value="01:00 PM">Afternoon (12:00 PM - 05:00 PM)</option>
                    <option value="06:00 PM">Evening (05:00 PM - 09:00 PM)</option>
                  </select>
                </div>

                {/* 4. Specialization */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Specialization</label>
                  <select
                    value={availableSearchFilters.specialty}
                    onChange={(e) => {
                      const newSpec = e.target.value;
                      setAvailableSearchFilters(prev => ({ ...prev, specialty: newSpec }));
                      fetchAvailableDoctors({ specialty: newSpec });
                    }}
                    className="w-full p-2 rounded-xl border border-[#F4DDE2] bg-white font-medium focus:border-[#936DA2] outline-none"
                  >
                    <option value="">All Specialties</option>
                    <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                    <option value="Maternal-Fetal">Maternal-Fetal Specialist</option>
                    <option value="Reproductive">Reproductive Specialist</option>
                    <option value="Pelvic">Pelvic Health & PT</option>
                    <option value="General">General Practice</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DOCTORS & SHIFTS LIST (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {isLoadingAvailableDoctors ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#936DA2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-[#7a6f75] font-medium">Checking live doctor shift schedules & accommodation capacity...</p>
                </div>
              ) : availableDoctors.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-[#F4DDE2] space-y-3 bg-[#FCF4F5]">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#936DA2] flex items-center justify-center mx-auto">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#3a3135]">No Available Doctors Found for Chosen Criteria</h4>
                  <p className="text-xs text-[#7a6f75] max-w-md mx-auto">
                    No active clinical shifts or remaining accommodations match your search filters for this date. Try picking another date or clearing your location/time filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const resetFilters = {
                        date: new Date().toISOString().split('T')[0],
                        place: '',
                        time: '',
                        specialty: ''
                      };
                      setAvailableSearchFilters(resetFilters);
                      fetchAvailableDoctors(resetFilters);
                    }}
                    className="px-4 py-2 bg-[#936DA2] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#835A92] transition-all"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDoctors.map((doc) => (
                    <div key={doc.id} className="p-4 sm:p-5 rounded-2xl border border-[#F4DDE2] bg-white shadow-2xs hover:shadow-xs transition-all space-y-3">
                      
                      {/* Doctor Info Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#F4DDE2] text-[#936DA2] flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                            {doc.name ? doc.name.replace('Dr. ', '').charAt(0) : 'D'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#3a3135]">{doc.name}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#936DA2] border border-purple-200">
                                {doc.specialization}
                              </span>
                            </div>
                            <p className="text-xs text-[#7a6f75] flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{doc.hospitalClinic || 'FemSphere Health Center'}</span>
                            </p>
                          </div>
                        </div>

                        {doc.teleconsultFee && (
                          <div className="text-right sm:text-right shrink-0">
                            <span className="text-[10px] text-gray-400 font-bold block uppercase">Consultation Fee</span>
                            <span className="text-sm font-bold text-[#936DA2]">${doc.teleconsultFee}</span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Shifts on this day */}
                      <div className="space-y-3">
                        {doc.shifts.map((shift) => {
                          const percentFilled = shift.maxPatients > 0 
                            ? Math.min(100, Math.round((shift.bookedCount / shift.maxPatients) * 100)) 
                            : 0;

                          return (
                            <div 
                              key={shift.id} 
                              className={`p-3.5 rounded-xl border transition-all text-xs space-y-2.5 ${
                                shift.isFull 
                                  ? 'bg-red-50/40 border-red-200 opacity-90' 
                                  : 'bg-[#FCF4F5] border-[#F4DDE2] hover:border-purple-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#3a3135]">{shift.type || 'Clinical Shift'}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-semibold text-gray-600 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#936DA2]" /> {shift.startTime} - {shift.endTime}
                                  </span>
                                </div>

                                {/* Live Accommodation Decrement Badge */}
                                <div className="flex items-center gap-2">
                                  {shift.isFull ? (
                                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                                      🔒 FULL (0 / {shift.maxPatients} Accommodations Left)
                                    </span>
                                  ) : shift.remainingCapacity <= 2 ? (
                                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                      ⚠️ {shift.remainingCapacity} / {shift.maxPatients} Accommodations Left (Filling Fast!)
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                      🟢 {shift.remainingCapacity} / {shift.maxPatients} Accommodations Available
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Visual Capacity Bar */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                                  <span>Shift Accommodation Capacity: {shift.bookedCount} booked / {shift.maxPatients} max</span>
                                  <span>{shift.isFull ? '100% Full' : `${shift.remainingCapacity} spots remaining`}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      shift.isFull 
                                        ? 'bg-red-500' 
                                        : shift.remainingCapacity <= 2 
                                        ? 'bg-amber-500' 
                                        : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${percentFilled}%` }}
                                  />
                                </div>
                              </div>

                              {/* Slot Pill Buttons */}
                              {shift.isFull ? (
                                <div className="p-2.5 bg-red-100/50 rounded-lg text-[11px] text-red-700 font-semibold flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  <span>All {shift.maxPatients} accommodation spots for this shift are filled. Please select another shift.</span>
                                </div>
                              ) : (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                                    Select Appointment Slot:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {(shift.availableSlots || shift.slots).map((slotTime) => {
                                      const isSelected = newAppointment.doctorId === doc.id && 
                                                         newAppointment.time === slotTime && 
                                                         newAppointment.date === availableSearchFilters.date;

                                      return (
                                        <button
                                          key={slotTime}
                                          type="button"
                                          onClick={() => {
                                            setSelectedShiftId(shift.id);
                                            setNewAppointment({
                                              ...newAppointment,
                                              doctorId: doc.id,
                                              doctor: `${doc.name} (${doc.specialization})`,
                                              date: availableSearchFilters.date,
                                              time: slotTime
                                            });
                                            setAppointmentErrorMsg(null);
                                          }}
                                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                                            isSelected
                                              ? 'bg-[#936DA2] text-white shadow-sm ring-2 ring-purple-300'
                                              : 'bg-white hover:bg-purple-50 text-gray-700 border border-[#F4DDE2]'
                                          }`}
                                        >
                                          <Clock className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#936DA2]'}`} />
                                          <span>{slotTime}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOOKING DETAILS & SUBMISSION FORM */}
            <form onSubmit={handleBookAppointment} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 shrink-0 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
                <div>
                  <span className="font-bold text-[#3a3135] text-xs">Selected Consultation Slot:</span>
                  {newAppointment.doctor && newAppointment.time ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-[#936DA2] text-sm">{newAppointment.doctor}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-[#936DA2] font-bold">
                        {newAppointment.date} at {newAppointment.time}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mt-0.5">Please click on an available time slot above to book with that doctor.</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-gray-600">Visit Type:</label>
                  <select
                    value={newAppointment.type || 'Virtual Telehealth'}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                    className="p-1.5 rounded-lg border border-purple-200 bg-white font-semibold text-xs text-[#3a3135] outline-none"
                  >
                    <option value="Virtual Telehealth">Virtual Telehealth (In-App Video)</option>
                    <option value="In-Person Clinic Visit">In-Person Clinic Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason for Visit & Symptoms Review</label>
                <input 
                  type="text"
                  placeholder="e.g. PCOS follow-up, hormonal bloodwork review & exercise prescription"
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-xs outline-none focus:border-[#936DA2]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowBookModal(false)} 
                  className="py-2.5 px-4 border border-gray-300 rounded-xl font-bold cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!newAppointment.doctorId || !newAppointment.time}
                  className="py-2.5 px-6 bg-[#936DA2] hover:bg-[#835A92] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Lock Accommodation Slot</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* 5. AI Document Scanning Progress Modal */}
      {isScanningDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#F4DDE2] shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#F9E8EC] border border-[#F4DDE2] mx-auto flex items-center justify-center text-[#936DA2]">
              <Scan className="w-8 h-8 text-[#936DA2] animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                AI OCR Clinical Engine
              </span>
              <h3 className="font-bold text-xl text-[#3a3135]">Scanning Medical Report</h3>
              <p className="text-xs text-[#7a6f75]">Parsing biomarker values from <b>"{scanningRecordTitle}"</b>...</p>
            </div>

            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-[#FCF4F5] border border-[#F4DDE2] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#936DA2] to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${scanningProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-[#7a6f75]">
                <span>Extracting Reference Ranges</span>
                <span>{scanningProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Scanned Medical Report Result Modal */}
      {viewingScanRecordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#F4DDE2] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4DDE2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] border border-[#F4DDE2] flex items-center justify-center text-[#936DA2]">
                  <FileCheck className="w-5 h-5 text-[#936DA2]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3135]">{viewingScanRecordModal.title}</h3>
                  <p className="text-xs text-[#7a6f75]">Scanned on {viewingScanRecordModal.date} • {viewingScanRecordModal.month}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingScanRecordModal(null)}
                className="p-2 rounded-xl text-[#7a6f75] hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Ordering Doctor</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.doctorName || 'Dr. Sarah Jenkins, MD'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Diagnostic Lab</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.labName || 'Quest Diagnostics'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Risk Level</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] inline-block mt-0.5">
                  {viewingScanRecordModal.scanResults?.riskLevel || 'Optimal Health'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9E8EC] border border-[#F4DDE2] text-xs space-y-1">
              <span className="font-bold text-[#936DA2] uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#936DA2]" /> AI Diagnostic Summary
              </span>
              <p className="text-[#3a3135] leading-relaxed">
                {viewingScanRecordModal.scanResults?.aiSummary}
              </p>
            </div>

            {viewingScanRecordModal.scanResults?.keyBiomarkers && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-[#3a3135]">Extracted Biomarkers & Test Results</h5>
                <div className="overflow-x-auto rounded-xl border border-[#F4DDE2]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FCF4F5] border-b border-[#F4DDE2] text-[#7a6f75] font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Biomarker</th>
                        <th className="p-2.5">Value</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4DDE2]">
                      {viewingScanRecordModal.scanResults.keyBiomarkers.map((b: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-[#3a3135]">{b.name}</td>
                          <td className="p-2.5 font-semibold">{b.value}</td>
                          <td className="p-2.5 text-[#7a6f75]">{b.range}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              b.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : b.status === 'Normal' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#FCF4F5] border border-[#F4DDE2] text-xs">
              <span className="font-bold text-[#64595e] uppercase block text-[10px] mb-1">Clinical Recommendations</span>
              <p className="text-[#3a3135]">{viewingScanRecordModal.scanResults?.recommendations}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F4DDE2]">
              <button 
                onClick={() => setViewingScanRecordModal(null)} 
                className="px-5 py-2.5 bg-[#936DA2] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Change Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#F4DDE2] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4DDE2]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#936DA2]" />
                <h3 className="font-bold text-lg text-[#3a3135]">Edit Profile Photo</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfilePhoto} className="space-y-6 text-xs">
              <div className="text-center space-y-3">
                <div 
                  className="w-28 h-28 rounded-full text-white mx-auto flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-white overflow-hidden relative"
                  style={{ backgroundColor: tempAvatarBg }}
                >
                  {tempAvatarUrl ? (
                    <img src={tempAvatarUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#7a6f75] font-medium">Avatar Photo Preview</p>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-[#3a3135] uppercase text-[10px]">1. Upload Photo File (JPG, PNG)</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFilePhotoChange}
                  className="w-full text-xs text-[#7a6f75] file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F4DDE2] file:text-[#936DA2] hover:file:bg-[#936DA2] hover:file:text-white transition-colors cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-[#3a3135] uppercase text-[10px]">2. Choose Theme Accent Color</label>
                <div className="flex items-center justify-center gap-3">
                  {['#936DA2', '#14B8A6', '#EC4899', '#F59E0B', '#4F46E5', '#10B981'].map((c) => (
                    <button 
                      key={c}
                      type="button"
                      onClick={() => setTempAvatarBg(c)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer border-2 ${
                        tempAvatarBg === c ? 'scale-125 border-slate-900 shadow-md' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    ></button>
                  ))}
                </div>
              </div>

              {tempAvatarUrl && (
                <button 
                  type="button" 
                  onClick={() => setTempAvatarUrl(null)} 
                  className="w-full py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  Remove Uploaded Image & Revert to Initials
                </button>
              )}

              <div className="flex gap-3 pt-3 border-t border-[#F4DDE2]">
                <button 
                  type="button" 
                  onClick={() => setShowPhotoModal(false)} 
                  className="flex-1 py-3 border border-[#F4DDE2] rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#936DA2] text-white rounded-xl font-bold text-xs hover:bg-[#835A92] shadow-xs cursor-pointer"
                >
                  Save Avatar Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F4DDE2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F4DDE2]">
              <h3 className="font-bold text-base text-[#3a3135]">Change Account Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${passwordMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Old Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={passwordData.oldPassword} 
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value as any})} 
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password" 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value as any})} 
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value as any})} 
                  className="w-full p-2.5 rounded-xl border border-[#F4DDE2]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#936DA2] text-white font-bold rounded-xl cursor-pointer">
                  Update Password
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="py-2.5 px-4 border rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Health Report Full Preview Modal */}
      {showReportPreview && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#F4DDE2] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4DDE2]">
              <h3 className="font-bold text-lg text-[#3a3135]">Generated Health Report Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintPDFReport} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#936DA2] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Download / Print PDF
                </button>
                <button onClick={() => setShowReportPreview(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-4 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2]">
                <h4 className="font-bold text-sm text-[#936DA2] mb-2">1. Personal Profile</h4>
                <p><b>Name:</b> {userProfile.fullName} | <b>DOB:</b> {userProfile.dob} ({userProfile.age} yrs)</p>
                <p><b>Blood Group:</b> {userProfile.bloodGroup || 'Not specified'} | <b>Height/Weight:</b> {userProfile.height || '--'}cm / {userProfile.weight || '--'}kg</p>
                <p><b>Contact:</b> {userProfile.phone || '--'} | {userProfile.email || '--'}</p>
              </div>

              <div className="p-4 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2]">
                <h4 className="font-bold text-sm text-[#936DA2] mb-2">2. Health Vitals Log</h4>
                <p><b>Latest Weight:</b> {trackerLogs[0]?.weight || '--'} kg | <b>Water:</b> {trackerLogs[0]?.water || '--'} L | <b>Sleep:</b> {trackerLogs[0]?.sleep || '--'} hrs</p>
                <p><b>Exercise:</b> {trackerLogs[0]?.exercise || '--'} mins | <b>Blood Pressure:</b> {trackerLogs[0]?.bloodPressure || '120/78'}</p>
              </div>

              <div className="p-4 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2]">
                <h4 className="font-bold text-sm text-[#936DA2] mb-2">3. Symptom History</h4>
                {symptomLogs.length > 0 ? (
                  symptomLogs.map(s => (
                    <p key={s.id}>• <b>{s.symptomName}</b> ({s.severity} severity) - {s.description || 'Logged symptom'} [{s.date}]</p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No symptoms logged.</p>
                )}
              </div>

              <div className="p-4 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2]">
                <h4 className="font-bold text-sm text-[#936DA2] mb-2">4. Medical Vault Records</h4>
                {records.length > 0 ? (
                  records.map(r => (
                    <p key={r.id}>• <b>{r.title}</b> ({r.type}) - {r.description} [{r.date}]</p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No medical records uploaded yet.</p>
                )}
              </div>

              <div className="p-4 bg-[#FCF4F5] rounded-2xl border border-[#F4DDE2]">
                <h4 className="font-bold text-sm text-[#936DA2] mb-2">5. Appointments Summary</h4>
                {appointments.length > 0 ? (
                  appointments.map(a => (
                    <p key={a.id}>• <b>{a.doctor}</b> - {a.reason} [{a.status} on {a.date} at {a.time}]</p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No appointments booked.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: INCOMING TELEHEALTH CALL --- */}
      {incomingCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-inter animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-purple-200 shadow-2xl text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#936DA2] to-pink-500 flex items-center justify-center text-white shadow-lg">
                <Video className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 bg-purple-100 text-[#936DA2] text-xs font-bold rounded-full uppercase tracking-wider">
                Incoming Video Call
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2E2428] mt-3">
                {incomingCall.doctorName}
              </h3>
              <p className="text-sm text-[#936DA2] font-semibold mt-0.5">
                {incomingCall.doctorSpecialization}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Scheduled Slot: {incomingCall.appointmentDate} at {incomingCall.appointmentTime}
              </p>
            </div>

            <p className="text-xs text-slate-600 bg-[#FCF4F5] p-3 rounded-2xl border border-purple-50">
              Your doctor is calling you for your scheduled clinical consultation. Click Accept to join the encrypted video session.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDeclineCall}
                className="flex-1 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-rose-200 text-sm"
              >
                <PhoneOff className="w-4 h-4" /> Decline
              </button>
              <button
                onClick={handleAcceptCall}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg text-sm animate-pulse"
              >
                <PhoneCall className="w-4 h-4" /> Accept Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: PATIENT ACTIVE VIDEO CONSULTATION ROOM --- */}
      {activeVideoConsultation && (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 font-inter text-white animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">Consultation with {activeVideoConsultation.doctorName}</h3>
                <p className="text-xs text-slate-400">
                  Duration: {Math.floor(activeVideoConsultation.durationSeconds / 60).toString().padStart(2, '0')}:{(activeVideoConsultation.durationSeconds % 60).toString().padStart(2, '0')} • Encrypted Peer-to-Peer Stream
                </p>
              </div>
            </div>

            <button
              onClick={handleEndUserCall}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <PhoneOff className="w-4 h-4" /> Leave Call
            </button>
          </div>

          {/* Video Feed Area */}
          <div className="flex-1 p-4 flex items-center justify-center relative bg-slate-900/50">
            {/* Main Doctor Feed */}
            <div className="w-full h-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-3">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#936DA2] to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto shadow-2xl">
                  {activeVideoConsultation.doctorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xl">{activeVideoConsultation.doctorName}</h4>
                  <p className="text-xs text-[#A78BFA] font-medium">{activeVideoConsultation.doctorSpecialization}</p>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-2">
                    <Activity className="w-3.5 h-3.5" /> Doctor Video & Audio Connected
                  </p>
                </div>
              </div>

              {/* Patient Mini PIP Camera View (Bottom Right) */}
              <div className="absolute bottom-6 right-6 w-44 h-32 bg-slate-800 rounded-2xl border-2 border-[#936DA2] overflow-hidden flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-base font-bold mx-auto">
                    {userProfile.fullName.charAt(0)}
                  </div>
                  <span className="text-[11px] text-slate-200 block mt-1 font-medium">You ({userProfile.fullName})</span>
                </div>
              </div>

              {/* Floating Controls Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 shadow-xl">
                <button
                  onClick={() => setIsPatientMicOn(!isPatientMicOn)}
                  className={`p-3 rounded-full cursor-pointer transition-all ${isPatientMicOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-600 text-white'}`}
                  title={isPatientMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {isPatientMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsPatientVideoOn(!isPatientVideoOn)}
                  className={`p-3 rounded-full cursor-pointer transition-all ${isPatientVideoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-rose-600 text-white'}`}
                  title={isPatientVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {isPatientVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleEndUserCall}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full cursor-pointer transition-all shadow-md"
                  title="End Consultation Call"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
