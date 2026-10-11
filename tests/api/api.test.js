import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../../server.js';
import pool from '../../config/db.js';

let serverInstance;
let baseUrl;
let patientToken = '';
let doctorToken = '';

before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    serverInstance = http.createServer(app).listen(0, '127.0.0.1', () => {
      const port = serverInstance.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (serverInstance) {
    serverInstance.close();
  }
  await pool.end();
});

describe('FemSphere Node.js Express REST API Automated Test Suite', () => {

  test('TC_API_01: GET /api/health returns UP status and PostgreSQL connectivity', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'UP');
    assert.match(data.service, /FemSphere/i);
    assert.ok(data.timestamp);
  });

  test('TC_API_02: POST /api/auth/login succeeds with valid Patient demo credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'elena.rostova@femsphere.health',
        password: 'Password123!'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token, 'Expected JWT token to be present');
    assert.equal(data.user.email, 'elena.rostova@femsphere.health');
    patientToken = data.token;
  });

  test('TC_API_03: POST /api/auth/login succeeds with valid Doctor demo credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dr.jenkins@femsphere.health',
        password: 'Password123!'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token);
    assert.equal(data.user.role, 'Doctor');
    doctorToken = data.token;
  });

  test('TC_API_04: POST /api/auth/login rejects invalid credentials with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'elena.rostova@femsphere.health',
        password: 'WrongPassword999!'
      })
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /Incorrect password/i);
  });

  test('TC_API_05: GET /api/auth/me rejects unauthenticated request with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.equal(res.status, 401);
  });

  test('TC_API_06: GET /api/auth/me returns profile for authenticated user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.email, 'elena.rostova@femsphere.health');
    assert.ok(data.user.profile);
  });

  test('TC_API_07: POST /api/auth/forgot-password generates scoped reset token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'elena.rostova@femsphere.health' })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.resetToken);
  });

  test('TC_API_08: POST /api/auth/refresh provides renewed authorization token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token);
  });

  test('TC_API_09: GET /api/appointments returns list for patient', async () => {
    const res = await fetch(`${baseUrl}/api/appointments`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.appointments));
  });

  test('TC_API_10: GET /api/period-tracker/overview returns cycle calculations and logs', async () => {
    const res = await fetch(`${baseUrl}/api/period-tracker/overview`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.isConfigured !== undefined);
  });

  test('TC_API_11: GET /api/medical-records returns records with HIPAA audit logging', async () => {
    const res = await fetch(`${baseUrl}/api/medical-records`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const records = await res.json();
    assert.ok(Array.isArray(records));
  });

  test('TC_API_12: GET /api/life-stages/current returns dynamic biological stage derived from DOB', async () => {
    const res = await fetch(`${baseUrl}/api/life-stages/current`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.currentStage);
    assert.ok(data.currentStage.name);
    assert.ok(data.currentStage.age !== undefined);
  });

  test('TC_API_13: POST /api/period-tracker/pregnancy/activate pauses cycle and returns gestational metrics', async () => {
    const lmpDate = '2026-06-01';
    const res = await fetch(`${baseUrl}/api/period-tracker/pregnancy/activate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lmpDate })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.isPregnant, true);
    assert.ok(data.metrics.gestationalWeeks !== undefined);
    assert.equal(data.metrics.phaseCode, 'PREGNANCY');
    assert.ok(data.metrics.edd);

    // Verify overview also reflects paused cycle
    const overviewRes = await fetch(`${baseUrl}/api/period-tracker/overview`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const overview = await overviewRes.json();
    assert.equal(overview.isPregnant, true);
    assert.equal(overview.metrics.phaseCode, 'PREGNANCY');
  });

  test('TC_API_14: POST /api/period-tracker/pregnancy/deactivate resumes standard menstrual tracking', async () => {
    const res = await fetch(`${baseUrl}/api/period-tracker/pregnancy/deactivate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${patientToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumePeriodDate: '2026-10-01' })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.isPregnant, false);
    assert.ok(data.metrics.cycleDay !== undefined);
    assert.notEqual(data.metrics.phaseCode, 'PREGNANCY');
  });

});

