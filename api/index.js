import app from '../server.js';

export default function handler(req, res) {
  // Normalize req.url so Express routes matching /api/* always resolve
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
}
