const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const authValidator = require('../validators/authValidator');
const rateLimit = require('express-rate-limit');

// Rate limiting untuk login (max 5x per menit)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.',
  },
});

router.post('/login', loginLimiter, validateMiddleware(authValidator.login), authController.login);

router.post('/logout', authMiddleware, authController.logout);

router.post('/refresh-token', validateMiddleware(authValidator.refreshToken), authController.refreshToken);

module.exports = router;
