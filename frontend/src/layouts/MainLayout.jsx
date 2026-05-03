// ============================================
// CashierNova — Main Layout
// Layout utama dengan sidebar dan navbar
// Dependencies: react-router-dom, Sidebar, Navbar
// ============================================

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

/* Buat munculin title di Navbar */
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/cashier': 'Kasir',
  '/products': 'Produk',
  '/transactions': 'Transaksi',
  '/users': 'Pengguna',
};

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'CashierNova';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={`transition-all duration-300 ml-0 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        <Navbar title={title} onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
