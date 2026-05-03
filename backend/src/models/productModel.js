// ============================================
// CashierNova — Product Model
// Operasi database untuk tabel products
// Dependencies: config/db
// ============================================

const { pool } = require('../config/db');

const productModel = {
  /**
   * Mengambil semua produk dengan filter, search, dan pagination
   */
  findAll: async ({ search, category, page = 1, limit = 10 }) => {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.deleted_at IS NULL
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.deleted_at IS NULL';
    const params = [];
    const countParams = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      countQuery += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND p.category_id = ?';
      countQuery += ' AND p.category_id = ?';
      params.push(category);
      countParams.push(category);
    }

    // Total count
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);

    return {
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Mencari produk berdasarkan ID
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.deleted_at IS NULL`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Membuat produk baru
   */
  create: async (data) => {
    const { category_id, name, sku, price, stock, image_url, description } = data;
    const [result] = await pool.query(
      'INSERT INTO products (category_id, name, sku, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, sku || null, price, stock || 0, image_url || null, description || null]
    );
    return { id: result.insertId, ...data };
  },

  /**
   * Mengupdate produk
   */
  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.category_id !== undefined) { fields.push('category_id = ?'); values.push(data.category_id); }
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.sku !== undefined) { fields.push('sku = ?'); values.push(data.sku); }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price); }
    if (data.stock !== undefined) { fields.push('stock = ?'); values.push(data.stock); }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }

    if (fields.length === 0) return null;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
      values
    );
    return result.affectedRows > 0;
  },

  /**
   * Soft delete produk
   */
  delete: async (id) => {
    const [result] = await pool.query(
      'UPDATE products SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Update stok produk
   */
  updateStock: async (id, stock) => {
    const [result] = await pool.query(
      'UPDATE products SET stock = ? WHERE id = ? AND deleted_at IS NULL',
      [stock, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Mengurangi stok produk (untuk transaksi)
   * Menggunakan connection untuk transaction support
   */
  decreaseStock: async (connection, id, quantity) => {
    const [result] = await connection.query(
      'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ? AND deleted_at IS NULL',
      [quantity, id, quantity]
    );
    return result.affectedRows > 0;
  },
};

module.exports = productModel;
