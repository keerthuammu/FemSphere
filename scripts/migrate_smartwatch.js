import pool from '../config/db.js';

async function migrateSmartwatch() {
  const client = await pool.connect();
  try {
    console.log('Running Smartwatch ALTER TABLE Migration...');
    await client.query('BEGIN');

    // Add battery_level to smartwatch_devices
    await client.query(`
      ALTER TABLE smartwatch_devices 
      ADD COLUMN IF NOT EXISTS battery_level INT CHECK (battery_level IS NULL OR (battery_level >= 0 AND battery_level <= 100));
    `);

    // Add spo2, distance_meters, sleep_duration_minutes to smartwatch_health_data
    await client.query(`
      ALTER TABLE smartwatch_health_data
      ADD COLUMN IF NOT EXISTS spo2 INT CHECK (spo2 IS NULL OR (spo2 >= 50 AND spo2 <= 100)),
      ADD COLUMN IF NOT EXISTS distance_meters NUMERIC(8,2),
      ADD COLUMN IF NOT EXISTS sleep_duration_minutes INT;
    `);

    // Sync values if sleep_duration exists
    await client.query(`
      UPDATE smartwatch_health_data 
      SET sleep_duration_minutes = sleep_duration 
      WHERE sleep_duration_minutes IS NULL AND sleep_duration IS NOT NULL;
    `);

    // Create unique constraint on user_id, device_identifier if not exists
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_device_identifier'
        ) THEN
          ALTER TABLE smartwatch_devices ADD CONSTRAINT uq_user_device_identifier UNIQUE (user_id, device_identifier);
        END IF;
      END $$;
    `);

    await client.query('COMMIT');
    console.log('✅ Smartwatch columns updated successfully in PostgreSQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateSmartwatch();
