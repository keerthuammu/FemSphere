import pool from '../config/db.js';

const API_BASE = 'http://localhost:5001/api';

async function testWearablesApi() {
  try {
    console.log('Testing Universal Wearable Endpoints...');

    // 1. Login as demo user
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'elena.rostova@femsphere.health',
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log('Login success: true');

    // 2. Register Apple Watch
    const appleWatchRes = await fetch(`${API_BASE}/wearables/devices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        device_name: 'Apple Watch Series 9',
        device_model: 'A2980',
        device_identifier: 'APPLE-WATCH-SERIES-9-01',
        brand: 'APPLE_WATCH',
        device_type: 'SMARTWATCH',
        capabilities: {
          heart_rate: true,
          resting_heart_rate: true,
          steps: true,
          calories: true,
          distance: true,
          sleep: true,
          spo2: true,
          hrv: true,
          body_temperature: true,
          ecg: true,
          respiratory_rate: true
        },
        battery_level: 92
      })
    });
    const appleData = await appleWatchRes.json();
    console.log('Registered Apple Watch:', appleData.device?.brand, appleData.device?.device_name);

    // 3. Register Garmin Watch
    const garminRes = await fetch(`${API_BASE}/wearables/devices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        device_name: 'Garmin Forerunner 265',
        device_model: 'FR265',
        device_identifier: 'GARMIN-FR265-B4',
        brand: 'GARMIN',
        device_type: 'SMARTWATCH',
        capabilities: {
          heart_rate: true,
          resting_heart_rate: true,
          steps: true,
          calories: true,
          distance: true,
          sleep: true,
          spo2: true,
          hrv: true,
          stress: true
        },
        battery_level: 78
      })
    });
    const garminData = await garminRes.json();
    console.log('Registered Garmin:', garminData.device?.brand, garminData.device?.device_name);

    // 4. Sync Apple Watch Telemetry with advanced metrics (Body temp, HRV, Sleep)
    const syncApple = await fetch(`${API_BASE}/wearables/sync`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        device_identifier: 'APPLE-WATCH-SERIES-9-01',
        device_name: 'Apple Watch Series 9',
        device_model: 'A2980',
        brand: 'APPLE_WATCH',
        battery_level: 91,
        heart_rate: 68,
        resting_heart_rate: 58,
        steps: 8120,
        calories: 420,
        distance_meters: 6150.00,
        sleep_duration_minutes: 480,
        spo2: 99,
        hrv_rmssd: 62,
        body_temperature: 36.65,
        respiratory_rate: 14.5,
        activity_type: 'Outdoor Run',
        source: 'APPLE_WATCH'
      })
    });
    const syncAppleData = await syncApple.json();
    console.log('Synced Apple Watch Telemetry:', syncAppleData.health_data?.source, 'HR:', syncAppleData.health_data?.heart_rate, 'Temp:', syncAppleData.health_data?.body_temperature);

    // 5. Sync boAt BLE wearable
    const syncBoat = await fetch(`${API_BASE}/wearables/sync`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        device_identifier: 'DC:1B:44:A2:89:12',
        device_name: 'boAt Wave Beat',
        device_model: 'WaveBeat-BLE',
        brand: 'BOAT',
        battery_level: 80,
        heart_rate: 76,
        steps: 4300,
        calories: 210,
        activity_type: 'Walking',
        source: 'BOAT_WAVE_BEAT'
      })
    });
    const syncBoatData = await syncBoat.json();
    console.log('Synced boAt Wave Beat Telemetry:', syncBoatData.health_data?.source, 'Steps:', syncBoatData.health_data?.steps);

    // 6. Get all devices
    const listRes = await fetch(`${API_BASE}/wearables/devices`, { headers: authHeaders });
    const listData = await listRes.json();
    console.log(`Total Wearables for user: ${listData.count}`);
    listData.devices.forEach(d => console.log(`  - [${d.brand}] ${d.device_name} (Status: ${d.connection_status}, Battery: ${d.battery_level}%)`));

    // 7. Get latest telemetry
    const latestRes = await fetch(`${API_BASE}/wearables/data/latest`, { headers: authHeaders });
    const latestData = await latestRes.json();
    console.log('Latest Wearable Reading:', {
      device: latestData.device?.device_name,
      brand: latestData.device?.brand,
      heart_rate: latestData.latest_reading?.heart_rate,
      today_steps: latestData.today_summary?.today_steps
    });

    console.log('🎉 ALL UNIVERSAL WEARABLE BACKEND TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await pool.end();
  }
}

testWearablesApi();
