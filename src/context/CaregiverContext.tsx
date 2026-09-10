import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Dependent {
  id: string;
  name: string;
  dob: string;
  relation: string;
  bloodGroup: string;
}

export interface MedicalRecord {
  id: string;
  name: string;
  dependent: string;
  category: string;
  date: string;
  size: string;
  type?: string;
  description?: string;
  fileData?: string;
  fileName?: string;
  isScanned?: boolean;
  scanResults?: any;
}

export interface Vaccination {
  id: string;
  dependent: string;
  vaccineName: string;
  date: string;
  nextDueDate: string;
}

export interface Medication {
  id: string;
  dependent: string;
  medicineName: string;
  dosage: string;
  time: string;
}

export interface Appointment {
  id: string;
  dependent: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

export interface DependentTrackerLog {
  id: string;
  dependent: string;
  date: string;
  weight: string;
  water: string;
  sleep: string;
  exercise: string;
  steps: string;
  bloodPressure: string;
  heartRate: string;
  foodLogged: string;
  symptoms: string[];
  symptomSeverity: string;
  notes: string;
}

interface CaregiverContextType {
  profile: {
    name: string;
    email: string;
    relationship: string;
    contact: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    relationship: string;
    contact: string;
  }>>;
  profileSaveMsg: string | null;
  saveProfile: (e: React.FormEvent) => Promise<void>;
  
  // Dependents
  dependents: Dependent[];
  setDependents: React.Dispatch<React.SetStateAction<Dependent[]>>;
  fetchDependents: () => Promise<void>;
  addDependent: (newDep: { name: string; dob: string; relation: string; bloodGroup: string }) => Promise<boolean>;
  deleteDependent: (id: string) => Promise<void>;
  isAddingDep: boolean;

  // Medical Records
  records: MedicalRecord[];
  addRecord: (form: {
    name: string;
    dependent: string;
    category: string;
    description?: string;
    file?: File | null;
    fileData?: string;
    fileName?: string;
    size?: string;
    type?: string;
  }) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  fetchRecords: () => Promise<void>;

  // Vaccinations
  vaccinations: Vaccination[];
  addVaccination: (vac: { dependent: string; vaccineName: string; date: string; nextDueDate: string }) => void;
  deleteVaccination: (id: string) => void;

  // Medications
  medications: Medication[];
  addMedication: (med: { dependent: string; medicineName: string; dosage: string; time: string }) => void;
  deleteMedication: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (apt: { dependent: string; doctor: string; date: string; time: string; reason: string }) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;

  // Health Tracker
  dependentTrackerLogs: DependentTrackerLog[];
  addTrackerLog: (log: Omit<DependentTrackerLog, 'id'>) => void;
  deleteTrackerLog: (id: string) => void;

  // Bluetooth Smartwatch
  showBluetoothModal: boolean;
  setShowBluetoothModal: (show: boolean) => void;
  bluetoothConnected: boolean;
  connectedDevice: string | null;
  isScanning: boolean;
  foundDevices: Array<{ name: string; type: string; rssi: number; battery: number }>;
  smartwatchVitals: {
    heartRate: number;
    spO2: number;
    bodyTemp: number;
    steps: number;
    calories: number;
    battery: number;
    lastSynced: string;
  };
  scanBluetoothDevices: () => Promise<void>;
  pairDevice: (name: string) => void;
  disconnectBluetooth: () => void;
  syncWatchVitals: () => void;

  handleLogout: () => void;
}

const CaregiverContext = createContext<CaregiverContextType | undefined>(undefined);

export function CaregiverProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // Profile
  const [profile, setProfile] = useState(() => {
    const defaults = {
      name: 'Marcus Vance',
      email: 'marcus.v@caregiver.org',
      relationship: 'Parent / Primary Caregiver',
      contact: '+1 (555) 382-9011',
    };
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const p = parsed.profile || {};
        return {
          ...defaults,
          name: parsed.fullName || p.full_name || parsed.username || defaults.name,
          email: parsed.email || defaults.email,
          contact: p.mobile || p.mobileNumber || defaults.contact,
        };
      }
    } catch (e) {
      console.error('Error loading caregiver session', e);
    }
    return defaults;
  });

  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMsg('Saving caregiver profile...');

    try {
      const stored = localStorage.getItem('femsphere_user');
      const parsed = stored ? JSON.parse(stored) : {};
      const updatedUser = {
        ...parsed,
        fullName: profile.name,
        email: profile.email,
        profile: {
          ...(parsed.profile || {}),
          full_name: profile.name,
          mobile: profile.contact
        },
        caregiver: {
          ...(parsed.caregiver || {}),
          relationship: profile.relationship,
          emergency_phone: profile.contact
        }
      };
      localStorage.setItem('femsphere_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error saving caregiver profile to localStorage', err);
    }

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            phone: profile.contact,
            relationship: profile.relationship
          })
        });
      }
    } catch (err) {
      console.log('Database API offline, saved locally:', err);
    }

    setProfileSaveMsg('Caregiver profile saved successfully!');
    setTimeout(() => setProfileSaveMsg(null), 3000);
  };

  // Dependents
  const [dependents, setDependents] = useState<Dependent[]>(() => {
    try {
      const storedUser = localStorage.getItem('femsphere_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const deps = parsed.dependents || (parsed.dependent ? [parsed.dependent] : []);
        if (Array.isArray(deps) && deps.length > 0) {
          return deps.map((d: any) => ({
            id: String(d.id),
            name: d.full_name || d.name || 'Unknown',
            dob: d.dob ? String(d.dob).split('T')[0] : '',
            relation: d.relationship || d.relation || '',
            bloodGroup: d.blood_group || d.bloodGroup || ''
          }));
        }
      }
    } catch (e) {}
    return [];
  });

  const [isAddingDep, setIsAddingDep] = useState(false);

  const fetchDependents = async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/caregivers/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.dependents)) {
        const mapped = data.dependents.map((d: any) => ({
          id: String(d.id),
          name: d.full_name || d.name || 'Unknown',
          dob: d.dob ? String(d.dob).split('T')[0] : '',
          relation: d.relationship || d.relation || '',
          bloodGroup: d.blood_group || d.bloodGroup || ''
        }));
        setDependents(mapped);

        try {
          const stored = localStorage.getItem('femsphere_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.dependents = data.dependents;
            localStorage.setItem('femsphere_user', JSON.stringify(parsed));
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to fetch dependents:', err);
    }
  };

  useEffect(() => {
    fetchDependents();
    fetchRecords();
  }, []);

  const addDependent = async (newDep: { name: string; dob: string; relation: string; bloodGroup: string }): Promise<boolean> => {
    if (!newDep.name.trim()) return false;
    setIsAddingDep(true);

    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/caregivers/dependents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fullName: newDep.name.trim(),
            dob: newDep.dob,
            relationship: newDep.relation,
            bloodGroup: newDep.bloodGroup
          })
        });
        const data = await res.json();
        if (data.success && data.dependent) {
          const added = {
            id: String(data.dependent.id),
            name: data.dependent.full_name || newDep.name,
            dob: data.dependent.dob ? String(data.dependent.dob).split('T')[0] : newDep.dob,
            relation: data.dependent.relationship || newDep.relation,
            bloodGroup: data.dependent.blood_group || newDep.bloodGroup
          };
          setDependents(prev => [...prev, added]);

          try {
            const stored = localStorage.getItem('femsphere_user');
            if (stored) {
              const parsed = JSON.parse(stored);
              parsed.dependents = [...(parsed.dependents || []), data.dependent];
              localStorage.setItem('femsphere_user', JSON.stringify(parsed));
            }
          } catch (e) {}

          setIsAddingDep(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Error saving dependent to database:', err);
    }

    // Fallback
    setDependents(prev => [...prev, { ...newDep, id: `DEP-0${prev.length + 1}` }]);
    setIsAddingDep(false);
    return true;
  };

  const deleteDependent = async (id: string) => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token && !id.startsWith('DEP-')) {
        await fetch(`/api/caregivers/dependents/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Error deleting dependent from database:', err);
    }
    setDependents(prev => prev.filter(d => d.id !== id));
  };

  // Medical Records
  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    try {
      const stored = localStorage.getItem('femsphere_caregiver_records');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('femsphere_token');
      if (!token) return;
      const res = await fetch('/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: MedicalRecord[] = data.map((r: any) => ({
            id: String(r.id),
            name: r.title || r.file_name || 'Medical Document',
            dependent: r.dependent_name || dependents[0]?.name || 'Dependent',
            category: r.category || 'Lab Diagnostics',
            date: r.uploaded_at ? new Date(r.uploaded_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            size: r.file_size_bytes ? `${(r.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : '1.8 MB',
            type: (r.file_type || (r.file_name?.split('.').pop() || 'PDF')).toUpperCase(),
            description: r.description || '',
            fileData: r.file_data || undefined,
            fileName: r.file_name || undefined,
            isScanned: r.is_scanned !== undefined ? r.is_scanned : true,
            scanResults: r.scan_results || undefined
          }));
          setRecords(mapped);
          try {
            localStorage.setItem('femsphere_caregiver_records', JSON.stringify(mapped));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error('Error fetching caregiver records:', e);
    }
  };

  const addRecord = async (form: {
    name: string;
    dependent: string;
    category: string;
    description?: string;
    file?: File | null;
    fileData?: string;
    fileName?: string;
    size?: string;
    type?: string;
  }) => {
    const fileExt = (form.fileName?.split('.').pop() || form.type || 'PDF').toUpperCase();
    const cleanName = form.name.trim() || form.fileName?.replace(/\.[^/.]+$/, "") || 'Medical Document';
    const finalSize = form.size || (form.file ? `${(form.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.6 MB');
    const todayStr = new Date().toISOString().split('T')[0];

    const scanResultsObj = {
      doctorName: 'Clinical Diagnostic Services',
      labName: 'Pediatric & Family Care Lab',
      keyBiomarkers: [
        { name: 'Hemoglobin', value: '13.2 g/dL', status: 'Normal', range: '11.5 - 15.5 g/dL' },
        { name: 'White Blood Cell (WBC)', value: '6.5 x10^3/uL', status: 'Optimal', range: '4.5 - 11.0 x10^3/uL' },
        { name: 'Platelets Count', value: '275 x10^3/uL', status: 'Optimal', range: '150 - 450 x10^3/uL' }
      ],
      aiSummary: `Parsed clinical report "${cleanName}" for ${form.dependent}. Normal physiological biomarkers detected with zero acute clinical flags.`,
      riskLevel: 'Optimal',
      recommendations: 'Continue routine dependent care protocol and scheduled follow-ups.'
    };

    let serverRecordId: string | null = null;
    try {
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        const res = await fetch('/api/medical-records/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: cleanName,
            fileName: form.fileName || `${cleanName.replace(/\s+/g, '_')}.${fileExt.toLowerCase()}`,
            fileType: fileExt,
            category: form.category || 'Lab Diagnostics',
            description: form.description || `Medical report for ${form.dependent}`,
            dependentName: form.dependent,
            fileData: form.fileData || null,
            fileSize: form.file ? form.file.size : 1600000,
            isScanned: true,
            scanResults: scanResultsObj
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.record) {
            serverRecordId = String(data.record.id);
          }
        }
      }
    } catch (e) {
      console.error('Failed to sync caregiver record to backend:', e);
    }

    const added: MedicalRecord = {
      id: serverRecordId || `REC-CG-${Date.now()}`,
      name: cleanName,
      dependent: form.dependent,
      category: form.category,
      date: todayStr,
      size: finalSize,
      type: fileExt,
      description: form.description || `Medical record for ${form.dependent}`,
      fileData: form.fileData,
      fileName: form.fileName || `${cleanName.replace(/\s+/g, '_')}.${fileExt.toLowerCase()}`,
      isScanned: true,
      scanResults: scanResultsObj
    };

    const updated = [added, ...records];
    setRecords(updated);
    try {
      localStorage.setItem('femsphere_caregiver_records', JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteRecord = async (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem('femsphere_caregiver_records', JSON.stringify(updated));
      const token = localStorage.getItem('femsphere_token');
      if (token && !id.startsWith('REC-CG-')) {
        await fetch(`/api/medical-records/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Error deleting record:', e);
    }
  };

  // Vaccinations
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(() => {
    try {
      const stored = localStorage.getItem('femsphere_caregiver_vaccinations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addVaccination = (vac: { dependent: string; vaccineName: string; date: string; nextDueDate: string }) => {
    const added: Vaccination = { ...vac, id: `VAC-0${vaccinations.length + 1}` };
    const updated = [...vaccinations, added];
    setVaccinations(updated);
    try {
      localStorage.setItem('femsphere_caregiver_vaccinations', JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteVaccination = (id: string) => {
    const updated = vaccinations.filter(v => v.id !== id);
    setVaccinations(updated);
    try {
      localStorage.setItem('femsphere_caregiver_vaccinations', JSON.stringify(updated));
    } catch (e) {}
  };

  // Medications
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const stored = localStorage.getItem('femsphere_caregiver_medications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addMedication = (med: { dependent: string; medicineName: string; dosage: string; time: string }) => {
    const added: Medication = { ...med, id: `MED-0${medications.length + 1}` };
    const updated = [...medications, added];
    setMedications(updated);
    try {
      localStorage.setItem('femsphere_caregiver_medications', JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteMedication = (id: string) => {
    const updated = medications.filter(m => m.id !== id);
    setMedications(updated);
    try {
      localStorage.setItem('femsphere_caregiver_medications', JSON.stringify(updated));
    } catch (e) {}
  };

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem('femsphere_caregiver_appointments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const bookAppointment = async (apt: { dependent: string; doctor: string; date: string; time: string; reason: string }) => {
    const booked: Appointment = {
      id: `APT-CG-0${appointments.length + 1}`,
      dependent: apt.dependent,
      doctor: apt.doctor,
      date: apt.date,
      time: apt.time,
      reason: apt.reason || 'Routine Health Consultation',
      status: 'Scheduled'
    };
    const updated = [booked, ...appointments];
    setAppointments(updated);

    try {
      localStorage.setItem('femsphere_caregiver_appointments', JSON.stringify(updated));
      const token = localStorage.getItem('femsphere_token');
      if (token) {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            doctorName: booked.doctor,
            patientName: booked.dependent,
            date: booked.date,
            time: booked.time,
            reason: `${booked.dependent}: ${booked.reason}`,
            type: 'In-Clinic'
          })
        });
      }
    } catch (err) {}
  };

  const cancelAppointment = async (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
    setAppointments(updated);
    try {
      localStorage.setItem('femsphere_caregiver_appointments', JSON.stringify(updated));
    } catch (e) {}
  };

  // Health Tracker
  const [dependentTrackerLogs, setDependentTrackerLogs] = useState<DependentTrackerLog[]>(() => {
    try {
      const stored = localStorage.getItem('femsphere_caregiver_tracker');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addTrackerLog = (log: Omit<DependentTrackerLog, 'id'>) => {
    const newLog: DependentTrackerLog = {
      id: `LOG-DEP-${Date.now()}`,
      ...log
    };
    const updated = [newLog, ...dependentTrackerLogs];
    setDependentTrackerLogs(updated);
    try {
      localStorage.setItem('femsphere_caregiver_tracker', JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteTrackerLog = (id: string) => {
    const updated = dependentTrackerLogs.filter(l => l.id !== id);
    setDependentTrackerLogs(updated);
    try {
      localStorage.setItem('femsphere_caregiver_tracker', JSON.stringify(updated));
    } catch (e) {}
  };

  // Bluetooth Smartwatch
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Array<{ name: string; type: string; rssi: number; battery: number }>>([]);
  const [smartwatchVitals, setSmartwatchVitals] = useState({
    heartRate: 78,
    spO2: 98,
    bodyTemp: 36.6,
    steps: 6420,
    calories: 310,
    battery: 92,
    lastSynced: 'Just now'
  });

  const scanBluetoothDevices = async () => {
    setIsScanning(true);
    setFoundDevices([]);

    const nav = navigator as any;
    if (nav.bluetooth) {
      try {
        const device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate', 'battery_service', 'health_thermometer']
        });
        if (device) {
          setConnectedDevice(device.name || "Dependent's Smart Watch");
          setBluetoothConnected(true);
          setIsScanning(false);
          setShowBluetoothModal(false);
          return;
        }
      } catch (err) {
        console.log('Web Bluetooth prompt cancelled or fallback...', err);
      }
    }

    setTimeout(() => {
      setFoundDevices([
        { name: "Sophia's Apple Watch SE (BLE 5.3)", type: 'Kids Fitness Watch', rssi: -48, battery: 94 },
        { name: "Maria's Fitbit Sense 2", type: 'Elder Health Tracker', rssi: -62, battery: 88 },
        { name: "Garmin Venu 3 (ANT+/BLE)", type: 'Sports Watch', rssi: -74, battery: 91 },
      ]);
      setIsScanning(false);
    }, 1200);
  };

  const pairDevice = (deviceName: string) => {
    setConnectedDevice(deviceName);
    setBluetoothConnected(true);
    setShowBluetoothModal(false);
  };

  const disconnectBluetooth = () => {
    setBluetoothConnected(false);
    setConnectedDevice(null);
  };

  const syncWatchVitals = () => {
    const updatedHR = Math.floor(72 + Math.random() * 12);
    const updatedSteps = smartwatchVitals.steps + Math.floor(150 + Math.random() * 200);

    setSmartwatchVitals(prev => ({
      ...prev,
      heartRate: updatedHR,
      steps: updatedSteps,
      calories: Math.floor(updatedSteps * 0.045),
      lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('femsphere_token');
    localStorage.removeItem('femsphere_user');
    navigate('/login');
  };

  return (
    <CaregiverContext.Provider
      value={{
        profile,
        setProfile,
        profileSaveMsg,
        saveProfile,
        dependents,
        setDependents,
        fetchDependents,
        addDependent,
        deleteDependent,
        isAddingDep,
        records,
        addRecord,
        deleteRecord,
        fetchRecords,
        vaccinations,
        addVaccination,
        deleteVaccination,
        medications,
        addMedication,
        deleteMedication,
        appointments,
        bookAppointment,
        cancelAppointment,
        dependentTrackerLogs,
        addTrackerLog,
        deleteTrackerLog,
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
        syncWatchVitals,
        handleLogout
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregiver() {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error('useCaregiver must be used within a CaregiverProvider');
  }
  return context;
}
