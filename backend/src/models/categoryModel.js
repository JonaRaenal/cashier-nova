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

const categoryModel = {
  findAll: async () => {
    return queryAll('SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC');
  },

  findById: async (id) => {
    return queryOne('SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL', [id]);
  },

  create: async (data) => {
    const { name, description } = data;
    const db = getDb();
    db.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || null]);
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    saveDatabase();
    return { id: lastId, name, description };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (fields.length === 0) return null;
    fields.push("updated_at = datetime('now')");
    values.push(id);
    execute(`UPDATE categories SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`, values);
    return true;
  },

  delete: async (id) => {
    execute("UPDATE categories SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL", [id]);
    return true;
  },
};

module.exports = categoryModel;
