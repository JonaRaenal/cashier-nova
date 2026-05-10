const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const env = require('./src/config/env');
const { initConnection } = require('./src/config/db');
const logger = require('./src/utils/logger');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", env.CORS_ORIGIN],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: env.NODE_ENV === 'production',
}));

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini. Silakan coba lagi setelah 15 menit.',
  },
});
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CashierNova API berjalan normal.', timestamp: new Date() });
});

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

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
    });
  });

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    logger.info(`🚀 CashierNova API berjalan di http://localhost:${env.PORT}`);
    logger.info(`📋 Environment: ${env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
