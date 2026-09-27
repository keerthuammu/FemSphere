import React from 'react';
import {
  WifiOff,
  BluetoothOff,
  AlertTriangle,
  RotateCw,
  FolderOpen,
  Calendar,
  Pill,
  Watch,
  Users,
  Sparkles
} from 'lucide-react';

interface EmptyStateProps {
  type?: 'wearables' | 'reports' | 'appointments' | 'medications' | 'dependents' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const defaults = {
    wearables: {
      icon: Watch,
      title: 'No Wearable Connected',
      desc: 'Pair your Apple Watch, Amazfit, Garmin, or BLE chest strap to stream live telemetry.',
      btn: 'Pair New Device',
    },
    reports: {
      icon: FolderOpen,
      title: 'No Reports Uploaded',
      desc: 'Upload lab blood tests, ultrasound imaging, or physician notes to generate biomarker extractions.',
      btn: 'Upload Document',
    },
    appointments: {
      icon: Calendar,
      title: 'No Scheduled Appointments',
      desc: 'Book a consultation with certified OB/GYN or reproductive endocrinologists.',
      btn: 'Book Consultation',
    },
    medications: {
      icon: Pill,
      title: 'No Medications Added',
      desc: 'Build your daily adherence schedule to track supplements, iron, and prescriptions.',
      btn: 'Add Medication',
    },
    dependents: {
      icon: Users,
      title: 'No Dependents Configured',
      desc: 'Add children or senior parents to monitor immunizations, vitals, and caregiver adherence.',
      btn: 'Add Dependent',
    },
    generic: {
      icon: Sparkles,
      title: 'No Health Data Yet',
      desc: 'Synchronize devices or log your first symptoms to start calibrating your Digital Health Twin.',
      btn: 'Log Entry',
    },
  };

  const current = defaults[type] || defaults.generic;
  const Icon = current.icon;

  return (
    <div className="bg-white dark:bg-slate-850 p-8 rounded-3xl border border-dashed border-purple-200 dark:border-slate-800 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 stroke-[1.7]" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        {title || current.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
        {description || current.desc}
      </p>
      {actionLabel || current.btn ? (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all min-h-[44px]"
        >
          {actionLabel || current.btn}
        </button>
      ) : null}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
      {/* Big Card Skeleton */}
      <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
    </div>
  );
}

interface ErrorStateProps {
  type?: 'network' | 'bluetooth' | 'server' | 'auth';
  onRetry?: () => void;
}

export function ErrorState({ type = 'network', onRetry }: ErrorStateProps) {
  const configs = {
    network: {
      icon: WifiOff,
      title: 'Internet Connection Unavailable',
      desc: 'Your offline cached Health Twin telemetry is safely stored locally. We will resync once connectivity resumes.',
    },
    bluetooth: {
      icon: BluetoothOff,
      title: 'Bluetooth Sensor Disconnected',
      desc: 'Unable to reach Amazfit Bip U Pro. Ensure your wearable device is within 10 meters and Bluetooth is powered on.',
    },
    server: {
      icon: AlertTriangle,
      title: 'Clinical Sync Latency',
      desc: 'The health record gateway is undergoing scheduled synchronization. Please try again shortly.',
    },
    auth: {
      icon: AlertTriangle,
      title: 'Encrypted Session Expired',
      desc: 'For medical privacy, your authentication token has rotated. Please confirm biometric identity to resume.',
    },
  };

  const current = configs[type] || configs.network;
  const Icon = current.icon;

  return (
    <div className="bg-rose-50/70 dark:bg-rose-950/30 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/60 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
        {current.title}
      </h3>
      <p className="text-xs text-rose-700 dark:text-rose-300 max-w-xs mx-auto leading-relaxed">
        {current.desc}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto min-h-[44px]"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
