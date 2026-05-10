const { getDb, saveDatabase } = require('../config/db');

const queryAll = (sql, params = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
};

const queryOne = (sql, params = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
};

const execute = (sql, params = []) => {
  const db = getDb();
  db.run(sql, params);
  saveDatabase();
};

const userModel = {
  findAll: async () => {
    return queryAll(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
  },

  findById: async (id) => {
    return queryOne(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
  },

  findByEmail: async (email) => {
    return queryOne(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );
  },

  create: async (data) => {
    const { name, email, password, role } = data;
    const db = getDb();
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'kasir']
    );
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    saveDatabase();
    return { id: lastId, name, email, role: role || 'kasir' };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }
    if (fields.length === 0) return null;

    fields.push("updated_at = datetime('now')");
    values.push(id);
    execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`, values);
    return true;
  },

  delete: async (id) => {
    execute("UPDATE users SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL", [id]);
    return true;
  },

  updateRefreshToken: async (id, refreshToken) => {
    execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
  },

  findByRefreshToken: async (refreshToken) => {
    return queryOne(
      'SELECT id, name, email, role FROM users WHERE refresh_token = ? AND deleted_at IS NULL',
      [refreshToken]
    );
  },
};

module.exports = userModel;
