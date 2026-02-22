// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow FE origins (same as rag-fe-v4 dev) to avoid cross-origin errors
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
];
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, true); // allow other origins in dev; set to false in prod if needed
  },
  credentials: false,
}));
app.use(express.json());

// Serve static files (audio, images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 for unknown routes under /api (so FE always gets JSON, never HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found', error: 'Not found' });
});

// Global error handler - always JSON, FE expects message/error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!', error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
