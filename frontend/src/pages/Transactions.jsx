// ============================================
// CashierNova — Transactions Page
// Riwayat transaksi dengan filter tanggal dan detail modal
// Dependencies: transactionService, lucide-react
// ============================================

import { useState, useEffect } from 'react';
import { Receipt, Eye, Download } from 'lucide-react';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';
import Modal from '../components/ui/Modal';
import Pagination from '../components/shared/Pagination';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getAll({ startDate, endDate, page, limit: 10 });
      setTransactions(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [page, startDate, endDate]);

  const viewDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await transactionService.getById(id);
      setSelectedTx(res.data.data);
    } catch (err) {
      toast.error('Gagal memuat detail transaksi');
    } finally {
      setLoadingDetail(false);
    }
  };

  const exportCSV = () => {
    if (transactions.length === 0) { toast.error('Tidak ada data'); return; }

    const now = new Date();
    const exportDate = formatDate(now);

    // Header info
    const infoRows = [
      ['CashierNova — Laporan Transaksi'],
      [`Diekspor pada: ${exportDate}`],
      [`Filter: ${startDate && endDate ? `${startDate} s/d ${endDate}` : startDate ? `Dari ${startDate}` : endDate ? `Sampai ${endDate}` : 'Semua tanggal'}`],
      [`Total data: ${meta.total} transaksi`],
      [''],
    ];

    // Header kolom
    const headers = ['No', 'Invoice', 'Kasir', 'Total', 'Dibayar', 'Kembalian', 'Metode', 'Tanggal'];

    // Rows data
    const rows = transactions.map((tx, i) => [
      i + 1,
      tx.invoice_number,
      tx.cashier_name,
      formatCurrency(tx.grand_total),
      formatCurrency(tx.payment_amount),
      formatCurrency(tx.change_amount),
      tx.payment_method.toUpperCase(),
      formatDate(tx.created_at),
    ]);

    // Baris total
    const totalRow = [
      '',
      '',
      'TOTAL',
      formatCurrency(transactions.reduce((sum, tx) => sum + Number(tx.grand_total), 0)),
      '',
      '',
      '',
      '',
    ];

    // Gabungkan semua
    const allRows = [
      ...infoRows,
      headers,
      ...rows,
      [''],
      totalRow,
    ];

    // Konversi ke CSV dengan tab sebagai separator biar rapi di Excel/spreadsheet
    const csv = '\uFEFF' + allRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi-cashiernova-${now.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV berhasil diunduh');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Riwayat Transaksi</h1>
          <p className="text-text-secondary dark:text-gray-400 mt-1">Lihat seluruh riwayat transaksi penjualan</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-medium text-text-secondary dark:text-gray-400 mb-1">Dari Tanggal</label>
            <input type="date" className="input-field" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
          </div>
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-medium text-text-secondary dark:text-gray-400 mb-1">Sampai Tanggal</label>
            <input type="date" className="input-field" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
          </div>
          {(startDate || endDate) && (
            <button onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }} className="btn-ghost text-sm">Reset</button>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary dark:text-gray-500">
            <Receipt size={48} className="opacity-30 mb-3" /><p>Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Invoice</th>
                  <th className="table-header hidden sm:table-cell">Kasir</th>
                  <th className="table-header">Total</th>
                  <th className="table-header hidden md:table-cell">Bayar</th>
                  <th className="table-header hidden sm:table-cell">Metode</th>
                  <th className="table-header hidden md:table-cell">Tanggal</th>
                  <th className="table-header text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors cursor-pointer" onClick={() => viewDetail(tx.id)}>
                    <td className="table-cell font-medium text-primary">{tx.invoice_number}</td>
                    <td className="table-cell text-text-secondary hidden sm:table-cell">{tx.cashier_name}</td>
                    <td className="table-cell font-medium">{formatCurrency(tx.grand_total)}</td>
                    <td className="table-cell hidden md:table-cell">{formatCurrency(tx.payment_amount)}</td>
                    <td className="table-cell hidden sm:table-cell">
                      <span className="badge bg-gray-100 text-text-secondary capitalize">{tx.payment_method}</span>
                    </td>
                    <td className="table-cell text-text-secondary text-sm hidden md:table-cell">{formatDate(tx.created_at)}</td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost p-2" onClick={(e) => { e.stopPropagation(); viewDetail(tx.id); }}>
                        <Eye size={15} className="text-text-secondary dark:text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 gap-2">
            <p className="text-sm text-text-secondary">Halaman {meta.page} dari {meta.totalPages} ({meta.total} transaksi)</p>
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title={`Detail ${selectedTx?.invoice_number || ''}`} size="md">
        {loadingDetail ? (
          <div className="flex items-center justify-center py-10"><LoadingSpinner size="lg" /></div>
        ) : selectedTx && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-text-secondary dark:text-gray-400">Kasir</p><p className="font-medium">{selectedTx.cashier_name}</p></div>
              <div><p className="text-text-secondary dark:text-gray-400">Tanggal</p><p className="font-medium">{formatDate(selectedTx.created_at)}</p></div>
              <div><p className="text-text-secondary dark:text-gray-400">Metode</p><p className="font-medium capitalize">{selectedTx.payment_method}</p></div>
              <div><p className="text-text-secondary dark:text-gray-400">Status</p><span className="badge-success">Selesai</span></div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold mb-3">Item Transaksi</h3>
              {selectedTx.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium dark:text-gray-400">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary dark:text-gray-400"><span>Subtotal</span><span>{formatCurrency(selectedTx.total_amount)}</span></div>
              <div className="flex justify-between text-text-secondary dark:text-gray-400"><span>Pajak</span><span>{formatCurrency(selectedTx.tax_amount)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Grand Total</span><span className="text-primary">{formatCurrency(selectedTx.grand_total)}</span></div>
              <div className="flex justify-between text-text-secondary dark:text-gray-400"><span>Dibayar</span><span>{formatCurrency(selectedTx.payment_amount)}</span></div>
              <div className="flex justify-between font-medium text-emerald-600 dark:text-emerald-400"><span>Kembalian</span><span>{formatCurrency(selectedTx.change_amount)}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
