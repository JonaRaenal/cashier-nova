// ============================================
// CashierNova — Transaction Controller
// Handler untuk membuat dan melihat transaksi
// Dependencies: transactionModel
// ============================================

const transactionModel = require('../models/transactionModel');
const { success, error } = require('../utils/response');

const transactionController = {
  /**
   * POST /api/transactions
   * Membuat transaksi baru (atomic dengan DB transaction)
   */
  create: async (req, res, next) => {
    try {
      const { items, payment_amount, payment_method, notes, tax_rate = 0 } = req.body;

      if (!items || items.length === 0) {
        return error(res, 'Minimal 1 item diperlukan untuk membuat transaksi.', 400);
      }

      // Hitung total
      let totalAmount = 0;
      const processedItems = items.map((item) => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;
        return {
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          subtotal,
        };
      });

      const taxAmount = totalAmount * (tax_rate / 100);
      const grandTotal = totalAmount + taxAmount;

      if (payment_amount < grandTotal) {
        return error(res, 'Jumlah pembayaran kurang dari total belanja.', 400);
      }

      const changeAmount = payment_amount - grandTotal;

      // Generate invoice number
      const invoiceNumber = await transactionModel.generateInvoiceNumber();

      // Buat transaksi (atomic)
      const transaction = await transactionModel.create(
        {
          invoice_number: invoiceNumber,
          user_id: req.user.id,
          total_amount: totalAmount,
          tax_amount: taxAmount,
          grand_total: grandTotal,
          payment_amount: payment_amount,
          change_amount: changeAmount,
          payment_method: payment_method || 'cash',
          notes: notes || null,
        },
        processedItems
      );

      return success(res, 'Transaksi berhasil dibuat.', transaction, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/transactions
   * Mengambil daftar transaksi dengan filter dan pagination
   */
  getAll: async (req, res, next) => {
    try {
      const { startDate, endDate, page, limit } = req.query;
      const result = await transactionModel.findAll({ startDate, endDate, page, limit });

      return success(res, 'Daftar transaksi berhasil diambil.', result.data, 200, result.meta);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/transactions/:id
   * Mengambil detail transaksi berdasarkan ID
   */
  getById: async (req, res, next) => {
    try {
      const transaction = await transactionModel.findById(req.params.id);
      if (!transaction) {
        return error(res, 'Transaksi tidak ditemukan.', 404);
      }
      return success(res, 'Detail transaksi berhasil diambil.', transaction);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = transactionController;
