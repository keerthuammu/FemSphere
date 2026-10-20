import pool from './config/db.js';

async function migrate() {
  console.log('Running comprehensive companion & audit migration...');

  // 1. Audit logs columns
  await pool.query(`
    ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS previous_state VARCHAR(255);
    ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS new_state VARCHAR(255);
    ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
  `);
  console.log('✓ audit_logs columns verified/added');

  // 2. Partner connections columns
  await pool.query(`
    ALTER TABLE partner_connections ADD COLUMN IF NOT EXISTS consent_granted_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE partner_connections ADD COLUMN IF NOT EXISTS last_consent_updated_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE partner_connections ADD COLUMN IF NOT EXISTS consent_status VARCHAR(50) DEFAULT 'awaiting_consent';
  `);
  console.log('✓ partner_connections columns verified/added');

  // 3. Relationships columns & constraints
  await pool.query(`
    ALTER TABLE relationships ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE relationships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS relationships_relationship_type_check;
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS relationships_status_check;
    ALTER TABLE relationships ADD CONSTRAINT relationships_status_check 
      CHECK (status IN ('Pending', 'Active', 'Accepted', 'Rejected', 'Cancelled', 'Revoked', 'Suspended'));
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS uq_user_relationship;
    ALTER TABLE relationships ADD CONSTRAINT uq_user_relationship 
      UNIQUE (owner_user_id, related_user_id, relationship_type);
  `);
  console.log('✓ relationships table verified/updated');

  // 4. Partner sharing permissions table check
  await pool.query(`
    CREATE TABLE IF NOT EXISTS partner_sharing_permissions (
      id SERIAL PRIMARY KEY,
      connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
      data_type VARCHAR(50) NOT NULL,
      permission VARCHAR(10) NOT NULL DEFAULT 'none' CHECK (permission IN ('none', 'view')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_connection_datatype UNIQUE (connection_id, data_type)
    );
  `);
  console.log('✓ partner_sharing_permissions table verified');

  console.log('All migrations completed successfully!');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
