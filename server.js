import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import caregiverRoutes from './routes/caregiverRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import healthTrackerRoutes from './routes/healthTrackerRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import lifeStageRoutes from './routes/lifeStageRoutes.js';
import privacyConsentRoutes from './routes/privacyConsentRoutes.js';
import healthTimelineRoutes from './routes/healthTimelineRoutes.js';
import aiTwinRoutes from './routes/aiTwinRoutes.js';
import periodTrackerRoutes from './routes/periodTrackerRoutes.js';
import smartwatchRoutes from './routes/smartwatchRoutes.js';
import wearableRoutes from './routes/wearableRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';

import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Production Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Allows Three.js WebGL canvases, inline assets, and Vite dev server
}));

// Restrict CORS in production to trusted origins with fallback for mobile and dev clients
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://femsphere.me',
  'https://www.femsphere.me',
  'https://api.femsphere.me',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.includes('femsphere.me') ||
      origin.endsWith('.vercel.app') ||
      Boolean(process.env.VERCEL) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General API rate limiter protection
app.use('/api/', apiLimiter);

// Health Check API Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await pool.query('SELECT NOW()');
    res.json({
      status: 'UP',
      service: 'FemSphere REST API Server',
      database: 'PostgreSQL (femsphere_db)',
      timestamp: dbTest.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', databaseError: err.message });
  }
});

// Mount Modular REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health-tracker', healthTrackerRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/life-stages', lifeStageRoutes);
app.use('/api/privacy', privacyConsentRoutes);
app.use('/api/health/timeline', healthTimelineRoutes);
app.use('/api/health/insights', aiTwinRoutes);
app.use('/api/period-tracker', periodTrackerRoutes);
app.use('/api/smartwatch', smartwatchRoutes);
app.use('/api/wearables', wearableRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/connections', connectionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error: ' + err.message });
});

let server;
const isTestEnv = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));
const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL);
if (!isTestEnv && !isVercel) {
  server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌸 FemSphere Node.js + Express REST API Server Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🗄️ Database: PostgreSQL (femsphere_db)`);
    console.log(`=======================================================`);
  });
}

export { app, server };
export default app;
