// ============================================
// CashierNova — Login Page
// Form login dengan validasi React Hook Form + Zod
// Dependencies: react-hook-form, zod, authStore
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Skema validasi Zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal 6 karakter.'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Handler submit
  const onSubmit = async (data) => {
    setApiError('');
    const result = await login(data);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="animate-slide-in">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Zap size={22} className="text-dark-900" />
        </div>
        <span className="text-xl font-bold text-white">CashierNova</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang 👋</h2>
        <p className="text-gray-400 mb-8">Masuk ke akun Anda untuk melanjutkan</p>
      </div>

      {/* Error dari API */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-slide-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input
            id="input-email"
            type="email"
            placeholder="nama@email.com"
            className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
              errors.email ? 'border-red-500' : 'border-white/10 focus:border-primary'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
          <div className="relative">
            <input
              id="input-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              className={`w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                errors.password ? 'border-red-500' : 'border-white/10 focus:border-primary'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          id="btn-login"
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-dark-900 font-semibold rounded-lg hover:bg-primary-500 active:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <LogIn size={18} />
              Masuk
            </>
          )}
        </button>
      </form>

      {/* Demo credentials */}
      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs font-medium text-gray-400 mb-2">Demo Login:</p>
        <p className="text-xs text-gray-500">Email: admin@cashiernova.com</p>
        <p className="text-xs text-gray-500">Password: admin123</p>
      </div>
    </div>
  );
};

export default Login;
