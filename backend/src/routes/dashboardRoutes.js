const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);

router.get('/chart', dashboardController.getChart);

module.exports = router;
