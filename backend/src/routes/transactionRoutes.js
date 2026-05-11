const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

router.post('/', transactionController.create);

router.get('/', transactionController.getAll);

router.get('/:id', transactionController.getById);

module.exports = router;
