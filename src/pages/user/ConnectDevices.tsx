import React, { useState, useEffect, useCallback } from 'react';
import {
  Watch,
  Heart,
  Footprints,
  Flame,
  Moon,
  Activity,
  RefreshCw,
  Battery,
  ShieldCheck,
  Smartphone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Bluetooth,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  Wifi,
  Radio
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import {
  WearableDeviceEntity,
  WearableTelemetryRecord,
  getBrandMeta,
  DeviceBrandType
} from '../../features/wearables/webWearableManager';
import ConnectDeviceModal from '../../components/wearables/ConnectDeviceModal';

interface TodaySummary {
  today_steps: number;
  avg_heart_rate: number | string;
  min_heart_rate?: number;
  max_heart_rate?: number;
  resting_heart_rate?: number;
  today_calories: number;
  today_distance_meters: string | number;
  today_sleep_minutes: number;
  latest_spo2: number;
  avg_hrv?: number;
  avg_stress?: number;
  latest_body_temp?: number;
  latest_bp_sys?: number;
  latest_bp_dia?: number;
}

interface HistoryItem {
  date: string;
  steps: number;
  avg_heart_rate: number | string;
  calories: number;
  distance_km: string | number;
  sleep_hours: string | number;
  spo2: number;
  avg_hrv?: number;
  avg_stress?: number;
  body_temperature?: number;
}

export default function ConnectDevices() {
  const {
    wearableDevices,
    activeWearable,
    fetchWearables,
    showConnectDeviceModal,
    setShowConnectDeviceModal,
    handleDisconnectWearableDevice
  } = useUser();

  const [selectedDevice, setSelectedDevice] = useState<WearableDeviceEntity | null>(null);
  const [latestReading, setLatestReading] = useState<WearableTelemetryRecord | null>(null);
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyDays, setHistoryDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const token = localStorage.getItem('femsphere_token') || '';

  // Fetch telemetry for active device
  const fetchTelemetry = useCallback(async (devId?: number) => {
    if (!token) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const activeDevId = devId || selectedDevice?.id || activeWearable?.id;
      const queryParam = activeDevId ? `?device_id=${activeDevId}` : '';

      // 1. Fetch latest telemetry & today's summary
      const latestRes = await fetch(`/api/wearables/data/latest${queryParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latestData = await latestRes.json();
      if (latestData.success) {
        setLatestReading(latestData.latest_reading || null);
        setTodaySummary(latestData.today_summary || null);
      }

      // 2. Fetch history
      const historyRes = await fetch(
        `/api/wearables/data/history?days=${historyDays}${activeDevId ? `&device_id=${activeDevId}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const historyData = await historyRes.json();
      if (historyData.success) {
        setHistory(historyData.history || []);
      }
    } catch (err: any) {
      console.error('Error fetching telemetry:', err);
      setErrorMsg('Failed to load device telemetry.');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedDevice?.id, activeWearable?.id, historyDays]);

  useEffect(() => {
    fetchWearables();
  }, [fetchWearables]);

  useEffect(() => {
    if (wearableDevices.length > 0 && !selectedDevice) {
      const active = wearableDevices.find(d => d.connection_status === 'CONNECTED') || wearableDevices[0];
      setSelectedDevice(active);
    }
  }, [wearableDevices, selectedDevice]);

  useEffect(() => {
    fetchTelemetry(selectedDevice?.id);
  }, [fetchTelemetry, selectedDevice?.id, historyDays]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetchWearables();
      await fetchTelemetry(selectedDevice?.id);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveDevice = async (id: number) => {
    if (window.confirm('Are you sure you want to disconnect and remove this device?')) {
      await handleDisconnectWearableDevice(id);
      setSelectedDevice(null);
      await fetchWearables();
    }
  };

  const formatLastSync = (timestamp?: string | null) => {
    if (!timestamp) return 'Not yet synced';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center border border-[#F4DDE2]">
              <Watch className="w-4 h-4 text-[#936DA2]" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#201538]">Connect Devices</h2>
          </div>
          <p className="text-xs text-[#7a6f75] mt-1">
            Manage your connected smartwatches, fitness trackers, and real daily activity telemetry
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-2xl border border-[#F4DDE2] bg-[#FCF4F5] hover:bg-[#F9E8EC] text-[#936DA2] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConnectDeviceModal(true)}
            className="px-5 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Device</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 1: CONNECTED DEVICES LIST */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1EBF9]">
          <div>
            <h3 className="font-bold text-base text-[#201538] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#936DA2]" />
              <span>Registered Devices</span>
            </h3>
            <p className="text-xs text-[#7a6f75]">Select an active device to inspect its synchronized vitals</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F9E8EC] text-[#936DA2] border border-[#F4DDE2]">
            {wearableDevices.length} {wearableDevices.length === 1 ? 'Device' : 'Devices'} Registered
          </span>
        </div>

        {wearableDevices.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-[#FCF4F5] border border-dashed border-[#F4DDE2] text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F4DDE2] flex items-center justify-center text-[#936DA2] shadow-2xs">
              <Watch className="w-6 h-6 text-[#936DA2]" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#201538]">No Devices Connected</h4>
              <p className="text-xs text-[#7a6f75] max-w-sm mt-1">
                Pair your smartwatch or import activity records to stream your daily steps, heart rate, and sleep.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConnectDeviceModal(true)}
              className="mt-2 px-5 py-2.5 bg-[#936DA2] hover:bg-[#835A92] text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Your First Device</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wearableDevices.map((dev) => {
              const brandMeta = getBrandMeta(dev.brand);
              const isSelected = selectedDevice?.id === dev.id;
              const isConnected = dev.connection_status === 'CONNECTED';

              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-[#936DA2] bg-[#FCF4F5] ring-2 ring-[#936DA2]/15 shadow-sm'
                      : 'border-[#F4DDE2] bg-white hover:bg-[#FCF4F5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: brandMeta.bgLight, color: brandMeta.color }}
                      >
                        <Watch className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#201538] leading-tight">{dev.device_name}</h4>
                        <span className="text-[11px] text-[#7a6f75] block mt-0.5">{brandMeta.displayName}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isConnected
                          ? 'bg-emerald-100 text-emerald-800'
                          : dev.connection_status === 'WAITING_FOR_DATA' || dev.connection_status === 'SYNCED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                      {isConnected ? 'Connected' : dev.connection_status || 'Paired'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#F1EBF9] grid grid-cols-2 gap-2 text-[11px] text-[#7a6f75]">
                    <div className="flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dev.battery_level ? `${dev.battery_level}% Battery` : 'Battery N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-[#936DA2]" />
                      <span className="truncate">{formatLastSync(dev.last_synced_at || dev.last_connected_at)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#936DA2]">
                      {isSelected ? '● Active Device' : 'Click to select'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDevice(dev.id);
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Disconnect & Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: DAILY ACTIVITY TELEMETRY (PURE BACKEND RECORDS) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F1EBF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] text-[#936DA2] flex items-center justify-center border border-[#F4DDE2]">
              <Activity className="w-5 h-5 text-[#936DA2]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#201538]">
                {selectedDevice ? `${selectedDevice.device_name} Activity Summary` : 'Daily Device Activity'}
              </h3>
              <p className="text-xs text-[#7a6f75]">
                {selectedDevice
                  ? `Last synchronized: ${formatLastSync(selectedDevice.last_synced_at || latestReading?.recorded_at)}`
                  : 'Connect a device to stream activity data'}
              </p>
            </div>
          </div>

          {selectedDevice && (
            <button
              type="button"
              onClick={handleManualSync}
              className="px-3.5 py-1.5 rounded-xl border border-[#F4DDE2] text-xs font-bold text-[#936DA2] hover:bg-[#FCF4F5] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Readings</span>
            </button>
          )}
        </div>

        {/* 6-Card Activity Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Card 1: Steps */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Steps</span>
              <Footprints className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.today_steps ? Number(todaySummary.today_steps).toLocaleString() : latestReading?.steps ? Number(latestReading.steps).toLocaleString() : '--'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">
              {todaySummary?.today_distance_meters 
                ? `${(Number(todaySummary.today_distance_meters) / 1000).toFixed(1)} km distance`
                : latestReading?.distance_meters
                ? `${(Number(latestReading.distance_meters) / 1000).toFixed(1)} km distance`
                : 'Daily step count'}
            </p>
          </div>

          {/* Card 2: Heart Rate */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-rose-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Heart Rate</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.avg_heart_rate 
                ? `${todaySummary.avg_heart_rate} bpm` 
                : latestReading?.heart_rate 
                ? `${latestReading.heart_rate} bpm` 
                : '-- bpm'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">
              {todaySummary?.resting_heart_rate ? `Resting: ${todaySummary.resting_heart_rate} bpm` : 'Continuous telemetry'}
            </p>
          </div>

          {/* Card 3: Active Calories */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Calories</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.today_calories 
                ? `${Math.round(Number(todaySummary.today_calories))} kcal` 
                : latestReading?.calories 
                ? `${Math.round(Number(latestReading.calories))} kcal` 
                : '-- kcal'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">Burned through activity</p>
          </div>

          {/* Card 4: Sleep Duration */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-[#936DA2]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">Sleep</span>
              <Moon className="w-4 h-4 text-[#936DA2]" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.today_sleep_minutes
                ? `${Math.floor(todaySummary.today_sleep_minutes / 60)}h ${todaySummary.today_sleep_minutes % 60}m`
                : latestReading?.sleep_duration_minutes
                ? `${Math.floor(latestReading.sleep_duration_minutes / 60)}h ${latestReading.sleep_duration_minutes % 60}m`
                : '--'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">Recorded rest</p>
          </div>

          {/* Card 5: Blood Oxygen */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-[#0284C7]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">SpO2 Oxygen</span>
              <Activity className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.latest_spo2 
                ? `${todaySummary.latest_spo2}%` 
                : latestReading?.spo2 
                ? `${latestReading.spo2}%` 
                : '--%'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">Normal saturation</p>
          </div>

          {/* Card 6: HRV / Stress */}
          <div className="p-4 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6f75]">HRV Recovery</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-lg font-extrabold text-[#201538]">
              {todaySummary?.avg_hrv 
                ? `${Math.round(Number(todaySummary.avg_hrv))} ms` 
                : latestReading?.hrv_rmssd 
                ? `${latestReading.hrv_rmssd} ms` 
                : '-- ms'}
            </div>
            <p className="text-[10px] text-[#7a6f75]">Autonomic recovery</p>
          </div>

        </div>
      </div>

      {/* SECTION 3: DEVICE ACTIVITY HISTORY TABLE (PURE REAL STORED DATA) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F4DDE2] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EBF9]">
          <div>
            <h3 className="font-bold text-base text-[#201538] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#936DA2]" />
              <span>Historical Activity Records</span>
            </h3>
            <p className="text-xs text-[#7a6f75]">Aggregated daily activity data stored in database per user and date</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#FCF4F5] rounded-xl border border-[#F4DDE2] text-xs font-bold">
            <button
              type="button"
              onClick={() => setHistoryDays(7)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                historyDays === 7 ? 'bg-[#936DA2] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#201538]'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setHistoryDays(14)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                historyDays === 14 ? 'bg-[#936DA2] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#201538]'
              }`}
            >
              14 Days
            </button>
            <button
              type="button"
              onClick={() => setHistoryDays(30)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                historyDays === 30 ? 'bg-[#936DA2] text-white shadow-2xs' : 'text-[#7a6f75] hover:text-[#201538]'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#7a6f75] bg-[#FCF4F5] rounded-2xl border border-dashed border-[#F4DDE2]">
            No historical activity records stored yet. As your connected device syncs, daily activity totals will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F4DDE2] text-[#7a6f75] uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Steps</th>
                  <th className="pb-3 font-bold">Avg Heart Rate</th>
                  <th className="pb-3 font-bold">Active Calories</th>
                  <th className="pb-3 font-bold">Sleep Duration</th>
                  <th className="pb-3 font-bold">SpO2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EBF9]">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FCF4F5] transition-colors">
                    <td className="py-3 font-bold text-[#201538]">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 font-semibold text-emerald-700">
                      {item.steps ? Number(item.steps).toLocaleString() : '--'}
                    </td>
                    <td className="py-3 font-semibold text-rose-600">
                      {item.avg_heart_rate ? `${item.avg_heart_rate} bpm` : '--'}
                    </td>
                    <td className="py-3 font-semibold text-amber-600">
                      {item.calories ? `${Math.round(Number(item.calories))} kcal` : '--'}
                    </td>
                    <td className="py-3 font-semibold text-[#936DA2]">
                      {item.sleep_hours ? `${item.sleep_hours} hrs` : '--'}
                    </td>
                    <td className="py-3 font-semibold text-[#0284C7]">
                      {item.spo2 ? `${item.spo2}%` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 4: TRANSPARENT INTEGRATION COMPATIBILITY MATRIX */}
      <div className="bg-white rounded-3xl p-6 border border-[#F4DDE2] shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#936DA2]" />
          <h4 className="font-bold text-sm text-[#201538]">Transparent Device Compatibility Guide</h4>
        </div>
        <p className="text-[11px] text-[#7a6f75] leading-relaxed">
          Device compatibility depends on your smartwatch, operating system, and browser permissions. We only support accessible, verified integration methods:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <span className="font-bold text-[#201538] block flex items-center gap-1.5">
              <Bluetooth className="w-3.5 h-3.5 text-[#936DA2]" />
              Web Bluetooth (Direct Browser BLE)
            </span>
            <p className="text-[#64595e]">
              Supported on <b>Google Chrome</b> and <b>Microsoft Edge</b> (Windows, Mac, Linux, Android). Directly pairs with BLE fitness bands and heart rate monitors broadcasting GATT services. Safari and Firefox do not expose Web Bluetooth.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCF4F5] border border-[#F4DDE2] space-y-1">
            <span className="font-bold text-[#201538] block flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#936DA2]" />
              FemSphere Mobile Companion Bridge
            </span>
            <p className="text-[#64595e]">
              For <b>Apple Watch</b> (Apple HealthKit) and <b>Galaxy Watch / Pixel Watch</b> (Health Connect), continuous background telemetry streams directly through the FemSphere Flutter companion app into your account.
            </p>
          </div>
        </div>
      </div>

      {/* REUSABLE CONNECT DEVICE MODAL */}
      <ConnectDeviceModal
        isOpen={showConnectDeviceModal}
        onClose={() => setShowConnectDeviceModal(false)}
      />
    </div>
  );
}
