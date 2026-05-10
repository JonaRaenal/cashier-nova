# Laporan Audit Keamanan Backend: Cashier Nova

## Ringkasan Eksekutif
Sistem Cashier Nova memiliki postur keamanan dasar yang cukup baik dengan penggunaan middleware standar seperti `helmet`, `cors`, dan `express-rate-limit`. Namun, ditemukan celah keamanan **Critical** pada logika bisnis transaksi yang memungkinkan manipulasi harga produk oleh pengguna. Selain itu, manajemen file sensitif (`.gitignore`) dan enkripsi data saat istirahat (*at-rest*) memerlukan perhatian segera untuk mencegah kebocoran data.

## Metodologi
Pengujian keamanan dilakukan menggunakan metode *Static Application Security Testing* (SAST) dengan mengacu pada standar **OWASP Top 10 2021** untuk mengidentifikasi celah keamanan pada level kode dan arsitektur.

## Temuan Keamanan (Tabel)
| ID | Kerentanan | Tingkat Risiko | Status |
| :--- | :--- | :--- | :--- |
| CN-01 | Manipulasi Harga Produk (Business Logic Vulnerability) | **Critical** | Open |
| CN-02 | Pengungkapan Informasi Sensitif via Missing .gitignore | **High** | Open |
| CN-03 | Kurangnya Enkripsi Database at-rest | **Medium** | Open |
| CN-04 | Konfigurasi Rate Limiting Global Terlalu Longgar | **Low** | Open |
| CN-05 | Ketiadaan Content Security Policy (CSP) | **Medium** | Open |

---

## Detail Temuan

### CN-01: Manipulasi Harga Produk (Business Logic Vulnerability)
*   **Deskripsi:** Backend menerima harga produk (`price`) langsung dari request body saat membuat transaksi tanpa memverifikasinya dengan data di database.
*   **Lokasi Kode:** `backend/src/controllers/transactionController.js` (Fungsi `create`).
*   **Dampak:** Penyerang dapat memanipulasi request untuk mengubah harga barang mahal menjadi sangat murah, mengakibatkan kerugian finansial bagi pemilik toko.
*   **Rekomendasi Perbaikan:**
    Ambil harga produk langsung dari database berdasarkan `product_id` sebelum menghitung total.
    ```javascript
    // Contoh Perbaikan
    const product = await productModel.findById(item.product_id);
    const subtotal = product.price * item.quantity; // Gunakan product.price dari DB
    ```

### CN-02: Pengungkapan Informasi Sensitif via Missing .gitignore
*   **Deskripsi:** Tidak ditemukan file `.gitignore` pada root proyek atau subdirektori backend.
*   **Lokasi Kode:** Root direktori proyek.
*   **Dampak:** File sensitif seperti `.env` (berisi JWT Secret), `node_modules`, dan file database `cashiernova.db` dapat secara tidak sengaja ter-commit ke repositori Git.
*   **Rekomendasi Perbaikan:**
    Segera buat file `.gitignore` dan masukkan daftar file/folder sensitif.

### CN-03: Kurangnya Enkripsi Database at-rest
*   **Deskripsi:** Database menggunakan SQLite (`sql.js`) yang disimpan dalam file `.db` mentah tanpa enkripsi.
*   **Lokasi Kode:** `backend/database/cashiernova.db`.
*   **Dampak:** Jika penyerang mendapatkan akses ke file sistem atau jika file `.db` terunduh melalui celah lain, seluruh data transaksi dan user (termasuk hash password) dapat dibaca dengan mudah.
*   **Rekomendasi Perbaikan:** Gunakan ekstensi seperti `SQLCipher` untuk enkripsi SQLite atau pastikan kontrol akses level OS sangat ketat.

### CN-04: Konfigurasi Rate Limiting Global Terlalu Longgar
*   **Deskripsi:** Rate limiting global diatur ke 1000 request per 15 menit.
*   **Lokasi Kode:** `backend/server.js`.
*   **Dampak:** Memberikan celah yang cukup luas untuk serangan *denial of service* ringan atau *automated scraping*. Meskipun login sudah memiliki limiter terpisah, endpoint lain masih rentan.
*   **Rekomendasi Perbaikan:** Perketat limiter global menjadi sekitar 100-300 request per 15 menit tergantung pada estimasi traffic normal.

### CN-05: Ketiadaan Content Security Policy (CSP)
*   **Deskripsi:** Middleware `helmet` digunakan, namun tanpa konfigurasi CSP yang spesifik.
*   **Lokasi Kode:** `backend/server.js`.
*   **Dampak:** Meningkatkan risiko serangan *Cross-Site Scripting* (XSS) di sisi frontend jika ada celah injeksi script.
*   **Rekomendasi Perbaikan:** Konfigurasi CSP melalui `helmet` untuk membatasi sumber script, gaya, dan koneksi yang diizinkan.

---

## Kesimpulan & Saran Strategis
Sistem Cashier Nova memiliki fondasi yang kuat namun memerlukan perbaikan kritis pada **validasi logika bisnis** (Harga Produk). Keamanan bukan hanya tentang menahan serangan dari luar, tetapi juga memastikan integritas data dalam proses internal.

**Saran Strategis:**
1.  **Prioritas Utama**: Perbaiki `transactionController` untuk memvalidasi harga dari database.
2.  **Manajemen Rahasia**: Pindahkan semua rahasia ke Environment Variables dan pastikan `.gitignore` aktif.
3.  **Audit Lanjutan**: Lakukan pengujian penetrasi dinamis (DAST) setelah perbaikan logika bisnis selesai dilakukan.

---
**Auditor**: Gemini CLI (Senior Security Engineer)
**Tanggal**: 10 Mei 2026

---

## Lampiran: Implementasi Keamanan Backend Berlapis (Production Ready)

Sebagai tindak lanjut dari temuan di atas, berikut adalah panduan implementasi berlapis untuk menambal kerentanan OWASP Top 10 pada aplikasi Cashier Nova.

### 1. Zero-Trust Input Validation & Logic Integrity (Zod & Controller)

**Masalah (CN-01):** Jika Anda menerima harga dari *client*, attacker dapat menggunakan *proxy interceptor* (seperti Burp Suite) untuk mengubah harga produk menjadi 0.1 sebelum dikirim ke server. Ini adalah celah *Broken Access Control* dan *Insecure Design*.

**Solusi:** Gunakan `Zod` untuk membuang field tidak dikenal secara otomatis, dan hitung harga absolut dari database server.

```javascript
// validations/transaction.schema.js
const { z } = require('zod');

// Schema akan otomatis membuang (strip) field 'price' jika client mencoba mengirimkannya
const createTransactionSchema = z.object({
  product_id: z.number().int().positive("Product ID tidak valid"),
  quantity: z.number().int().min(1, "Minimal pembelian adalah 1")
});

module.exports = { createTransactionSchema };
```

```javascript
// controllers/transaction.controller.js
const { createTransactionSchema } = require('../validations/transaction.schema');
const db = require('../config/database'); // Asumsi koneksi DB SQLite (better-sqlite3)

exports.createTransaction = async (req, res, next) => {
  try {
    // 1. Zero-Trust Input Validation
    // Validasi input, jika client mengirim 'price', akan otomatis diabaikan
    const validatedData = createTransactionSchema.parse(req.body);
    const { product_id, quantity } = validatedData;

    // 2. Database Transaction (ACID)
    // Pastikan operasi pengecekan stok dan pengurangan terjadi secara atomik
    const runTransaction = db.transaction(() => {
        // AMBIL HARGA DARI SERVER (Single Source of Truth)
        const product = db.prepare('SELECT price, stock FROM products WHERE id = ?').get(product_id);
        
        if (!product) throw new Error('NOT_FOUND');
        if (product.stock < quantity) throw new Error('INSUFFICIENT_STOCK');

        // Kalkulasi Total di backend, BUKAN dari frontend
        const total_price = product.price * quantity;

        // Update stok
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(quantity, product_id);

        // Insert riwayat transaksi
        const result = db.prepare('INSERT INTO transactions (product_id, quantity, total_price) VALUES (?, ?, ?)')
                         .run(product_id, quantity, total_price);
                         
        return { transaction_id: result.lastInsertRowid, total_price };
    });

    const result = runTransaction();
    
    res.status(201).json({
        success: true,
        message: 'Transaksi berhasil',
        data: result
    });

  } catch (error) {
    // Penanganan error spesifik sebelum dilempar ke global handler
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.errors });
    }
    if (error.message === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    if (error.message === 'INSUFFICIENT_STOCK') return res.status(400).json({ success: false, message: 'Stok tidak mencukupi' });
    
    // Lempar ke Global Error Handler
    next(error);
  }
};
```
*Mengapa lebih aman?* Operasi *database transaction* memastikan bahwa jika saat *update* stok gagal, riwayat transaksi tidak akan dibuat (mencegah *Race Conditions*). Menghitung `total_price` di backend sepenuhnya menutup celah manipulasi harga.

### 2. Secure Authentication & Authorization (JWT & RBAC)

**Masalah:** Attacker dapat mengirim token JWT dengan algoritma "none" (Algorithm Confusion Attack) untuk melewati autentikasi, atau user biasa dapat mengakses endpoint admin.

**Solusi:** Paksa verifikasi menggunakan algoritma **HS256** dan terapkan *Role-Based Access Control* (RBAC).

```javascript
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware 1: Verifikasi Token yang ketat
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });

    // SECURITY FIX: Pengecekan algoritma eksplisit mencegah eksploitasi JWT
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            // Jangan beri tahu apakah token salah atau expired (Information Disclosure)
            return res.status(403).json({ success: false, message: 'Sesi tidak valid.' });
        }
        req.user = decoded; // Berisi payload spt { id: 1, role: 'admin' }
        next();
    });
};

// Middleware 2: Role-Based Access Control (RBAC)
exports.requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Pastikan req.user sudah di-set oleh authenticateToken sebelumnya
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Akses ditolak. Anda tidak memiliki izin untuk operasi ini.' 
            });
        }
        next();
    };
};
```

### 3. Infrastructure & Secret Management (.env & Helmet)

**Masalah:** Bocornya variabel lingkungan (Secrets) dan kurangnya *Security Headers* membuat frontend rentan terhadap XSS dan Clickjacking.

**Solusi:** Implementasikan `Helmet` dengan *Content Security Policy* (CSP) dan gunakan file `.env.example` sebagai referensi aman bagi tim *development*.

**A. File `.env.example`**
```env
# ==========================================
# SERVER CONFIGURATION
# ==========================================
PORT=5000
NODE_ENV=development

# ==========================================
# DATABASE SECRETS (Do not commit actual passwords)
# ==========================================
# Karena menggunakan SQLite, hanya butuh path database
DB_PATH=./database.sqlite

# ==========================================
# AUTHENTICATION
# Generate a strong 256-bit key (e.g., using: openssl rand -base64 32)
# ==========================================
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=1h
```

**B. Konfigurasi Helmet (app.js / server.js)**
```javascript
const helmet = require('helmet');

// Letakkan di bagian atas middleware, sebelum router
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Izinkan script dari domain sendiri
      scriptSrc: ["'self'"], 
      // Izinkan style dari domain sendiri (tambahkan 'unsafe-inline' jika terpaksa pakai Tailwind/inline CSS)
      styleSrc: ["'self'", "'unsafe-inline'"], 
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"], // Blokir plugin Flash/Java (Mencegah XSS)
      upgradeInsecureRequests: [], // Memaksa HTTP ke HTTPS
    },
  },
  // Mencegah aplikasi di-embed di iFrame (Mencegah Clickjacking)
  frameguard: { action: 'deny' }, 
  // Menyembunyikan header 'X-Powered-By: Express' dari attacker
  hidePoweredBy: true 
}));
```

### 4. Error & Information Handling

**Masalah:** Membiarkan Express mengirim *Stack Trace* default ke frontend saat terjadi error 500 akan membocorkan struktur folder, nama database, dan logika kode Anda kepada attacker (Information Leakage).

**Solusi:** *Global Error Handler*.

```javascript
// middlewares/errorHandler.js

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Log error ke server/console untuk pemantauan Developer (Opsional: Kirim ke Sentry/Winston)
    console.error(`[ERROR] ${req.method} ${req.url} >> ${err.message}`);
    if (!isProduction) console.error(err.stack); // Stack hanya muncul di Development

    // 2. Format respon balasan ke Client (Generic Message di Production)
    const clientMessage = isProduction && statusCode === 500 
        ? 'Terjadi gangguan internal pada server. Silakan coba beberapa saat lagi.' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        message: clientMessage,
        // Jangan pernah mengirim stack trace di environment production
        ...(isProduction ? {} : { stack: err.stack }) 
    });
};

module.exports = globalErrorHandler;
```
*Cara Penggunaan:* Pastikan ini di-*mount* di akhir file `app.js` Anda, tepat setelah semua rute (`app.use(globalErrorHandler);`).
