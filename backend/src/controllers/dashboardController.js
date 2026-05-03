// ============================================
// CashierNova — Dashboard Controller (sql.js)
// Handler untuk data ringkasan dan chart dashboard
// Dependencies: transactionModel, db
// ============================================

const transactionModel = require('../models/transactionModel');
const { getDb } = require('../config/db');
const { success } = require('../utils/response');

// Helper query
const queryOne = (sql, params = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
};

const dashboardController = {
  getSummary: async (req, res, next) => {
    try {
      const todaySummary = await transactionModel.getTodaySummary();
      const productCount = queryOne('SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL');
      const lowStock = queryOne('SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND deleted_at IS NULL');
      const recentTransactions = await transactionModel.getRecentTransactions();

      return success(res, 'Ringkasan dashboard berhasil diambil.', {
        today_sales: todaySummary.total_sales,
        today_transactions: todaySummary.total_transactions,
        active_products: productCount ? productCount.count : 0,
        low_stock_products: lowStock ? lowStock.count : 0,
        recent_transactions: recentTransactions,
      });
    } catch (err) {
      next(err);
    }
  },

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
