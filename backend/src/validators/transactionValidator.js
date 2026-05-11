const { z } = require('zod');

const createTransactionSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive("ID Produk harus berupa angka positif"),
    quantity: z.number().int().min(1, "Jumlah minimal pembelian adalah 1"),
  })).min(1, "Minimal 1 item diperlukan untuk membuat transaksi"),
  payment_amount: z.number().min(0, "Jumlah pembayaran tidak boleh negatif"),
  payment_method: z.string().optional().default('cash'),
  notes: z.string().optional(),
  tax_rate: z.number().min(0).max(100).optional().default(0),
});

module.exports = {
  createTransactionSchema
};
