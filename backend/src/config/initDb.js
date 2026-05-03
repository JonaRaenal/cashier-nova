// ============================================
// CashierNova — Database Initializer (sql.js)
// Membuat tabel dan seed data otomatis saat pertama kali
// Dependencies: sql.js, bcrypt
// ============================================

const { getDb, saveDatabase } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const initDatabase = () => {
  const db = getDb();

  // ---- Buat semua tabel ----
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'kasir' CHECK(role IN ('admin', 'kasir')),
      refresh_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      price REAL NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL DEFAULT 0,
      tax_amount REAL NOT NULL DEFAULT 0,
      grand_total REAL NOT NULL DEFAULT 0,
      payment_amount REAL NOT NULL DEFAULT 0,
      change_amount REAL NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'cash' CHECK(payment_method IN ('cash', 'debit', 'credit', 'qris')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transaction_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      subtotal REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE
    )
  `);

  // ---- Seed data jika tabel kosong ----
  const result = db.exec('SELECT COUNT(*) as count FROM users');
  const userCount = result[0]?.values[0][0] || 0;

  if (userCount === 0) {
    logger.info('🌱 Menanam data awal (seed)...');

    // Seed admin — password: admin123
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrator', 'admin@cashiernova.com', adminHash, 'admin']);

    // Seed kasir — password: kasir123
    const kasirHash = bcrypt.hashSync('kasir123', 10);
    db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Kasir Demo', 'kasir@cashiernova.com', kasirHash, 'kasir']);

    // Seed kategori
    db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Makanan', 'Produk makanan ringan dan berat']);
    db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Minuman', 'Minuman dingin dan panas']);
    db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Snack', 'Camilan dan kue kering']);

    // Seed produk
    const products = [
      [1, 'Nasi Goreng Spesial', 'MKN-001', 25000, 50, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300'],
      [1, 'Mie Ayam Bakso', 'MKN-002', 20000, 40, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300'],
      [1, 'Ayam Geprek', 'MKN-003', 22000, 35, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300'],
      [2, 'Es Teh Manis', 'MNM-001', 5000, 100, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300'],
      [2, 'Kopi Susu Gula Aren', 'MNM-002', 18000, 80, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300'],
      [2, 'Jus Jeruk Segar', 'MNM-003', 12000, 60, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300'],
      [3, 'Keripik Singkong', 'SNK-001', 10000, 60, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300'],
      [3, 'Cokelat Bar', 'SNK-002', 15000, 3, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300'],
      [3, 'Kacang Panggang', 'SNK-003', 8000, 45, 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=300'],
    ];
    for (const p of products) {
      db.run('INSERT INTO products (category_id, name, sku, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)', p);
    }

    // Simpan ke file
    saveDatabase();
    logger.info('✅ Seed data berhasil ditanam');
  }
};

module.exports = initDatabase;
