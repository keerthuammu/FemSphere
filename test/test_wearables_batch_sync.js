import jwt from 'jsonwebtoken';
import http from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'femsphere_secret_jwt_key_2026';
const token = jwt.sign({ id: 1, email: 'test_user@femsphere.me', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (_) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Wearables Batch Sync & Provider Tests...');

  // Test 1: GET /api/wearables/providers
  console.log('\n[Test 1] GET /api/wearables/providers');
  const provRes = await request({
    hostname: 'localhost',
    port: 5001,
    path: '/api/wearables/providers',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${provRes.status}, Providers Count: ${provRes.body.providers?.length}`);
  if (provRes.status !== 200 || !provRes.body.providers?.length) {
    throw new Error('Test 1 failed: Could not get providers');
  }
  console.log('✅ Providers retrieved successfully:', provRes.body.providers.map(p => p.name));

  // Test 2: POST /api/wearables/sync/batch (Batch Sync)
  console.log('\n[Test 2] POST /api/wearables/sync/batch (Initial Ingestion)');
  const batchPayload = {
    provider: 'HEALTH_CONNECT',
    brand: 'AMAZFIT',
    device_model: 'Amazfit Bip U Pro (A2008)',
    device_name: 'Amazfit Zepp Bridge',
    device_identifier: 'TEST_AMAZFIT_A2008_ZEPP',
    records: [
      {
        sync_key: 'test_amazfit_sync_1',
        recorded_at: '2026-10-23T08:00:00Z',
        heart_rate: 74,
        resting_heart_rate: 62,
        steps: 3200,
        calories: 140,
        distance_meters: 2200,
        spo2: 98,
        sleep_duration_minutes: 450
      },
      {
        sync_key: 'test_amazfit_sync_2',
        recorded_at: '2026-10-23T12:00:00Z',
        heart_rate: 82,
        resting_heart_rate: 62,
        steps: 6400,
        calories: 280,
        distance_meters: 4500,
        spo2: 99
      }
    ]
  };

  const syncRes1 = await request({
    hostname: 'localhost',
    port: 5001,
    path: '/api/wearables/sync/batch',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, batchPayload);
  console.log(`Status: ${syncRes1.status}, Uploaded: ${syncRes1.body.records_uploaded}, Failed: ${syncRes1.body.records_failed}`);
  if (syncRes1.status !== 200 || syncRes1.body.records_uploaded !== 2) {
    throw new Error('Test 2 failed: Batch sync did not ingest 2 records');
  }
  console.log('✅ Batch sync succeeded:', syncRes1.body);

  // Test 3: POST /api/wearables/sync/batch (Idempotency - same sync_keys)
  console.log('\n[Test 3] POST /api/wearables/sync/batch (Idempotency check)');
  const syncRes2 = await request({
    hostname: 'localhost',
    port: 5001,
    path: '/api/wearables/sync/batch',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, batchPayload);
  console.log(`Status: ${syncRes2.status}, Uploaded: ${syncRes2.body.records_uploaded}, Failed: ${syncRes2.body.records_failed}`);
  if (syncRes2.status !== 200 || syncRes2.body.records_uploaded !== 2) {
    throw new Error('Test 3 failed: Batch sync idempotency failed');
  }
  console.log('✅ Batch sync idempotency verified (0 duplicates, updated cleanly)!');

  // Test 4: GET /api/wearables/sync-history
  console.log('\n[Test 4] GET /api/wearables/sync-history');
  const histRes = await request({
    hostname: 'localhost',
    port: 5001,
    path: '/api/wearables/sync-history',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${histRes.status}, Sync History Count: ${histRes.body.count}`);
  if (histRes.status !== 200 || histRes.body.count === 0) {
    throw new Error('Test 4 failed: Sync history empty');
  }
  console.log('✅ Sync history verified. Latest job status:', histRes.body.history[0]?.sync_status);

  // Test 5: GET /api/wearables/data/latest
  console.log('\n[Test 5] GET /api/wearables/data/latest');
  const latestRes = await request({
    hostname: 'localhost',
    port: 5001,
    path: '/api/wearables/data/latest',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${latestRes.status}, Steps: ${latestRes.body.today_summary?.today_steps}, Heart Rate: ${latestRes.body.today_summary?.avg_heart_rate}`);
  if (latestRes.status !== 200 || !latestRes.body.latest_reading) {
    throw new Error('Test 5 failed: Latest reading empty');
  }
  console.log('✅ Latest reading verified from smartwatch_health_data:', latestRes.body.latest_reading.device_model);

  console.log('\n🎉 ALL 5 END-TO-END BACKEND WEARABLE TESTS PASSED!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
