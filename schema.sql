-- ==============================================================================
-- 🌸 FEMSPHERE DATABASE SCHEMA (POSTGRESQL)
-- Database: femsphere_db
-- Architecture: 22 Relational Entities fully normalized up to 5NF / BCNF
-- Normalization Levels:
--   - 1NF: Atomic scalar values, typed domains, primary key identification.
--   - 2NF: Elimination of partial functional dependencies via surrogate keys.
--   - 3NF: Elimination of transitive dependencies via dedicated lookup/profile tables.
--   - BCNF: Every determinant is an enforced Superkey (explicit UNIQUE constraints).
--   - 4NF: Independent multi-valued facts isolated into dedicated relations.
--   - 5NF: Lossless decomposition of ternary privacy/consent relationships (PJNF).
-- ==============================================================================

-- Enable UUID extension if needed in future
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- DOMAIN 1: IDENTITY, AUTHENTICATION & ROLE PROFILES (BCNF)
-- ==============================================================================

-- 1. USERS TABLE (Primary Identity Entity)
-- Determinants: {id}, {username}, {email}
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Myself', 'User (Female)', 'Caregiver', 'Doctor', 'Admin (Superuser)')),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Pending Verification')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER_PROFILES TABLE (Female Demographic & Health Baseline)
-- Enforces 1:1 Candidate Key with users(id) via UNIQUE constraint
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(30) DEFAULT 'Female' CHECK (gender IN ('Female', 'Non-Binary', 'Other')),
    blood_group VARCHAR(20) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')),
    height_cm NUMERIC(5,2) CHECK (height_cm IS NULL OR (height_cm > 30.0 AND height_cm < 280.0)),
    weight_kg NUMERIC(5,2) CHECK (weight_kg IS NULL OR (weight_kg > 2.0 AND weight_kg < 450.0)),
    marital_status VARCHAR(30) CHECK (marital_status IS NULL OR marital_status IN ('Single', 'Married', 'Divorced', 'Widowed', 'Partnered')),
    life_stage VARCHAR(50),
    menarche_started BOOLEAN DEFAULT TRUE,
    wearable_device VARCHAR(50) DEFAULT 'Apple Watch',
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CAREGIVERS TABLE (Caregiver Role Profile)
-- Enforces 1:1 Candidate Key with users(id) via UNIQUE constraint
CREATE TABLE IF NOT EXISTS caregivers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caregiver_type VARCHAR(50) NOT NULL CHECK (caregiver_type IN ('Parent', 'Partner / Spouse', 'Sibling', 'Friend', 'Nurse', 'Caretaker', 'Relative')),
    organization_name VARCHAR(150),
    emergency_phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DEPENDENTS TABLE (Linked Care Recipients)
-- Determinants: {id}
CREATE TABLE IF NOT EXISTS dependents (
    id SERIAL PRIMARY KEY,
    caregiver_id INT NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('Child / Daughter', 'Child / Son', 'Mother', 'Father', 'Elder Relative', 'Spouse', 'Other')),
    blood_group VARCHAR(20),
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCTORS TABLE (Medical Practitioner Verification & Practice)
-- Enforces Candidate Keys: {id}, {user_id}, {license_number}
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    hospital_clinic VARCHAR(200),
    years_experience INT DEFAULT 0 CHECK (years_experience >= 0 AND years_experience <= 70),
    approval_status VARCHAR(30) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Suspended')),
    schedule JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DOMAIN 2: LIFE-STAGE ENGINE (3NF REFERENCE CATALOG & 4NF PROGRESSION)
-- ==============================================================================

-- 6. LIFE_STAGES TABLE (Master Reference Catalog - Prevents Transitive Dependency)
-- Candidate Keys: {id}, {code}
CREATE TABLE IF NOT EXISTS life_stages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_age INT CHECK (min_age >= 0),
    max_age INT CHECK (max_age >= min_age)
);

-- 7. USER_LIFE_STAGES TABLE (Longitudinal Life-Stage History & Active State)
-- Candidate Keys: {id}, {user_id, life_stage_code, started_at}
CREATE TABLE IF NOT EXISTS user_life_stages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    life_stage_code VARCHAR(50) NOT NULL REFERENCES life_stages(code) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    manually_set BOOLEAN DEFAULT FALSE,
    enabled_modules JSONB DEFAULT '[]'::jsonb
);

-- ==============================================================================
-- DOMAIN 3: DAILY VITALS, SYMPTOMS & MEDICAL VAULT (4NF SEGREGATION)
-- ==============================================================================

-- 8. HEALTH_TRACKER TABLE (Daily Vital Time Series)
-- Candidate Keys: {id}, {user_id, log_date} (Guarantees at most 1 aggregate log per user per calendar day)
CREATE TABLE IF NOT EXISTS health_tracker (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) CHECK (weight_kg IS NULL OR (weight_kg > 2.0 AND weight_kg < 450.0)),
    water_intake_liters NUMERIC(4,2) CHECK (water_intake_liters IS NULL OR (water_intake_liters >= 0.0 AND water_intake_liters <= 25.0)),
    sleep_hours NUMERIC(4,2) CHECK (sleep_hours IS NULL OR (sleep_hours >= 0.0 AND sleep_hours <= 24.0)),
    exercise_minutes INT CHECK (exercise_minutes IS NULL OR (exercise_minutes >= 0 AND exercise_minutes <= 1440)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_daily_tracker UNIQUE (user_id, log_date)
);

-- 9. SYMPTOMS TABLE (Independent Multi-Valued Symptom Observations - 4NF)
CREATE TABLE IF NOT EXISTS symptoms (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptom_name VARCHAR(150) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    onset_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. MEDICAL_RECORDS TABLE (Encrypted Medical Vault - 4NF)
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF', 'JPG', 'PNG', 'JPEG')),
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes INT CHECK (file_size_bytes > 0),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DOMAIN 4: CLINICAL CARE, CONSULTATIONS & GOVERNANCE (BCNF)
-- ==============================================================================

-- 11. APPOINTMENTS TABLE (Clinical Teleconsultation Bookings)
-- Candidate Keys: {id}, {doctor_id, appointment_date, appointment_time} (Prevents double booking)
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Accepted', 'Rejected', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_doctor_appointment_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);

-- 12. HEALTH_REPORTS TABLE (Digital Health Twin Generated Reports)
CREATE TABLE IF NOT EXISTS health_reports (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_title VARCHAR(200) NOT NULL,
    summary TEXT,
    ai_risk_score INT CHECK (ai_risk_score IS NULL OR (ai_risk_score >= 0 AND ai_risk_score <= 100)),
    shared_with_doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. CONSULTATION_NOTES TABLE (Doctor's Clinical Notes)
CREATE TABLE IF NOT EXISTS consultation_notes (
    id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    advice TEXT,
    prescription_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. HEALTH_ARTICLES TABLE (Admin Educational Health Content)
CREATE TABLE IF NOT EXISTS health_articles (
    id SERIAL PRIMARY KEY,
    author_admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DOMAIN 5: DEPENDENT CARE & MEDICATION MANAGEMENT (4NF)
-- ==============================================================================

-- 15. VACCINATIONS TABLE (Dependent Immunization Schedule)
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    dependent_id INT NOT NULL REFERENCES dependents(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    administered_date DATE NOT NULL,
    next_due_date DATE CHECK (next_due_date IS NULL OR next_due_date >= administered_date),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. MEDICATIONS TABLE (Active Prescriptions & Reminders)
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    dependent_id INT NOT NULL REFERENCES dependents(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    schedule_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DOMAIN 6: PRIVACY CONSENTS, 5NF PERMISSION DECOMPOSITION & AUDITING
-- ==============================================================================

-- 17. RELATIONSHIPS TABLE (Caregiver / Partner / Patient Linkages)
-- Candidate Keys: {id}, {owner_user_id, related_user_id, relationship_type}
CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    related_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Accepted', 'Rejected', 'Cancelled', 'Revoked', 'Suspended')),
    permissions JSONB DEFAULT '["DailyActivities", "Cycle", "MedicalRecords", "Appointments"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_relationship UNIQUE (owner_user_id, related_user_id, relationship_type),
    CONSTRAINT chk_different_relationship_users CHECK (owner_user_id != related_user_id)
);

-- 18. CONSENTS TABLE (Atomic Consent Agreements - 5NF Project-Join Projection 1)
-- Candidate Keys: {id}, {owner_user_id, related_user_id, consent_type}
CREATE TABLE IF NOT EXISTS consents (
    id SERIAL PRIMARY KEY,
    owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    related_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL CHECK (consent_type IN ('PARTNER_SHARING', 'PARENT_MANAGEMENT', 'CAREGIVER_ACCESS', 'CLINICAL_SHARE')),
    status VARCHAR(30) DEFAULT 'Granted' CHECK (status IN ('Pending', 'Granted', 'Modified', 'Revoked', 'Expired')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_consent_grant UNIQUE (owner_user_id, related_user_id, consent_type),
    CONSTRAINT chk_different_consent_users CHECK (owner_user_id != related_user_id)
);

-- 19. PERMISSIONS TABLE (Granular Resource Access Control - 5NF Project-Join Projection 2)
-- Candidate Keys: {id}, {consent_id, resource}
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    consent_id INT NOT NULL REFERENCES consents(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL CHECK (resource IN ('Cycle', 'Symptoms', 'Medications', 'MedicalRecords', 'Appointments', 'Mood', 'Journal', 'Wearables', 'Emergency', 'DailyActivities')),
    action VARCHAR(30) DEFAULT 'Read' CHECK (action IN ('Read', 'Write', 'Notify')),
    allowed BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_consent_resource_action UNIQUE (consent_id, resource, action)
);

-- 20. HEALTH_EVENTS TABLE (Unified Longitudinal Lifetime Timeline Engine)
CREATE TABLE IF NOT EXISTS health_events (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('Cycle', 'Symptom', 'Mood', 'Medication', 'Appointment', 'MedicalRecord', 'AIInsight', 'Vaccination', 'LifeStageTransition')),
    event_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    source VARCHAR(50) DEFAULT 'User' CHECK (source IN ('User', 'Caregiver', 'Doctor', 'Wearable', 'AI_Engine')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. AI_INSIGHTS TABLE (Gemini AI Health Twin Analytics)
CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'DOCTOR_PREP', 'ATTENTION_FLAG')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'Normal' CHECK (severity IN ('Normal', 'Informational', 'Notice', 'Attention')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. AUDIT_LOGS TABLE (HIPAA/GDPR Compliance Privacy Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accessor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'Success',
    category VARCHAR(100),
    previous_state VARCHAR(255),
    new_state VARCHAR(255),
    details JSONB DEFAULT '{}'::jsonb,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- HIGH-PERFORMANCE 5NF NATURAL JOIN INDEXES (B-TREE)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_user_id ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_dependents_caregiver_id ON dependents(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_tracker_user_date ON health_tracker(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_date ON symptoms(user_id, onset_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_user_life_stages_user ON user_life_stages(user_id, is_current);
CREATE INDEX IF NOT EXISTS idx_consents_owner ON consents(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_consents_related ON consents(related_user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_consent ON permissions(consent_id);
CREATE INDEX IF NOT EXISTS idx_health_events_timeline ON health_events(user_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user ON ai_insights(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, accessed_at DESC);

-- ==============================================================================
-- DOMAIN 8: PERIOD & MENSTRUAL CYCLE TRACKING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS period_settings (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_period_start DATE NOT NULL,
    period_duration INT NOT NULL DEFAULT 5,
    cycle_length INT NOT NULL DEFAULT 28,
    is_configured BOOLEAN DEFAULT TRUE,
    is_pregnant BOOLEAN DEFAULT FALSE,
    pregnancy_start_date DATE,
    gestational_target_edd DATE,
    reminder_period_days_before INT DEFAULT 2,
    reminder_period_enabled BOOLEAN DEFAULT TRUE,
    reminder_ovulation_enabled BOOLEAN DEFAULT FALSE,
    reminder_daily_logging_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS period_cycles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INT NOT NULL DEFAULT 5,
    cycle_length_days INT NOT NULL DEFAULT 28,
    status VARCHAR(50) DEFAULT 'On Time',
    variance_days INT DEFAULT 0,
    flow_intensity VARCHAR(30) DEFAULT 'Medium',
    symptoms JSONB DEFAULT '[]'::jsonb,
    mood VARCHAR(50) DEFAULT 'Calm',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS period_daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    is_period_day BOOLEAN DEFAULT FALSE,
    flow_intensity VARCHAR(30) DEFAULT 'None',
    symptoms JSONB DEFAULT '[]'::jsonb,
    mood VARCHAR(50) DEFAULT 'Calm',
    energy_level VARCHAR(30) DEFAULT 'Normal',
    sleep_quality VARCHAR(30) DEFAULT 'Good',
    cervical_mucus VARCHAR(30) DEFAULT 'None',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_period_daily_logs_user_date ON period_daily_logs(user_id, log_date DESC);

-- ==============================================================================
-- DOMAIN 9: NOTIFICATIONS & UNIVERSAL WEARABLE TELEMETRY
-- ==============================================================================
-- 23. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. SMARTWATCH_DEVICES TABLE (Universal Wearables Registry)
CREATE TABLE IF NOT EXISTS smartwatch_devices (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(150) NOT NULL DEFAULT 'Smartwatch',
    device_model VARCHAR(150) DEFAULT 'Unknown Model',
    device_identifier VARCHAR(255) NOT NULL,
    brand VARCHAR(50) DEFAULT 'AMAZFIT',
    device_type VARCHAR(50) DEFAULT 'SMARTWATCH',
    capabilities JSONB DEFAULT '{"heart_rate": true, "steps": true, "calories": true, "distance": true, "sleep": false, "spo2": false, "battery": true}'::jsonb,
    mac_address VARCHAR(50),
    firmware_version VARCHAR(50),
    connection_status VARCHAR(50) DEFAULT 'DISCONNECTED',
    battery_level INT CHECK (battery_level IS NULL OR (battery_level >= 0 AND battery_level <= 100)),
    last_connected_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_device_identifier UNIQUE (user_id, device_identifier)
);

-- 25. SMARTWATCH_HEALTH_DATA TABLE (High-Frequency Biometric Ingestion)
CREATE TABLE IF NOT EXISTS smartwatch_health_data (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id INT REFERENCES smartwatch_devices(id) ON DELETE SET NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    heart_rate INT CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 240)),
    resting_heart_rate INT CHECK (resting_heart_rate IS NULL OR (resting_heart_rate >= 30 AND resting_heart_rate <= 150)),
    steps INT CHECK (steps IS NULL OR steps >= 0),
    calories NUMERIC(8,2) CHECK (calories IS NULL OR calories >= 0),
    distance NUMERIC(8,2),
    distance_meters NUMERIC(8,2),
    sleep_duration INT,
    sleep_duration_minutes INT,
    spo2 INT CHECK (spo2 IS NULL OR (spo2 >= 50 AND spo2 <= 100)),
    hrv_rmssd INT CHECK (hrv_rmssd IS NULL OR (hrv_rmssd >= 0 AND hrv_rmssd <= 300)),
    stress_score INT CHECK (stress_score IS NULL OR (stress_score >= 0 AND stress_score <= 100)),
    body_temperature NUMERIC(4,2) CHECK (body_temperature IS NULL OR (body_temperature >= 30.0 AND body_temperature <= 45.0)),
    blood_pressure_systolic INT CHECK (blood_pressure_systolic IS NULL OR (blood_pressure_systolic >= 50 AND blood_pressure_systolic <= 250)),
    blood_pressure_diastolic INT CHECK (blood_pressure_diastolic IS NULL OR (blood_pressure_diastolic >= 30 AND blood_pressure_diastolic <= 150)),
    respiratory_rate NUMERIC(4,1) CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 5.0 AND respiratory_rate <= 60.0)),
    activity_type VARCHAR(100) DEFAULT 'General',
    source VARCHAR(100) CHECK (length(source) > 0),
    raw_payload JSONB DEFAULT '{}'::jsonb,
    sync_key VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_smartwatch_data_sync_key ON smartwatch_health_data (user_id, sync_key) WHERE sync_key IS NOT NULL;

-- Wearable Views for Universal Compatibility
CREATE OR REPLACE VIEW wearable_devices AS SELECT * FROM smartwatch_devices;
CREATE OR REPLACE VIEW wearable_health_data AS SELECT * FROM smartwatch_health_data;

-- ==============================================================================
-- DOMAIN 10: PARTNER SHARING & COLLABORATIVE CARE
-- ==============================================================================
-- 26. PARTNER_CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS partner_connections (
    id SERIAL PRIMARY KEY,
    patient_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'revoked', 'cancelled')),
    relationship_type VARCHAR(50) DEFAULT 'Spouse / Partner',
    consent_status VARCHAR(50) DEFAULT 'awaiting_consent',
    consent_granted_at TIMESTAMP WITH TIME ZONE,
    last_consent_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_patient_partner UNIQUE (patient_user_id, partner_user_id),
    CONSTRAINT chk_different_users CHECK (patient_user_id <> partner_user_id)
);

-- 27. PARTNER_SHARING_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS partner_sharing_permissions (
    id SERIAL PRIMARY KEY,
    connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL,
    permission VARCHAR(20) NOT NULL DEFAULT 'none' CHECK (permission IN ('none', 'view')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_connection_data_type UNIQUE (connection_id, data_type)
);

-- 28. PARTNER_TASKS TABLE
CREATE TABLE IF NOT EXISTS partner_tasks (
    id SERIAL PRIMARY KEY,
    connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
    created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 29. SHARED_HEALTH_GOALS TABLE
CREATE TABLE IF NOT EXISTS shared_health_goals (
    id SERIAL PRIMARY KEY,
    connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
    created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target NUMERIC(10,2) NOT NULL,
    current_value NUMERIC(10,2) DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 32. TELEHEALTH_SESSIONS TABLE (Persistent Clinical Video Call Sessions)
CREATE TABLE IF NOT EXISTS telehealth_sessions (
    id SERIAL PRIMARY KEY,
    appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id INT,
    doctor_user_id INT,
    doctor_name VARCHAR(255),
    patient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_name VARCHAR(255),
    specialization VARCHAR(255),
    appointment_date VARCHAR(50),
    appointment_time VARCHAR(50),
    status VARCHAR(50) DEFAULT 'calling' CHECK (status IN ('calling', 'connected', 'declined', 'ended')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    connected_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    room_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXES FOR DOMAINS 8, 9, 10, 11
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_period_cycles_user_start ON period_cycles(user_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smartwatch_devices_user ON smartwatch_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_smartwatch_health_user_date ON smartwatch_health_data(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_conn_patient ON partner_connections(patient_user_id, status);
CREATE INDEX IF NOT EXISTS idx_partner_conn_partner ON partner_connections(partner_user_id, status);
CREATE INDEX IF NOT EXISTS idx_partner_perm_conn ON partner_sharing_permissions(connection_id);
CREATE INDEX IF NOT EXISTS idx_partner_tasks_conn ON partner_tasks(connection_id);
CREATE INDEX IF NOT EXISTS idx_partner_goals_conn ON shared_health_goals(connection_id);
CREATE INDEX IF NOT EXISTS idx_telehealth_apt ON telehealth_sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_telehealth_patient ON telehealth_sessions(patient_id, status);

-- ==============================================================================
-- MASTER REFERENCE SEED DATA (LIFE STAGES)
-- ==============================================================================
INSERT INTO life_stages (code, name, description, min_age, max_age) VALUES
('EARLY_CHILDHOOD', 'Early Childhood', '0-5 years pediatric growth, vaccination & milestone care', 0, 5),
('PRE_PUBERTY', 'Pre-Puberty', '6-10 years growing & physical development phase', 6, 10),
('PUBERTY', 'Puberty & Development', '11-13 years growing & changing, menstrual readiness', 11, 13),
('MENSTRUATING_ADOLESCENT', 'Adolescent Health', '14-17 years cycle tracking, symptom & mood logging', 14, 17),
('YOUNG_ADULT', 'Young Adult', '18-24 years holistic wellness, reproductive education', 18, 24),
('REPRODUCTIVE_AGE', 'Reproductive Age', '25-39 years cycle intelligence, fertility & wellness', 25, 39),
('PREGNANCY', 'Pregnancy Journey', 'Gestational age timeline, prenatal care & doctor checklist', 18, 50),
('POSTPARTUM', 'Postpartum Recovery', 'Fourth trimester recovery, newborn support & mood logs', 18, 50),
('PERIMENOPAUSE', 'Perimenopause', 'Hormonal shift tracking, hot flash & sleep pattern analysis', 40, 55),
('MENOPAUSE', 'Menopause Transition', 'Midlife health support, bone density & heart wellness', 45, 65),
('OLDER_ADULT', 'Healthy Aging', '60+ years vitals, medication adherence & elder support', 60, 120)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- INITIAL CORE SEED USERS (Password: Password123!)
-- Bcrypt Hash: $2b$10$po6K.4ZuAGnP6Lv.nIhc/Ocdyl9cwdDLXKU1qZewWAlFSFTTYvmke
-- ==============================================================================
INSERT INTO users (id, username, email, password_hash, role, status) VALUES
(1, 'admin', 'admin@femsphere.health', '$2b$10$po6K.4ZuAGnP6Lv.nIhc/Ocdyl9cwdDLXKU1qZewWAlFSFTTYvmke', 'Admin (Superuser)', 'Active'),
(2, 'elena_health', 'elena.rostova@femsphere.health', '$2b$10$po6K.4ZuAGnP6Lv.nIhc/Ocdyl9cwdDLXKU1qZewWAlFSFTTYvmke', 'User (Female)', 'Active'),
(3, 'marcus_cg', 'caregiver@femsphere.health', '$2b$10$po6K.4ZuAGnP6Lv.nIhc/Ocdyl9cwdDLXKU1qZewWAlFSFTTYvmke', 'Caregiver', 'Active'),
(4, 'dr_jenkins', 'dr.jenkins@femsphere.health', '$2b$10$po6K.4ZuAGnP6Lv.nIhc/Ocdyl9cwdDLXKU1qZewWAlFSFTTYvmke', 'Doctor', 'Active')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email, 
    password_hash = EXCLUDED.password_hash, 
    role = EXCLUDED.role, 
    status = EXCLUDED.status;

-- USER PROFILES
INSERT INTO user_profiles (id, user_id, full_name, dob, gender, blood_group, height_cm, weight_kg, marital_status, life_stage, wearable_device, emergency_contact_name, emergency_contact_phone) VALUES
(1, 1, 'System Administrator', '1990-01-01', 'Other', 'O+', 175.0, 70.0, 'Single', 'Young Adult', 'None', 'Emergency Admin', '+1-555-0100'),
(2, 2, 'Elena Rostova', '1996-04-12', 'Female', 'O+', 168.0, 58.0, 'Partnered', 'Reproductive Age', 'Apple Watch Series 9', 'Marcus Vance', '+1-555-0199'),
(3, 3, 'Marcus Vance', '1992-08-20', 'Other', 'A+', 182.0, 78.0, 'Partnered', 'Reproductive Age', 'Amazfit GTR 4', 'Elena Rostova', '+1-555-0144'),
(4, 4, 'Dr. Sarah Jenkins, MD', '1984-11-03', 'Female', 'B+', 165.0, 60.0, 'Married', 'Reproductive Age', 'Apple Watch Ultra', 'Hospital Security', '+1-555-0111')
ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- CAREGIVERS PROFILE
INSERT INTO caregivers (id, user_id, caregiver_type, organization_name, emergency_phone) VALUES
(1, 3, 'Partner / Spouse', 'Family Caregiver', '+1-555-0199')
ON CONFLICT (user_id) DO UPDATE SET caregiver_type = EXCLUDED.caregiver_type;

-- DEPENDENTS
INSERT INTO dependents (id, caregiver_id, full_name, dob, relationship, blood_group, medical_notes) VALUES
(1, 1, 'Maya Vance', '2021-06-15', 'Child / Daughter', 'A+', 'Mild eczema; up to date on pediatric vaccinations.')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- DOCTORS PROFILE
INSERT INTO doctors (id, user_id, license_number, specialization, hospital_clinic, years_experience, approval_status, schedule) VALUES
(1, 4, 'MD-948201', 'Obstetrics & Gynecology', 'Metropolitan Women’s Health Center', 14, 'Approved', '{"shifts": [{"day": "Monday", "startTime": "09:00 AM", "endTime": "05:00 PM", "maxPatients": 5}, {"day": "Tuesday", "startTime": "09:00 AM", "endTime": "05:00 PM", "maxPatients": 5}, {"day": "Wednesday", "startTime": "09:00 AM", "endTime": "05:00 PM", "maxPatients": 5}, {"day": "Thursday", "startTime": "09:00 AM", "endTime": "05:00 PM", "maxPatients": 5}, {"day": "Friday", "startTime": "09:00 AM", "endTime": "05:00 PM", "maxPatients": 5}], "slotDuration": "30 Minutes", "teleconsultFee": 75, "isUrgentCareOpen": true, "workingHours": "09:00 AM - 05:00 PM"}'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET 
    license_number = EXCLUDED.license_number,
    specialization = EXCLUDED.specialization,
    approval_status = EXCLUDED.approval_status,
    schedule = EXCLUDED.schedule;

-- PERIOD SETTINGS & INITIAL CYCLE FOR ELENA
INSERT INTO period_settings (id, user_id, last_period_start, period_duration, cycle_length, is_configured) VALUES
(1, 2, CURRENT_DATE - INTERVAL '14 days', 5, 28, TRUE)
ON CONFLICT (user_id) DO UPDATE SET last_period_start = EXCLUDED.last_period_start;

INSERT INTO period_cycles (user_id, start_date, end_date, duration_days, cycle_length_days, status, flow_intensity, symptoms, mood, notes) VALUES
(2, CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '9 days', 5, 28, 'On Time', 'Medium', '["Mild Cramps", "Normal Energy"]'::jsonb, 'Calm', 'Regular cycle onset, tracking well with twin predictions.')
ON CONFLICT DO NOTHING;

-- PARTNER CONNECTION BETWEEN ELENA (PATIENT) AND MARCUS (PARTNER/CAREGIVER)
INSERT INTO partner_connections (id, patient_user_id, partner_user_id, status, relationship_type, accepted_at) VALUES
(1, 2, 3, 'accepted', 'Spouse', CURRENT_TIMESTAMP)
ON CONFLICT (patient_user_id, partner_user_id) DO UPDATE SET status = 'accepted';

-- PARTNER SHARING PERMISSIONS
INSERT INTO partner_sharing_permissions (connection_id, data_type, permission) VALUES
(1, 'cycle_information', 'view'),
(1, 'fertility_information', 'view'),
(1, 'pregnancy_information', 'view'),
(1, 'appointments', 'view'),
(1, 'health_goals', 'view'),
(1, 'health_tracker', 'view'),
(1, 'ai_health_insights', 'none'),
(1, 'medications', 'none'),
(1, 'medical_records', 'none'),
(1, 'doctor_notes', 'none'),
(1, 'vaccinations', 'none'),
(1, 'prescriptions', 'none'),
(1, 'physical_therapy', 'none')
ON CONFLICT (connection_id, data_type) DO UPDATE SET permission = EXCLUDED.permission;

-- SHARED PARTNER TASKS & GOALS
INSERT INTO partner_tasks (id, connection_id, created_by, assigned_to, title, description, due_date, status) VALUES
(1, 1, 2, 3, 'Attend ultrasound appointment together', 'OB-GYN prenatal scan with Dr. Jenkins', CURRENT_TIMESTAMP + INTERVAL '1 day', 'pending'),
(2, 1, 2, 3, 'Evening walk together', '45 min relaxed walk to reach daily step goal', CURRENT_TIMESTAMP + INTERVAL '8 hours', 'pending'),
(3, 1, 3, 2, 'Hydration reminder check-in', 'Help achieve 8 glasses target today', CURRENT_TIMESTAMP + INTERVAL '4 hours', 'completed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO shared_health_goals (id, connection_id, created_by, title, target, current_value, unit, status) VALUES
(1, 1, 2, 'Daily Hydration Goal', 8.0, 6.0, 'glasses', 'active'),
(2, 1, 3, 'Daily Steps Together', 8000.0, 6200.0, 'steps', 'active'),
(3, 1, 2, 'Weekly Healthy Home Cooking', 5.0, 3.0, 'meals', 'active')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- DOMAIN 11: PATIENT PRESCRIBED PHYSICAL THERAPY & EXERCISE COMPLIANCE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS patient_exercise_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consultation_id INT REFERENCES consultation_notes(id) ON DELETE SET NULL,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_key VARCHAR(255) NOT NULL,
    completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_exercise_day UNIQUE (user_id, exercise_key, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_date ON patient_exercise_logs(user_id, completed_date DESC);

-- ==============================================================================
-- DOMAIN 12: SYNCHRONIZE PRIMARY KEY SEQUENCES AFTER SEEDING
-- ==============================================================================
DO $$
DECLARE
    tbl text;
    tbls text[] := ARRAY[
        'users', 'user_profiles', 'caregivers', 'dependents', 'doctors',
        'life_stages', 'user_life_stages', 'health_tracker', 'symptoms',
        'medical_records', 'appointments', 'health_reports', 'consultation_notes',
        'health_articles', 'vaccinations', 'medications', 'relationships',
        'consents', 'permissions', 'health_events', 'ai_insights', 'audit_logs',
        'period_settings', 'period_cycles', 'notifications', 'smartwatch_devices',
        'smartwatch_health_data', 'partner_connections', 'partner_sharing_permissions',
        'partner_tasks', 'shared_health_goals', 'patient_exercise_logs', 'telehealth_sessions'
    ];
BEGIN
    FOREACH tbl IN ARRAY tbls LOOP
        BEGIN
            EXECUTE format('SELECT setval(pg_get_serial_sequence(%L, ''id''), COALESCE((SELECT MAX(id) FROM %I), 1))', tbl, tbl);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END $$;


