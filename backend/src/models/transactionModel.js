// ============================================
// CashierNova — Transaction Model (sql.js)
// Operasi database untuk transaksi (atomic)
// Dependencies: config/db (sql.js)
// ============================================

const { getDb, saveDatabase } = require('../config/db');

const queryAll = (sql, params = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

const queryOne = (sql, params = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
};

const transactionModel = {
  create: async (data, items) => {
    const db = getDb();

    try {
      db.run('BEGIN TRANSACTION');

      // Buat header transaksi
      db.run(
        `INSERT INTO transactions 
         (invoice_number, user_id, total_amount, tax_amount, grand_total, payment_amount, change_amount, payment_method, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.invoice_number, data.user_id, data.total_amount, data.tax_amount,
         data.grand_total, data.payment_amount, data.change_amount,
         data.payment_method || 'cash', data.notes || null]
      );

      const transactionId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];

      // Masukkan items dan kurangi stok
      for (const item of items) {
        db.run(
          `INSERT INTO transaction_items (transaction_id, product_id, product_name, price, quantity, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [transactionId, item.product_id, item.product_name, item.price, item.quantity, item.subtotal]
        );

        // Cek stok sebelum kurangi
        const product = queryOne('SELECT stock FROM products WHERE id = ? AND deleted_at IS NULL', [item.product_id]);
        if (!product || product.stock < item.quantity) {
          throw { statusCode: 400, message: `Stok produk "${item.product_name}" tidak mencukupi.` };
        }

        db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      }

      db.run('COMMIT');
      saveDatabase();

      return {
        id: transactionId,
        invoice_number: data.invoice_number,
        ...data,
        items,
      };
    } catch (err) {
      db.run('ROLLBACK');
      throw err;
    }
  },

  findAll: async ({ startDate, endDate, page = 1, limit = 10 }) => {
    let query = `
      SELECT t.*, u.name as cashier_name 
      FROM transactions t LEFT JOIN users u ON t.user_id = u.id WHERE 1=1
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

    const countResult = queryOne(countQuery, countParams);
    const total = countResult ? countResult.total : 0;

    const offset = (page - 1) * limit;
    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = queryAll(query, params);

    return {
      data: rows,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
    };
  },

  findById: async (id) => {
    const row = queryOne(
      `SELECT t.*, u.name as cashier_name FROM transactions t LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?`,
      [id]
    );
    if (!row) return null;
    const items = queryAll('SELECT * FROM transaction_items WHERE transaction_id = ?', [id]);
    return { ...row, items };
  },

  generateInvoiceNumber: async () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayDate = new Date().toISOString().slice(0, 10);
    const result = queryOne("SELECT COUNT(*) as count FROM transactions WHERE DATE(created_at) = ?", [todayDate]);
    const count = (result ? result.count : 0) + 1;
    return `INV-${today}-${String(count).padStart(4, '0')}`;
  },

  getTodaySummary: async () => {
    const todayDate = new Date().toISOString().slice(0, 10);
    const row = queryOne(`
      SELECT COALESCE(SUM(grand_total), 0) as total_sales, COUNT(*) as total_transactions
      FROM transactions WHERE DATE(created_at) = ?
    `, [todayDate]);
    return row || { total_sales: 0, total_transactions: 0 };
  },

  getSalesChart: async (range = 7) => {
    return queryAll(`
      SELECT DATE(created_at) as date, COALESCE(SUM(grand_total), 0) as total_sales, COUNT(*) as total_transactions
      FROM transactions WHERE created_at >= datetime('now', ? || ' days')
      GROUP BY DATE(created_at) ORDER BY date ASC
    `, [`-${range}`]);
  },

  getRecentTransactions: async () => {
    return queryAll(`
      SELECT t.id, t.invoice_number, t.grand_total, t.payment_method, t.created_at, u.name as cashier_name
      FROM transactions t LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC LIMIT 5
    `);
  },
};

module.exports = transactionModel;
