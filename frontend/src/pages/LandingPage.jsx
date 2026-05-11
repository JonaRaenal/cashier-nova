import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, Search, Menu, X, ArrowRight, Star, 
  Minus, Plus, Trash2, Package, UserCircle, ChevronRight,
  Leaf, ShieldCheck, Truck, Clock
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.backgroundColor = '#ffffff';
    document.documentElement.style.color = '#1f2937';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.color = '';
    }
  }, []);

  const cartItems = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const openCart = useCartStore((state) => state.openCart);
  const addItem = useCartStore((state) => state.addItem);
  const getCartCount = useCartStore((state) => state.getCartCount);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCheckoutWA = () => {
    if (cartItems.length === 0) return;
    let message = 'Halo, saya ingin memesan pesanan berikut via CashierNova:\n\n';
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n   ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\n*Total Belanja: ${formatCurrency(getCartTotal())}*\n\nMohon informasi pembayarannya. Terima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Leaf size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                Cashier<span className="text-emerald-500">Nova</span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all duration-300"
              >
                <UserCircle size={20} />
                Admin
              </button>
              
              <button 
                onClick={toggleCart}
                className="relative p-3 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all duration-300 group"
              >
                <ShoppingCart size={22} className="transition-transform group-hover:scale-110" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="bg-emerald-50/50 rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden border border-emerald-100/50">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-600 font-bold text-sm mb-6 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                100% Produk Original & Segar
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                Belanja Pintar, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Hidup Lebih Sehat.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                CashierNova menghadirkan ribuan produk berkualitas langsung ke pintu Anda. Nikmati kemudahan berbelanja dengan pengalaman modern.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all hover:gap-4 shadow-xl shadow-emerald-200"
                >
                  Mulai Belanja <ArrowRight size={20} />
                </button>
                <div className="flex items-center gap-4 ml-2">
                  <div className="flex -space-x-3">
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                    <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                  </div>
                  <div className="text-sm font-semibold text-slate-600">
                    <span className="text-emerald-600 font-bold">50k+</span> Pelanggan<br/>Setia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4">
              <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">Kualitas Terjamin</h3>
                <p className="text-slate-500 text-sm">Semua produk melewati quality control yang ketat.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">Pengiriman Cepat</h3>
                <p className="text-slate-500 text-sm">Dikirim langsung ke depan pintu Anda dengan aman.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">Layanan 24/7</h3>
                <p className="text-slate-500 text-sm">Siap melayani pesanan Anda kapan saja.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="py-20 px-4" id="products">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Produk Terpopuler</h2>
              <p className="text-slate-500 text-lg mb-6 lg:mb-0">Pilihan terbaik dari pelanggan kami minggu ini.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative group w-full sm:w-80 flex-shrink-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk..." 
                  className="w-full bg-white border border-gray-200 focus:border-emerald-500 rounded-full py-2.5 pl-11 pr-4 text-slate-700 font-medium placeholder-gray-400 outline-none transition-all duration-300 shadow-sm focus:shadow-emerald-100/50"
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full font-semibold text-sm whitespace-nowrap">Semua</button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 rounded-full font-semibold text-sm transition-colors whitespace-nowrap">Sayuran</button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 rounded-full font-semibold text-sm transition-colors whitespace-nowrap">Buah</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700">Produk tidak ditemukan</h3>
              <p className="text-slate-500 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group flex flex-col h-full relative">
                  
                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      Sisa {product.stock}!
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      Habis
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden group-hover:bg-emerald-50/50 transition-colors">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" 
                      />
                    ) : (
                      <Package size={60} className="text-gray-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs text-slate-400 ml-1">(4.9)</span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-4">Stok: <span className="font-medium text-slate-600">{product.stock}</span></p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="font-black text-xl text-emerald-600">
                        {formatCurrency(product.price)}
                      </span>
                      
                      <button 
                        onClick={() => {
                          addItem(product);
                          openCart();
                        }}
                        disabled={product.stock <= 0}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CART DRAWER OVERLAY --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeCart}
          />
          
          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slideInRight">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Keranjang Belanja</h2>
                  <p className="text-sm text-slate-500">{getCartCount()} Item terpilih</p>
                </div>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingCart size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Keranjang Kosong</h3>
                  <p className="text-slate-500 mb-8 max-w-[250px]">Belum ada produk yang dipilih. Silakan pilih produk terlebih dahulu.</p>
                  <button 
                    onClick={closeCart}
                    className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100 p-2">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />
                        ) : (
                          <Package size={32} className="text-gray-300" />
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex justify-between items-start pr-6">
                          <h4 className="font-bold text-slate-800 line-clamp-2 text-sm leading-snug">{item.name}</h4>
                        </div>
                        <div className="font-black text-emerald-600 mt-1">{formatCurrency(item.price)}</div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 bg-white text-slate-600 rounded-md shadow-sm flex items-center justify-center hover:text-emerald-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-8 text-center text-slate-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 bg-white text-slate-600 rounded-md shadow-sm flex items-center justify-center hover:text-emerald-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white border-t border-gray-100 p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-700">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <span className="text-slate-500 font-medium">Pengiriman</span>
                  <span className="font-bold text-emerald-500">Gratis</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-800 font-bold text-lg">Total Pembayaran</span>
                  <span className="text-2xl font-black text-emerald-600">{formatCurrency(getCartTotal())}</span>
                </div>
                
                <button 
                  onClick={handleCheckoutWA}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Checkout via WhatsApp
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Leaf size={18} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black text-slate-800">
                  Cashier<span className="text-emerald-500">Nova</span>
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm mb-6">
                Platform Kasir Pintar (POS) & Toko Online modern untuk memudahkan bisnis ritel Anda mengelola produk dan melayani pelanggan dengan cepat.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 text-lg">Pintasan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Beranda</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Kategori Produk</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Promo Mingguan</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Tentang Kami</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-6 text-lg">Bantuan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Cara Pemesanan</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Pengiriman</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Hubungi Kami</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} CashierNova by JonaRaenal. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 rounded-full flex items-center justify-center transition-all">
                IG
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 rounded-full flex items-center justify-center transition-all">
                WA
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
