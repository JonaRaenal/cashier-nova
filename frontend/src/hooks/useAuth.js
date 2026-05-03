// ============================================
// CashierNova — useAuth Hook
// Custom hook untuk akses auth store
// Dependencies: authStore
// ============================================

import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, token, isAuthenticated, loading, login, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isKasir: user?.role === 'kasir',
  };
};

export default useAuth;
