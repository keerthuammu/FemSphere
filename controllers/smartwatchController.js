import pool from '../config/db.js';

/**
 * Universal Wearable & Smartwatch Controller
 * Handles devices from Amazfit, Apple Watch, Samsung Galaxy Watch, Google Pixel Watch,
 * Fitbit, Garmin, Huawei, Xiaomi, OnePlus, Realme, Noise, boAt, and generic BLE wearables.
 */

/**
 * Register or update a wearable device for the authenticated user.
 * POST /api/smartwatch/devices or POST /api/wearables/devices
 */
export const registerDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      device_name = 'Smartwatch',
      device_model = 'Unknown Model',
      device_identifier,
      connection_status = 'CONNECTED',
      battery_level = null,
      brand = 'GENERIC_BLE',
      device_type = 'SMARTWATCH',
      capabilities = {},
      firmware_version = null,
      mac_address = null
    } = req.body;

    if (!device_identifier || device_identifier.trim() === '') {
      return res.status(400).json({ success: false, message: 'device_identifier (MAC or UUID) is required.' });
    }

    const query = `
      INSERT INTO smartwatch_devices 
        (user_id, device_name, device_model, device_identifier, connection_status, battery_level, brand, device_type, capabilities, firmware_version, mac_address, last_connected_at, updated_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, device_identifier)
      DO UPDATE SET
        device_name = EXCLUDED.device_name,
        device_model = EXCLUDED.device_model,
        connection_status = EXCLUDED.connection_status,
        battery_level = COALESCE(EXCLUDED.battery_level, smartwatch_devices.battery_level),
        brand = COALESCE(EXCLUDED.brand, smartwatch_devices.brand),
        device_type = COALESCE(EXCLUDED.device_type, smartwatch_devices.device_type),
        capabilities = COALESCE(EXCLUDED.capabilities, smartwatch_devices.capabilities),
        firmware_version = COALESCE(EXCLUDED.firmware_version, smartwatch_devices.firmware_version),
        mac_address = COALESCE(EXCLUDED.mac_address, smartwatch_devices.mac_address),
        last_connected_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(query, [
      userId,
      device_name,
      device_model,
      device_identifier.trim(),
      connection_status,
      battery_level,
      brand.toUpperCase(),
      device_type.toUpperCase(),
      JSON.stringify(capabilities || {}),
      firmware_version,
      mac_address
    ]);

    return res.status(200).json({
      success: true,
      message: `${brand} wearable device registered successfully.`,
      device: result.rows[0]
    });
  } catch (err) {
    console.error('Error in registerDevice:', err);
    return res.status(500).json({ success: false, message: 'Server error registering device: ' + err.message });
  }
};

/**
 * List all wearable devices belonging to the authenticated user.
 * GET /api/smartwatch/devices or GET /api/wearables/devices
 */
export const getDevices = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM smartwatch_devices WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      count: result.rows.length,
      devices: result.rows
    });
  } catch (err) {
    console.error('Error in getDevices:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving devices.' });
  }
};

/**
 * Get current wearable connection and sync status for user.
 * Optional query: ?device_id=123
 * GET /api/smartwatch/status or GET /api/wearables/status
 */
export const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const deviceId = req.query.device_id;

    let deviceQuery = `SELECT * FROM smartwatch_devices WHERE user_id = $1`;
    const params = [userId];

    if (deviceId) {
      params.push(deviceId);
      deviceQuery += ` AND id = $2`;
    }
    deviceQuery += ` ORDER BY updated_at DESC LIMIT 1`;

    const deviceRes = await pool.query(deviceQuery, params);

    if (deviceRes.rows.length === 0) {
      return res.json({
        success: true,
        has_device: false,
        status: 'NOT_CONNECTED',
        device: null,
        last_sync: null
      });
    }

    const device = deviceRes.rows[0];

    const lastDataRes = await pool.query(
      `SELECT * FROM smartwatch_health_data WHERE user_id = $1 AND (device_id = $2 OR $2 IS NULL) ORDER BY recorded_at DESC LIMIT 1`,
      [userId, device.id]
    );

    return res.json({
      success: true,
      has_device: true,
      status: device.connection_status,
      device,
      last_sync: device.last_synced_at || (lastDataRes.rows[0]?.recorded_at ?? null),
      latest_data: lastDataRes.rows[0] || null
    });
  } catch (err) {
    console.error('Error in getStatus:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching status.' });
  }
};

/**
 * Ingest synchronized telemetry from Flutter Mobile or Web.
 * Supports any wearable brand (Amazfit, Apple Watch, Galaxy Watch, Fitbit, Garmin, boAt, Noise, etc.).
 * POST /api/smartwatch/sync or POST /api/wearables/sync
 */
export const syncData = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user.id;

    const {
      device_identifier,
      device_name = 'Smartwatch',
      device_model = 'Unknown Model',
      brand = 'AMAZFIT',
      device_type = 'SMARTWATCH',
      capabilities = {},
      battery_level = null,
      heart_rate = null,
      resting_heart_rate = null,
      steps = null,
      calories = null,
      distance_meters = null,
      sleep_duration_minutes = null,
      spo2 = null,
      hrv_rmssd = null,
      stress_score = null,
      body_temperature = null,
      blood_pressure_systolic = null,
      blood_pressure_diastolic = null,
      respiratory_rate = null,
      activity_type = 'General',
      source = null,
      recorded_at = null,
      raw_payload = {}
    } = req.body;

    if (!device_identifier) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'device_identifier is required for sync.' });
    }

    const deviceBrand = (brand || 'GENERIC_BLE').toUpperCase();
    const dataSource = source || `${deviceBrand}_${(device_model || 'DEVICE').replace(/[\s-]/g, '_').toUpperCase()}`;

    // 1. Upsert Device & mark as SYNCED
    const deviceQuery = `
      INSERT INTO smartwatch_devices
        (user_id, device_name, device_model, device_identifier, brand, device_type, capabilities, connection_status, battery_level, last_connected_at, last_synced_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, 'SYNCED', $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, device_identifier)
      DO UPDATE SET
        device_name = EXCLUDED.device_name,
        device_model = EXCLUDED.device_model,
        brand = COALESCE(EXCLUDED.brand, smartwatch_devices.brand),
        device_type = COALESCE(EXCLUDED.device_type, smartwatch_devices.device_type),
        capabilities = COALESCE(EXCLUDED.capabilities, smartwatch_devices.capabilities),
        connection_status = 'SYNCED',
        battery_level = COALESCE(EXCLUDED.battery_level, smartwatch_devices.battery_level),
        last_connected_at = CURRENT_TIMESTAMP,
        last_synced_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, device_name, device_identifier, brand, device_type, capabilities, battery_level, last_synced_at;
    `;

    const devResult = await client.query(deviceQuery, [
      userId,
      device_name,
      device_model,
      device_identifier.trim(),
      deviceBrand,
      (device_type || 'SMARTWATCH').toUpperCase(),
      JSON.stringify(capabilities || {}),
      battery_level
    ]);
    const deviceId = devResult.rows[0].id;

    // 2. Insert Health Telemetry Point
    const dataTimestamp = recorded_at ? new Date(recorded_at) : new Date();

    const insertDataQuery = `
      INSERT INTO smartwatch_health_data
        (user_id, device_id, recorded_at, heart_rate, resting_heart_rate, steps, calories, distance, distance_meters, sleep_duration, sleep_duration_minutes, spo2, hrv_rmssd, stress_score, body_temperature, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, activity_type, source, raw_payload)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *;
    `;

    const distM = distance_meters !== undefined && distance_meters !== null && distance_meters >= 0 ? parseFloat(distance_meters) : null;
    const distKm = distM !== null ? parseFloat((distM / 1000.0).toFixed(2)) : null;
    const sleepM = sleep_duration_minutes !== undefined && sleep_duration_minutes !== null && sleep_duration_minutes >= 0 ? parseInt(sleep_duration_minutes) : null;

    const dataResult = await client.query(insertDataQuery, [
      userId,
      deviceId,
      dataTimestamp,
      heart_rate !== undefined && heart_rate !== null && heart_rate > 0 ? parseInt(heart_rate) : null,
      resting_heart_rate !== undefined && resting_heart_rate !== null && resting_heart_rate > 0 ? parseInt(resting_heart_rate) : null,
      steps !== undefined && steps !== null && steps >= 0 ? parseInt(steps) : null,
      calories !== undefined && calories !== null && calories >= 0 ? Math.round(parseFloat(calories)) : null,
      distKm,
      distM,
      sleepM,
      sleepM,
      spo2 !== undefined && spo2 !== null && spo2 >= 50 ? parseInt(spo2) : null,
      hrv_rmssd !== undefined && hrv_rmssd !== null && hrv_rmssd >= 0 ? parseInt(hrv_rmssd) : null,
      stress_score !== undefined && stress_score !== null && stress_score >= 0 ? parseInt(stress_score) : null,
      body_temperature !== undefined && body_temperature !== null && body_temperature >= 30.0 ? parseFloat(body_temperature) : null,
      blood_pressure_systolic !== undefined && blood_pressure_systolic !== null ? parseInt(blood_pressure_systolic) : null,
      blood_pressure_diastolic !== undefined && blood_pressure_diastolic !== null ? parseInt(blood_pressure_diastolic) : null,
      respiratory_rate !== undefined && respiratory_rate !== null ? parseFloat(respiratory_rate) : null,
      activity_type || 'General',
      dataSource,
      JSON.stringify(raw_payload || {})
    ]);

    // 3. Keep standard FemSphere health_tracker daily log in sync if sleep was read
    if (sleep_duration_minutes !== null && sleep_duration_minutes > 0) {
      const sleepHours = (sleep_duration_minutes / 60.0).toFixed(2);
      await client.query(`
        INSERT INTO health_tracker (user_id, log_date, sleep_hours)
        VALUES ($1, CURRENT_DATE, $2)
        ON CONFLICT (user_id, log_date)
        DO UPDATE SET sleep_hours = EXCLUDED.sleep_hours;
      `, [userId, sleepHours]);
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: `${deviceBrand} wearable health telemetry synchronized successfully.`,
      device: devResult.rows[0],
      health_data: dataResult.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in syncData:', err);
    return res.status(500).json({ success: false, message: 'Server error during sync: ' + err.message });
  } finally {
    client.release();
  }
};

/**
 * Query recent wearable health telemetry for authenticated user.
 * Optional query: ?device_id=...&brand=...
 * GET /api/smartwatch/data or GET /api/wearables/data
 */
export const getData = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');
    const deviceId = req.query.device_id;
    const brand = req.query.brand;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    let query = `
      SELECT shd.*, sd.device_name, sd.device_identifier, sd.brand, sd.device_type, sd.capabilities
      FROM smartwatch_health_data shd
      LEFT JOIN smartwatch_devices sd ON sd.id = shd.device_id
      WHERE shd.user_id = $1
    `;
    const params = [userId];

    if (deviceId) {
      params.push(deviceId);
      query += ` AND shd.device_id = $${params.length}`;
    }
    if (brand) {
      params.push(brand.toUpperCase());
      query += ` AND sd.brand = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND shd.recorded_at >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND shd.recorded_at <= $${params.length}`;
    }

    query += ` ORDER BY shd.recorded_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error in getData:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving data.' });
  }
};

/**
 * Retrieve latest wearable data reading and today's summary.
 * Optional query: ?device_id=...
 * GET /api/smartwatch/data/latest or GET /api/wearables/data/latest
 */
export const getLatestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const deviceId = req.query.device_id;

    // Latest single reading
    let latestQuery = `
      SELECT shd.*, sd.device_name, sd.device_model, sd.brand, sd.device_type, sd.capabilities, sd.connection_status, sd.battery_level, sd.last_synced_at
      FROM smartwatch_health_data shd
      LEFT JOIN smartwatch_devices sd ON sd.id = shd.device_id
      WHERE shd.user_id = $1
    `;
    const latestParams = [userId];

    if (deviceId) {
      latestParams.push(deviceId);
      latestQuery += ` AND shd.device_id = $2`;
    }
    latestQuery += ` ORDER BY shd.recorded_at DESC LIMIT 1;`;
    const latestRes = await pool.query(latestQuery, latestParams);

    // Active device info
    let devQuery = `SELECT * FROM smartwatch_devices WHERE user_id = $1`;
    const devParams = [userId];
    if (deviceId) {
      devParams.push(deviceId);
      devQuery += ` AND id = $2`;
    }
    devQuery += ` ORDER BY updated_at DESC LIMIT 1;`;
    const deviceRes = await pool.query(devQuery, devParams);

    // Today's aggregate
    let todayAggQuery = `
      SELECT 
        COALESCE(MAX(steps), 0) as today_steps,
        COALESCE(ROUND(AVG(heart_rate)), 0) as avg_heart_rate,
        COALESCE(MIN(CASE WHEN heart_rate IS NOT NULL AND heart_rate > 30 THEN heart_rate END), 0) as min_heart_rate,
        COALESCE(MAX(heart_rate), 0) as max_heart_rate,
        COALESCE(MAX(resting_heart_rate), 0) as resting_heart_rate,
        COALESCE(MAX(calories), 0) as today_calories,
        COALESCE(MAX(distance_meters), 0) as today_distance_meters,
        COALESCE(MAX(sleep_duration_minutes), 0) as today_sleep_minutes,
        COALESCE(MAX(spo2), 0) as latest_spo2,
        COALESCE(AVG(hrv_rmssd), 0) as avg_hrv,
        COALESCE(AVG(stress_score), 0) as avg_stress,
        COALESCE(MAX(body_temperature), null) as latest_body_temp,
        COALESCE(MAX(blood_pressure_systolic), null) as latest_bp_sys,
        COALESCE(MAX(blood_pressure_diastolic), null) as latest_bp_dia
      FROM smartwatch_health_data
      WHERE user_id = $1 AND recorded_at >= CURRENT_DATE
    `;
    const todayParams = [userId];
    if (deviceId) {
      todayParams.push(deviceId);
      todayAggQuery += ` AND device_id = $2`;
    }

    const todayRes = await pool.query(todayAggQuery, todayParams);

    return res.json({
      success: true,
      device: deviceRes.rows[0] || null,
      latest_reading: latestRes.rows[0] || null,
      today_summary: todayRes.rows[0] || {
        today_steps: 0,
        avg_heart_rate: 0,
        today_calories: 0,
        today_distance_meters: 0,
        today_sleep_minutes: 0,
        latest_spo2: 0,
        avg_hrv: 0,
        avg_stress: 0
      }
    });
  } catch (err) {
    console.error('Error in getLatestData:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving latest data.' });
  }
};

/**
 * Historical aggregated data for weekly/monthly charts.
 * GET /api/smartwatch/data/history or GET /api/wearables/data/history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days || '7');
    const deviceId = req.query.device_id;

    let historyQuery = `
      SELECT 
        DATE(recorded_at) as date,
        COALESCE(MAX(steps), 0) as steps,
        COALESCE(ROUND(AVG(heart_rate)), 0) as avg_heart_rate,
        COALESCE(MAX(calories), 0) as calories,
        COALESCE(ROUND(MAX(distance_meters) / 1000.0, 2), 0) as distance_km,
        COALESCE(ROUND(MAX(sleep_duration_minutes) / 60.0, 1), 0) as sleep_hours,
        COALESCE(MAX(spo2), 0) as spo2,
        COALESCE(ROUND(AVG(hrv_rmssd)), 0) as avg_hrv,
        COALESCE(ROUND(AVG(stress_score)), 0) as avg_stress,
        MAX(body_temperature) as body_temperature
      FROM smartwatch_health_data
      WHERE user_id = $1 AND recorded_at >= CURRENT_DATE - ($2 || ' days')::INTERVAL
    `;
    const params = [userId, days];

    if (deviceId) {
      params.push(deviceId);
      historyQuery += ` AND device_id = $3`;
    }

    historyQuery += `
      GROUP BY DATE(recorded_at)
      ORDER BY DATE(recorded_at) ASC;
    `;

    const result = await pool.query(historyQuery, params);

    return res.json({
      success: true,
      days,
      history: result.rows
    });
  } catch (err) {
    console.error('Error in getHistory:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving history.' });
  }
};

/**
 * Remove a registered wearable device for authenticated user.
 * DELETE /api/smartwatch/devices/:id or DELETE /api/wearables/devices/:id
 */
export const deleteDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const deviceId = req.params.id;

    const result = await pool.query(
      `DELETE FROM smartwatch_devices WHERE id = $1 AND user_id = $2 RETURNING *`,
      [deviceId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Device not found or not owned by user.' });
    }

    return res.json({
      success: true,
      message: 'Wearable device disconnected and removed successfully.',
      device: result.rows[0]
    });
  } catch (err) {
    console.error('Error in deleteDevice:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting device.' });
  }
};
