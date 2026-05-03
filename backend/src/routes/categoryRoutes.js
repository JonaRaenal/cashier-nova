// ============================================
// CashierNova — Category Routes
// Endpoint CRUD kategori
// Dependencies: express, categoryController, middlewares
// ============================================

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

// GET /api/categories — semua role
router.get('/', categoryController.getAll);

// POST /api/categories — admin only
router.post('/', roleMiddleware('admin'), categoryController.create);

// PUT /api/categories/:id — admin only
router.put('/:id', roleMiddleware('admin'), categoryController.update);

// DELETE /api/categories/:id — admin only
router.delete('/:id', roleMiddleware('admin'), categoryController.delete);

module.exports = router;
