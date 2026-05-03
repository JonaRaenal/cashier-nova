// ============================================
// CashierNova — App Root Component
// Routing utama aplikasi dengan route guards
// Dependencies: react-router-dom
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cashier from './pages/Cashier';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import Users from './pages/Users';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1f2e',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#2dd8a3', secondary: '#1a1f2e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* Auth Routes (Public) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* Semua role */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/transactions" element={<Transactions />} />

            {/* Admin only */}
            <Route element={<RoleRoute roles={['admin']} />}>
              <Route path="/products" element={<Products />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
