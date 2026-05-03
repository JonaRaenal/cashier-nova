// ============================================
// CashierNova — Role Route Guard
// Redirect ke /dashboard jika bukan role yang sesuai
// Dependencies: react-router-dom, authStore
// ============================================

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleRoute = ({ roles = [] }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
