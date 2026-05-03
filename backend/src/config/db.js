// ============================================
// CashierNova — Database Connection Pool
// MySQL connection pool dengan reconnect handling
// Dependencies: mysql2/promise, config/env
// ============================================

const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

// Membuat connection pool untuk performa optimal
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test koneksi saat startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ Database terhubung berhasil');
    connection.release();
  } catch (error) {
    logger.error('❌ Gagal terhubung ke database:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
