import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints (prevent brute-force attacks)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please wait 15 minutes before retrying.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General application API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1200,
  message: {
    success: false,
    message: 'High traffic rate limit reached. Please try again shortly.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
