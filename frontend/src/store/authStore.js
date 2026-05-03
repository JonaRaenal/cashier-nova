// ============================================
// CashierNova — Auth Store (Zustand)
// State management untuk autentikasi
// Dependencies: zustand
// ============================================

import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  // State
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,

  // Login
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authService.login(credentials);
      const { user, access_token, refresh_token } = response.data.data;

      // Simpan ke localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Terjadi kesalahan saat login.';
      return { success: false, message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Tetap lanjutkan logout meskipun API gagal
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Update user data di store
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
