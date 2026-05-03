// ============================================
// CashierNova — User Validator
// Rules validasi untuk endpoint manajemen user
// Dependencies: express-validator
// ============================================

const { body, param } = require('express-validator');

const userValidator = {
  create: [
    body('name')
      .notEmpty().withMessage('Nama wajib diisi.')
      .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter.'),
    body('email')
      .notEmpty().withMessage('Email wajib diisi.')
      .isEmail().withMessage('Format email tidak valid.'),
    body('password')
      .notEmpty().withMessage('Password wajib diisi.')
      .isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
    body('role')
      .optional()
      .isIn(['admin', 'kasir']).withMessage('Role harus admin atau kasir.'),
  ],

  update: [
    param('id').isInt({ min: 1 }).withMessage('ID user tidak valid.'),
    body('name')
      .optional()
      .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter.'),
    body('email')
      .optional()
      .isEmail().withMessage('Format email tidak valid.'),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Password minimal 6 karakter.'),
    body('role')
      .optional()
      .isIn(['admin', 'kasir']).withMessage('Role harus admin atau kasir.'),
  ],
};

module.exports = userValidator;
