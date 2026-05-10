# 🚀 CashierNova: Sistem Point of Sale (POS) Modern

CashierNova adalah solusi manajemen penjualan (Point of Sale) berbasis web yang dirancang untuk efisiensi operasional toko ritel kecil hingga menengah. Dibangun dengan arsitektur modern yang memisahkan antara **Frontend (React)** dan **Backend (Node.js)**, aplikasi ini menawarkan antarmuka yang responsif, manajemen inventaris yang cerdas, dan laporan transaksi yang komprehensif.

---

## 🌟 Fitur Utama

### 📊 Dashboard Analitik
- Ringkasan performa penjualan harian/bulanan.
- Grafik tren penjualan menggunakan **Recharts**.
- Indikator stok produk kritis yang memerlukan pengadaan ulang.
- Daftar transaksi terbaru yang terjadi secara *real-time*.

### 🛒 Point of Sale (Kasir)
- Antarmuka dua kolom yang efisien: Katalog Produk (Kiri) dan Keranjang Belanja (Kanan).
- Pencarian produk instan berdasarkan nama atau kategori.
- Kalkulasi otomatis total belanja, pajak, dan kembalian.
- Fitur cetak struk digital setelah transaksi berhasil.

### 📦 Manajemen Inventaris
- Manajemen Kategori: Pengelompokan produk untuk pencarian yang lebih teratur.
- Manajemen Produk: CRUD (Create, Read, Update, Delete) lengkap dengan pelacakan stok.
- Validasi data produk menggunakan **Zod** dan **Express-Validator**.

### 👤 Manajemen Pengguna & Keamanan
- Sistem Multi-role: **Administrator** (Akses Penuh) dan **Kasir** (Transaksi Saja).
- Autentikasi berbasis **JWT (JSON Web Token)** dengan sistem Access & Refresh Token.
- Keamanan berlapis menggunakan **Helmet**, **Rate Limiting**, dan enkripsi kata sandi **Bcrypt**.

### 📜 Laporan & Transaksi
- Riwayat transaksi lengkap dengan detail item yang terjual.
- Filter transaksi berdasarkan rentang tanggal.
- Ekspor data transaksi ke format CSV untuk keperluan pembukuan.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18**: Library UI utama.
- **Vite**: Build tool yang sangat cepat.
- **Tailwind CSS**: Framework CSS utility-first untuk styling responsif.
- **Zustand**: State management yang ringan dan efisien.
- **React Router Dom v6**: Navigasi antar halaman.
- **Lucide React**: Set ikon yang modern.
- **Axios**: Komunikasi HTTP ke backend.

### Backend
- **Node.js & Express.js**: Runtime dan framework server.
- **SQLite (sql.js)**: Database embedded yang tidak memerlukan server eksternal (portabel).
- **Winston**: Sistem logging untuk debugging dan monitoring.
- **Express Validator**: Validasi input pada level API.

---

## 📂 Struktur Proyek

```text
cashier-nova/
├── backend/                   # Sumber kode server API
│   ├── database/              # File database SQLite (.db)
│   ├── src/
│   │   ├── config/            # Konfigurasi DB, Env, dan Inisialisasi
│   │   ├── controllers/       # Logika bisnis per modul
│   │   ├── middlewares/       # Auth, Error handling, Role validation
│   │   ├── models/            # Abstraksi query database
│   │   ├── routes/            # Definisi endpoint API
│   │   ├── utils/             # Helper (Logger, Response formatter)
│   │   └── validators/        # Skema validasi request
│   └── server.js              # Entry point aplikasi backend
│
└── frontend/                  # Sumber kode antarmuka web
    ├── public/                # Asset statis (Logo, Ikon)
    ├── src/
    │   ├── components/        # Komponen UI modular (Shared & Layout)
    │   ├── hooks/             # Custom hooks (Auth, Debounce, dll)
    │   ├── layouts/           # Wrapper layout (AuthLayout, MainLayout)
    │   ├── pages/             # View utama aplikasi
    │   ├── services/          # Konfigurasi API Client (Axios)
    │   ├── store/             # Global state (Zustand)
    │   └── utils/             # Fungsi utilitas (Currency, Date format)
    └── tailwind.config.js     # Konfigurasi tema Tailwind
```

---

## ⚙️ Instalasi & Konfigurasi

### 1. Prasyarat
- **Node.js** (v18.x atau lebih tinggi)
- **NPM** (v9.x atau lebih tinggi)

### 2. Setup Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instalasi dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya.
   ```bash
   cp .env.example .env
   ```
4. Jalankan server dalam mode pengembangan:
   ```bash
   npm run dev
   ```

### 3. Setup Frontend
1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instalasi dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Salin file `.env.example` menjadi `.env`.
   ```bash
   cp .env.example .env
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

---

## 📡 Endpoint API Utama

| Method | Endpoint | Deskripsi | Akses |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Autentikasi pengguna & dptkan token | Publik |
| **GET** | `/api/dashboard/stats` | Statistik ringkasan dashboard | Admin/Kasir |
| **GET** | `/api/products` | Ambil semua daftar produk | Admin/Kasir |
| **POST** | `/api/products` | Tambah produk baru | Admin |
| **POST** | `/api/transactions` | Buat transaksi baru (Checkout) | Admin/Kasir |
| **GET** | `/api/transactions` | Ambil riwayat transaksi | Admin/Kasir |
| **GET** | `/api/users` | Manajemen daftar pengguna | Admin |

---

## 🔑 Kredensial Akun Demo

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@cashiernova.com` | `admin123` |
| **Kasir** | `kasir@cashiernova.com` | `kasir123` |

---

## 🛡️ Keamanan Sistem
1. **JWT Authentication**: Token disimpan di memori/state (frontend) untuk mencegah serangan XSS.
2. **Refresh Token**: Mekanisme pembaruan session tanpa harus login ulang secara manual.
3. **Password Hashing**: Menggunakan `bcryptjs` dengan salt 10-12 rounds.
4. **Rate Limiting**: Membatasi jumlah request dari IP yang sama untuk mencegah serangan Brute Force.
5. **Security Headers**: Menggunakan `helmet` untuk mengamankan HTTP headers.

---

## 🤝 Kontribusi
Kontribusi selalu terbuka! Jika Anda ingin meningkatkan proyek ini:
1. Fork Repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/FiturHebat`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur hebat'`).
4. Push ke branch tersebut (`git push origin fitur/FiturHebat`).
5. Buat Pull Request.

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---
Dikembangkan dengan ❤️ oleh Tim CashierNova.
