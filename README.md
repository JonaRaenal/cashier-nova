Tentu, saya mengerti. Berikut adalah versi yang lebih formal, bersih, dan profesional tanpa penggunaan ikon atau emoji, cocok untuk dokumentasi teknis standar.

CashierNova POS
Sistem Point of Sale Full-Stack Modern

CashierNova adalah sistem manajemen penjualan (Point of Sale) yang dirancang untuk efisiensi dan kemudahan implementasi. Sistem ini menggunakan database embedded SQLite, sehingga tidak memerlukan instalasi database server eksternal seperti MySQL atau XAMPP.

Fitur Utama
Dashboard: Visualisasi ringkasan penjualan, grafik interaktif, dan pemantauan transaksi terbaru.

Kasir: Antarmuka Point of Sale dua kolom (Katalog dan Keranjang) dengan sistem kalkulasi kembalian otomatis dan cetak struk.

Manajemen Produk: Pengelolaan data barang (CRUD) lengkap dengan fitur pencarian, kategori, dan indikator stok kritis.

Laporan Transaksi: Riwayat penjualan yang dapat difilter berdasarkan rentang tanggal dan mendukung ekspor data ke format CSV.

Manajemen Pengguna: Pengaturan akun dengan tingkatan akses yang berbeda (Admin dan Kasir).

Keamanan: Implementasi sistem autentikasi menggunakan JSON Web Token (JWT) dengan Access dan Refresh Token.

Teknologi
Frontend: React 18, Vite, Tailwind CSS v3, Zustand (State Management).

Backend: Node.js 20, Express.js.

Database: SQLite (via sql.js - pure JavaScript implementation).

Keamanan: JWT, Bcryptjs, Helmet (Security Headers).

Instruksi Instalasi dan Penggunaan
Proyek ini menggunakan database SQLite yang akan secara otomatis terinisialisasi pada saat backend dijalankan untuk pertama kali.

Persyaratan Sistem
Node.js (Minimal versi 18, disarankan versi 20 ke atas).

Langkah 1: Konfigurasi Backend
Buka terminal dan arahkan ke direktori backend:

Bash
cd backend
Instalasi dependensi:

Bash
npm install
Jalankan server backend:

Bash
npm run dev

*Catatan: Server akan berjalan pada http://localhost:5000. Sistem akan otomatis membuat file database pada direktori backend/database/cashiernova.db.*

### Langkah 2: Konfigurasi Frontend

1.  Buka terminal baru dan arahkan ke direktori frontend:
    ```bash
    cd frontend
    ```
2.  Instalasi dependensi:
    ```bash
    npm install
    ```
3.  Jalankan aplikasi frontend:
    ```bash
    npm run dev
    ```
*Catatan: Aplikasi web dapat diakses melalui browser pada alamat http://localhost:5173.*

---

## Kredensial Akun Demo

| Peran | Email | Kata Sandi |
| :--- | :--- | :--- |
| Administrator (Akses Penuh) | admin@cashiernova.com | admin123 |
| Kasir (Akses Terbatas) | kasir@cashiernova.com | kasir123 |

---

## Struktur Proyek
```text
cashier-nova/
├── backend/                  # API Server dan Database
│   ├── database/             # Lokasi penyimpanan file .db
│   ├── src/
│   │   ├── config/           # Konfigurasi database dan inisialisasi
│   │   ├── controllers/      # Logika aplikasi (Auth, Transaksi, dll)
│   │   ├── models/           # Definisi skema dan operasi database
│   │   └── routes/           # Definisi endpoint API
│   └── server.js             # Entry point aplikasi backend
│
├── frontend/                 # Application Interface (React)
│   ├── src/
│   │   ├── components/       # Komponen UI modular
│   │   ├── pages/            # View/Halaman utama aplikasi
│   │   ├── services/         # Integrasi API (Axios configuration)
│   │   └── store/            # State management menggunakan Zustand
│   └── vite.config.js        # Konfigurasi Build dan Proxy