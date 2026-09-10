import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, Heart, Calendar, FileText, 
  LogOut, Bell, Watch, Bluetooth, Wifi, RefreshCw, 
  Battery, CheckCircle2, Clock, Printer, Camera, 
  X, FileCheck, Scan, User, Sliders, Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff,
  MapPin, Search, Stethoscope, AlertCircle, AlertTriangle, ShieldCheck, Users, ChevronRight, Droplet
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import LifeStageSelector from '../../components/LifeStageSelector';
import LifeStageOnboardingModal from '../../components/LifeStageOnboardingModal';
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
    bluetoothConnected,
    connectedDevice,
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

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity, end: true },
    { name: 'Medical Records', path: '/dashboard/records', icon: FileText },
    { name: 'Health Tracker', path: '/dashboard/tracker', icon: Heart, iconColor: 'text-[#F472B6]' },
    ...(isReproductiveAgeUser ? [
      { name: 'Period Tracker', path: '/dashboard/period-tracker', icon: Droplet, iconColor: 'text-rose-500' }
    ] : []),
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Health Reports', path: '/dashboard/reports', icon: Printer, iconColor: 'text-[#14B8A6]' },
    { name: 'Prescribed Fitness', path: '/dashboard/fitness', icon: Activity, iconColor: 'text-emerald-600' },
    { name: 'Partner Mode', path: '/dashboard/partner', icon: Heart, iconColor: 'text-rose-500' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-sans text-[#2E2428]">
      
      {/* --- SIDEBAR --- Identical to DoctorLayout */}
      <aside className="w-64 bg-[#F2EBE5] border-r border-[#E5CDBC] p-6 flex flex-col justify-between hidden md:flex shrink-0 print:hidden">
        <div className="space-y-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2E2428] block leading-none">FemSphere</span>
              <span className="text-[10px] uppercase font-bold text-[#7C3AED] tracking-widest block mt-0.5">Patient Portal</span>
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
                        ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]' 
                        : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7C3AED] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Connect Watch (Bluetooth) in nav */}
            <button 
              onClick={() => {
                setShowBluetoothModal(true);
                if (!bluetoothConnected && foundDevices.length === 0) {
                  handleScanBluetoothDevices();
                }
              }} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                bluetoothConnected 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs' 
                  : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
              }`}
            >
              <Watch className={`w-4 h-4 shrink-0 ${bluetoothConnected ? 'text-emerald-600' : 'text-[#7C3AED]'}`} />
              <span className="truncate">{bluetoothConnected ? 'Watch Paired' : 'Connect Watch'}</span>
            </button>
          </nav>
        </div>

        {/* User Identity & Logout Footer */}
        <div className="pt-6 border-t border-[#E5CDBC] space-y-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden shrink-0"
              style={{ backgroundColor: userProfile.avatarBg || '#7C3AED' }}
            >
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-[#2E2428] truncate">{userProfile.fullName || 'User'}</h4>
              <p className="text-[10px] text-[#7A6A72] truncate">{stageName || 'Patient'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/profile"
              className="flex-1 flex items-center justify-center py-2 px-3 bg-white/60 hover:bg-white border border-[#E5CDBC] rounded-xl text-xs font-bold text-[#4A3B42] hover:text-[#2E2428] transition-all cursor-pointer shadow-2xs"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/60 hover:bg-white border border-[#E5CDBC] rounded-xl text-xs font-bold text-rose-700 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#E5CDBC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Patient Active
            </span>
            <span className="text-xs text-[#7A6A72] hidden sm:inline">•</span>
            <span className="text-xs text-[#7A6A72] font-semibold hidden sm:inline">
              Welcome back, <strong className="text-[#2E2428]">{userProfile.fullName || 'User'}</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Life Stage Selector */}
            <LifeStageSelector
              currentStageCode={currentStageCode}
              stageName={stageName}
              onSelectStage={handleSelectStage}
            />

            {/* Smartwatch Status Pill */}
            {bluetoothConnected && (
              <button 
                onClick={() => setShowBluetoothModal(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <Watch className="w-3.5 h-3.5 text-emerald-600" />
                <span>{smartwatchVitals.heartRate} bpm</span>
              </button>
            )}

            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-2 bg-[#FAF7F4] px-3.5 py-1.5 rounded-xl border border-[#E5CDBC] text-xs font-mono font-bold text-[#7A6A72]">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            {/* Notification Bell */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2 rounded-xl bg-white text-[#4A3B42] hover:text-[#7C3AED] transition-colors border border-[#E5CDBC] cursor-pointer shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7C3AED] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-[#F2EBE5] border-b border-[#E5CDBC]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]'
                    : 'text-[#4A3B42] hover:bg-white/40'
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

      {/* 2. Bluetooth Smartwatch Pairing Modal */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#EDE9FE] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center border border-[#EDE9FE]">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#3a3135]">Bluetooth Smartwatch Pairing</h3>
                  <p className="text-xs text-[#7a6f75]">Connect wearable fitness trackers & Apple Watch</p>
                </div>
              </div>
              <button onClick={() => setShowBluetoothModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bluetoothConnected ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="font-bold text-base block">{connectedDevice}</span>
                      <span className="text-xs text-emerald-700 font-medium">Status: Live Streaming Connected</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5" /> {smartwatchVitals.battery}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Heart Rate</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.heartRate} <span className="text-xs font-normal">bpm</span></span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">SpO2 Oxygen</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.spO2}%</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Body Temp</span>
                    <span className="text-lg font-bold text-emerald-900">{smartwatchVitals.bodyTemp}°C</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={handleSyncWatchVitals} 
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Sync Vitals to Health Tracker
                  </button>
                  <button 
                    onClick={handleDisconnectBluetooth} 
                    className="px-4 py-3 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Watch className="w-6 h-6 text-[#7C3AED]" />
                    <div>
                      <p className="font-bold text-sm text-[#3a3135]">Scan Nearby Bluetooth Wearables</p>
                      <p className="text-xs text-[#7a6f75]">Enable Bluetooth on Apple Watch, Fitbit, or Garmin</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleScanBluetoothDevices} 
                    disabled={isScanning}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Devices'}
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase font-bold tracking-wider text-[#7a6f75]">Discovered Devices ({foundDevices.length})</p>
                  
                  {isScanning ? (
                    <div className="p-8 text-center space-y-3 border border-dashed border-[#EDE9FE] rounded-2xl">
                      <div className="w-10 h-10 rounded-full border-4 border-[#7C3AED] border-t-transparent animate-spin mx-auto"></div>
                      <p className="text-xs text-[#7a6f75] font-medium">Searching for Bluetooth Low Energy fitness trackers...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {foundDevices.map((dev, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-white hover:bg-[#F5F3FF] flex items-center justify-between transition-colors">
                          <div className="flex items-center gap-3">
                            <Watch className="w-5 h-5 text-[#7C3AED]" />
                            <div>
                              <p className="font-bold text-sm text-[#3a3135]">{dev.name}</p>
                              <p className="text-xs text-[#7a6f75]">{dev.type} • Signal: {dev.rssi} dBm • Battery: {dev.battery}%</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handlePairDevice(dev.name)} 
                            className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                          >
                            Pair & Connect
                          </button>
                        </div>
                      ))}

                      {foundDevices.length === 0 && !isScanning && (
                        <div className="p-6 text-center text-xs text-[#7a6f75] bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                          Click <span className="font-bold text-[#7C3AED]">Scan Devices</span> to discover nearby smartwatches or trackers.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#7a6f75]">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Web Bluetooth API • Encrypted Stream
              </span>
              <button onClick={() => setShowBluetoothModal(false)} className="font-bold text-[#7C3AED] hover:underline cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Upload Medical Record Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-base text-[#3a3135]">Upload Medical Report</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {uploadErrorMsg}
              </div>
            )}

            <form onSubmit={handleUploadRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Report Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Complete Blood Count (CBC) Test" 
                  value={newRecord.title} 
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category</label>
                <select 
                  value={newRecord.category} 
                  onChange={(e) => setNewRecord({...newRecord, category: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="Lab Results">Lab Results</option>
                  <option value="Imaging & Scans">Imaging & Scans</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Doctor Notes">Doctor Notes</option>
                  <option value="Vaccination Record">Vaccination Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Select File (PDF, JPG, PNG - Max 10MB)</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedRecordFile(file);
                    setNewRecord({...newRecord, fileName: file?.name || ''});
                  }}
                  className="w-full text-xs text-[#7a6f75] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#EDE9FE] file:text-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Routine blood analysis from Lab Diagnostics" 
                  value={newRecord.description} 
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl cursor-pointer">
                  Upload & Scan Record
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="py-2.5 px-4 border rounded-xl font-bold cursor-pointer">
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
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-4xl w-full border border-[#EDE9FE] shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
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
            <div className="p-4 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] space-y-3 shrink-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3a3135] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#7C3AED]" /> Filter Available Shifts & Accommodations
                </span>
                {availableSearchFilters.date && (
                  <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-100 px-2.5 py-0.5 rounded-full">
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
                    className="w-full p-2 rounded-xl border border-[#EDE9FE] bg-white font-medium focus:border-[#7C3AED] outline-none"
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
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-[#EDE9FE] bg-white font-medium focus:border-[#7C3AED] outline-none"
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
                    className="w-full p-2 rounded-xl border border-[#EDE9FE] bg-white font-medium focus:border-[#7C3AED] outline-none"
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
                    className="w-full p-2 rounded-xl border border-[#EDE9FE] bg-white font-medium focus:border-[#7C3AED] outline-none"
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
                  <div className="w-10 h-10 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-[#7a6f75] font-medium">Checking live doctor shift schedules & accommodation capacity...</p>
                </div>
              ) : availableDoctors.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-[#EDE9FE] space-y-3 bg-[#FAF8FC]">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
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
                    className="px-4 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#6D28D9] transition-all"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDoctors.map((doc) => (
                    <div key={doc.id} className="p-4 sm:p-5 rounded-2xl border border-[#EDE9FE] bg-white shadow-2xs hover:shadow-xs transition-all space-y-3">
                      
                      {/* Doctor Info Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                            {doc.name ? doc.name.replace('Dr. ', '').charAt(0) : 'D'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#3a3135]">{doc.name}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200">
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
                            <span className="text-sm font-bold text-[#7C3AED]">${doc.teleconsultFee}</span>
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
                                  : 'bg-[#FAF8FC] border-[#EDE9FE] hover:border-purple-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#3a3135]">{shift.type || 'Clinical Shift'}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-semibold text-gray-600 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#7C3AED]" /> {shift.startTime} - {shift.endTime}
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
                                              ? 'bg-[#7C3AED] text-white shadow-sm ring-2 ring-purple-300'
                                              : 'bg-white hover:bg-purple-50 text-gray-700 border border-[#EDE9FE]'
                                          }`}
                                        >
                                          <Clock className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#7C3AED]'}`} />
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
                      <span className="font-bold text-[#7C3AED] text-sm">{newAppointment.doctor}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-[#7C3AED] font-bold">
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
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-xs outline-none focus:border-[#7C3AED]"
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
                  className="py-2.5 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
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
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-[#F5F3FF] border border-[#EDE9FE] mx-auto flex items-center justify-center text-[#7C3AED]">
              <Scan className="w-8 h-8 text-[#7C3AED] animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                AI OCR Clinical Engine
              </span>
              <h3 className="font-bold text-xl text-[#3a3135]">Scanning Medical Report</h3>
              <p className="text-xs text-[#7a6f75]">Parsing biomarker values from <b>"{scanningRecordTitle}"</b>...</p>
            </div>

            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-[#FAF8FC] border border-[#EDE9FE] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-purple-500 rounded-full transition-all duration-300"
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
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#EDE9FE] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                  <FileCheck className="w-5 h-5 text-[#7C3AED]" />
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
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Ordering Doctor</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.doctorName || 'Dr. Sarah Jenkins, MD'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE]">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Diagnostic Lab</span>
                <span className="font-bold text-[#3a3135]">{viewingScanRecordModal.scanResults?.labName || 'Quest Diagnostics'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#7a6f75] uppercase block">Risk Level</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] inline-block mt-0.5">
                  {viewingScanRecordModal.scanResults?.riskLevel || 'Optimal Health'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#EDE9FE] text-xs space-y-1">
              <span className="font-bold text-[#7C3AED] uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> AI Diagnostic Summary
              </span>
              <p className="text-[#3a3135] leading-relaxed">
                {viewingScanRecordModal.scanResults?.aiSummary}
              </p>
            </div>

            {viewingScanRecordModal.scanResults?.keyBiomarkers && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-[#3a3135]">Extracted Biomarkers & Test Results</h5>
                <div className="overflow-x-auto rounded-xl border border-[#EDE9FE]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8FC] border-b border-[#EDE9FE] text-[#7a6f75] font-bold text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Biomarker</th>
                        <th className="p-2.5">Value</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE9FE]">
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

            <div className="p-3.5 rounded-xl bg-[#FAF8FC] border border-[#EDE9FE] text-xs">
              <span className="font-bold text-[#64595e] uppercase block text-[10px] mb-1">Clinical Recommendations</span>
              <p className="text-[#3a3135]">{viewingScanRecordModal.scanResults?.recommendations}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EDE9FE]">
              <button 
                onClick={() => setViewingScanRecordModal(null)} 
                className="px-5 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#7C3AED]" />
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
                  className="w-full text-xs text-[#7a6f75] file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EDE9FE] file:text-[#7C3AED] hover:file:bg-[#7C3AED] hover:file:text-white transition-colors cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-[#3a3135] uppercase text-[10px]">2. Choose Theme Accent Color</label>
                <div className="flex items-center justify-center gap-3">
                  {['#7C3AED', '#14B8A6', '#EC4899', '#F59E0B', '#4F46E5', '#10B981'].map((c) => (
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

              <div className="flex gap-3 pt-3 border-t border-[#EDE9FE]">
                <button 
                  type="button" 
                  onClick={() => setShowPhotoModal(false)} 
                  className="flex-1 py-3 border border-[#EDE9FE] rounded-xl font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-xs hover:bg-[#6D28D9] shadow-xs cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
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
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
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
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
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
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl cursor-pointer">
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
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#EDE9FE] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-lg text-[#3a3135]">Generated Health Report Preview</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintPDFReport} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Download / Print PDF
                </button>
                <button onClick={() => setShowReportPreview(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">1. Personal Profile</h4>
                <p><b>Name:</b> {userProfile.fullName} | <b>DOB:</b> {userProfile.dob} ({userProfile.age} yrs)</p>
                <p><b>Blood Group:</b> {userProfile.bloodGroup || 'Not specified'} | <b>Height/Weight:</b> {userProfile.height || '--'}cm / {userProfile.weight || '--'}kg</p>
                <p><b>Contact:</b> {userProfile.phone || '--'} | {userProfile.email || '--'}</p>
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">2. Health Vitals Log</h4>
                <p><b>Latest Weight:</b> {trackerLogs[0]?.weight || '--'} kg | <b>Water:</b> {trackerLogs[0]?.water || '--'} L | <b>Sleep:</b> {trackerLogs[0]?.sleep || '--'} hrs</p>
                <p><b>Exercise:</b> {trackerLogs[0]?.exercise || '--'} mins | <b>Blood Pressure:</b> {trackerLogs[0]?.bloodPressure || '120/78'}</p>
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">3. Symptom History</h4>
                {symptomLogs.length > 0 ? (
                  symptomLogs.map(s => (
                    <p key={s.id}>• <b>{s.symptomName}</b> ({s.severity} severity) - {s.description || 'Logged symptom'} [{s.date}]</p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No symptoms logged.</p>
                )}
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">4. Medical Vault Records</h4>
                {records.length > 0 ? (
                  records.map(r => (
                    <p key={r.id}>• <b>{r.title}</b> ({r.type}) - {r.description} [{r.date}]</p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No medical records uploaded yet.</p>
                )}
              </div>

              <div className="p-4 bg-[#FAF8FC] rounded-2xl border border-[#EDE9FE]">
                <h4 className="font-bold text-sm text-[#7C3AED] mb-2">5. Appointments Summary</h4>
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
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] to-pink-500 flex items-center justify-center text-white shadow-lg">
                <Video className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 bg-purple-100 text-[#7C3AED] text-xs font-bold rounded-full uppercase tracking-wider">
                Incoming Video Call
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2E2428] mt-3">
                {incomingCall.doctorName}
              </h3>
              <p className="text-sm text-[#7C3AED] font-semibold mt-0.5">
                {incomingCall.doctorSpecialization}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Scheduled Slot: {incomingCall.appointmentDate} at {incomingCall.appointmentTime}
              </p>
            </div>

            <p className="text-xs text-slate-600 bg-[#FAF8FC] p-3 rounded-2xl border border-purple-50">
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
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#7C3AED] to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto shadow-2xl">
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
              <div className="absolute bottom-6 right-6 w-44 h-32 bg-slate-800 rounded-2xl border-2 border-[#7C3AED] overflow-hidden flex items-center justify-center shadow-2xl">
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
