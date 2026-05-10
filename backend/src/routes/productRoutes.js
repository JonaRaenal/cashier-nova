const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const productValidator = require('../validators/productValidator');

// Semua route memerlukan autentikasi
router.use(authMiddleware);

router.get('/', productController.getAll);

router.get('/:id', productController.getById);

router.post('/', roleMiddleware('admin'), validateMiddleware(productValidator.create), productController.create);

router.put('/:id', roleMiddleware('admin'), validateMiddleware(productValidator.update), productController.update);

router.delete('/:id', roleMiddleware('admin'), productController.delete);

router.patch('/:id/stock', roleMiddleware('admin'), validateMiddleware(productValidator.updateStock), productController.updateStock);

module.exports = router;
