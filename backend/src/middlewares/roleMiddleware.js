// ============================================
// CashierNova — Role Middleware
// Guard endpoint khusus berdasarkan role user
// Dependencies: utils/response
// ============================================

const { error } = require('../utils/response');

/**
 * Middleware factory untuk membatasi akses berdasarkan role
 * @param  {...string} roles - Daftar role yang diizinkan
 * @returns {Function} Express middleware
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Akses ditolak. Silakan login terlebih dahulu.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.', 403);
    }

    next();
  };
};

module.exports = roleMiddleware;
