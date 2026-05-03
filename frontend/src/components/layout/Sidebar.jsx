// ============================================
// CashierNova — Sidebar Component
// Navigasi utama sidebar dengan menu dan role-based visibility
// Dependencies: react-router-dom, lucide-react, authStore
// ============================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  LogOut,
  ChevronLeft,
  X,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Kasir', path: '/cashier' },
    { icon: Package, label: 'Produk', path: '/products', adminOnly: true },
    { icon: Receipt, label: 'Transaksi', path: '/transactions' },
    { icon: Users, label: 'Pengguna', path: '/users', adminOnly: true },
  ];

  const filteredMenu = menuItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-dark-900 text-white z-40 transition-all duration-300 flex flex-col
        /* Buat Mobile dan Tablet */
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} w-[260px]
        /* Buat Desktop */
        lg:translate-x-0 ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src="/logo.svg" alt="CashierNova Logo" className="w-full h-full object-contain" />
        </div>
        {/* Mobile cuma tampilin nama */}
        <span className={`text-lg font-bold tracking-tight lg:${collapsed ? 'hidden' : 'block'}`}>CashierNova</span>
        {/* Tombol close untuk mobile */}
        <button onClick={onMobileClose} className="ml-auto p-1 rounded-lg hover:bg-white/10 lg:hidden">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className={`lg:${collapsed ? 'hidden' : 'block'}`}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-white/10">
          <div className={`px-3 py-2 mb-2 lg:${collapsed ? 'hidden' : 'block'}`}>
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
            <span className={`lg:${collapsed ? 'hidden' : 'block'}`}>Keluar</span>
        </button>
      </div>

      {/* Toggle button desktop */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-dark-900 border border-white/20 rounded-full flex items-center justify-center hover:bg-dark-800 transition-colors"
      >
        <ChevronLeft
          size={14}
          className={`text-gray-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
