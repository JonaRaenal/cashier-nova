import React, { useEffect, useState } from 'react';
import { ShoppingCart, Info, X, User, Plus, Minus, Search, Package, ArrowRight, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency } from '../utils/formatCurrency';
import useCartStore from '../store/cartStore';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null); // For Details Modal

  const cartItems = useCartStore((state) => state.items);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const getCartCount = useCartStore((state) => state.getCartCount);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);
        
        // Extract unique categories
        const cats = new Set(fetchedProducts.map(p => p.category?.name || 'Uncategorized'));
        setCategories(['All', ...Array.from(cats)]);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (product.category?.name || 'Uncategorized') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckoutWA = () => {
    if (cartItems.length === 0) return;
    
    let message = `Halo CashierNova, saya ingin memesan:\n\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\nTotal Belanja: *${formatCurrency(getCartTotal())}*\n\nMohon informasi pembayarannya. Terima kasih!`;
    
    const waNumber = '6281234567890'; // Replace with actual WA number
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-emerald-200">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Package size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              CashierNova
            </span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk favoritmu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={openCart}
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </button>
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
              <User size={16} />
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50/50 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Bahan Segar untuk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Hidup Lebih Sehat</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Temukan berbagai macam produk segar, bahan makanan berkualitas tinggi, dan kebutuhan harian Anda. Belanja mudah, cepat, dan terpercaya bersama CashierNova.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:hidden flex-1 px-5 py-3.5 rounded-full border border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-[73px] z-30">
        <div className="container mx-auto px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedCategory === 'All' ? 'Semua Produk' : `Kategori: ${selectedCategory}`}
          </h2>
          <span className="text-slate-500 text-sm">{filteredProducts.length} produk ditemukan</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div 
                  className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={48} />
                    </div>
                  )}
                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                    Sisa: {product.stock}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-emerald-500 mb-1 tracking-wider uppercase">
                    {product.category?.name || 'Umum'}
                  </div>
                  <h3 
                    className="font-bold text-slate-800 mb-2 line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                      }}
                      disabled={product.stock <= 0}
                      className="w-10 h-10 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-600">Tidak ada produk ditemukan.</h3>
            <p className="text-gray-400">Coba ubah kata kunci pencarian atau kategori.</p>
          </div>
        )}
      </section>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
              <ShoppingCart size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Keranjang Saya</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
              <p className="text-slate-500">Keranjang Anda masih kosong.</p>
              <button 
                onClick={closeCart}
                className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-600 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-full h-full p-4 text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-tight">{item.name}</h4>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-emerald-600">{formatCurrency(item.price)}</span>
                    <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-slate-500 hover:text-emerald-600 p-1"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-500 hover:text-emerald-600 p-1"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-bold text-slate-900">{formatCurrency(getCartTotal())}</span>
            </div>
            <button 
              onClick={handleCheckoutWA}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
            >
              Checkout via WhatsApp
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all transform scale-100 opacity-100 duration-200">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                {selectedProduct.image_url ? (
                  <img 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package size={80} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">
                  Stok: {selectedProduct.stock}
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                <div className="text-xs font-semibold text-emerald-500 mb-2 uppercase tracking-wider">
                  {selectedProduct.category?.name || 'Umum'} • {selectedProduct.sku}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="text-3xl font-extrabold text-emerald-600 mb-6">
                  {formatCurrency(selectedProduct.price)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                    <Info size={16} className="text-emerald-500" />
                    Deskripsi Produk
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {selectedProduct.description || "Tidak ada deskripsi tersedia untuk produk ini."}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    addItem(selectedProduct);
                    setSelectedProduct(null);
                    openCart();
                  }}
                  disabled={selectedProduct.stock <= 0}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShoppingCart size={18} />
                  {selectedProduct.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Package size={18} />
            </div>
            <span className="text-xl font-bold text-white">
              CashierNova
            </span>
          </div>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Solusi kasir cerdas dan toko online terintegrasi untuk bisnis modern Anda.
          </p>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CashierNova. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
