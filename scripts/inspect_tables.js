import pool from '../config/db.js';

async function inspect() {
  const devCols = await pool.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'smartwatch_devices' ORDER BY ordinal_position`
  );
  console.log('smartwatch_devices columns:', devCols.rows);

  const dataCols = await pool.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'smartwatch_health_data' ORDER BY ordinal_position`
  );
  console.log('smartwatch_health_data columns:', dataCols.rows);
  await pool.end();
}

inspect();
