const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

const validateMiddleware = (validations) => {
  return async (req, res, next) => {
    // Jalankan semua validasi
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format error menjadi array pesan
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return error(res, 'Validasi gagal. Periksa kembali input Anda.', 422, extractedErrors);
  };
};

module.exports = validateMiddleware;
