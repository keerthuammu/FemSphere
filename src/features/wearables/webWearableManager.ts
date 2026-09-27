/**
 * Universal Web Wearable & Smartwatch Client Layer
 * Supports Amazfit, Apple Watch, Samsung Galaxy, Google Pixel,
 * Garmin, Fitbit, boAt, Noise, and standard BLE GATT devices.
 */

export interface WearableCapabilities {
  heartRate: boolean;
  restingHeartRate: boolean;
  steps: boolean;
  calories: boolean;
  distance: boolean;
  sleep: boolean;
  spo2: boolean;
  hrv: boolean;
  bodyTemperature: boolean;
  bloodPressure: boolean;
  stress: boolean;
  respiratoryRate: boolean;
  battery: boolean;
  realTimeStream: boolean;
}

export type DeviceBrandType =
  | 'AMAZFIT'
  | 'APPLE_WATCH'
  | 'SAMSUNG'
  | 'PIXEL_WATCH'
  | 'FITBIT'
  | 'GARMIN'
  | 'HUAWEI'
  | 'XIAOMI'
  | 'ONEPLUS'
  | 'REALME'
  | 'NOISE'
  | 'BOAT'
  | 'FIRE_BOLTT'
  | 'TITAN'
  | 'OURA'
  | 'WHOOP'
  | 'POLAR'
  | 'SUUNTO'
  | 'GENERIC_BLE';

export interface WearableDeviceEntity {
  id: number;
  user_id: number;
  device_name: string;
  device_model: string;
  device_identifier: string;
  brand: DeviceBrandType;
  device_type: string;
  capabilities: WearableCapabilities | Record<string, boolean>;
  connection_status: string;
  battery_level: number | null;
  last_connected_at: string | null;
  last_synced_at: string | null;
}

export interface WearableTelemetryRecord {
  id: number;
  recorded_at: string;
  heart_rate: number | null;
  resting_heart_rate: number | null;
  steps: number | null;
  calories: number | null;
  distance_meters: string | number | null;
  sleep_duration_minutes: number | null;
  spo2: number | null;
  hrv_rmssd: number | null;
  stress_score: number | null;
  body_temperature: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  respiratory_rate: number | null;
  activity_type: string;
  source: string;
}

export interface BrandMeta {
  code: DeviceBrandType;
  displayName: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const BRAND_REGISTRY: Record<DeviceBrandType, BrandMeta> = {
  AMAZFIT: {
    code: 'AMAZFIT',
    displayName: 'Amazfit',
    color: '#ea580c',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
  },
  APPLE_WATCH: {
    code: 'APPLE_WATCH',
    displayName: 'Apple Watch',
    color: '#334155',
    bgLight: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  SAMSUNG: {
    code: 'SAMSUNG',
    displayName: 'Samsung Galaxy Watch',
    color: '#2563eb',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  PIXEL_WATCH: {
    code: 'PIXEL_WATCH',
    displayName: 'Google Pixel Watch',
    color: '#16a34a',
    bgLight: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  FITBIT: {
    code: 'FITBIT',
    displayName: 'Fitbit',
    color: '#0d9488',
    bgLight: '#f0fdfa',
    borderColor: '#99f6e4',
  },
  GARMIN: {
    code: 'GARMIN',
    displayName: 'Garmin',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  HUAWEI: {
    code: 'HUAWEI',
    displayName: 'Huawei Watch',
    color: '#dc2626',
    bgLight: '#fef2f2',
    borderColor: '#fecaca',
  },
  XIAOMI: {
    code: 'XIAOMI',
    displayName: 'Xiaomi / Redmi',
    color: '#ea580c',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
  },
  ONEPLUS: {
    code: 'ONEPLUS',
    displayName: 'OnePlus Watch',
    color: '#e11d48',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
  },
  REALME: {
    code: 'REALME',
    displayName: 'Realme Watch',
    color: '#d97706',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
  },
  NOISE: {
    code: 'NOISE',
    displayName: 'Noise',
    color: '#7c3aed',
    bgLight: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  BOAT: {
    code: 'BOAT',
    displayName: 'boAt',
    color: '#e11d48',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
  },
  FIRE_BOLTT: {
    code: 'FIRE_BOLTT',
    displayName: 'Fire-Boltt',
    color: '#f43f5e',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
  },
  TITAN: {
    code: 'TITAN',
    displayName: 'Titan Smart / Fastrack',
    color: '#0f766e',
    bgLight: '#f0fdfa',
    borderColor: '#99f6e4',
  },
  OURA: {
    code: 'OURA',
    displayName: 'Oura Ring',
    color: '#475569',
    bgLight: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  WHOOP: {
    code: 'WHOOP',
    displayName: 'Whoop',
    color: '#09090b',
    bgLight: '#f4f4f5',
    borderColor: '#d4d4d8',
  },
  POLAR: {
    code: 'POLAR',
    displayName: 'Polar',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  SUUNTO: {
    code: 'SUUNTO',
    displayName: 'Suunto',
    color: '#d97706',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
  },
  GENERIC_BLE: {
    code: 'GENERIC_BLE',
    displayName: 'Standard BLE Wearable',
    color: '#475569',
    bgLight: '#f8fafc',
    borderColor: '#cbd5e1',
  },
};

export function getBrandMeta(brandStr?: string): BrandMeta {
  const key = (brandStr || 'GENERIC_BLE').toUpperCase() as DeviceBrandType;
  return BRAND_REGISTRY[key] || BRAND_REGISTRY.GENERIC_BLE;
}
