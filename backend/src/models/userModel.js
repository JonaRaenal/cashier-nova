// ============================================
// CashierNova — User Model
// Operasi database untuk tabel users
// Dependencies: config/db
// ============================================

const { pool } = require('../config/db');

const userModel = {
  /**
   * Mengambil semua user (tanpa soft deleted)
   */
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
    return rows;
  },

  /**
   * Mencari user berdasarkan ID
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Mencari user berdasarkan email (termasuk password untuk auth)
   */
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Membuat user baru
   */
  create: async (data) => {
    const { name, email, password, role } = data;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'kasir']
    );
    return { id: result.insertId, name, email, role: role || 'kasir' };
  },

  /**
   * Mengupdate data user
   */
  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }

    if (fields.length === 0) return null;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
      values
    );
    return result.affectedRows > 0;
  },

  /**
   * Soft delete user
   */
  delete: async (id) => {
    const [result] = await pool.query(
      'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Menyimpan refresh token
   */
  updateRefreshToken: async (id, refreshToken) => {
    await pool.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, id]
    );
  },

  /**
   * Mencari user berdasarkan refresh token
   */
  findByRefreshToken: async (refreshToken) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE refresh_token = ? AND deleted_at IS NULL',
      [refreshToken]
    );
    return rows[0] || null;
  },
};

module.exports = userModel;
