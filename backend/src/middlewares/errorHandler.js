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

  // Error validasi MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return error(res, 'Data sudah ada. Pastikan tidak ada duplikasi.', 409);
  }

  // Error foreign key MySQL
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return error(res, 'Data referensi tidak ditemukan.', 400);
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    return error(res, 'Format request body tidak valid.', 400);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Terjadi kesalahan pada server.';

  return error(res, message, statusCode);
};

module.exports = errorHandler;
