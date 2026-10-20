import pool from './config/db.js';

async function migrate() {
  console.log('Migrating relationships table...');

  // 1. Add permissions column
  await pool.query(`
    ALTER TABLE relationships ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
  `);
  console.log('Added permissions column');

  // 2. Add updated_at column
  await pool.query(`
    ALTER TABLE relationships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  `);
  console.log('Added updated_at column');

  // 3. Drop restrictive relationship_type check constraint so any valid relationship is allowed
  await pool.query(`
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS relationships_relationship_type_check;
  `);
  console.log('Dropped restrictive relationship_type_check constraint');

  // 4. Update status check constraint to include all valid statuses
  await pool.query(`
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS relationships_status_check;
  `);
  await pool.query(`
    ALTER TABLE relationships ADD CONSTRAINT relationships_status_check 
    CHECK (status IN ('Pending', 'Active', 'Accepted', 'Rejected', 'Cancelled', 'Revoked', 'Suspended'));
  `);
  console.log('Updated status_check constraint');

  // 5. Add unique constraint for ON CONFLICT (owner_user_id, related_user_id, relationship_type)
  await pool.query(`
    ALTER TABLE relationships DROP CONSTRAINT IF EXISTS uq_user_relationship;
  `);
  // Remove duplicates if any exist before adding unique constraint
  await pool.query(`
    DELETE FROM relationships a USING relationships b
    WHERE a.id < b.id 
      AND a.owner_user_id = b.owner_user_id 
      AND a.related_user_id = b.related_user_id 
      AND a.relationship_type = b.relationship_type;
  `);
  await pool.query(`
    ALTER TABLE relationships ADD CONSTRAINT uq_user_relationship 
    UNIQUE (owner_user_id, related_user_id, relationship_type);
  `);
  console.log('Added uq_user_relationship unique constraint');

  console.log('Migration completed successfully!');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
