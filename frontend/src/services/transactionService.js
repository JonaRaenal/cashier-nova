// ============================================
// CashierNova — Transaction Service
// API calls untuk transaksi dan dashboard
// Dependencies: api.js
// ============================================

import api from './api';

const transactionService = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),

  // Dashboard
  getDashboardSummary: () => api.get('/dashboard/summary'),
  getDashboardChart: (range = 7) => api.get('/dashboard/chart', { params: { range } }),
};

export default transactionService;
