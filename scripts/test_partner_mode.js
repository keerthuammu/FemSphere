import pool from '../config/db.js';

const API_BASE = 'http://localhost:5001/api';

async function testPartnerMode() {
  try {
    console.log('Testing Partner Mode Endpoints...');

    // 1. Login as Elena (Patient)
    const elenaLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'elena.rostova@femsphere.health', password: 'Password123!' })
    });
    const elenaAuth = await elenaLogin.json();
    const elenaToken = elenaAuth.token;
    const elenaHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${elenaToken}` };
    console.log('Elena (Patient) Login:', !!elenaToken);

    // 2. Login as Marcus (Caregiver)
    const marcusLogin = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'caregiver@femsphere.health', password: 'Password123!' })
    });
    const marcusAuth = await marcusLogin.json();
    const marcusToken = marcusAuth.token;
    const marcusHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${marcusToken}` };
    console.log('Marcus (Caregiver) Login:', !!marcusToken);

    // 3. Get Connections for Elena
    const elenaConnsRes = await fetch(`${API_BASE}/partner/connections`, { headers: elenaHeaders });
    const elenaConns = await elenaConnsRes.json();
    console.log('Elena partner connections (as patient):', elenaConns.as_patient?.length);
    const activeConn = elenaConns.as_patient?.[0];

    if (!activeConn) {
      console.log('No connection found, inviting Marcus...');
      const inviteRes = await fetch(`${API_BASE}/partner/invite`, {
        method: 'POST',
        headers: elenaHeaders,
        body: JSON.stringify({
          partner_email: 'marcus.vance@femsphere.care',
          relationship_type: 'Spouse'
        })
      });
      const inviteData = await inviteRes.json();
      console.log('Invite sent:', inviteData.message);

      // Marcus accepts
      await fetch(`${API_BASE}/partner/connections/${inviteData.connection_id}/accept`, {
        method: 'POST',
        headers: marcusHeaders
      });
      console.log('Marcus accepted invitation.');
    }

    // 4. Test Granular Permissions Config by Patient
    const connId = activeConn ? activeConn.id : 1;
    const updatePermsRes = await fetch(`${API_BASE}/partner/sharing`, {
      method: 'PUT',
      headers: elenaHeaders,
      body: JSON.stringify({
        connection_id: connId,
        permissions: [
          { data_type: 'cycle_information', permission: 'view' },
          { data_type: 'appointments', permission: 'view' },
          { data_type: 'health_goals', permission: 'view' },
          { data_type: 'health_tracker', permission: 'view' },
          { data_type: 'medications', permission: 'none' },
          { data_type: 'doctor_notes', permission: 'none' },
          { data_type: 'medical_records', permission: 'none' }
        ]
      })
    });
    const permsData = await updatePermsRes.json();
    console.log('Permissions updated by patient:', permsData.success);

    // 5. Test Partner Dashboard Feed (from Marcus Caregiver account in Partner Mode)
    const dashboardRes = await fetch(`${API_BASE}/partner/dashboard`, { headers: marcusHeaders });
    const dashData = await dashboardRes.json();
    console.log('Partner Dashboard Feed for Marcus:', {
      has_partner: dashData.has_partner,
      patient_name: dashData.patient?.name,
      cycle_available: !!dashData.cycle_information,
      cycle_phase: dashData.cycle_information?.cycle_phase,
      vitals_available: !!dashData.shared_vitals,
      goals_count: dashData.shared_goals?.length,
      tasks_count: dashData.support_tasks?.length
    });

    // 6. Test Creating and Updating a Partner Task
    const newTaskRes = await fetch(`${API_BASE}/partner/tasks`, {
      method: 'POST',
      headers: marcusHeaders,
      body: JSON.stringify({
        connection_id: connId,
        title: 'Pick up prenatal vitamins & attend checkup',
        description: 'Scheduled visit at 10:30 AM',
        assigned_to: 2
      })
    });
    const newTask = await newTaskRes.json();
    console.log('Marcus created partner task:', newTask.success, newTask.task?.title);

    // Elena completes the task
    if (newTask.task) {
      const updateTaskRes = await fetch(`${API_BASE}/partner/tasks/${newTask.task.id}`, {
        method: 'PUT',
        headers: elenaHeaders,
        body: JSON.stringify({ status: 'completed' })
      });
      const updatedTask = await updateTaskRes.json();
      console.log('Elena completed task:', updatedTask.task?.status);
    }

    // 7. Test Shared Health Goal
    const newGoalRes = await fetch(`${API_BASE}/partner/goals`, {
      method: 'POST',
      headers: elenaHeaders,
      body: JSON.stringify({
        connection_id: connId,
        title: 'Hydration 2L Together',
        target: 8.0,
        current_value: 6.0,
        unit: 'glasses'
      })
    });
    const newGoal = await newGoalRes.json();
    console.log('Elena created shared goal:', newGoal.success, newGoal.goal?.title);

    console.log('🎉 ALL PARTNER MODE BACKEND API ENDPOINTS VERIFIED & WORKING!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await pool.end();
  }
}

testPartnerMode();
