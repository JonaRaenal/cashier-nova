# CashierNova — Sistem POS Modern

Sistem Point of Sale (POS) full-stack modern yang production-ready dengan arsitektur profesional.

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS v3             |
| Backend    | Node.js 20 + Express.js 4                     |
| Database   | MySQL 8                                       |
| Auth       | JWT (Access Token 15m + Refresh Token 7d)     |
| HTTP       | Axios (dengan interceptor)                    |
| State      | Zustand                                       |
| Validasi   | express-validator (BE) + React Hook Form + Zod (FE) |

## Fitur Utama

- **Dashboard** — Ringkasan penjualan, grafik, transaksi terbaru
- **Kasir** — POS 2 kolom dengan keranjang, pembayaran, struk digital
- **Produk** — CRUD dengan search, filter, pagination, badge stok
- **Transaksi** — Riwayat dengan filter tanggal, detail, export CSV
- **Pengguna** — Manajemen user dengan role (admin/kasir)
- **Auth** — Login/logout, JWT refresh otomatis, rate limiting

## Quick Start

### 1. Database

```sql
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env  # Sesuaikan konfigurasi DB
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Login

- **URL**: http://localhost:5173
- **Email**: admin@cashiernova.com
- **Password**: admin123

## Struktur Project

```
cashier-nova/
├── backend/
│   ├── database/schema.sql
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── config/       (db.js, env.js)
│       ├── controllers/  (auth, product, category, transaction, user, dashboard)
│       ├── models/       (user, product, category, transaction)
│       ├── routes/       (index + semua route files)
│       ├── middlewares/  (auth, role, validate, errorHandler)
│       ├── validators/   (auth, product, user)
│       └── utils/        (response, logger)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/   (ui, layout, shared)
│       ├── pages/        (Login, Dashboard, Cashier, Products, Transactions, Users)
│       ├── layouts/      (AuthLayout, MainLayout)
│       ├── services/     (api, auth, product, transaction, user)
│       ├── store/        (authStore, cartStore)
│       ├── hooks/        (useAuth, useDebounce)
│       ├── utils/        (formatCurrency, formatDate)
│       ├── routes/       (PrivateRoute, RoleRoute)
│       └── constants/    (roles)
```

## API Endpoints

| Method | Endpoint                        | Auth  | Role  |
|--------|---------------------------------|-------|-------|
| POST   | /api/auth/login                 | -     | -     |
| POST   | /api/auth/logout                | ✅    | -     |
| POST   | /api/auth/refresh-token         | -     | -     |
| GET    | /api/products                   | ✅    | -     |
| POST   | /api/products                   | ✅    | admin |
| PUT    | /api/products/:id               | ✅    | admin |
| DELETE | /api/products/:id               | ✅    | admin |
| PATCH  | /api/products/:id/stock         | ✅    | admin |
| GET    | /api/categories                 | ✅    | -     |
| POST   | /api/categories                 | ✅    | admin |
| PUT    | /api/categories/:id             | ✅    | admin |
| DELETE | /api/categories/:id             | ✅    | admin |
| POST   | /api/transactions               | ✅    | -     |
| GET    | /api/transactions               | ✅    | -     |
| GET    | /api/transactions/:id           | ✅    | -     |
| GET    | /api/users                      | ✅    | admin |
| POST   | /api/users                      | ✅    | admin |
| PUT    | /api/users/:id                  | ✅    | admin |
| DELETE | /api/users/:id                  | ✅    | admin |
| GET    | /api/dashboard/summary          | ✅    | -     |
| GET    | /api/dashboard/chart?range=7    | ✅    | -     |

## Design System

- **Primary**: `#2dd8a3`
- **Dark**: `#1a1f2e`
- **Font**: Poppins (400, 500, 600, 700)
- **Border Radius**: Card 8px, Input 6px, Badge 999px
