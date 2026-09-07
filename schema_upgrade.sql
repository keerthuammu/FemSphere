-- ============================================================
-- FemSphere Database Schema Upgrade: Life-Stage Engine & Consent
-- ============================================================

-- 1. LIFE STAGES REFERENCE TABLE
CREATE TABLE IF NOT EXISTS life_stages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_age INT,
    max_age INT
);

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

-- 2. USER LIFE STAGES ACTIVE TRACKING TABLE
CREATE TABLE IF NOT EXISTS user_life_stages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    life_stage_code VARCHAR(50) REFERENCES life_stages(code) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    manually_set BOOLEAN DEFAULT FALSE,
    enabled_modules JSONB DEFAULT '[]'::jsonb
);

-- 3. RELATIONSHIPS TABLE (Caregiver / Partner / Parent linkages)
CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    owner_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    related_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('Parent', 'Partner', 'Sibling', 'Caregiver', 'Doctor', 'Adult Child', 'Friend')),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Pending', 'Active', 'Suspended', 'Revoked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONSENTS TABLE (Granular access agreements)
CREATE TABLE IF NOT EXISTS consents (
    id SERIAL PRIMARY KEY,
    owner_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    related_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL, -- 'PARTNER_SHARING', 'PARENT_MANAGEMENT', 'CAREGIVER_ACCESS', 'CLINICAL_SHARE'
    status VARCHAR(30) DEFAULT 'Granted' CHECK (status IN ('Granted', 'Modified', 'Revoked', 'Expired')),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP
);

-- 5. PERMISSIONS TABLE (Resource level permissions per consent)
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    consent_id INT REFERENCES consents(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL, -- 'Cycle', 'Symptoms', 'Medications', 'MedicalRecords', 'Appointments', 'Mood', 'Journal', 'Wearables', 'Emergency'
    action VARCHAR(30) DEFAULT 'Read', -- 'Read', 'Write', 'Notify'
    allowed BOOLEAN DEFAULT TRUE
);

-- 6. AI INSIGHTS TABLE (Gemini AI Health Twin Output)
CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'DOCTOR_PREP', 'ATTENTION_FLAG')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'Normal' CHECK (severity IN ('Normal', 'Informational', 'Notice', 'Attention')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. HEALTH EVENTS TABLE (Unified Timeline Engine)
CREATE TABLE IF NOT EXISTS health_events (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'Cycle', 'Symptom', 'Mood', 'Medication', 'Appointment', 'MedicalRecord', 'AIInsight', 'Vaccination'
    event_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    source VARCHAR(50) DEFAULT 'User'
);

-- 8. AUDIT LOGS TABLE (Data Access Privacy Auditing)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    accessor_id INT REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'Success',
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
