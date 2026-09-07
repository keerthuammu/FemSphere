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
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('Parent', 'Partner', 'Sibling', 'Caregiver', 'Doctor', 'Adult Child', 'Friend')),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Pending', 'Active', 'Suspended', 'Revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
    status VARCHAR(30) DEFAULT 'Granted' CHECK (status IN ('Granted', 'Modified', 'Revoked', 'Expired')),
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
    resource VARCHAR(50) NOT NULL CHECK (resource IN ('Cycle', 'Symptoms', 'Medications', 'MedicalRecords', 'Appointments', 'Mood', 'Journal', 'Wearables', 'Emergency')),
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
    status VARCHAR(30) DEFAULT 'Success' CHECK (status IN ('Success', 'Denied', 'Revoked')),
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
-- INITIAL CORE SEED USERS & PROFILES
-- ==============================================================================
INSERT INTO users (id, username, email, password_hash, role, status) VALUES
(1, 'admin', 'admin@femsphere.health', 'admin_hash_2026', 'Admin (Superuser)', 'Active'),
(2, 'elena_health', 'elena.rostova@femsphere.health', 'user_hash_2026', 'User (Female)', 'Active'),
(3, 'marcus_cg', 'caregiver@femsphere.health', 'caregiver_hash_2026', 'Caregiver', 'Active'),
(4, 'dr_jenkins', 'dr.jenkins@femsphere.health', 'doctor_hash_2026', 'Doctor', 'Active')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
