import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  Users, Sparkles, Heart, Bell, Calendar, FileText, Syringe,
  LogOut, Watch, Bluetooth, Wifi, RefreshCw, X, CheckCircle2, Clock
} from 'lucide-react';
import { useCaregiver } from '../../context/CaregiverContext';

export default function CaregiverLayout() {
  const {
    profile,
    handleLogout,
    showBluetoothModal,
    setShowBluetoothModal,
    bluetoothConnected,
    connectedDevice,
    isScanning,
    foundDevices,
    smartwatchVitals,
    scanBluetoothDevices,
    pairDevice,
    disconnectBluetooth,
    syncWatchVitals
  } = useCaregiver();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Dashboard Overview', path: '/caregiver-dashboard', icon: Users, end: true },
    { name: 'Manage Dependents', path: '/caregiver-dashboard/dependents', icon: Users },
    { name: 'Medical Records', path: '/caregiver-dashboard/records', icon: FileText },
    { name: 'Vaccination Records', path: '/caregiver-dashboard/vaccinations', icon: Syringe },
    { name: 'Medication Reminder', path: '/caregiver-dashboard/medications', icon: Bell },
    { name: 'Appointments', path: '/caregiver-dashboard/appointments', icon: Calendar },
    { name: 'Health Tracker', path: '/caregiver-dashboard/tracker', icon: Heart },
    { name: 'Health Reports', path: '/caregiver-dashboard/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex font-sans text-[#2E2428]">
      {/* --- SIDEBAR --- Identical to DoctorLayout */}
      <aside className="w-64 bg-[#F2EBE5] border-r border-[#E5CDBC] p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#2E2428] block leading-none">FemSphere</span>
              <span className="text-[10px] uppercase font-bold text-[#7C3AED] tracking-widest block mt-0.5">Caregiver Portal</span>
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
                    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-white text-[#7C3AED] shadow-xs border border-[#E5CDBC]'
                        : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
                    }`
                  }
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}

            {/* Connect Watch (Bluetooth) Action Button in nav */}
            <button
              onClick={() => {
                setShowBluetoothModal(true);
                if (!bluetoothConnected && foundDevices.length === 0) {
                  scanBluetoothDevices();
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

        {/* Caregiver Identity & Logout Footer */}
        <div className="pt-6 border-t border-[#E5CDBC] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold text-sm shrink-0">
              {profile.name ? profile.name.charAt(0) : 'C'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-[#2E2428] truncate">{profile.name}</h4>
              <p className="text-[10px] text-[#7A6A72] truncate">{profile.relationship || 'Caregiver'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/caregiver-dashboard/profile"
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
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#E5CDBC] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Caregiver Verified Active
            </span>
            <span className="text-xs text-[#7A6A72] hidden sm:inline">•</span>
            <span className="text-xs text-[#7A6A72] font-semibold hidden sm:inline">
              Welcome back, <strong className="text-[#2E2428]">{profile.name}</strong>
            </span>
          </div>

          {/* Quick Actions & Live Time */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#FAF7F4] px-3.5 py-1.5 rounded-xl border border-[#E5CDBC] text-xs font-mono font-bold text-[#7A6A72]">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <button
              onClick={() => setShowBluetoothModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E5CDBC] bg-white text-[#4A3B42] hover:bg-white/80 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Watch className="w-3.5 h-3.5 text-[#7C3AED]" />
              {bluetoothConnected ? 'Watch Paired' : 'Connect Watch'}
            </button>
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

        {/* Dynamic Nested Page Content */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <Outlet />
        </main>
      </div>

      {/* BLUETOOTH SMARTWATCH PAIRING MODAL */}
      {showBluetoothModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-inter">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#EDE9FE] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Watch className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#3a3135]">Connect Smartwatch (BLE 5.3)</h3>
                  <p className="text-xs text-[#7a6f75]">Pair dependent's fitness watch for live vitals streaming</p>
                </div>
              </div>
              <button
                onClick={() => setShowBluetoothModal(false)}
                className="p-2 rounded-xl text-[#7a6f75] hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bluetoothConnected ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Paired with {connectedDevice}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                    ACTIVE STREAM
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">Heart Rate</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.heartRate} bpm</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">Steps</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.steps}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-emerald-100">
                    <span className="text-[10px] text-gray-500 block">SpO2 / Temp</span>
                    <span className="font-bold text-emerald-700">{smartwatchVitals.spO2}% / {smartwatchVitals.bodyTemp}°C</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={syncWatchVitals}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-sync Live Vitals
                  </button>
                  <button
                    onClick={disconnectBluetooth}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Disconnect Watch
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7a6f75] uppercase">Nearby Bluetooth Devices</span>
                  <button
                    onClick={scanBluetoothDevices}
                    disabled={isScanning}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan Devices'}
                  </button>
                </div>

                {isScanning ? (
                  <div className="p-8 text-center space-y-3 bg-[#FAF8FC] rounded-2xl border border-dashed border-[#EDE9FE]">
                    <Bluetooth className="w-8 h-8 text-[#7C3AED] mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-[#3a3135]">Searching for nearby Bluetooth Smartwatches...</p>
                    <p className="text-[11px] text-[#7a6f75]">Ensure Bluetooth is enabled on dependent's device</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {foundDevices.map((dev, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-[#EDE9FE] bg-[#FAF8FC] hover:border-[#7C3AED] hover:bg-purple-50/40 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Watch className="w-5 h-5 text-[#7C3AED]" />
                          <div>
                            <p className="font-bold text-xs text-[#3a3135]">{dev.name}</p>
                            <p className="text-[10px] text-[#7a6f75]">{dev.type} • Signal: {dev.rssi} dBm</p>
                          </div>
                        </div>
                        <button
                          onClick={() => pairDevice(dev.name)}
                          className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                        >
                          Pair
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-[#EDE9FE] flex items-center justify-between text-xs text-[#7a6f75]">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Web Bluetooth API • Encrypted Stream
              </span>
              <button
                onClick={() => setShowBluetoothModal(false)}
                className="font-bold text-[#7C3AED] hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
