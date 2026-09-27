import pool from '../config/db.js';

async function migrateUniversalWearables() {
  const client = await pool.connect();
  try {
    console.log('Running Universal Wearables ALTER TABLE Migration...');
    await client.query('BEGIN');

    // 1. Enhance smartwatch_devices to support any wearable brand, type, capabilities
    await client.query(`
      ALTER TABLE smartwatch_devices 
      ADD COLUMN IF NOT EXISTS brand VARCHAR(50) DEFAULT 'AMAZFIT',
      ADD COLUMN IF NOT EXISTS device_type VARCHAR(50) DEFAULT 'SMARTWATCH',
      ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '{"heart_rate": true, "steps": true, "calories": true, "distance": true, "sleep": false, "spo2": false, "battery": true}'::jsonb,
      ADD COLUMN IF NOT EXISTS mac_address VARCHAR(50),
      ADD COLUMN IF NOT EXISTS firmware_version VARCHAR(50);
    `);

    // 2. Enhance smartwatch_health_data for advanced biometric metrics (HRV, stress, temperature, BP)
    await client.query(`
      ALTER TABLE smartwatch_health_data
      ADD COLUMN IF NOT EXISTS hrv_rmssd INT CHECK (hrv_rmssd IS NULL OR (hrv_rmssd >= 0 AND hrv_rmssd <= 300)),
      ADD COLUMN IF NOT EXISTS stress_score INT CHECK (stress_score IS NULL OR (stress_score >= 0 AND stress_score <= 100)),
      ADD COLUMN IF NOT EXISTS body_temperature NUMERIC(4,2) CHECK (body_temperature IS NULL OR (body_temperature >= 30.0 AND body_temperature <= 45.0)),
      ADD COLUMN IF NOT EXISTS blood_pressure_systolic INT CHECK (blood_pressure_systolic IS NULL OR (blood_pressure_systolic >= 50 AND blood_pressure_systolic <= 250)),
      ADD COLUMN IF NOT EXISTS blood_pressure_diastolic INT CHECK (blood_pressure_diastolic IS NULL OR (blood_pressure_diastolic >= 30 AND blood_pressure_diastolic <= 150)),
      ADD COLUMN IF NOT EXISTS respiratory_rate NUMERIC(4,1) CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 5.0 AND respiratory_rate <= 60.0));
    `);

    // Drop restrictive source enum check so all brand sources are supported
    await client.query(`
      ALTER TABLE smartwatch_health_data DROP CONSTRAINT IF EXISTS smartwatch_health_data_source_check;
      ALTER TABLE smartwatch_health_data ADD CONSTRAINT smartwatch_health_data_source_check CHECK (length(source) > 0);
    `);

    // 3. Create view wearable_devices and wearable_health_data as universal aliases
    await client.query(`
      CREATE OR REPLACE VIEW wearable_devices AS SELECT * FROM smartwatch_devices;
    `);

    await client.query(`
      CREATE OR REPLACE VIEW wearable_health_data AS SELECT * FROM smartwatch_health_data;
    `);

    // 4. Update existing Amazfit devices with appropriate metadata
    await client.query(`
      UPDATE smartwatch_devices
      SET brand = 'AMAZFIT',
          capabilities = '{"heart_rate": true, "steps": true, "calories": true, "distance": true, "sleep": false, "spo2": false, "battery": true, "real_time_stream": true}'::jsonb
      WHERE brand IS NULL OR brand = 'AMAZFIT';
    `);

    await client.query('COMMIT');
    console.log('✅ Universal Wearables columns and views created successfully in PostgreSQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Universal Wearables migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateUniversalWearables();
