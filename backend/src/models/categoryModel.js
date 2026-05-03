// ============================================
// CashierNova — Category Model
// Operasi database untuk tabel categories
// Dependencies: config/db
// ============================================

const { pool } = require('../config/db');

const categoryModel = {
  /**
   * Mengambil semua kategori (tanpa soft deleted)
   */
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC'
    );
    return rows;
  },

  /**
   * Mencari kategori berdasarkan ID
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Membuat kategori baru
   */
  create: async (data) => {
    const { name, description } = data;
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return { id: result.insertId, name, description };
  },

  /**
   * Mengupdate kategori
   */
  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }

    if (fields.length === 0) return null;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
      values
    );
    return result.affectedRows > 0;
  },

  /**
   * Soft delete kategori
   */
  delete: async (id) => {
    const [result] = await pool.query(
      'UPDATE categories SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = categoryModel;
