import pool from '../config/db.js';

async function updateGenderConstraint() {
  console.log('Connecting to database to update user_profiles_gender_check constraint...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Drop the old constraint
    console.log('Dropping old constraint user_profiles_gender_check...');
    await client.query(`
      ALTER TABLE user_profiles 
      DROP CONSTRAINT IF EXISTS user_profiles_gender_check;
    `);

    // Add updated constraint allowing Female, Male, Non-Binary, Other
    console.log('Adding updated constraint allowing Female, Male, Non-Binary, Other...');
    await client.query(`
      ALTER TABLE user_profiles 
      ADD CONSTRAINT user_profiles_gender_check 
      CHECK (gender IS NULL OR gender IN ('Female', 'Male', 'Non-Binary', 'Other'));
    `);

    await client.query('COMMIT');
    console.log('Successfully updated user_profiles_gender_check constraint in database!');

    // Verify
    const verify = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c 
      JOIN pg_class t ON c.conrelid = t.oid 
      WHERE t.relname = 'user_profiles' AND c.conname = 'user_profiles_gender_check';
    `);
    console.log('Verified constraint definition:', verify.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update constraint:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

updateGenderConstraint();
