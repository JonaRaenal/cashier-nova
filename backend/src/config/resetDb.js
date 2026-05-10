const { initConnection, saveDatabase } = require('./db');
const bcrypt = require('bcryptjs');

const resetDatabase = async () => {
  const db = await initConnection();

  console.log('🗑️  Menghapus data lama...');

  db.run('DROP TABLE IF EXISTS transaction_items');
  db.run('DROP TABLE IF EXISTS transactions');
  db.run('DROP TABLE IF EXISTS products');
  db.run('DROP TABLE IF EXISTS categories');
  db.run('DROP TABLE IF EXISTS users');

  console.log('🔨 Membuat ulang tabel...');

  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'kasir' CHECK(role IN ('admin', 'kasir')),
    refresh_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
  )`);

  db.run(`CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
  )`);

  db.run(`CREATE TABLE products (
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
  )`);

  db.run(`CREATE TABLE transactions (
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
  )`);

  db.run(`CREATE TABLE transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE
  )`);

  console.log('🌱 Menanam data baru...');

  const adminHash = bcrypt.hashSync('admin123', 10);
  const kasirHash = bcrypt.hashSync('kasir123', 10);
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['Administrator', 'admin@cashiernova.com', adminHash, 'admin']);
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['Kasir Demo', 'kasir@cashiernova.com', kasirHash, 'kasir']);

  db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Makanan', 'Produk makanan ringan dan berat']);
  db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Minuman', 'Minuman dingin dan panas']);
  db.run('INSERT INTO categories (name, description) VALUES (?, ?)', ['Snack', 'Camilan dan kue kering']);

  const products = [
    [1, 'Indomie Goreng', 'MKN-001', 3500, 50, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300'],
    [1, 'Beras Premium 5kg', 'MKN-002', 75000, 40, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300'],
    [1, 'Minyak Goreng 1L', 'MKN-003', 18000, 35, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300'],
    [2, 'Aqua 600ml', 'MNM-001', 4000, 100, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300'],
    [2, 'Teh Botol Sosro', 'MNM-002', 5000, 80, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300'],
    [2, 'Coca Cola 330ml', 'MNM-003', 7000, 60, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300'],
    [3, 'Chitato Sapi Panggang', 'SNK-001', 12000, 60, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300'],
    [3, 'Silverqueen Chunky', 'SNK-002', 18000, 3, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300'],
    [3, 'Kacang Garuda Original', 'SNK-003', 10000, 45, 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=300'],
  ];

  for (const p of products) {
    db.run('INSERT INTO products (category_id, name, sku, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)', p);
  }

  saveDatabase();
  console.log('✅ Database berhasil direset!');
};

resetDatabase().catch(console.error);