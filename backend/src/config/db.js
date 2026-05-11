const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DB_DIR = path.join(__dirname, '..', '..', 'database');
const DB_PATH = path.join(DB_DIR, 'cashiernova.db');

let db = null;

/**
 * Inisialisasi database SQLite
 * Memuat file database jika ada, atau buat baru
 */
const initConnection = async () => {
  const SQL = await initSqlJs();

  // Pastikan folder database ada
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Muat file database jika ada
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    logger.info('✅ Database SQLite berhasil dimuat dari file');
  } else {
    db = new SQL.Database();
    logger.info('✅ Database SQLite baru berhasil dibuat');
  }

  logger.info(`📁 File database: ${DB_PATH}`);
  return db;
};

/**
 * Simpan database ke file (dipanggil setelah operasi write)
 */
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
};

/**
 * Mendapatkan instance database
 */
const getDb = () => {
  if (!db) throw new Error('Database belum diinisialisasi. Panggil initConnection() dulu.');
  return db;
};

module.exports = { initConnection, getDb, saveDatabase };
