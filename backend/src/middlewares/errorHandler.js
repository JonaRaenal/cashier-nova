// ============================================
// CashierNova — Global Error Handler
// Menangkap semua error dan format response konsisten
// Dependencies: utils/response, utils/logger
// ============================================

const { error } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Menangani semua error yang tidak tertangkap di controller
 */
const errorHandler = (err, req, res, _next) => {
  logger.error(err.message, { stack: err.stack });

  // Error UNIQUE constraint SQLite
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || (err.message && err.message.includes('UNIQUE constraint'))) {
    return error(res, 'Data sudah ada. Pastikan tidak ada duplikasi.', 409);
  }

  // Error foreign key SQLite
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || (err.message && err.message.includes('FOREIGN KEY constraint'))) {
    return error(res, 'Data referensi tidak ditemukan.', 400);
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    return error(res, 'Format request body tidak valid.', 400);
  }

  // Custom error dengan statusCode
  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  // Default error
  const statusCode = 500;
  const message = 'Terjadi kesalahan pada server.';

  return error(res, message, statusCode);
};

module.exports = errorHandler;
