const { body } = require('express-validator');

const authValidator = {
  login: [
    body('email')
      .notEmpty().withMessage('Email wajib diisi.')
      .isEmail().withMessage('Format email tidak valid.'),
    body('password')
      .notEmpty().withMessage('Password wajib diisi.')
      .isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
  ],

  refreshToken: [
    body('refresh_token')
      .notEmpty().withMessage('Refresh token wajib diisi.'),
  ],
};

module.exports = authValidator;
