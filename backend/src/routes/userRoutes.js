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

router.get('/', userController.getAll);

router.post('/', validateMiddleware(userValidator.create), userController.create);

router.put('/:id', validateMiddleware(userValidator.update), userController.update);

router.delete('/:id', userController.delete);

module.exports = router;
