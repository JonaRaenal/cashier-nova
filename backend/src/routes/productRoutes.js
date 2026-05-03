// ============================================
// CashierNova — Product Routes
// Endpoint CRUD produk dan manajemen stok
// Dependencies: express, productController, middlewares
// ============================================

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const productValidator = require('../validators/productValidator');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

// GET /api/products — semua role
router.get('/', productController.getAll);

// GET /api/products/:id — semua role
router.get('/:id', productController.getById);

// POST /api/products — admin only
router.post('/', roleMiddleware('admin'), validateMiddleware(productValidator.create), productController.create);

// PUT /api/products/:id — admin only
router.put('/:id', roleMiddleware('admin'), validateMiddleware(productValidator.update), productController.update);

// DELETE /api/products/:id — admin only
router.delete('/:id', roleMiddleware('admin'), productController.delete);

// PATCH /api/products/:id/stock — admin only
router.patch('/:id/stock', roleMiddleware('admin'), validateMiddleware(productValidator.updateStock), productController.updateStock);

module.exports = router;
