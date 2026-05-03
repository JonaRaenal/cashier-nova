// ============================================
// CashierNova — Dashboard Controller
// Handler untuk data ringkasan dan chart dashboard
// Dependencies: transactionModel, productModel
// ============================================

const transactionModel = require('../models/transactionModel');
const { pool } = require('../config/db');
const { success } = require('../utils/response');

const dashboardController = {
  /**
   * GET /api/dashboard/summary
   * Ringkasan: total penjualan hari ini, jumlah transaksi, produk aktif, stok menipis
   */
  getSummary: async (req, res, next) => {
    try {
      // Total penjualan dan transaksi hari ini
      const todaySummary = await transactionModel.getTodaySummary();

      // Jumlah produk aktif
      const [productCount] = await pool.query(
        'SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL'
      );

      // Produk dengan stok menipis (≤ 5)
      const [lowStock] = await pool.query(
        'SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND deleted_at IS NULL'
      );

      // 5 transaksi terbaru
      const recentTransactions = await transactionModel.getRecentTransactions();

      return success(res, 'Ringkasan dashboard berhasil diambil.', {
        today_sales: todaySummary.total_sales,
        today_transactions: todaySummary.total_transactions,
        active_products: productCount[0].count,
        low_stock_products: lowStock[0].count,
        recent_transactions: recentTransactions,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/dashboard/chart?range=7|30
   * Data chart penjualan per hari
   */
  getChart: async (req, res, next) => {
    try {
      const range = parseInt(req.query.range) || 7;
      const chartData = await transactionModel.getSalesChart(range);

      return success(res, 'Data chart berhasil diambil.', chartData);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dashboardController;
