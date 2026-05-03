// ============================================
// CashierNova — User Controller
// Handler untuk CRUD manajemen user (admin only)
// Dependencies: bcrypt, userModel
// ============================================

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { success, error } = require('../utils/response');

const userController = {
  /**
   * GET /api/users
   * Mengambil semua user
   */
  getAll: async (req, res, next) => {
    try {
      const users = await userModel.findAll();
      return success(res, 'Daftar user berhasil diambil.', users);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/users
   * Membuat user baru
   */
  create: async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      // Cek apakah email sudah terdaftar
      const existing = await userModel.findByEmail(email);
      if (existing) {
        return error(res, 'Email sudah terdaftar.', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return success(res, 'User berhasil ditambahkan.', user, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/users/:id
   * Mengupdate user
   */
  update: async (req, res, next) => {
    try {
      const existing = await userModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'User tidak ditemukan.', 404);
      }

      const updateData = { ...req.body };

      // Hash password jika ada perubahan
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await userModel.update(req.params.id, updateData);
      const updated = await userModel.findById(req.params.id);
      return success(res, 'User berhasil diperbarui.', updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/users/:id
   * Soft delete user
   */
  delete: async (req, res, next) => {
    try {
      // Cegah hapus diri sendiri
      if (parseInt(req.params.id) === req.user.id) {
        return error(res, 'Tidak dapat menghapus akun sendiri.', 400);
      }

      const existing = await userModel.findById(req.params.id);
      if (!existing) {
        return error(res, 'User tidak ditemukan.', 404);
      }

      await userModel.delete(req.params.id);
      return success(res, 'User berhasil dihapus.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
