const transactionModel = require('../models/transactionModel');
const productModel = require('../models/productModel');
const { createTransactionSchema } = require('../validators/transactionValidator');
const { success, error } = require('../utils/response');

const transactionController = {
  create: async (req, res, next) => {
    try {
      // 1. Validasi input menggunakan Zod
      const validation = createTransactionSchema.safeParse(req.body);
      
      if (!validation.success) {
        const formattedErrors = validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return error(res, 'Validasi gagal. Periksa kembali input Anda.', 422, formattedErrors);
      }

      const { items, payment_amount, payment_method, notes, tax_rate } = validation.data;

      // 2. Ambil harga produk dari database & Verifikasi stok
      let totalAmount = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await productModel.findById(item.product_id);
        
        if (!product) {
          return error(res, `Produk dengan ID ${item.product_id} tidak ditemukan.`, 404);
        }

        if (product.stock < item.quantity) {
          return error(res, `Stok produk '${product.name}' tidak mencukupi (Tersedia: ${product.stock}).`, 400);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        processedItems.push({
          product_id: item.product_id,
          product_name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });
      }

      const taxAmount = totalAmount * (tax_rate / 100);
      const grandTotal = totalAmount + taxAmount;

      if (payment_amount < grandTotal) {
        return error(res, `Jumlah pembayaran (Rp${payment_amount.toLocaleString()}) kurang dari total belanja (Rp${grandTotal.toLocaleString()}).`, 400);
      }

      const changeAmount = payment_amount - grandTotal;

      // 3. Generate invoice number
      const invoiceNumber = await transactionModel.generateInvoiceNumber();

      // 4. Buat transaksi (atomic)
      const transaction = await transactionModel.create(
        {
          invoice_number: invoiceNumber,
          user_id: req.user.id,
          total_amount: totalAmount,
          tax_amount: taxAmount,
          grand_total: grandTotal,
          payment_amount: payment_amount,
          change_amount: changeAmount,
          payment_method: payment_method,
          notes: notes || null,
        },
        processedItems
      );

      return success(res, 'Transaksi berhasil dibuat.', transaction, 201);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { startDate, endDate, page, limit } = req.query;
      const result = await transactionModel.findAll({ startDate, endDate, page, limit });

      return success(res, 'Daftar transaksi berhasil diambil.', result.data, 200, result.meta);
    } catch (err) {
      next(err);
    }
  },

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
