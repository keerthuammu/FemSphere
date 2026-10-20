import pool from '../config/db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migration: add sync_key to smartwatch_health_data...');
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE smartwatch_health_data 
      ADD COLUMN IF NOT EXISTS sync_key VARCHAR(255);
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_smartwatch_data_sync_key 
      ON smartwatch_health_data (user_id, sync_key) 
      WHERE sync_key IS NOT NULL;
    `);

    await client.query(`
      CREATE OR REPLACE VIEW wearable_health_data AS 
      SELECT * FROM smartwatch_health_data;
    `);

    await client.query('COMMIT');
    console.log('Migration successful: sync_key added and index created!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
