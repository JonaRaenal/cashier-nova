// ============================================
// CashierNova — Navbar Component
// Top navigation bar dengan search dan user info
// Dependencies: lucide-react
// ============================================

import { Bell, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navbar = ({ title }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary leading-tight">{user?.name}</p>
            <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
