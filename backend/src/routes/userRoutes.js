// ============================================
// CashierNova — User Routes
// Endpoint CRUD manajemen user (admin only)
// Dependencies: express, userController, middlewares
// ============================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const userValidator = require('../validators/userValidator');

// Semua route memerlukan autentikasi + role admin
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// GET /api/users
router.get('/', userController.getAll);

// POST /api/users
router.post('/', validateMiddleware(userValidator.create), userController.create);

// PUT /api/users/:id
router.put('/:id', validateMiddleware(userValidator.update), userController.update);

// DELETE /api/users/:id
router.delete('/:id', userController.delete);

module.exports = router;
