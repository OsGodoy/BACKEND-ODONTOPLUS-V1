-- EXTENSION PARA UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS citext;

-- ======================
-- USERS (STAFF)
-- ======================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'secretary', 'doctor')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ======================
-- SECRETARIES
-- ======================
CREATE TABLE secretaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ======================
-- DOCTORS
-- ======================
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ======================
-- PATIENTS (SIN LOGIN)
-- ======================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email CITEXT,
    document_id VARCHAR(50), -- cédula o identificación
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ======================
-- AVAILABILITY (HORARIOS)
-- ======================
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- APPOINTMENTS (CITAS)
-- ======================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- secretaria

    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'cancelled')
    ),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX unique_appointment_slot
ON appointments (doctor_id, date, start_time)
WHERE deleted_at IS NULL;

CREATE INDEX idx_appointments_doctor_date
ON appointments (doctor_id, date);

CREATE INDEX idx_appointments_patient
ON appointments (patient_id);

CREATE INDEX idx_availability_doctor
ON availability (doctor_id);

CREATE UNIQUE INDEX unique_email ON patients(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX unique_document ON patients(document_id) WHERE document_id IS NOT NULL;