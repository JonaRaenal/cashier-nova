// ============================================
// CashierNova — Transaction Routes
// Endpoint untuk transaksi penjualan
// Dependencies: express, transactionController, middlewares
// ============================================

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

// POST /api/transactions — semua role (kasir & admin)
router.post('/', transactionController.create);

// GET /api/transactions — semua role
router.get('/', transactionController.getAll);

// GET /api/transactions/:id — semua role
router.get('/:id', transactionController.getById);

module.exports = router;
