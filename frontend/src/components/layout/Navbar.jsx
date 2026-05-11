import { Bell, Menu, Sun, Moon, Keyboard, Check, CheckCircle2, Trash2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import useNotificationStore from '../../store/notificationStore';
import { useState, useRef, useEffect } from 'react';
import formatDate from '../../utils/formatDate';

const Navbar = ({ title, onMobileMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotificationStore();
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300 ease-in-out">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-text-secondary dark:text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-text-primary dark:text-gray-100">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 relative">
          {/* Keyboard shortcut hint - desktop only */}
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="hidden lg:flex relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            aria-label="Keyboard shortcuts"
            title="Keyboard Shortcuts"
          >
            <Keyboard size={18} className="text-text-secondary dark:text-gray-400" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} className="text-text-secondary" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) {
                  markAllAsRead();
                }
              }}
              className={`relative p-2 rounded-lg transition-colors ${
                showNotifications ? 'bg-gray-100 dark:bg-dark-700' : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
              aria-label="Notifications"
            >
              <Bell size={20} className="text-text-secondary dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-dark-800" />
              )}
            </button>

            {/* Notifications Popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-modal border border-gray-100 dark:border-dark-700 overflow-hidden animate-scale-in origin-top-right z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-700">
                  <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">Notifikasi</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-xs text-text-secondary hover:text-danger dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Bersihkan
                    </button>
                  )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-text-secondary dark:text-gray-500">
                      <Bell size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Belum ada notifikasi</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 dark:divide-dark-700/50">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary dark:text-gray-200">
                                {notif.title}
                              </p>
                              <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                {formatDate(notif.timestamp, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-3 ml-1 pl-2 border-l border-gray-100 dark:border-dark-700">
            <div className="w-8 h-8 bg-primary/15 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary dark:text-gray-100 leading-tight">{user?.name}</p>
              <p className="text-xs text-text-secondary dark:text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-dark-800 rounded-xl shadow-modal p-6 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
              <Keyboard size={20} className="text-primary" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {[
                ['F1', 'Fokus pencarian produk'],
                ['F2', 'Buka pembayaran'],
                ['F4', 'Tahan transaksi'],
                ['F5', 'Panggil transaksi'],
                ['F8', 'Kosongkan keranjang'],
                ['F9', 'Buka diskon total'],
                ['Esc', 'Tutup modal / batal'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-text-secondary dark:text-gray-400">{desc}</span>
                  <kbd className="px-2.5 py-1 bg-gray-100 dark:bg-dark-700 rounded-md text-xs font-mono font-semibold text-text-primary dark:text-gray-300 border border-gray-200 dark:border-dark-600">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="btn-secondary w-full mt-4"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
