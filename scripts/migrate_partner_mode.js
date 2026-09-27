import pool from '../config/db.js';

async function migratePartnerMode() {
  const client = await pool.connect();
  try {
    console.log('Running Partner Mode Migration...');
    await client.query('BEGIN');

    // 1. PARTNER CONNECTIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_connections (
        id SERIAL PRIMARY KEY,
        patient_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        partner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'revoked')),
        relationship_type VARCHAR(50) DEFAULT 'Spouse / Partner',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP WITH TIME ZONE,
        revoked_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT uq_patient_partner UNIQUE (patient_user_id, partner_user_id),
        CONSTRAINT chk_different_users CHECK (patient_user_id <> partner_user_id)
      );
    `);

    // 2. PARTNER SHARING PERMISSIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_sharing_permissions (
        id SERIAL PRIMARY KEY,
        connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
        data_type VARCHAR(50) NOT NULL,
        permission VARCHAR(20) NOT NULL DEFAULT 'none' CHECK (permission IN ('none', 'view')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_connection_data_type UNIQUE (connection_id, data_type)
      );
    `);

    // 3. PARTNER TASKS TABLE (Shared partner support tasks)
    await client.query(`
      CREATE TABLE IF NOT EXISTS partner_tasks (
        id SERIAL PRIMARY KEY,
        connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
        created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP WITH TIME ZONE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 4. SHARED HEALTH GOALS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS shared_health_goals (
        id SERIAL PRIMARY KEY,
        connection_id INT NOT NULL REFERENCES partner_connections(id) ON DELETE CASCADE,
        created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        target NUMERIC(10,2) NOT NULL,
        current_value NUMERIC(10,2) DEFAULT 0,
        unit VARCHAR(50) NOT NULL,
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create Indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_partner_conn_patient ON partner_connections(patient_user_id, status);
      CREATE INDEX IF NOT EXISTS idx_partner_conn_partner ON partner_connections(partner_user_id, status);
      CREATE INDEX IF NOT EXISTS idx_partner_perm_conn ON partner_sharing_permissions(connection_id);
      CREATE INDEX IF NOT EXISTS idx_partner_tasks_conn ON partner_tasks(connection_id);
      CREATE INDEX IF NOT EXISTS idx_partner_goals_conn ON shared_health_goals(connection_id);
    `);

    // 6. Seed active demo partner connection between User 2 (Elena, patient) and User 3 (Marcus, caregiver)
    const seedCheck = await client.query(
      `SELECT id FROM partner_connections WHERE patient_user_id = 2 AND partner_user_id = 3`
    );

    if (seedCheck.rows.length === 0) {
      const connRes = await client.query(`
        INSERT INTO partner_connections 
          (patient_user_id, partner_user_id, status, relationship_type, accepted_at)
        VALUES 
          (2, 3, 'accepted', 'Spouse', CURRENT_TIMESTAMP)
        RETURNING id;
      `);
      const connId = connRes.rows[0].id;

      // Seed default permissions
      const initialPermissions = [
        ['cycle_information', 'view'],
        ['fertility_information', 'view'],
        ['pregnancy_information', 'view'],
        ['appointments', 'view'],
        ['health_goals', 'view'],
        ['health_tracker', 'view'],
        ['ai_health_insights', 'none'],
        ['medications', 'none'],
        ['medical_records', 'none'],
        ['doctor_notes', 'none'],
        ['vaccinations', 'none'],
        ['prescriptions', 'none'],
        ['physical_therapy', 'none']
      ];

      for (const [dt, perm] of initialPermissions) {
        await client.query(`
          INSERT INTO partner_sharing_permissions (connection_id, data_type, permission)
          VALUES ($1, $2, $3)
          ON CONFLICT (connection_id, data_type) DO UPDATE SET permission = EXCLUDED.permission;
        `, [connId, dt, perm]);
      }

      // Seed demo shared tasks
      await client.query(`
        INSERT INTO partner_tasks (connection_id, created_by, assigned_to, title, description, due_date, status)
        VALUES 
          ($1, 2, 3, 'Attend ultrasound appointment together', 'OB-GYN prenatal scan with Dr. Jenkins at 10:00 AM', CURRENT_TIMESTAMP + INTERVAL '1 day', 'pending'),
          ($1, 2, 3, 'Evening walk together', '45 min relaxed walk to reach daily step goal', CURRENT_TIMESTAMP + INTERVAL '8 hours', 'pending'),
          ($1, 3, 2, 'Hydration reminder check-in', 'Help achieve 8 glasses target today', CURRENT_TIMESTAMP + INTERVAL '4 hours', 'completed');
      `, [connId]);

      // Seed demo shared goals
      await client.query(`
        INSERT INTO shared_health_goals (connection_id, created_by, title, target, current_value, unit, status)
        VALUES
          ($1, 2, 'Daily Hydration Goal', 8.0, 6.0, 'glasses', 'active'),
          ($1, 3, 'Daily Steps Together', 8000.0, 6200.0, 'steps', 'active'),
          ($1, 2, 'Weekly Healthy Home Cooking', 5.0, 3.0, 'meals', 'active');
      `, [connId]);

      console.log('✅ Demo partner connection (Elena <-> Marcus) seeded with permissions, tasks, and goals.');
    }

    await client.query('COMMIT');
    console.log('✅ Partner Mode database tables, indexes, and constraints created successfully in PostgreSQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Partner Mode migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migratePartnerMode();
