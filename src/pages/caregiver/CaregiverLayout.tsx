import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  Users, Sparkles, Heart, Bell, Calendar, FileText, Syringe,
  LogOut, Watch, Bluetooth, Wifi, RefreshCw, X, CheckCircle2
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

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/caregiver-dashboard', icon: Users, end: true },
    { name: 'Manage Dependents', path: '/caregiver-dashboard/dependents', icon: Users },
    { name: 'Medical Records', path: '/caregiver-dashboard/records', icon: FileText },
    { name: 'Vaccination Records', path: '/caregiver-dashboard/vaccinations', icon: Syringe, iconColor: 'text-[#14B8A6]' },
    { name: 'Medication Reminder', path: '/caregiver-dashboard/medications', icon: Bell, iconColor: 'text-[#F472B6]' },
    { name: 'Appointments', path: '/caregiver-dashboard/appointments', icon: Calendar },
    { name: 'Health Tracker', path: '/caregiver-dashboard/tracker', icon: Heart, iconColor: 'text-[#F472B6]' },
    { name: 'Health Reports', path: '/caregiver-dashboard/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex font-sans text-[#3a3135]">
      {/* Sidebar - Caregiver */}
      <aside className="w-72 bg-[#F4E0D1] border-r border-[#E5CDBC] hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen font-inter">
        <div className="p-6 border-b border-[#E5CDBC] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold text-[#7C3AED] tracking-tight">FemSphere</h1>
            <Sparkles className="w-5 h-5 text-[#14B8A6]" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide font-inter">
          <p className="text-xs uppercase tracking-widest text-[#8C756B] font-bold px-3 py-2">Features</p>

          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all ${
                    isActive
                      ? 'bg-white text-[#7C3AED] shadow-sm border border-[#E5CDBC]'
                      : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
                  }`
                }
              >
                <IconComponent className={`w-5 h-5 ${item.iconColor || 'text-[#7C3AED]'}`} />
                {item.name}
              </NavLink>
            );
          })}

          {/* Connect Watch (Bluetooth) Action Button */}
          <button
            onClick={() => {
              setShowBluetoothModal(true);
              if (!bluetoothConnected && foundDevices.length === 0) {
                scanBluetoothDevices();
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer ${
              bluetoothConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                : 'text-[#4A3B42] hover:bg-white/40 hover:text-[#2E2428]'
            }`}
          >
            <Watch className={`w-5 h-5 ${bluetoothConnected ? 'text-emerald-600' : 'text-[#7C3AED]'}`} />
            Connect Watch
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto font-inter bg-[#FAF7F4]">
        {/* Header */}
        <header className="bg-[#F4E0D1]/90 backdrop-blur-md border-b border-[#E5CDBC] p-5 md:px-8 flex items-center justify-between sticky top-0 z-20 font-inter">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#3a3135] text-lg">Caregiver Workspace ({profile.name})</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Nav Links Indicator */}
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-1">
              <NavLink
                to="/caregiver-dashboard"
                end
                className={({ isActive }) =>
                  `px-2.5 py-1 text-xs rounded-lg font-bold ${isActive ? 'bg-white text-[#7C3AED]' : 'text-[#4A3B42]'}`
                }
              >
                Overview
              </NavLink>
              <NavLink
                to="/caregiver-dashboard/dependents"
                className={({ isActive }) =>
                  `px-2.5 py-1 text-xs rounded-lg font-bold ${isActive ? 'bg-white text-[#7C3AED]' : 'text-[#4A3B42]'}`
                }
              >
                Dependents
              </NavLink>
              <NavLink
                to="/caregiver-dashboard/appointments"
                className={({ isActive }) =>
                  `px-2.5 py-1 text-xs rounded-lg font-bold ${isActive ? 'bg-white text-[#7C3AED]' : 'text-[#4A3B42]'}`
                }
              >
                Appointments
              </NavLink>
            </div>

            {/* Profile Avatar Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-1 rounded-full border border-[#EDE9FE] bg-[#FAF8FC] hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-xs focus:ring-2 focus:ring-[#7C3AED]"
                title="Profile Menu"
              >
                <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-base shadow-inner relative">
                  {profile.name ? profile.name.charAt(0) : 'M'}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EDE9FE] shadow-xl z-40 py-2 font-inter animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2.5 border-b border-[#EDE9FE] bg-[#FAF8FC]">
                      <p className="text-xs font-bold text-[#3a3135] truncate">{profile.name}</p>
                      <p className="text-[10px] text-[#7a6f75] truncate">{profile.email}</p>
                    </div>

                    <NavLink
                      to="/caregiver-dashboard/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-[#4a4145] hover:bg-[#FAF8FC] transition-colors"
                    >
                      Caregiver Profile & Password
                    </NavLink>

                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
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
