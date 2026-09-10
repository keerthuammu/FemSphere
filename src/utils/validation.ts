/**
 * Centralized Client-Side Validation Utilities for FemSphere
 * Pure frontend logic - zero backend overhead.
 * Note: Vitals (Height & Weight) are intentionally excluded per requirements.
 */

// Email Validation
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
};

// Phone Number Validation (international or 10-digit formats, min 10 digits)
export const PHONE_REGEX = /^\+?[0-9\s\-()]{10,20}$/;
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return PHONE_REGEX.test(phone.trim()) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

// Postal / Pincode Validation (alphanumeric or 4-10 digit standard zip codes)
export const isValidPincode = (pincode: string): boolean => {
  if (!pincode) return false;
  return /^[a-zA-Z0-9\s\-]{4,10}$/.test(pincode.trim());
};

// Username Validation (3-30 chars, alphanumeric + underscores/hyphens)
export const isValidUsername = (username: string): boolean => {
  if (!username) return false;
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username.trim());
};

// Name Validation (letters, spaces, hyphens, min 2 chars)
export const isValidName = (name: string): boolean => {
  if (!name) return false;
  return /^[a-zA-Z\s\-'.]{2,60}$/.test(name.trim());
};

// Password Strength Validation
export interface PasswordValidationResult {
  isValid: boolean;
  score: 'Weak' | 'Medium' | 'Strong';
  message: string;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password || password.length < 8) {
    const msg = 'Password must be at least 8 characters long.';
    return {
      isValid: false,
      score: 'Weak',
      message: msg,
      errors: [msg]
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  if (criteriaMet >= 4 && password.length >= 10) {
    return { isValid: true, score: 'Strong', message: '', errors: [] };
  } else if (criteriaMet >= 3) {
    return { isValid: true, score: 'Medium', message: '', errors: [] };
  } else {
    const msg = 'Password must include uppercase, lowercase, numbers, and special characters.';
    return {
      isValid: false,
      score: 'Weak',
      message: msg,
      errors: [msg]
    };
  }
};

// Date Validations
export const isPastOrToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d.getTime() <= today.getTime();
};

export const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

export const isChronological = (startDateStr: string, endDateStr: string): boolean => {
  if (!startDateStr || !endDateStr) return false;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  return end.getTime() >= start.getTime();
};

export const calculateAge = (dobStr: string): number => {
  if (!dobStr) return 0;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Health Tracker Ranges (EXCLUDING Height and Weight)
export const isValidWater = (liters: number): boolean => {
  return typeof liters === 'number' && !isNaN(liters) && liters >= 0.1 && liters <= 10.0;
};

export const isValidSleep = (hours: number): boolean => {
  return typeof hours === 'number' && !isNaN(hours) && hours >= 0.0 && hours <= 24.0;
};

export const isValidExercise = (mins: number): boolean => {
  return typeof mins === 'number' && !isNaN(mins) && mins >= 0 && mins <= 720;
};

export const isValidHeartRate = (bpm: number): boolean => {
  return typeof bpm === 'number' && !isNaN(bpm) && bpm >= 35 && bpm <= 220;
};

export const isValidBloodPressure = (bpStr: string): { isValid: boolean; message: string } => {
  if (!bpStr || !bpStr.trim()) return { isValid: false, message: 'Blood pressure is required (e.g. 120/80).' };
  const match = bpStr.trim().match(/^(\d{2,3})\s*\/\s*(\d{2,3})$/);
  if (!match) {
    return { isValid: false, message: 'Format must be systolic/diastolic (e.g. 120/80).' };
  }
  const systolic = parseInt(match[1], 10);
  const diastolic = parseInt(match[2], 10);

  if (systolic < 70 || systolic > 240) {
    return { isValid: false, message: 'Systolic pressure should be between 70 and 240 mmHg.' };
  }
  if (diastolic < 40 || diastolic > 150) {
    return { isValid: false, message: 'Diastolic pressure should be between 40 and 150 mmHg.' };
  }
  if (systolic <= diastolic) {
    return { isValid: false, message: 'Systolic pressure must be higher than diastolic pressure.' };
  }
  return { isValid: true, message: '' };
};

export const isValidTemperature = (celsius: number): boolean => {
  return typeof celsius === 'number' && !isNaN(celsius) && celsius >= 34.0 && celsius <= 42.0;
};

export const isValidBloodGlucose = (mgdl: number): boolean => {
  return typeof mgdl === 'number' && !isNaN(mgdl) && mgdl >= 30 && mgdl <= 600;
};

// Shift and Appointment Validation
export const isValidTimeSlot = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  return endTime > startTime;
};

export const isValidPatientCapacity = (capacity: number): boolean => {
  return typeof capacity === 'number' && !isNaN(capacity) && capacity >= 1 && capacity <= 100;
};

// File Validation
export const isValidDocumentFile = (
  file: File,
  allowedExtensions: string[] = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB
): { isValid: boolean; message: string } => {
  if (!file) return { isValid: false, message: 'No file selected.' };

  const fileName = file.name.toLowerCase();
  const hasAllowedExt = allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));
  if (!hasAllowedExt) {
    return { isValid: false, message: `Only files with extensions ${allowedExtensions.join(', ')} are allowed.` };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { isValid: false, message: `File size exceeds the maximum limit of ${maxMb}MB.` };
  }

  return { isValid: true, message: '' };
};

// Caregiver sub-type calculation from relationship
export const getCaregiverTypeFromRelationship = (relationship: string): string => {
  const rel = (relationship || '').toLowerCase().trim();
  if (!rel) return '';
  if (rel.includes('daughter') || rel.includes('son') || rel.includes('child')) {
    return 'Parent';
  }
  if (rel.includes('spouse') || rel.includes('partner') || rel.includes('husband') || rel.includes('wife')) {
    return 'Partner / Spouse';
  }
  if (rel.includes('sister') || rel.includes('brother') || rel.includes('sibling')) {
    return 'Sibling';
  }
  if (rel.includes('mother') || rel.includes('father') || rel.includes('grandparent') || rel.includes('relative') || rel.includes('elder')) {
    return 'Relative';
  }
  return 'Relative';
};

// Dependent category / life stage calculation based on Date of Birth
export const getDependentCategoryFromDob = (dobStr: string): string => {
  if (!dobStr) return '';
  const age = calculateAge(dobStr);
  if (age < 12) return 'Child / Infant';
  if (age < 18) return 'Adolescent';
  if (age < 60) return 'Adult';
  return 'Elder / Senior';
};
