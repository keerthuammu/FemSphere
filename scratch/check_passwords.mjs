import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  const users = await pool.query("SELECT username, email, password_hash FROM users WHERE username IN ('mkeerthana2909', 'sussela', 'bobby', 'aurora', 'dr_jenkins')");
  const candidates = ['mkeerthana2909', 'keerthana', 'keerthi', 'suseela', 'suseela123', 'sussela', 'bobby', 'bobby123', 'doctor123', 'Doctor123', 'aurora', 'aurora123', '123456', '12345678', 'password', 'Password@123', 'Password123', 'Secret123'];
  for (const u of users.rows) {
    let matched = false;
    for (const c of candidates) {
      if (await bcrypt.compare(c, u.password_hash)) {
        console.log(`MATCH! ${u.username}: ${c}`);
        matched = true;
        break;
      }
    }
    if (!matched) {
      console.log(`No match for ${u.username}`);
    }
  }
  await pool.end();
}
main().catch(console.error);
