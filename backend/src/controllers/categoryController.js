const categoryModel = require('../models/categoryModel');
const { success, error } = require('../utils/response');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryModel.findAll();
      return success(res, 'Daftar kategori berhasil diambil.', categories);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const category = await categoryModel.create(req.body);
      return success(res, 'Kategori berhasil ditambahkan.', category, 201);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const existing = await categoryModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'Kategori tidak ditemukan.', 404);
      }

      await categoryModel.update(req.params.id, req.body);
      const updated = await categoryModel.findById(req.params.id);
      return success(res, 'Kategori berhasil diperbarui.', updated);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const existing = await categoryModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'Kategori tidak ditemukan.', 404);
      }

      await categoryModel.delete(req.params.id);
      return success(res, 'Kategori berhasil dihapus.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
