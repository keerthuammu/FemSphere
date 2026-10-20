import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function initPostgreSQL() {
  let client;

  if (process.env.DATABASE_URL) {
    console.log('Connecting to cloud PostgreSQL using DATABASE_URL...');
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    });
    await client.connect();
    console.log('Connected to cloud PostgreSQL successfully!');
  } else {
    client = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      database: 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      password: process.env.DB_PASSWORD || 'postgres'
    });

    await client.connect();
    try {
      await client.query('CREATE DATABASE femsphere_db');
      console.log('Database femsphere_db created successfully!');
    } catch (err) {
      console.log('Database notice:', err.message);
    }
    await client.end();

    client = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'femsphere_db',
      port: parseInt(process.env.DB_PORT || '5432'),
      password: process.env.DB_PASSWORD || 'postgres'
    });

    await client.connect();
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  await client.query(sql);
  console.log('Successfully executed schema.sql on femsphere_db!');

  // Sync sequence values after explicit ID inserts
  const tables = [
    'users', 'user_profiles', 'caregivers', 'dependents', 'doctors',
    'life_stages', 'user_life_stages', 'health_tracker', 'symptoms',
    'medical_records', 'appointments', 'health_reports', 'consultation_notes',
    'health_articles', 'vaccinations', 'medications', 'relationships',
    'consents', 'permissions', 'health_events', 'ai_insights', 'audit_logs',
    'period_settings', 'period_cycles', 'notifications', 'smartwatch_devices',
    'smartwatch_health_data', 'partner_connections', 'partner_sharing_permissions',
    'partner_tasks', 'shared_health_goals', 'patient_exercise_logs', 'telehealth_sessions'
  ];
  for (const t of tables) {
    try {
      await client.query(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM ${t}), 1))`);
    } catch (e) {}
  }
  console.log(`PostgreSQL sequences synchronized for all ${tables.length} tables!`);

  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log(`All ${tablesResult.rows.length} Tables in femsphere_db:`);
  tablesResult.rows.forEach(row => console.log(' - ' + row.table_name));

  await client.end();
}

initPostgreSQL().catch(err => {
  console.error('Initialization error:', err);
  process.exit(1);
});
