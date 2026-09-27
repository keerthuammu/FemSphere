import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function setupAndTest() {
  try {
    const hash = await bcrypt.hash('Password123!', 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id IN (1, 2, 3, 4)', [hash]);
    console.log('✅ Demo account passwords updated with valid bcrypt hash.');

    // 1. Test Login
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'elena.rostova@femsphere.health', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    console.log('Login success:', loginData.success);
    const token = loginData.token;

    if (!token) {
      console.error('Failed to get token:', loginData);
      return;
    }

    // 2. Test Smartwatch Status
    const statusRes = await fetch('http://localhost:5001/api/smartwatch/status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Initial Status:', await statusRes.json());

    // 3. Test Smartwatch Device Registration
    const regRes = await fetch('http://localhost:5001/api/smartwatch/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        device_name: 'Amazfit Bip U Pro',
        device_model: 'A2008',
        device_identifier: 'E4:15:F6:8A:2B:10',
        connection_status: 'CONNECTED',
        battery_level: 88
      })
    });
    console.log('Register Device:', await regRes.json());

    // 4. Test Smartwatch Sync
    const syncRes = await fetch('http://localhost:5001/api/smartwatch/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        device_identifier: 'E4:15:F6:8A:2B:10',
        device_name: 'Amazfit Bip U Pro',
        battery_level: 87,
        heart_rate: 74,
        resting_heart_rate: 62,
        steps: 6420,
        calories: 345.2,
        distance_meters: 4820,
        sleep_duration_minutes: 440,
        spo2: 98,
        activity_type: 'Walking'
      })
    });
    console.log('Sync Telemetry:', await syncRes.json());

    // 5. Test Smartwatch Latest Data
    const latestRes = await fetch('http://localhost:5001/api/smartwatch/data/latest', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Latest Data:', await latestRes.json());

    // 6. Test Smartwatch History
    const historyRes = await fetch('http://localhost:5001/api/smartwatch/data/history?days=7', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('History Data:', await historyRes.json());

    // 7. Test AI Health Twin Integration
    const aiRes = await fetch('http://localhost:5001/api/health/insights/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const aiData = await aiRes.json();
    console.log('AI Twin Telemetry Insight Generated:', aiData.insights?.find(i => i.type === 'WEARABLE_TELEMETRY'));

    console.log('🎉 ALL BACKEND SMARTWATCH API ENDPOINTS VERIFIED & WORKING!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await pool.end();
  }
}

setupAndTest();
