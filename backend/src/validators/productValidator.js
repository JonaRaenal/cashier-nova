const { body, param } = require('express-validator');

const productValidator = {
  create: [
    body('category_id')
      .notEmpty().withMessage('Kategori wajib dipilih.')
      .isInt({ min: 1 }).withMessage('Kategori tidak valid.'),
    body('name')
      .notEmpty().withMessage('Nama produk wajib diisi.')
      .isLength({ max: 150 }).withMessage('Nama produk maksimal 150 karakter.'),
    body('price')
      .notEmpty().withMessage('Harga wajib diisi.')
      .isFloat({ min: 0 }).withMessage('Harga harus bernilai positif.'),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('Stok harus bernilai positif.'),
    body('sku')
      .optional()
      .isLength({ max: 50 }).withMessage('SKU maksimal 50 karakter.'),
    body('image_url')
      .optional()
      .isURL().withMessage('Format URL gambar tidak valid.'),
  ],

  update: [
    param('id').isInt({ min: 1 }).withMessage('ID produk tidak valid.'),
    body('category_id')
      .optional()
      .isInt({ min: 1 }).withMessage('Kategori tidak valid.'),
    body('name')
      .optional()
      .isLength({ max: 150 }).withMessage('Nama produk maksimal 150 karakter.'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Harga harus bernilai positif.'),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('Stok harus bernilai positif.'),
  ],

  updateStock: [
    param('id').isInt({ min: 1 }).withMessage('ID produk tidak valid.'),
    body('stock')
      .notEmpty().withMessage('Stok wajib diisi.')
      .isInt({ min: 0 }).withMessage('Stok harus bernilai positif.'),
  ],
};

module.exports = productValidator;
