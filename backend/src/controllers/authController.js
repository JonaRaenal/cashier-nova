// ============================================
// CashierNova — Auth Controller
// Handler untuk login, logout, dan refresh token
// Dependencies: bcrypt, jsonwebtoken, userModel
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const env = require('../config/env');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

const authController = {
  /**
   * POST /api/auth/login
   * Login user dengan email dan password
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Cari user berdasarkan email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return error(res, 'Email atau password salah.', 401);
      }

      // Verifikasi password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return error(res, 'Email atau password salah.', 401);
      }

      // Generate access token
      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
      );

      // Simpan refresh token ke database
      await userModel.updateRefreshToken(user.id, refreshToken);

      logger.info(`User ${user.email} berhasil login`);

      return success(res, 'Login berhasil.', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/logout
   * Logout user dan hapus refresh token
   */
  logout: async (req, res, next) => {
    try {
      // Hapus refresh token dari database
      await userModel.updateRefreshToken(req.user.id, null);

      logger.info(`User ${req.user.email} berhasil logout`);

      return success(res, 'Logout berhasil.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/refresh-token
   * Generate access token baru menggunakan refresh token
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refresh_token } = req.body;

      // Verifikasi refresh token
      let decoded;
      try {
        decoded = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET);
      } catch (err) {
        return error(res, 'Refresh token tidak valid atau sudah kedaluwarsa.', 401);
      }

      // Cari user berdasarkan refresh token
      const user = await userModel.findByRefreshToken(refresh_token);
      if (!user) {
        return error(res, 'Refresh token tidak ditemukan. Silakan login kembali.', 401);
      }

      // Generate access token baru
      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      // Generate refresh token baru
      const newRefreshToken = jwt.sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
      );

      // Update refresh token di database
      await userModel.updateRefreshToken(user.id, newRefreshToken);

      return success(res, 'Token berhasil diperbarui.', {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
