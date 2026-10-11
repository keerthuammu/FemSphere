import React, { useState, useEffect } from 'react';
import {
  Watch,
  Bluetooth,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Plus,
  Battery,
  ShieldCheck,
  Info,
  Footprints,
  Heart,
  Moon,
  Flame
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { DeviceBrandType, BRAND_REGISTRY } from '../../features/wearables/webWearableManager';

interface ConnectDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectDeviceModal({ isOpen, onClose }: ConnectDeviceModalProps) {
  const {
    handleConnectBleDevice,
    handleRegisterWearableDevice,
    handleSyncWearableTelemetry,
    fetchWearables,
    isScanning
  } = useUser();

  const [activeTab, setActiveTab] = useState<'ble' | 'companion' | 'manual'>('ble');
  const [bleSupported, setBleSupported] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Companion form state
  const [companionBrand, setCompanionBrand] = useState<DeviceBrandType>('APPLE_WATCH');
  const [companionName, setCompanionName] = useState<string>('Apple Watch Series 9');
  const [isSubmittingCompanion, setIsSubmittingCompanion] = useState(false);

  // Manual activity sync state
  const [manualDate, setManualDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [manualSteps, setManualSteps] = useState<string>('');
  const [manualCalories, setManualCalories] = useState<string>('');
  const [manualHeartRate, setManualHeartRate] = useState<string>('');
  const [manualSleepMins, setManualSleepMins] = useState<string>('');
  const [manualSpo2, setManualSpo2] = useState<string>('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      setBleSupported(true);
    } else {
      setBleSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  // Handle direct Web Bluetooth pairing
  const handleStartBleScan = async () => {
    setStatusMessage(null);
    const result = await handleConnectBleDevice();
    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  // Handle companion registration
  const handleRegisterCompanion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companionName.trim()) return;

    setIsSubmittingCompanion(true);
    setStatusMessage(null);

    const deviceIdentifier = `COMPANION-${companionBrand}-${Date.now().toString().slice(-6)}`;
    const success = await handleRegisterWearableDevice({
      device_name: companionName.trim(),
      device_model: companionName.trim(),
      device_identifier: deviceIdentifier,
      brand: companionBrand,
      connection_status: 'CONNECTED',
      battery_level: 85,
      capabilities: {
        heart_rate: true,
        steps: true,
        calories: true,
        sleep: true,
        spo2: true,
        real_time_stream: true
      }
    });

    setIsSubmittingCompanion(false);
    if (success) {
      setStatusMessage({
        type: 'success',
        text: `${companionName} registered successfully. Telemetry will sync automatically.`
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Failed to register companion device. Please check backend connection.'
      });
    }
  };

  // Handle manual activity telemetry sync
  const handleSyncManualActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);
    setStatusMessage(null);

    const timestamp = manualDate ? new Date(`${manualDate}T12:00:00Z`).toISOString() : new Date().toISOString();
    const syncKey = `MANUAL_${timestamp.slice(0, 10)}`;

    const payload = {
      device_identifier: 'MANUAL_IMPORT_DEVICE',
      device_name: 'Health App Import',
      device_model: 'Direct Import',
      brand: 'GENERIC_BLE',
      recorded_at: timestamp,
      steps: manualSteps ? parseInt(manualSteps, 10) : null,
      calories: manualCalories ? parseFloat(manualCalories) : null,
      heart_rate: manualHeartRate ? parseInt(manualHeartRate, 10) : null,
      sleep_duration_minutes: manualSleepMins ? parseInt(manualSleepMins, 10) : null,
      spo2: manualSpo2 ? parseInt(manualSpo2, 10) : null,
      activity_type: 'Daily Summary Import',
      source: 'HEALTH_APP_IMPORT',
      sync_key: syncKey
    };

    const success = await handleSyncWearableTelemetry(payload);
    setIsSubmittingManual(false);

    if (success) {
      setStatusMessage({
        type: 'success',
        text: 'Daily activity telemetry saved and synchronized with your health records!'
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Failed to sync activity telemetry. Please ensure at least one metric is entered.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-inter">
      <div className="bg-white rounded-3xl border border-[#EDE9FE] shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center border border-[#EDE9FE]">
              <Watch className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#201538]">Connect Health Device</h3>
              <p className="text-xs text-[#7a6f75]">Pair your smartwatch or import activity telemetry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#7a6f75] hover:text-[#201538] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-purple-50 text-purple-800 border border-purple-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#7C3AED] shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Integration Method Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF8FD] rounded-2xl border border-[#EDE9FE] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('ble'); setStatusMessage(null); }}
            className={`py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ble'
                ? 'bg-white text-[#7C3AED] shadow-2xs'
                : 'text-[#7a6f75] hover:text-[#201538]'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>Web BLE</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('companion'); setStatusMessage(null); }}
            className={`py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'companion'
                ? 'bg-white text-[#7C3AED] shadow-2xs'
                : 'text-[#7a6f75] hover:text-[#201538]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Companion App</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('manual'); setStatusMessage(null); }}
            className={`py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-white text-[#7C3AED] shadow-2xs'
                : 'text-[#7a6f75] hover:text-[#201538]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sync Activity</span>
          </button>
        </div>

        {/* TAB 1: Direct Web Bluetooth (BLE) */}
        {activeTab === 'ble' && (
          <div className="space-y-4 text-xs">
            {/* Browser Support Indicator */}
            <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
              bleSupported 
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}>
              {bleSupported ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">
                  {bleSupported 
                    ? 'Web Bluetooth API is available in this browser' 
                    : 'Web Bluetooth requires Google Chrome or Microsoft Edge'}
                </p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {bleSupported 
                    ? 'You can pair standard Bluetooth Low Energy fitness bands, smartwatches, and heart rate sensors broadcasting GATT services directly.' 
                    : 'Safari on iOS and Firefox do not expose Web Bluetooth APIs due to OS sandbox constraints. Use the Companion App tab to connect your device.'}
                </p>
              </div>
            </div>

            {/* Supported Devices Info */}
            <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-[#EDE9FE] space-y-2">
              <span className="font-bold text-[#201538] block uppercase text-[10px] tracking-wider">
                Compatible BLE Profiles
              </span>
              <ul className="space-y-1 text-[#64595e] text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  <span>Standard Heart Rate Service (0x180D)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  <span>Battery Service & Level Streaming (0x180F)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  <span>Compatible with Polar, Garmin HRM, Amazfit, and BLE fitness bands</span>
                </li>
              </ul>
            </div>

            {/* Action button */}
            <button
              type="button"
              disabled={isScanning}
              onClick={handleStartBleScan}
              className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Bluetooth className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
              <span>{isScanning ? 'Requesting Bluetooth Device...' : 'Scan & Pair Bluetooth Device'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: Mobile Companion Bridge (Apple Watch / Wear OS / Amazfit / Garmin) */}
        {activeTab === 'companion' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF8FD] border border-[#EDE9FE] text-[#64595e] space-y-2 text-[11px] leading-relaxed">
              <p className="font-bold text-[#201538] text-xs">
                Apple Watch, Samsung Galaxy Watch & Garmin Sync
              </p>
              <p>
                Smartwatches that connect through proprietary ecosystems (Apple HealthKit, Samsung Health, Google Health Connect) stream their continuous background telemetry via the <b>FemSphere Mobile Companion App</b>.
              </p>
              <p className="text-[#7C3AED] font-semibold">
                Register your device below to link it to your account for streaming.
              </p>
            </div>

            <form onSubmit={handleRegisterCompanion} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#64595e] uppercase text-[10px] tracking-wider mb-1">
                  Device Brand / Platform
                </label>
                <select
                  value={companionBrand}
                  onChange={(e) => {
                    const b = e.target.value as DeviceBrandType;
                    setCompanionBrand(b);
                    if (b === 'APPLE_WATCH') setCompanionName('Apple Watch Series 9');
                    else if (b === 'SAMSUNG') setCompanionName('Samsung Galaxy Watch 6');
                    else if (b === 'PIXEL_WATCH') setCompanionName('Google Pixel Watch 2');
                    else if (b === 'GARMIN') setCompanionName('Garmin Venu 3');
                    else if (b === 'FITBIT') setCompanionName('Fitbit Sense 2');
                    else if (b === 'AMAZFIT') setCompanionName('Amazfit GTR 4');
                    else setCompanionName(`${b} Smartwatch`);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white font-medium"
                >
                  <option value="APPLE_WATCH">Apple Watch (Apple HealthKit)</option>
                  <option value="SAMSUNG">Samsung Galaxy Watch (Health Connect)</option>
                  <option value="PIXEL_WATCH">Google Pixel Watch (Health Connect)</option>
                  <option value="GARMIN">Garmin (Garmin Connect)</option>
                  <option value="FITBIT">Fitbit (Google Health)</option>
                  <option value="AMAZFIT">Amazfit / Zepp OS</option>
                  <option value="POLAR">Polar Flow</option>
                  <option value="GENERIC_BLE">Other Wearable Tracker</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#64595e] uppercase text-[10px] tracking-wider mb-1">
                  Device Model Name
                </label>
                <input
                  type="text"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="e.g. Apple Watch Ultra, Galaxy Watch 6"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingCompanion}
                className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isSubmittingCompanion ? 'Registering...' : 'Register Companion Device'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Manual Activity Telemetry Ingestion */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSyncManualActivity} className="space-y-4 text-xs">
            <p className="text-[11px] text-[#7a6f75]">
              Sync daily activity totals directly from your watch's health app (Apple Health, Garmin Connect, Samsung Health). Stored in the backend database per user and date without duplicate records.
            </p>

            <div>
              <label className="block font-bold text-[#64595e] uppercase text-[10px] tracking-wider mb-1">
                Activity Date
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-[#FAF8FD] font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Steps Count</label>
                <input
                  type="number"
                  value={manualSteps}
                  onChange={(e) => setManualSteps(e.target.value)}
                  placeholder="e.g. 8400"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(e.target.value)}
                  placeholder="e.g. 380"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Avg Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={manualHeartRate}
                  onChange={(e) => setManualHeartRate(e.target.value)}
                  placeholder="e.g. 72"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64595e] mb-1">Sleep (Minutes)</label>
                <input
                  type="number"
                  value={manualSleepMins}
                  onChange={(e) => setManualSleepMins(e.target.value)}
                  placeholder="e.g. 480 (8 hrs)"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#64595e] mb-1">SpO2 Oxygen (%)</label>
                <input
                  type="number"
                  value={manualSpo2}
                  onChange={(e) => setManualSpo2(e.target.value)}
                  placeholder="e.g. 98"
                  className="w-full p-2.5 rounded-xl border border-[#EDE9FE] bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingManual}
              className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSubmittingManual ? 'animate-spin' : ''}`} />
              <span>{isSubmittingManual ? 'Saving Telemetry...' : 'Sync Device Activity Telemetry'}</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#EDE9FE] flex items-center justify-between text-[11px] text-[#7a6f75]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Health Ingestion</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#7C3AED] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
