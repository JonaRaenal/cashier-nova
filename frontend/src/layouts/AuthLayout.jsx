// ============================================
// CashierNova — Auth Layout
// Layout halaman login dengan branding
// Dependencies: react-router-dom
// ============================================

import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import CountUp from '../components/shared/CountUp';

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Auto redirect jika sudah login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Panel kiri — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark-900 to-dark-900" />
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <img src="/logo.svg" alt="CashierNova Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">CashierNova</h1>
          <p className="text-lg text-gray-400 max-w-md">
            Sistem Point of Sale modern yang cepat, aman, dan mudah digunakan untuk bisnis Anda.
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                <CountUp end={99.9} decimals={1} suffix="%" />
              </p>
              <p className="text-sm">Uptime</p>
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                <CountUp end={1.2} decimals={1} suffix="k+" />
              </p>
              <p className="text-sm">Transactions</p>
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                <CountUp end={100} suffix="%" />
              </p>
              <p className="text-sm">Security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
