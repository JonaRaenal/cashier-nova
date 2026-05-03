// ============================================
// CashierNova — Server Entry Point
// Express app setup: CORS, Helmet, rate limiting, error handler
// Dependencies: express, cors, helmet, express-rate-limit
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const env = require('./src/config/env');
const { initConnection } = require('./src/config/db');
const logger = require('./src/utils/logger');

const app = express();

// ---- Security Middleware ----
app.use(helmet());

// ---- CORS Configuration ----
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---- Global Rate Limiting ----
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000,
  message: {
    success: false,
    message: 'Terlalu banyak request. Coba lagi nanti.',
  },
});
app.use(globalLimiter);

// ---- Body Parsing ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CashierNova API berjalan normal.', timestamp: new Date() });
});

// ---- Start Server ----
const startServer = async () => {
  // Inisialisasi database SQLite (async karena sql.js memuat WASM)
  await initConnection();

  // Inisialisasi tabel dan seed data
  const initDatabase = require('./src/config/initDb');
  initDatabase();

  // Muat routes setelah DB siap
  const routes = require('./src/routes');
  const errorHandler = require('./src/middlewares/errorHandler');

  app.use('/api', routes);

  // ---- 404 Handler ----
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
    });
  });

  // ---- Global Error Handler ----
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    logger.info(`🚀 CashierNova API berjalan di http://localhost:${env.PORT}`);
    logger.info(`📋 Environment: ${env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
