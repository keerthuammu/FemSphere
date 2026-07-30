# 🌸 FemSphere — Lifetime AI Health Twin Companion

> **Comprehensive Women's & Family Digital Health Platform** built with **React 19, TypeScript, TailwindCSS, Express REST API, Spring Boot, and PostgreSQL**.

---

## 🌟 Project Overview

**FemSphere** is a modern, privacy-first Digital Health Twin platform designed to monitor health vitals, track cycles and symptoms, coordinate caregiver responsibilities, and facilitate seamless teleconsultation sharing between patients and medical practitioners.

The platform provides **Role-Based Access Control (RBAC)** across four specialized workspaces:
- 🌸 **Myself (User - Female)**: Personal Digital Twin, daily vitals, symptom history, AI recommendations, and medical vault.
- 🤝 **Caregiver**: Family care management, multi-dependent scheduling, vaccination trackers, and medication reminders.
- 🩺 **Doctor**: Clinical patient list, patient-shared medical records (read-only), consultation notes, and appointment scheduling.
- 🛡️ **Administrator**: System governance, user & doctor verification/approvals, health article publishing, and analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling & UI** | TailwindCSS + Lucide Icons + Google Fonts (Inter/Outfit) |
| **Routing** | React Router DOM v7 |
| **Backend REST API** | Express.js (Node.js) / Spring Boot Architecture |
| **Database** | PostgreSQL (`schema.sql`) — 14 Relational Tables |
| **Security & Privacy** | Role-Based Access Control (RBAC), 256-bit Encrypted Storage Protocols |

---

## 🏛️ Database Architecture (14 Relational Tables)

FemSphere relies on a structured PostgreSQL schema ([schema.sql](schema.sql)) with full relational integrity and foreign keys:

1. `users` — Authentication accounts and user roles.
2. `user_profiles` — Female health profile, vitals, blood group, life stage, and emergency contacts.
3. `caregivers` — Caregiver types, organization details, and contact info.
4. `dependents` — Linked care recipients (children, elders, family members).
5. `doctors` — Medical licenses, specializations, affiliations, and approval statuses.
6. `medical_records` — Vault for uploaded lab results & scans (PDF, JPG, PNG).
7. `health_tracker` — Daily vital logs (weight, water intake, sleep, exercise).
8. `symptoms` — Symptom tracker with severity levels, dates, and clinical notes.
9. `appointments` — Appointment booking, approval status, and time slots.
10. `health_reports` — Generated health reports & doctor sharing logs.
11. `consultation_notes` — Clinical diagnoses, advice, and prescription notes.
12. `health_articles` — Published medical articles & wellness guidance.
13. `vaccinations` — Dependent vaccination schedules & booster due dates.
14. `medications` — Active medication reminders, dosages, and daily schedules.

---

## 🚀 Key Features by Role

### 1. 🌸 Myself (User) Workspace
- **Digital Health Twin Overview**: Real-time Health Score (89/100) and vital summary.
- **Daily Health Tracker**: Log weight, water (L), sleep (hrs), and exercise (mins).
- **Symptom Tracker**: Record symptoms with severity levels (Low, Moderate, High) and notes.
- **Rule-Based AI Health Engine**: Automated suggestions (*"Drink 2.5L water daily"*, *"Sleep at least 8 hours"*).
- **Medical Vault**: Upload, view, download, and delete lab reports (PDF, JPG, PNG).
- **Report Generator & Sharing**: Export PDF health reports and grant read-only access to doctors.

### 2. 🤝 Caregiver Workspace
- **Multi-Dependent Care**: Manage children, elders, or family care profiles.
- **Multi-Scope Setup**: Select multiple primary scopes (Medication reminders, Vaccination tracking, Emergency escalation).
- **Vaccination Tracker**: Monitor administered vaccines and upcoming due dates.
- **Medication Reminders**: Set dosage schedules and daily reminder times.
- **Appointments**: Book & manage medical consultations for dependents.

### 3. 🩺 Doctor Workspace
- **Patient Directory**: Access patients who have explicitly shared their health twin reports.
- **Shared Medical Records**: Read-only inspection and download of patient files.
- **Consultation Notes**: Create, edit, and maintain patient diagnosis, advice, and prescription notes.
- **Appointment Queue**: Accept, reject, or mark appointments as completed.

### 4. 🛡️ Administrator Control Center
- **User Directory**: Search, edit details, activate/deactivate accounts, or delete users.
- **Caregiver Directory**: Search, edit caregiver details, and manage linked care profiles.
- **Doctor Verification**: Review pending registrations, approve, reject, or suspend licenses.
- **Health Articles CMS**: Add, edit, publish, or delete health guidance articles.
- **System Reports**: Real-time stats on registered users, active doctors, and report counts.

---

## 📋 5-Step Registration Workflow

1. **Step 1: Account Type**: Choose between **Myself**, **Caregiver**, or **Doctor**.
2. **Step 2: Personal Information**: Name, DOB, Gender (Female, Male, Other), Mobile, Email, Street Address, Pincode, City, State, Country.
3. **Step 3: Account Credentials**: Unique Username and Password.
4. **Step 4: Role-Specific Setup**:
   - *Myself*: Blood group, height, weight, marital status, life stage, wearable device.
   - *Caregiver*: Caregiver sub-type, dependent details, multi-select primary scope.
   - *Doctor*: Medical license number, specialization, hospital affiliation, years of experience.
5. **Step 5: Simple Consent & Rules**: 4 role-tailored checkboxes confirming info accuracy, rules agreement, data collection consent, and doctor sharing rights.

---

## 💻 Quick Start & Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/keerthuammu/FemSphere.git
   cd FemSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *Application will launch on http://localhost:3000*

4. **Start the Express Backend API Server:**
   ```bash
   npm run server
   ```
   *REST API server will run on http://localhost:5001*

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 Quick Demo Credentials

For quick testing from the Login page:

| Role | Email / Username | Password | Target Dashboard |
|---|---|---|---|
| **Administrator** | `admin@femsphere.health` | `••••••••••••` | `/admin` |
| **Myself (User)** | `elena.rostova@femsphere.health` | `••••••••••••` | `/dashboard` |
| **Caregiver** | `caregiver@femsphere.health` | `••••••••••••` | `/caregiver-dashboard` |
| **Doctor** | `dr.jenkins@femsphere.health` | `••••••••••••` | `/doctor-dashboard` |

---

## 📄 License & Contact

Distributed under the MIT License. Developed for women's and family health intelligence.
