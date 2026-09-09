import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Activity, Heart, Calendar, FileText, 
  LogOut, Bell, Watch, Bluetooth, Wifi, RefreshCw, 
  Battery, CheckCircle2, Clock, Printer, Camera, 
  X, FileCheck, Scan, User, Sliders
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
    showBookModal,
    setShowBookModal,
    newAppointment,
    setNewAppointment,
    appointmentErrorMsg,
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
    handleLogout
  } = useUser();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity, end: true },
    { name: 'Medical Records', path: '/dashboard/records', icon: FileText },
    { name: 'Health Tracker', path: '/dashboard/tracker', icon: Heart, iconColor: 'text-[#F472B6]' },
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Health Reports', path: '/dashboard/reports', icon: Printer, iconColor: 'text-[#14B8A6]' },
    { name: 'Prescribed Fitness', path: '/dashboard/fitness', icon: Activity, iconColor: 'text-emerald-600' },
    { name: 'Partner Mode', path: '/dashboard/partner', icon: Heart, iconColor: 'text-rose-500' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-inter text-[#2E2428]">
      
      {/* SIDEBAR NAVIGATION MENU */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter print:hidden">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide font-inter">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">System Menu</p>
          
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-base transition-all ${
                    isActive 
                      ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]' 
                      : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 ${item.iconColor || 'text-[#7C3AED]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Connect Watch (Bluetooth) */}
          <button 
            onClick={() => {
              setShowBluetoothModal(true);
              if (!bluetoothConnected && foundDevices.length === 0) {
                handleScanBluetoothDevices();
              }
            }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer ${
              bluetoothConnected 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs' 
                : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Watch className={`w-5 h-5 ${bluetoothConnected ? 'text-emerald-600' : 'text-[#7C3AED]'}`} />
            <span>Connect Watch</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter">
        
        {/* HEADER BAR */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 print:hidden font-inter">
          <div>
            <h2 className="font-bold text-[#2E2428] text-xl md:text-2xl truncate max-w-[280px] sm:max-w-md">
              Welcome, {userProfile.fullName || 'User'}!
            </h2>
            <p className="text-xs md:text-sm text-[#635259] flex items-center gap-2 mt-1 font-medium">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Life Stage Selector Dropdown */}
            <LifeStageSelector
              currentStageCode={currentStageCode}
              stageName={stageName}
              onSelectStage={handleSelectStage}
            />

            {/* Smartwatch Status Pill */}
            {bluetoothConnected && (
              <button 
                onClick={() => setShowBluetoothModal(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <Watch className="w-3.5 h-3.5 text-emerald-600" />
                <span>{smartwatchVitals.heartRate} bpm</span>
              </button>
            )}

            {/* Notification Bell Icon with Link to Notifications */}
            <Link
              to="/dashboard/notifications"
              className="relative p-2.5 rounded-2xl bg-white/70 hover:bg-white text-[#4A3B42] hover:text-[#7C3AED] transition-colors border border-[#E5CDBC] cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7C3AED] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-[#E5CDBC] cursor-pointer"
              >
                <div 
                  className="w-10 h-10 rounded-2xl text-white flex items-center justify-center font-bold text-base shadow-sm overflow-hidden"
                  style={{ backgroundColor: userProfile.avatarBg || '#7C3AED' }}
                >
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE9FE] py-2 z-30 font-inter">
                  <div className="px-4 py-3 border-b border-[#EDE9FE]">
                    <p className="font-bold text-sm text-[#3a3135] truncate">{userProfile.fullName}</p>
                    <p className="text-xs text-[#7a6f75] truncate">{userProfile.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#7C3AED]" /> My Profile
                  </button>

                  <button 
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#3a3135] hover:bg-[#F5F3FF] hover:text-[#7C3AED] flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-[#7C3AED]" /> Settings
                  </button>
                  
                  <div className="border-t border-[#EDE9FE] my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SUB-PAGE VIEW ROUTE OUTLET */}
        <main className="flex-1 p-5 md:p-8 space-y-8 font-inter">
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

      {/* 4. Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE9FE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDE9FE]">
              <h3 className="font-bold text-base text-[#3a3135]">Book Doctor Appointment</h3>
              <button onClick={() => setShowBookModal(false)} className="text-[#7a6f75] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {appointmentErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {appointmentErrorMsg}
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Select Doctor</label>
                <select 
                  value={newAppointment.doctor} 
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const found = doctorsList.find(d => `${d.name} (${d.specialization})` === selectedName || d.name === selectedName);
                    setNewAppointment({
                      ...newAppointment,
                      doctor: selectedName,
                      doctorId: found?.id
                    });
                  }} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                  required
                >
                  <option value="">Select a Doctor</option>
                  {doctorsList.map(doc => (
                    <option key={doc.id} value={`${doc.name} (${doc.specialization})`}>
                      {doc.name} — {doc.specialization} ({doc.hospitalClinic})
                    </option>
                  ))}
                  {doctorsList.length === 0 && (
                    <>
                      <option value="Dr. Sarah Jenkins (OB/GYN)">Dr. Sarah Jenkins (Obstetrics & Gynecology)</option>
                      <option value="Dr. Priya Sharma (Maternal-Fetal)">Dr. Priya Sharma (Maternal-Fetal Specialist)</option>
                      <option value="Dr. Amanda Vance (Reproductive Endocrine)">Dr. Amanda Vance (Reproductive Specialist)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Appointment Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={newAppointment.date} 
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} 
                  className={`w-full p-2.5 rounded-xl border ${
                    newAppointment.date && !isFutureDate(newAppointment.date)
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#EDE9FE]'
                  }`} 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Appointment Time</label>
                <select 
                  value={newAppointment.time} 
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Reason for Visit</label>
                <input 
                  type="text" 
                  placeholder="e.g. Reproductive health checkup & vitals review" 
                  value={newAppointment.reason} 
                  onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})} 
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE]" 
                  required 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#7C3AED] text-white font-bold rounded-xl cursor-pointer">
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setShowBookModal(false)} className="py-2.5 px-4 border rounded-xl font-bold cursor-pointer">
                  Cancel
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

    </div>
  );
}
