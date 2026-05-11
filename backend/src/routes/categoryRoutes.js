const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', categoryController.getAll);

// Semua route memerlukan autentikasi (kecuali get)
router.use(authMiddleware);

router.post('/', roleMiddleware('admin'), categoryController.create);

router.put('/:id', roleMiddleware('admin'), categoryController.update);

router.delete('/:id', roleMiddleware('admin'), categoryController.delete);

module.exports = router;
