// ============================================
// CashierNova — Transaction Model
// Operasi database untuk tabel transactions & transaction_items
// Menggunakan BEGIN/COMMIT/ROLLBACK untuk atomic operations
// Dependencies: config/db
// ============================================

const { pool } = require('../config/db');

const transactionModel = {
  /**
   * Membuat transaksi baru dengan items (atomic)
   * @param {Object} data - Header transaksi
   * @param {Array} items - Array item transaksi
   * @returns {Object} Transaksi yang dibuat
   */
  create: async (data, items) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Buat header transaksi
      const [result] = await connection.query(
        `INSERT INTO transactions 
         (invoice_number, user_id, total_amount, tax_amount, grand_total, payment_amount, change_amount, payment_method, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.invoice_number,
          data.user_id,
          data.total_amount,
          data.tax_amount,
          data.grand_total,
          data.payment_amount,
          data.change_amount,
          data.payment_method || 'cash',
          data.notes || null,
        ]
      );

      const transactionId = result.insertId;

      // Masukkan semua item transaksi dan kurangi stok
      for (const item of items) {
        await connection.query(
          `INSERT INTO transaction_items 
           (transaction_id, product_id, product_name, price, quantity, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [transactionId, item.product_id, item.product_name, item.price, item.quantity, item.subtotal]
        );

        // Kurangi stok produk
        const [stockResult] = await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ? AND deleted_at IS NULL',
          [item.quantity, item.product_id, item.quantity]
        );

        if (stockResult.affectedRows === 0) {
          throw { statusCode: 400, message: `Stok produk "${item.product_name}" tidak mencukupi.` };
        }
      }

      await connection.commit();

      return {
        id: transactionId,
        invoice_number: data.invoice_number,
        ...data,
        items,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Mengambil daftar transaksi dengan filter dan pagination
   */
  findAll: async ({ startDate, endDate, page = 1, limit = 10 }) => {
    let query = `
      SELECT t.*, u.name as cashier_name 
      FROM transactions t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM transactions t WHERE 1=1';
    const params = [];
    const countParams = [];

    if (startDate) {
      query += ' AND DATE(t.created_at) >= ?';
      countQuery += ' AND DATE(t.created_at) >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(t.created_at) <= ?';
      countQuery += ' AND DATE(t.created_at) <= ?';
      params.push(endDate);
      countParams.push(endDate);
    }

    // Total count
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
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
   * Mencari transaksi berdasarkan ID (termasuk items)
   */
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.*, u.name as cashier_name 
       FROM transactions t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [id]
    );

    if (!rows[0]) return null;

    // Ambil items transaksi
    const [items] = await pool.query(
      'SELECT * FROM transaction_items WHERE transaction_id = ?',
      [id]
    );

    return { ...rows[0], items };
  },

  /**
   * Generate nomor invoice unik
   * Format: INV-YYYYMMDD-XXXX
   */
  generateInvoiceNumber: async () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM transactions WHERE DATE(created_at) = CURDATE()"
    );
    const count = rows[0].count + 1;
    return `INV-${today}-${String(count).padStart(4, '0')}`;
  },

  /**
   * Ringkasan dashboard — total hari ini
   */
  getTodaySummary: async () => {
    const [rows] = await pool.query(`
      SELECT 
        COALESCE(SUM(grand_total), 0) as total_sales,
        COUNT(*) as total_transactions
      FROM transactions 
      WHERE DATE(created_at) = CURDATE()
    `);
    return rows[0];
  },

  /**
   * Data chart penjualan per hari
   * @param {number} range - Jumlah hari (7 atau 30)
   */
  getSalesChart: async (range = 7) => {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(grand_total), 0) as total_sales,
        COUNT(*) as total_transactions
      FROM transactions
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [range]);
    return rows;
  },

  /**
   * 5 transaksi terbaru untuk dashboard
   */
  getRecentTransactions: async () => {
    const [rows] = await pool.query(`
      SELECT t.id, t.invoice_number, t.grand_total, t.payment_method, t.created_at, u.name as cashier_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    return rows;
  },
};

module.exports = transactionModel;
