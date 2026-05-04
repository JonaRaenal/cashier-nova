// ============================================
// CashierNova — Product Controller
// Handler untuk CRUD dan manajemen stok produk
// Dependencies: productModel
// ============================================

const productModel = require('../models/productModel');
const { success, error } = require('../utils/response');

const productController = {
  /**
   * GET /api/products
   * Mengambil daftar produk dengan search, filter, dan pagination
   */
  getAll: async (req, res, next) => {
    try {
      const { search, category, page, limit } = req.query;

      const sanitizedSearch = search ? search.replace(/[^a-zA-Z0-9 ]/g, '').trim() : search;
      const result = await productModel.findAll({ search: sanitizedSearch, category, page, limit });

      return success(res, 'Daftar produk berhasil diambil.', result.data, 200, result.meta);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/products/:id
   * Mengambil detail produk berdasarkan ID
   */
  getById: async (req, res, next) => {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return error(res, 'Produk tidak ditemukan.', 404);
      }
      return success(res, 'Detail produk berhasil diambil.', product);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/products
   * Membuat produk baru
   */
  create: async (req, res, next) => {
    try {
      const product = await productModel.create(req.body);
      return success(res, 'Produk berhasil ditambahkan.', product, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/products/:id
   * Mengupdate produk
   */
  update: async (req, res, next) => {
    try {
      const existing = await productModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'Produk tidak ditemukan.', 404);
      }

      await productModel.update(req.params.id, req.body);
      const updated = await productModel.findById(req.params.id);
      return success(res, 'Produk berhasil diperbarui.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/products/:id
   * Soft delete produk
   */
  delete: async (req, res, next) => {
    try {
      const existing = await productModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'Produk tidak ditemukan.', 404);
      }

      await productModel.delete(req.params.id);
      return success(res, 'Produk berhasil dihapus.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/products/:id/stock
   * Update stok produk
   */
  updateStock: async (req, res, next) => {
    try {
      const existing = await productModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'Produk tidak ditemukan.', 404);
      }

      await productModel.updateStock(req.params.id, req.body.stock);
      return success(res, 'Stok produk berhasil diperbarui.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = productController;
