import pool from '../config/db.js';

async function run() {
  const doc = await pool.query('SELECT d.id, u.username FROM doctors d JOIN users u ON d.user_id = u.id LIMIT 1');
  const docId = doc.rows[0]?.id || 1;
  const exercises = JSON.stringify([
    {
      id: 'pelvic-floor-kegel',
      name: 'Pelvic Floor & Kegel Stabilization',
      category: 'Pelvic Health',
      duration: '15 mins',
      frequency: 'Twice Daily',
      instructions: '5-second isometric pelvic floor contraction holds, 10 reps per set. Breathe smoothly without bearing down.'
    },
    {
      id: 'diastasis-core-repair',
      name: 'Transverse Abdominis Core Activation',
      category: 'Core Physical Therapy',
      duration: '12 mins',
      frequency: 'Daily',
      instructions: 'Supine gentle pelvic tilts with deep exhalation. Avoid standard crunches or high abdominal pressure.'
    }
  ]);

  await pool.query(
    `INSERT INTO consultation_notes (doctor_id, patient_id, diagnosis, advice, prescription_notes, prescribed_exercises)
     VALUES ($1, 8, 'Mild Pelvic Floor Laxity & Core Instability', 'Maintain gentle low-impact physical movement. Refrain from heavy lifting (>10kg) and perform prescribed therapy morning and evening.', '', $2)`,
    [docId, exercises]
  );
  console.log('Inserted clinical exercise prescription for user 8');
  await pool.end();
}

run().catch(console.error);
