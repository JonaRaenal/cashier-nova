-- ============================================
-- CashierNova POS — Database Schema
-- DDL lengkap untuk MySQL 8
-- Tabel: users, categories, products, transactions, transaction_items
-- ============================================

CREATE DATABASE IF NOT EXISTS cashier_nova
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cashier_nova;

-- --------------------------------------------
-- Tabel: users
-- Menyimpan data pengguna (admin & kasir)
-- --------------------------------------------
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir',
  refresh_token TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,

  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: categories
-- Kategori produk (Makanan, Minuman, dll)
-- --------------------------------------------
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,

  INDEX idx_categories_deleted_at (deleted_at)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: products
-- Data produk yang dijual
-- --------------------------------------------
CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50) NULL UNIQUE,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500) NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,

  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  INDEX idx_products_category_id (category_id),
  INDEX idx_products_name (name),
  INDEX idx_products_deleted_at (deleted_at)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: transactions
-- Header transaksi penjualan
-- --------------------------------------------
CREATE TABLE transactions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(30) NOT NULL UNIQUE,
  user_id INT UNSIGNED NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_method ENUM('cash', 'debit', 'credit', 'qris') NOT NULL DEFAULT 'cash',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  INDEX idx_transactions_user_id (user_id),
  INDEX idx_transactions_invoice (invoice_number),
  INDEX idx_transactions_created_at (created_at)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: transaction_items
-- Detail item per transaksi
-- --------------------------------------------
CREATE TABLE transaction_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,

  CONSTRAINT fk_items_transaction
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    ON UPDATE CASCADE ON DELETE CASCADE,

  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  INDEX idx_items_transaction_id (transaction_id),
  INDEX idx_items_product_id (product_id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Seed: Admin default
-- Password: admin123 (bcrypt hash)
-- --------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
('Administrator', 'admin@cashiernova.com', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf7.s5FMfmKEHcNqbUCyXbVn4mKi', 'admin');

-- --------------------------------------------
-- Seed: Kategori contoh
-- --------------------------------------------
INSERT INTO categories (name, description) VALUES
('Makanan', 'Produk makanan ringan dan berat'),
('Minuman', 'Minuman dingin dan panas'),
('Snack', 'Camilan dan kue kering');

-- --------------------------------------------
-- Seed: Produk contoh
-- --------------------------------------------
INSERT INTO products (category_id, name, sku, price, stock, image_url) VALUES
(1, 'Nasi Goreng Spesial', 'MKN-001', 25000, 50, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300'),
(1, 'Mie Ayam Bakso', 'MKN-002', 20000, 40, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300'),
(2, 'Es Teh Manis', 'MNM-001', 5000, 100, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300'),
(2, 'Kopi Susu Gula Aren', 'MNM-002', 18000, 80, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300'),
(3, 'Keripik Singkong', 'SNK-001', 10000, 60, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300'),
(3, 'Cokelat Bar', 'SNK-002', 15000, 3, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300');
