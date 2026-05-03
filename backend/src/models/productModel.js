// ============================================
// CashierNova — Product Model (sql.js)
// Operasi database untuk tabel products
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

const execute = (sql, params = []) => {
  const db = getDb();
  db.run(sql, params);
  saveDatabase();
};

const productModel = {
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
      params.push(Number(category));
      countParams.push(Number(category));
    }

    const countResult = queryOne(countQuery, countParams);
    const total = countResult ? countResult.total : 0;

    const offset = (page - 1) * limit;
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = queryAll(query, params);

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

  findById: async (id) => {
    return queryOne(
      `SELECT p.*, c.name as category_name 
       FROM products p LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.deleted_at IS NULL`,
      [id]
    );
  },

  create: async (data) => {
    const { category_id, name, sku, price, stock, image_url, description } = data;
    const db = getDb();
    db.run(
      'INSERT INTO products (category_id, name, sku, price, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Number(category_id), name, sku || null, Number(price), Number(stock) || 0, image_url || null, description || null]
    );
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    saveDatabase();
    return { id: lastId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    if (data.category_id !== undefined) { fields.push('category_id = ?'); values.push(Number(data.category_id)); }
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.sku !== undefined) { fields.push('sku = ?'); values.push(data.sku); }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(Number(data.price)); }
    if (data.stock !== undefined) { fields.push('stock = ?'); values.push(Number(data.stock)); }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (fields.length === 0) return null;
    fields.push("updated_at = datetime('now')");
    values.push(id);
    execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`, values);
    return true;
  },

  delete: async (id) => {
    execute("UPDATE products SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL", [id]);
    return true;
  },

  updateStock: async (id, stock) => {
    execute('UPDATE products SET stock = ? WHERE id = ? AND deleted_at IS NULL', [Number(stock), id]);
    return true;
  },
};

module.exports = productModel;
