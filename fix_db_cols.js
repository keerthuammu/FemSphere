import pool from './config/db.js';

async function fixDb() {
  await pool.query(`
    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS menarche_started BOOLEAN DEFAULT TRUE;
    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50) DEFAULT 'Single';
    ALTER TABLE partner_connections ADD COLUMN IF NOT EXISTS consent_granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  `);
  console.log('Columns verified and updated successfully.');
  process.exit(0);
}

fixDb().catch(e => {
  console.error(e);
  process.exit(1);
});
