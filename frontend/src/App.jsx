import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/themeStore';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cashier = lazy(() => import('./pages/Cashier'));
const Products = lazy(() => import('./pages/Products'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Users = lazy(() => import('./pages/Users'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Toast Notifications — theme-aware */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1e2235' : '#1a1f2e',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none',
          },
          success: {
            iconTheme: { primary: '#2dd8a3', secondary: theme === 'dark' ? '#1e2235' : '#1a1f2e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <ErrorBoundary>
        <Routes>
          {/* Auth Routes (Public) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            } />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* Semua role */}
              <Route path="/dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary message="Dashboard mengalami error.">
                    <Dashboard />
                  </ErrorBoundary>
                </Suspense>
              } />
              <Route path="/cashier" element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary message="Halaman kasir mengalami error.">
                    <Cashier />
                  </ErrorBoundary>
                </Suspense>
              } />
              <Route path="/transactions" element={
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary message="Halaman transaksi mengalami error.">
                    <Transactions />
                  </ErrorBoundary>
                </Suspense>
              } />

              {/* Admin only */}
              <Route element={<RoleRoute roles={['admin']} />}>
                <Route path="/products" element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary message="Halaman produk mengalami error.">
                      <Products />
                    </ErrorBoundary>
                  </Suspense>
                } />
                <Route path="/users" element={
                  <Suspense fallback={<PageLoader />}>
                    <ErrorBoundary message="Halaman pengguna mengalami error.">
                      <Users />
                    </ErrorBoundary>
                  </Suspense>
                } />
              </Route>
            </Route>
          </Route>

          {/* Default redirect to landing page */}
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
