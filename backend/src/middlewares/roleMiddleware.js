const { error } = require('../utils/response');

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
