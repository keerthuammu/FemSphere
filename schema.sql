-- ============================================================
-- FemSphere Mini Project PostgreSQL Database Schema
-- Database: femsphere_db
-- Tables: 14 Core Entities
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('User (Female)', 'Caregiver', 'Doctor', 'Admin (Superuser)')),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Pending Verification')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER_PROFILES TABLE (User Female Specific Details)
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(30) DEFAULT 'Female',
    blood_group VARCHAR(20),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    marital_status VARCHAR(30),
    life_stage VARCHAR(50),
    wearable_device VARCHAR(50),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CAREGIVERS TABLE
CREATE TABLE IF NOT EXISTS caregivers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    caregiver_type VARCHAR(50) NOT NULL CHECK (caregiver_type IN ('Parent', 'Partner / Spouse', 'Sibling', 'Friend', 'Nurse', 'Caretaker', 'Relative')),
    organization_name VARCHAR(150),
    emergency_phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. DEPENDENTS TABLE
CREATE TABLE IF NOT EXISTS dependents (
    id SERIAL PRIMARY KEY,
    caregiver_id INT REFERENCES caregivers(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    blood_group VARCHAR(20),
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    hospital_clinic VARCHAR(200),
    years_experience INT DEFAULT 0,
    approval_status VARCHAR(30) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. MEDICAL_RECORDS TABLE
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) CHECK (file_type IN ('PDF', 'JPG', 'PNG', 'JPEG')),
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. HEALTH_TRACKER TABLE
CREATE TABLE IF NOT EXISTS health_tracker (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2),
    water_intake_liters NUMERIC(4,2),
    sleep_hours NUMERIC(4,2),
    exercise_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. SYMPTOMS TABLE
CREATE TABLE IF NOT EXISTS symptoms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    symptom_name VARCHAR(150) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    onset_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Accepted', 'Rejected', 'Completed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. HEALTH_REPORTS TABLE
CREATE TABLE IF NOT EXISTS health_reports (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    report_title VARCHAR(200) NOT NULL,
    summary TEXT,
    ai_risk_score INT,
    shared_with_doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. CONSULTATION_NOTES TABLE
CREATE TABLE IF NOT EXISTS consultation_notes (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    advice TEXT,
    prescription_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. HEALTH_ARTICLES TABLE
CREATE TABLE IF NOT EXISTS health_articles (
    id SERIAL PRIMARY KEY,
    author_admin_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. VACCINATIONS TABLE
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    dependent_id INT REFERENCES dependents(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    administered_date DATE NOT NULL,
    next_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. MEDICATIONS TABLE
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    dependent_id INT REFERENCES dependents(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    schedule_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================
INSERT INTO users (id, username, email, password_hash, role, status) VALUES
(1, 'admin', 'admin@femsphere.health', 'admin_hash_2026', 'Admin (Superuser)', 'Active'),
(2, 'elena_health', 'elena.rostova@femsphere.health', 'user_hash_2026', 'User (Female)', 'Active'),
(3, 'marcus_cg', 'caregiver@femsphere.health', 'caregiver_hash_2026', 'Caregiver', 'Active'),
(4, 'dr_jenkins', 'dr.jenkins@femsphere.health', 'doctor_hash_2026', 'Doctor', 'Active')
ON CONFLICT DO NOTHING;
