// ============================================
// CashierNova — Dashboard Routes
// Endpoint untuk data dashboard
// Dependencies: express, dashboardController, middlewares
// ============================================

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/chart?range=7|30
router.get('/chart', dashboardController.getChart);

module.exports = router;
