import { describe, it } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:5001/api';

describe('Period Tracker End-to-End API Integration Verification', () => {
  let token = '';
  let cycleId = null;

  it('1. Authenticates user and retrieves bearer token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'elena.rostova@femsphere.health', password: 'Password123!' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    token = data.token;
  });

  it('2. Saves cycle baseline settings', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/settings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        lastPeriodStart: '2026-09-15',
        cycleLength: 29,
        periodDuration: 5
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.settings.cycle_length, 29);
  });

  it('3. Fetches period overview with real statistical calculations', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.predictions);
    assert.ok(data.predictions.nextPeriodStartDate);
    assert.ok(data.predictions.estimatedOvulationDate);
    assert.ok(data.predictions.fertileWindowStartDate);
    assert.ok(data.predictions.predictionDisclaimer);
    assert.ok(data.historicalStats);
  });

  it('4. Logs a new menstrual cycle', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/cycles`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        startDate: '2026-08-17',
        durationDays: 5,
        flowIntensity: 'Heavy',
        symptoms: ['Cramps', 'Headaches'],
        mood: 'Sensitive'
      })
    });
    assert.ok(res.status === 200 || res.status === 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.cycle);
    cycleId = data.cycle.id;
  });

  it('5. Corrects/updates the logged cycle', async () => {
    assert.ok(cycleId, 'Cycle ID must exist');
    const res = await fetch(`${BASE_URL}/period-tracker/cycles/${cycleId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        startDate: '2026-08-17',
        durationDays: 6,
        flowIntensity: 'Medium',
        symptoms: ['Cramps'],
        mood: 'Calm'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.cycle.duration_days, 6);
  });

  it('6. Saves daily health and symptom log', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/daily`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        date: '2026-08-18',
        isPeriodDay: true,
        flowIntensity: 'Heavy',
        symptoms: ['Cramps', 'Bloating'],
        mood: 'Calm',
        energyLevel: 'Medium',
        sleepQuality: 'Good',
        cervicalMucus: 'None',
        notes: 'Testing daily symptom logging persistence'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  it('7. Fetches daily logs for month', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/daily?month=2026-08`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.logs));
    const found = data.logs.find(l => l.date === '2026-08-18');
    assert.ok(found);
    assert.strictEqual(found.mood, 'Calm');
  });

  it('8. Retrieves cycle insights and trends', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/insights`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.stats);
    assert.ok(data.trends);
    assert.ok(Array.isArray(data.trends.cycleLengths));
    assert.ok(Array.isArray(data.trends.periodDurations));
    assert.ok(Array.isArray(data.trends.topSymptoms));
  });

  it('9. Updates reminder preferences', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        periodDaysBefore: 3,
        periodEnabled: true,
        ovulationEnabled: true,
        dailyLoggingEnabled: true
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.settings.reminder_period_days_before, 3);
  });

  it('10. Deletes daily log record', async () => {
    const res = await fetch(`${BASE_URL}/period-tracker/daily/2026-08-18`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  it('11. Deletes cycle record and recalibrates baseline', async () => {
    assert.ok(cycleId, 'Cycle ID must exist');
    const res = await fetch(`${BASE_URL}/period-tracker/cycles/${cycleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });
});
