// ============================================
// CashierNova — Auth Middleware
// Verifikasi JWT token di setiap protected route
// Dependencies: jsonwebtoken, config/env
// ============================================

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/response');

/**
 * Middleware untuk memverifikasi access token
 * Menyimpan data user di req.user jika valid
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Akses ditolak. Token tidak ditemukan.', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token telah kedaluwarsa. Silakan refresh token.', 401);
    }
    return error(res, 'Token tidak valid.', 401);
  }
};

module.exports = authMiddleware;
