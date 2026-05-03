// ============================================
// CashierNova — Private Route Guard
// Redirect ke /login jika belum autentikasi
// Dependencies: react-router-dom, authStore
// ============================================

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
