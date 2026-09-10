import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

async function checkAdmin() {
  const res = await pool.query("SELECT id, username, email, password_hash, role FROM users WHERE role LIKE '%Admin%'");
  console.log('Admin records:', res.rows);
  for (const r of res.rows) {
    console.log(`Checking user: ${r.username} (${r.email})`);
    console.log('  password123:', await bcrypt.compare('password123', r.password_hash));
    console.log('  Password123:', await bcrypt.compare('Password123', r.password_hash));
    console.log('  admin123:', await bcrypt.compare('admin123', r.password_hash));
    console.log('  Admin@123:', await bcrypt.compare('Admin@123', r.password_hash));
  }
  await pool.end();
}

checkAdmin().catch(console.error);
