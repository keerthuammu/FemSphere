import pool from '../config/db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('--- Migrating Wearable Sync History Table ---');
    await client.query(`
      CREATE TABLE IF NOT EXISTS wearable_sync_history (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        device_id INT REFERENCES smartwatch_devices(id) ON DELETE SET NULL,
        provider VARCHAR(50) NOT NULL,
        sync_status VARCHAR(50) NOT NULL,
        records_discovered INT DEFAULT 0,
        records_uploaded INT DEFAULT 0,
        records_failed INT DEFAULT 0,
        error_message TEXT,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_wearable_sync_history_user ON wearable_sync_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_wearable_sync_history_started ON wearable_sync_history(started_at DESC);
    `);

    console.log('✅ wearable_sync_history table and indexes verified.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
