import React, { useState } from 'react';
import {
  Watch,
  Bluetooth,
  RefreshCw,
  CheckCircle2,
  Heart,
  Wind,
  Footprints,
  Moon,
  Battery,
  Radio,
  Sparkles,
  AlertCircle,
  WifiOff,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WearablesHubView() {
  const {
    wearables,
    toggleWearableConnection,
    syncWearable,
    isScanningWearables,
    startWearableScan,
    vitals
  } = useApp();

  const [activeTab, setActiveTab] = useState<'devices' | 'live'>('devices');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');

  const connectedDevice = wearables.find(w => w.connected) || wearables[0];

  const brandOptions = ['All', 'Amazfit', 'Apple Watch', 'Garmin', 'Generic BLE'];

  const filteredWearables = wearables.filter(w =>
    selectedBrandFilter === 'All' ? true : w.brand === selectedBrandFilter
  );

  return (
    <div className="space-y-4">
      {/* Top Bar Switcher between Devices Hub and Live Telemetry Screen */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Connected Devices & Wearables Hub
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Universal BLE & multi-brand health telemetry integration
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              activeTab === 'devices'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Devices
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 min-h-[44px] ${
              activeTab === 'live'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>Live Stream</span>
          </button>
        </div>
      </div>

      {activeTab === 'devices' ? (
        <>
          {/* Active Connected Device Showcase */}
          {connectedDevice && connectedDevice.connected ? (
            <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50/40 dark:from-slate-850 dark:via-slate-850 dark:to-purple-950/20 p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                    <Watch className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {connectedDevice.brand} {connectedDevice.model}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>Last synced: {connectedDevice.lastSynced}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-emerald-600" />
                        {connectedDevice.batteryPct}%
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-purple-600" />
                        {connectedDevice.signalStrength}% RSSI
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => syncWearable(connectedDevice.id)}
                  title="Sync telemetry now"
                  className="w-9 h-9 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center transition-colors min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Data streams available */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Synchronized Biometrics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {connectedDevice.supportedMetrics.map((met, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-purple-100 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span>{met}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-purple-100/70 dark:border-slate-800">
                <button
                  onClick={() => syncWearable(connectedDevice.id)}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Telemetry Now</span>
                </button>
                <button
                  onClick={() => toggleWearableConnection(connectedDevice.id)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors min-h-[44px]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <WifiOff className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No active wearable paired right now
              </p>
              <button
                onClick={startWearableScan}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Scan for Nearby BLE Devices
              </button>
            </div>
          )}

          {/* Discovery & Multi-brand device catalog */}
          <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Available Devices & BLE Discovery
                </h3>
                <p className="text-[11px] text-slate-400">
                  Universal architecture supports Apple, Amazfit, Garmin, Fitbit, Pixel & BLE monitors
                </p>
              </div>

              <button
                onClick={startWearableScan}
                disabled={isScanningWearables}
                className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                <Bluetooth className={`w-3.5 h-3.5 ${isScanningWearables ? 'animate-spin text-purple-600' : ''}`} />
                <span>{isScanningWearables ? 'Scanning BLE...' : 'Scan Devices'}</span>
              </button>
            </div>

            {/* Scan pulse indicator if scanning */}
            {isScanningWearables && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2 animate-pulse">
                <Radio className="w-4 h-4 animate-ping text-purple-600" />
                <span>Scanning 2.4 GHz Bluetooth Low Energy advertising packets...</span>
              </div>
            )}

            {/* Device list */}
            <div className="space-y-2">
              {filteredWearables.map(dev => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl border border-purple-100/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Watch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {dev.brand} {dev.model}
                        </span>
                        {dev.connected && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            Paired
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Signal: {dev.signalStrength}%</span>
                        <span>·</span>
                        <span>{dev.supportedMetrics.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWearableConnection(dev.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                      dev.connected
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                    }`}
                  >
                    {dev.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* REAL-TIME LIVE TELEMETRY SCREEN (Prompt #19) */
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-purple-500/20 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Animated radar rings */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                Live From Wearable
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Amazfit Bip U Pro · Stream active
            </span>
          </div>

          {/* Central Pulsing Heart Rate Gauge */}
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="relative w-40 h-40 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-950/50 mb-3">
              <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-ping"></div>
              <Heart className="w-16 h-16 text-rose-500 fill-current animate-pulse stroke-[1.5]" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-extrabold text-white tabular-nums tracking-tight">
                72
              </span>
              <span className="text-lg font-bold text-rose-400">BPM</span>
            </div>
            <span className="text-xs text-slate-400 mt-1">
              Sinus Rhythm · Continuous Optical PPG Sensor
            </span>
          </div>

          {/* Secondary Live Metric Bars */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">SpO2 Oxygen</span>
              <span className="text-xl font-bold text-white tabular-nums">98%</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <Footprints className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Steps Today</span>
              <span className="text-xl font-bold text-white tabular-nums">6,842</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
              <Moon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Sleep Last Night</span>
              <span className="text-xl font-bold text-white tabular-nums">7h 42m</span>
            </div>
          </div>

          {/* Safety Notice */}
          <p className="text-[10px] text-slate-500 text-center">
            Continuous telemetry synchronizes with your Digital Health Twin neural network in 5-second intervals.
          </p>
        </div>
      )}
    </div>
  );
}
