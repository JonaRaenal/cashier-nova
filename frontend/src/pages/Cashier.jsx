// ============================================
// CashierNova — Cashier Page (PRIORITAS UTAMA)
// Layout 2 kolom: produk (kiri) + keranjang (kanan)
// Termasuk search, filter, cart, pembayaran, dan struk digital
// Dependencies: productService, transactionService, cartStore
// ============================================

import { useState, useEffect, useMemo } from 'react';
import {
  Search, ShoppingBag, Plus, Minus, Trash2,
  CreditCard, Printer, RotateCcw, Check,
  Package, Zap,
} from 'lucide-react';
import productService from '../services/productService';
import transactionService from '../services/transactionService';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useDebounce from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const TAX_RATE = Number(import.meta.env.VITE_TAX_RATE) || 11;

const Cashier = () => {
  const user = useAuthStore((state) => state.user);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Tab aktif — hanya berlaku di mobile
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'cart'

  const { items, addItem, removeItem, updateQty, clearCart, getTotal, getItemCount } = useCartStore();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll({ limit: 100, search: debouncedSearch, category: activeCategory }),
          productService.getCategories(),
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        toast.error('Gagal memuat produk');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [debouncedSearch, activeCategory]);

  const subtotal = getTotal();
  const taxAmount = subtotal * (TAX_RATE / 100);
  const grandTotal = subtotal + taxAmount;
  const changeAmount = Number(paymentAmount) - grandTotal;

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Stok produk habis!');
      return;
    }
    addItem(product);
    toast.success(`${product.name} ditambahkan`, { duration: 1500, position: 'bottom-right' });
  };

  const handleProcessTransaction = async () => {
    if (items.length === 0) { toast.error('Keranjang kosong!'); return; }
    if (Number(paymentAmount) < grandTotal) { toast.error('Jumlah pembayaran kurang!'); return; }

    setProcessing(true);
    try {
      const response = await transactionService.create({
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
        payment_amount: Number(paymentAmount),
        payment_method: paymentMethod,
        tax_rate: TAX_RATE,
      });

      setReceipt(response.data.data);
      setShowPayment(false);
      setShowReceipt(true);
      clearCart();
      setPaymentAmount('');
      setActiveTab('products');
      toast.success('Transaksi berhasil!');

      const productsRes = await productService.getAll({ limit: 100 });
      setProducts(productsRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses transaksi');
    } finally {
      setProcessing(false);
    }
  };

  const quickAmounts = useMemo(() => {
    const base = Math.ceil(grandTotal / 10000) * 10000;
    return [base, base + 10000, base + 20000, base + 50000].filter((v) => v >= grandTotal);
  }, [grandTotal]);

  // ======== PANEL PRODUK ========
  const ProductPanel = (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Search & Filter */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              !activeCategory ? 'bg-primary text-dark-900' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id ? 'bg-primary text-dark-900' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loadingProducts ? (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <Package size={40} className="mb-2 opacity-40" />
            <p className="text-sm">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className={`card text-left p-3 hover:shadow-card-hover transition-all duration-200 group relative ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
                }`}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/200?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </div>
                <h3 className="text-sm font-medium text-text-primary truncate">{product.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{product.category_name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-bold text-primary">{formatCurrency(product.price)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.stock <= 0 ? 'bg-red-50 text-red-600'
                    : product.stock <= 5 ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {product.stock <= 0 ? 'Habis' : product.stock <= 5 ? `Sisa ${product.stock}` : `Stok ${product.stock}`}
                  </span>
                </div>
                {product.stock > 0 && (
                  <div className="absolute inset-0 bg-primary/5 rounded-card opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-primary text-dark-900 rounded-full p-2">
                      <Plus size={20} />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ======== PANEL KERANJANG ========
  const CartPanel = (
    <div className="w-full lg:w-[380px] bg-white border-l border-gray-100 flex flex-col h-full">
      {/* Cart header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-semibold text-text-primary">Keranjang</h2>
            {items.length > 0 && (
              <span className="bg-primary text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {getItemCount()}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-xs text-text-secondary hover:text-danger transition-colors">
              Kosongkan
            </button>
          )}
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <ShoppingBag size={36} className="mb-2 opacity-30" />
            <p className="text-sm">Keranjang kosong</p>
            <p className="text-xs mt-1">Klik produk untuk menambahkan</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product_id} className="flex gap-3 p-3 bg-gray-50 rounded-xl animate-slide-in">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/48'}
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-text-primary truncate">{item.product_name}</h4>
                <p className="text-xs text-text-secondary">{formatCurrency(item.price)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => item.quantity <= 1 ? removeItem(item.product_id) : updateQty(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{formatCurrency(item.subtotal)}</p>
                    <button onClick={() => removeItem(item.product_id)} className="p-1 text-gray-400 hover:text-danger transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary & Checkout */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Pajak ({TAX_RATE}%)</span><span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-text-primary pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <CreditCard size={18} />
            Bayar Sekarang
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in -m-4 md:-m-6">

      {/* ======== MOBILE/TABLET: Tab Bar ======== */}
      <div className="flex lg:hidden border-b border-gray-100 bg-white sticky top-16 z-20">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary'
          }`}
        >
          Produk
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'cart'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary'
          }`}
        >
          Keranjang
          {getItemCount() > 0 && (
            <span className="bg-primary text-dark-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {getItemCount()}
            </span>
          )}
        </button>
      </div>

      {/* ======== MOBILE/TABLET: Konten Tab ======== */}
      <div className="lg:hidden flex flex-col" style={{ height: 'calc(100vh - 112px)' }}>
        {activeTab === 'products' ? ProductPanel : CartPanel}
      </div>

      {/* Floating cart button di mobile — shortcut pindah ke tab keranjang */}
      {activeTab === 'products' && getItemCount() > 0 && (
        <button
          onClick={() => setActiveTab('cart')}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-primary text-dark-900 rounded-full px-5 py-3 flex items-center gap-2 shadow-lg font-medium text-sm"
        >
          <ShoppingBag size={18} />
          {getItemCount()} item · {formatCurrency(grandTotal)}
        </button>
      )}

      {/* ======== DESKTOP: 2 Kolom ======== */}
      <div className="hidden lg:flex" style={{ height: 'calc(100vh - 64px)' }}>
        {ProductPanel}
        {CartPanel}
      </div>

      {/* ======== MODAL PEMBAYARAN ======== */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Pembayaran" size="md">
        <div className="space-y-5">
          <div className="text-center p-4 bg-primary/5 rounded-xl">
            <p className="text-sm text-text-secondary">Total Pembayaran</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(grandTotal)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-4 gap-2">
              {['cash', 'debit', 'credit', 'qris'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                    paymentMethod === method
                      ? 'bg-primary text-dark-900 ring-2 ring-primary/30'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {method === 'qris' ? 'QRIS' : method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Nominal Bayar</label>
            <input
              type="number"
              placeholder="Masukkan nominal"
              className="input-field text-lg font-semibold"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={() => setPaymentAmount(String(grandTotal))}
                className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
              >
                Uang Pas
              </button>
              {quickAmounts.slice(0, 3).map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPaymentAmount(String(amount))}
                  className="px-3 py-1.5 bg-gray-100 text-text-secondary text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          {Number(paymentAmount) > 0 && (
            <div className={`p-3 rounded-lg ${changeAmount >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${changeAmount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {changeAmount >= 0 ? 'Kembalian' : 'Kekurangan'}
                </span>
                <span className={`text-lg font-bold ${changeAmount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(Math.abs(changeAmount))}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleProcessTransaction}
            disabled={processing || Number(paymentAmount) < grandTotal}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {processing ? <LoadingSpinner size="sm" /> : <><Check size={18} />Proses Transaksi</>}
          </button>
        </div>
      </Modal>

      {/* ======== MODAL STRUK ======== */}
      <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)} title="Struk Transaksi" size="sm">
        {receipt && (
          <div className="receipt-print">
            <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text-primary">CashierNova</h3>
              </div>
              <p className="text-xs text-text-secondary">Jl. Contoh No. 123, Jakarta</p>
              <p className="text-xs text-text-secondary">Telp: (021) 1234-5678</p>
            </div>

            <div className="space-y-1 text-xs text-text-secondary mb-4">
              <div className="flex justify-between">
                <span>No. Invoice</span>
                <span className="font-medium text-text-primary">{receipt.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span><span>{formatDate(new Date())}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir</span><span>{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Metode</span><span className="capitalize">{receipt.payment_method}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 mb-3">
              {receipt.items?.map((item, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm font-medium text-text-primary">{item.product_name}</p>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                    <span className="font-medium text-text-primary">{formatCurrency(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span><span>{formatCurrency(receipt.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Pajak</span><span>{formatCurrency(receipt.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-text-primary pt-1">
                <span>Total</span><span>{formatCurrency(receipt.grand_total)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Bayar</span><span>{formatCurrency(receipt.payment_amount)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-primary">
                <span>Kembalian</span><span>{formatCurrency(receipt.change_amount)}</span>
              </div>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-dashed border-gray-300">
              <p className="text-xs text-text-secondary">Terima kasih atas kunjungan Anda!</p>
              <p className="text-xs text-text-secondary mt-0.5">Barang yang sudah dibeli tidak dapat dikembalikan</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6 pb-2">
          <button onClick={() => window.print()} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Printer size={16} />Print Struk
          </button>
          <button
            onClick={() => { setShowReceipt(false); setReceipt(null); }}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />Transaksi Baru
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cashier;
