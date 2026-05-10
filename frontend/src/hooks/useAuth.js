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
