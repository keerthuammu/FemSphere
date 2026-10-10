# 🌸 FemSphere — Lifetime AI Health Twin Companion

> **A minimal, comprehensive Women's & Family Digital Health Twin Platform** built with **React 19, TypeScript, Vite, TailwindCSS, Express REST API, and PostgreSQL**.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 Overview

**FemSphere** is an AI-powered Digital Health Twin ecosystem offering personalized health tracking, family care management, clinical teleconsultations, and system governance. The entire platform features a **unified, cohesive UI design language** shared across four distinct role-based portals.

---

## 🏛️ System Architecture & Portals

```
FemSphere Platform
├── 🌸 Patient Portal       (/dashboard)            → Digital Twin, Vitals, Period Tracker, OCR Vault, Telehealth
├── 🤝 Caregiver Portal     (/caregiver-dashboard)  → Dependents, Clinical Vault, Vaccines, Meds, BLE Watch
├── 🩺 Doctor Portal        (/doctor-dashboard)     → Patients, OCR Records, Prescriptions, Slot Availability
└── 🛡️ Admin Portal         (/admin)                → System Overview, Users, Caregivers, Doctors, Articles
```

### 1. 🌸 Patient Portal (`/dashboard`)
- **Digital Health Twin**: Live aggregate health score (0–100) and predictive vitals.
- **Daily Health Tracker**: Log water, sleep, weight, and exercise with rule-based recommendations.
- **Period & Cycle Tracker**: Predict phases (Follicular, Ovulatory, Luteal, Menstrual) and log symptoms.
- **AI Medical Vault**: Upload lab reports (PDF/JPG/PNG up to 10MB) with automatic OCR biomarker extraction.
- **Prescribed Physical Therapy**: View exercises prescribed directly by verified doctors with practitioner attribution.
- **Telehealth & Appointments**: Book capacity slots and join live video/audio consultations.
- **BLE Smartwatch Sync**: Stream real-time heart rate, SpO2, temperature, and steps.

### 2. 🤝 Caregiver Portal (`/caregiver-dashboard`)
- **Multi-Dependent Care**: Manage children, elderly relatives, and family members.
- **Dependent Medical Records Vault**: Full file upload matching the user experience, AI OCR biomarker tables, and document downloads.
- **Vaccination Tracker**: Track administered vaccines and upcoming booster due dates.
- **Medication Reminders**: Daily dosage schedules with time-based reminder alerts.
- **BLE Smartwatch Sync**: Live vitals streaming from dependent wearable devices.

### 3. 🩺 Doctor Portal (`/doctor-dashboard`)
- **Patient Directory**: Review patient profiles, health twins, and shared histories.
- **Shared Medical Records**: Inspect patient-uploaded diagnostic files and extracted biomarkers.
- **Consultation & Prescriptions**: Issue diagnosis notes, medications, and prescribed physical therapy.
- **Availability Slot Manager**: Create recurring availability shifts and slot capacities (Max 1–5 patients/slot).
- **Appointment Queue**: Accept, reschedule, complete, or reject consultation requests.

### 4. 🛡️ Admin Portal (`/admin`)
- **Unified Dashboard**: Platform overview, operational metrics, and quick actions in one place.
- **Users Directory**: Manage patients (Female & Male accounts) with account activation and status toggles.
- **Caregiver Management**: Inspect caregivers and click directly into linked dependent profiles.
- **Doctor Approvals**: Verify medical licenses, review credentials, and approve/reject practitioners.
- **Health Articles CMS**: Draft, edit, publish, and delete community wellness articles.

---

## 🎨 Unified Design System

All four portals share an identical, cohesive design layout:
- **Color Palette**: Warm canvas (`#FAF7F4`), soft stone sidebar (`#F2EBE5`), and accent borders (`#E5CDBC`).
- **Sidebar (`w-64`)**: Serif brand header with purple icon badge (`#7C3AED`), rounded-2xl navigation pills, and an identity card footer with instant Logout.
- **Top Header Bar**: Frosted glass (`backdrop-blur-md`), verified status badge, live digital clock, and role-tailored action buttons.
- **Registration Layout**: Standardized 3-input-per-row grid, automatic Caregiver sub-type calculation from relationship, automatic Dependent Stage calculation from DOB, and 16+ age enforcement.

---

## 🗄️ Database Schema (PostgreSQL)

The database schema (`config/db.js`) includes full relational integrity:

| Table Name | Description |
|---|---|
| `users` | Auth credentials, roles (`User (Female)`, `User (Male)`, `Caregiver`, `Doctor`, `Admin (Superuser)`), status. |
| `user_profiles` | Age, blood group, life stage, height, weight, emergency contacts, avatar. |
| `caregivers` | Caregiver type, organization, emergency contact phone. |
| `dependents` | Linked care recipients, date of birth, relationship, medical notes. |
| `doctors` | License number, specialization, clinic affiliation, experience, approval status. |
| `medical_records` | Vault files, category, description, OCR scan results, dependent link, binary data. |
| `health_tracker` | Daily logs for water, sleep, weight, heart rate, symptoms. |
| `period_tracking` | Cycle dates, flow intensity, mood, ovulation predictions. |
| `doctor_availability_slots` | Date, start/end time, max capacity, booked count, active status. |
| `appointments` | Doctor-patient links, appointment slot, reason, consultation status. |
| `consultation_notes` | Clinical diagnoses, prescriptions, and doctor-prescribed physical therapy. |
| `health_articles` | Educational health guidance, category, publish dates. |
| `vaccinations` | Dependent vaccine records, administered dates, booster due dates. |
| `medications` | Dependent prescription reminders, dosages, daily schedules. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **PostgreSQL** v14+ running on port `5432` with database `femsphere_db`

### Environment Configuration (`.env`)
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=femsphere_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=femsphere_production_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### Option A: Quickstart with Docker Compose (Recommended)
Spin up PostgreSQL 16, Node.js Express REST API, and React Vite Frontend with a single command:
```bash
docker-compose up --build
```
- **Web Application:** `http://localhost:3000`
- **Backend API:** `http://localhost:5001/api`
- **PostgreSQL Database:** Port `5432` (`femsphere_db`)

### Option B: Local Development Setup

```bash
# 1. Install Node.js dependencies
npm install

# 2. Initialize PostgreSQL Schema and Master Demo Seeds
node init_db.js

# 3. Start Express REST API Server (Port 5001)
npm run server

# 4. In a separate terminal, start Vite Web Application (Port 3000)
npm run dev

# 5. Build for production
npm run build
```

---

## 📱 Flutter Mobile Application

The native cross-platform mobile client for Android and iOS is located directly in the workspace (`lib/`):

```bash
# 1. Get Flutter dependencies
flutter pub get

# 2. Run automated Flutter smoke & widget tests
flutter test

# 3. Launch on connected Android device or iOS simulator
flutter run
```

---

## 🧪 Automated Testing & QA

### 1. Backend REST API Tests (Node.js Native Test Runner)
```bash
npm test
```
Runs 11 automated test cases verifying `/api/health`, auth tokens, password reset flows, appointments, period tracker metrics, and HIPAA audit trails.

### 2. Full Test Suite (Backend + Flutter)
```bash
npm run test:all
```

### 3. Mobile End-to-End Appium Automated Test Suite (Python)
Automated UI test suite for Android 14 containing 40 end-to-end test cases across 7 suites:
```bash
pip install -r tests/appium/requirements.txt
pytest tests/appium --html=tests/appium/reports/test_report.html -v
```

---

## 🔑 Demo Access Credentials

| Portal | Email / Username | Password | Default Route |
|---|---|---|---|
| **🌸 Patient** | `elena.rostova@femsphere.health` | `Password123!` | `/dashboard` |
| **🤝 Caregiver** | `caregiver@femsphere.health` | `Password123!` | `/caregiver-dashboard` |
| **🩺 Doctor** | `dr.jenkins@femsphere.health` | `Password123!` | `/doctor-dashboard` |
| **🛡️ Admin** | `admin@femsphere.health` | `Password123!` | `/admin` |

---

## 📄 License

Distributed under the **MIT License**. Engineered for privacy-first women's and family health intelligence.
