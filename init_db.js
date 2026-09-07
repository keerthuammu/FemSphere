import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function initPostgreSQL() {
  let client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    port: 5432
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
    user: 'postgres',
    host: '127.0.0.1',
    database: 'femsphere_db',
    port: 5432
  });

  await client.connect();

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  await client.query(sql);
  console.log('Successfully executed schema.sql on femsphere_db!');

  // Sync sequence values after explicit ID inserts
  const tables = ['users', 'user_profiles', 'caregivers', 'dependents', 'doctors', 'medical_records', 'health_tracker', 'symptoms', 'appointments', 'health_reports', 'consultation_notes', 'health_articles', 'vaccinations', 'medications'];
  for (const t of tables) {
    try {
      await client.query(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM ${t}), 1))`);
    } catch (e) {}
  }
  console.log('PostgreSQL sequences synchronized!');

  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log('All 14 Tables in femsphere_db:');
  tablesResult.rows.forEach(row => console.log(' - ' + row.table_name));

  await client.end();
}

initPostgreSQL().catch(err => {
  console.error('Initialization error:', err);
  process.exit(1);
});
