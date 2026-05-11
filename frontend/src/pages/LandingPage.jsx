import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ArrowRight,
  Star,
  Minus,
  Plus,
  Trash2,
  Package,
  UserCircle,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Truck,
  Clock,
  Heart,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import useThemeStore from "../store/themeStore";
import { formatCurrency } from "../utils/formatCurrency";

// Custom Social Icons (Official Brand Colors/Shapes)
const SocialIcons = {
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Whatsapp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  Instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  TikTok: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  ),
};

const LandingPage = () => {
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const {
    items: cartItems,
    isOpen,
    toggleCart,
    closeCart,
    openCart,
    addItem,
    getCartCount,
    getCartTotal,
    updateQuantity,
    removeItem,
  } = useCartStore();

  useEffect(() => {
    initTheme();

    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get("/api/products?limit=100"),
          axios.get("/api/categories"),
        ]);
        setProducts(productRes.data.data || []);
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initTheme]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCheckoutWA = () => {
    if (cartItems.length === 0) return;
    let message = "Halo, saya ingin memesan produk berikut:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n   ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\nSubtotal: ${formatCurrency(getCartTotal())}`;
    message += `\nPPN (11%): ${formatCurrency(getCartTotal() * 0.11)}`;
    message += `\n*Total Akhir: ${formatCurrency(getCartTotal() * 1.11)}*\n\nMohon informasi pembayarannya. Terima kasih!`;
    window.open(
      `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryId === null || p.category_id === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-yellow-200"
      id="beranda"
    >
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("beranda")}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="CashierNova Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white hidden sm:block">
              Cashier<span className="text-emerald-500">Nova</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full transition-colors"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full transition-colors"
              title="Admin Login"
            >
              <UserCircle size={24} />
            </button>
            <button
              onClick={toggleCart}
              className="relative p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub Navigation - Improved for Mobile */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <div className="container mx-auto px-4 flex items-center gap-6 sm:gap-8 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <button
              onClick={() => scrollToSection("beranda")}
              className="text-emerald-500"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection("produk")}
              className="hover:text-emerald-500 transition-colors"
            >
              Toko
            </button>
            <button
              onClick={() => scrollToSection("kategori")}
              className="hidden sm:block hover:text-emerald-500 transition-colors"
            >
              Kategori
            </button>
            <button
              onClick={() => scrollToSection("promo")}
              className="hover:text-emerald-500 transition-colors"
            >
              Promo
            </button>
            <button
              onClick={() => scrollToSection("featured")}
              className="hidden sm:block hover:text-emerald-500 transition-colors"
            >
              Fitur
            </button>

            <div className="ml-auto text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs sm:text-sm">
              <Truck size={18} />
              <span>Gratis Ongkir</span>
              <span className="hidden sm:inline">Min. Rp100k</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] overflow-hidden relative min-h-[500px] flex items-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-8 md:p-16 lg:p-20 relative z-10 w-full">
              <div className="max-w-xl">
                <div className="inline-block px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-6 uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                  100% Produk Original & Segar
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6">
                  Belanja Pintar, <br />
                  <span className="text-emerald-500">Hidup Lebih Sehat.</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                  CashierNova menghadirkan ribuan produk berkualitas langsung ke
                  pintu Anda. Nikmati kemudahan berbelanja dengan pengalaman
                  modern.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToSection("produk")}
                    className="bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all hover:translate-y-[-2px] shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 group"
                  >
                    Belanja Sekarang
                    <ArrowRight
                      size={22}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex -space-x-3">
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900"
                        src="https://i.pravatar.cc/100?img=1"
                        alt="User"
                      />
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900"
                        src="https://i.pravatar.cc/100?img=2"
                        alt="User"
                      />
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900"
                        src="https://i.pravatar.cc/100?img=3"
                        alt="User"
                      />
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        50k+
                      </span>{" "}
                      Pelanggan
                      <br />
                      Setia
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <img
                  src="/images/banner-1.jpg"
                  alt="Banner"
                  className="w-full h-auto rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                    <Star size={24} fill="white" />
                  </div>
                  <div>
                    <div className="font-black text-xl text-slate-800 dark:text-white">
                      4.9/5
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Rating Pelanggan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section
        className="py-12 border-b border-slate-50 dark:border-slate-900"
        id="kategori"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Belanja per Kategori
            </h2>
            <a
              href="#"
              className="text-sm font-bold text-emerald-500 flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ChevronRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {[
              { name: "Buah & Sayur", img: "category-thumb-1.jpg" },
              { name: "Roti & Kue", img: "category-thumb-2.jpg" },
              { name: "Minuman", img: "category-thumb-4.jpg" },
              { name: "Daging", img: "category-thumb-5.jpg" },
              { name: "Susu & Keju", img: "category-thumb-6.jpg" },
              { name: "Makanan", img: "category-thumb-7.jpg" },
              { name: "Bumbu Dapur", img: "category-thumb-8.jpg" },
              { name: "Snack", img: "category-thumb-3.jpg" },
            ].map((cat, i) => {
              const matched = categories.find((c) =>
                c.name
                  .toLowerCase()
                  .includes(cat.name.split(" ")[0].toLowerCase()),
              );

              return (
                <div
                  key={i}
                  className="group cursor-pointer"
                  onClick={() => {
                    setSelectedCategoryId(matched ? matched.id : -1);
                    scrollToSection("produk");
                  }}
                >
                  <div
                    className={`aspect-square bg-slate-50 dark:bg-slate-900 rounded-full mb-4 flex items-center justify-center overflow-hidden border transition-all duration-300 ${
                      matched && selectedCategoryId === matched.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-500"
                        : "border-slate-100 dark:border-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:border-emerald-100 dark:group-hover:border-emerald-800"
                    }`}
                  >
                    <img
                      src={`/images/${cat.img}`}
                      alt={cat.name}
                      className="w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3
                    className={`text-center font-bold transition-colors text-sm ${
                      matched && selectedCategoryId === matched.id
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    }`}
                  >
                    {cat.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="py-20 px-4" id="produk">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                Produk Unggulan Kami
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Pilihan terbaik dari pelanggan kami minggu ini.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative group w-full sm:w-80">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategoryId === null
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Semua
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-900 aspect-[3/4] rounded-[2rem] animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
              <Package size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                Produk tidak ditemukan
              </h3>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full relative"
                >
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        Sisa {product.stock}!
                      </span>
                    )}
                    {product.stock <= 0 && (
                      <span className="bg-slate-400 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        Habis
                      </span>
                    )}
                  </div>

                  <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110 transition-all">
                      <Heart size={18} />
                    </button>
                    <button className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-110 transition-all">
                      <Eye size={18} />
                    </button>
                  </div>

                  <div className="aspect-square bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/20 transition-colors duration-500 p-6">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                      />
                    ) : (
                      <Package size={60} className="text-slate-200" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2 text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        (4.5)
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm mb-4">
                      Stok:{" "}
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {product.stock}
                      </span>
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(product.price)}
                      </span>

                      <button
                        onClick={() => {
                          addItem(product);
                          openCart();
                        }}
                        disabled={product.stock <= 0}
                        className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-all hover:scale-110 active:scale-90"
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

      {/* --- BANNER AD / PROMO --- */}
      <section className="py-12 px-4" id="promo">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-amber-400 dark:bg-amber-500 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden group text-amber-900">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 max-w-xs">
              <span className="text-amber-800 dark:text-amber-950 font-black text-xl mb-4 block italic">
                Organik & Sehat
              </span>
              <h3 className="text-4xl font-black mb-6">Beras Premium 5kg</h3>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black hover:bg-slate-800 transition-colors">
                Beli Sekarang
              </button>
            </div>
            <img
              src="/images/product-thumb-2.png"
              alt="Ad"
              className="absolute bottom-0 right-0 w-1/2 opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"
            />
          </div>

          <div className="bg-rose-500 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 max-w-xs">
              <span className="text-rose-100 font-black text-xl mb-4 block italic">
                Diskon Hingga 25%
              </span>
              <h3 className="text-4xl font-black text-white mb-6">
                Minuman Jenis Apapun
              </h3>
              <button className="bg-white text-rose-500 px-8 py-3 rounded-xl font-black hover:bg-rose-50 transition-colors">
                Beli Sekarang
              </button>
            </div>
            <img
              src="/images/product-thumb-1.png"
              alt="Ad"
              className="absolute bottom-0 right-0 w-1/2 opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section
        className="py-20 px-4 bg-slate-50 dark:bg-slate-950"
        id="featured"
      >
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {[
            {
              icon: Truck,
              title: "Pengiriman Gratis",
              desc: "Tanpa biaya tambahan untuk area lokal.",
              iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
              iconColor: "text-emerald-500 dark:text-emerald-400",
            },
            {
              icon: ShieldCheck,
              title: "Pembayaran Aman",
              desc: "Transaksi aman dan terenkripsi.",
              iconBg: "bg-blue-50 dark:bg-blue-900/30",
              iconColor: "text-blue-500 dark:text-blue-400",
            },
            {
              icon: Star,
              title: "Kualitas Terjamin",
              desc: "Semua produk lulus quality control.",
              iconBg: "bg-amber-50 dark:bg-amber-900/30",
              iconColor: "text-amber-500 dark:text-amber-400",
            },
            {
              icon: Clock,
              title: "Layanan 24/7",
              desc: "Kami siap membantu kapan saja.",
              iconBg: "bg-rose-50 dark:bg-rose-900/30",
              iconColor: "text-rose-500 dark:text-rose-400",
            },
            {
              icon: Package,
              title: "Penawaran Harian",
              desc: "Hemat lebih banyak setiap harinya.",
              iconBg: "bg-purple-50 dark:bg-purple-900/30",
              iconColor: "text-purple-500 dark:text-purple-400",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-emerald-900/10 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feat.iconBg} ${feat.iconColor} rounded-2xl flex items-center justify-center mb-6`}
              >
                <feat.icon size={28} />
              </div>
              <h4 className="font-black text-slate-800 dark:text-slate-100 mb-2">
                {feat.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CART DRAWER --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeCart}
          />

          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slideInRight">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">
                    Keranjang Belanja
                  </h2>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {getCartCount()} Item Terpilih
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingCart
                      size={40}
                      className="text-slate-200 dark:text-slate-700"
                    />
                  </div>
                  <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 mb-2">
                    Keranjang Kosong
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 mb-8">
                    Belum ada produk yang kamu pilih.
                  </p>
                  <button
                    onClick={closeCart}
                    className="bg-emerald-500 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative group"
                  >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center p-2">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      ) : (
                        <Package
                          size={32}
                          className="text-slate-200 dark:text-slate-700"
                        />
                      )}
                    </div>

                    <div className="flex-1 py-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <div className="text-emerald-600 dark:text-emerald-400 font-black mb-3">
                        {formatCurrency(item.price)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg shadow-sm flex items-center justify-center hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-black w-8 text-center text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg shadow-sm flex items-center justify-center hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-8 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-emerald-500 dark:text-emerald-400 font-bold">
                    <span>Pengiriman</span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                    <span>PPN (11%)</span>
                    <span>{formatCurrency(getCartTotal() * 0.11)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
                    <span className="text-slate-800 dark:text-slate-100 font-black text-lg">
                      Total
                    </span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(getCartTotal() * 1.11)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWA}
                  className="w-full bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] shadow-xl shadow-slate-200 dark:shadow-emerald-900/20"
                >
                  Checkout via WhatsApp
                  <ArrowRight size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-slate-950 pt-20 border-t border-slate-50 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="CashierNova Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  Cashier<span className="text-emerald-500">Nova</span>
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
                Platform Kasir Pintar (POS) & Toko Online modern untuk
                memudahkan bisnis ritel Anda mengelola produk dan melayani
                pelanggan dengan cepat.
              </p>
              <div className="flex gap-4">
                {[
                  SocialIcons.Whatsapp,
                  SocialIcons.Instagram,
                  SocialIcons.Facebook,
                  SocialIcons.TikTok,
                ].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-slate-800 dark:text-white mb-8 text-lg">
                Informasi
              </h4>
              <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
                <li>
                  <button
                    onClick={() => scrollToSection("beranda")}
                    className="hover:text-emerald-500 transition-colors text-left"
                  >
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Pengiriman
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Syarat & Ketentuan
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Hubungi Kami
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-800 dark:text-white mb-8 text-lg">
                Bantuan
              </h4>
              <ul className="space-y-4 font-bold text-slate-500 dark:text-slate-400">
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    FAQ
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Cara Belanja
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Kebijakan Privasi
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-500 transition-colors text-left">
                    Lacak Pesanan
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-800 dark:text-white mb-8 text-lg">
                Berlangganan
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Dapatkan info promo terbaru langsung di email Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-full">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 flex-1 font-bold text-sm min-w-0 text-slate-900 dark:text-white"
                />
                <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-600 transition-colors whitespace-nowrap shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">
                  Gabung
                </button>
              </div>
            </div>
          </div>

          <div className="py-10 border-t border-slate-50 dark:border-slate-900 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">
              © {new Date().getFullYear()} CashierNova by JonaRaenal. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <img
                src="/images/img-app-store.png"
                alt="App Store"
                className="h-8 opacity-50 dark:opacity-30 hover:opacity-100 dark:hover:opacity-100 transition-opacity cursor-pointer"
              />
              <img
                src="/images/img-google-play.png"
                alt="Google Play"
                className="h-8 opacity-50 dark:opacity-30 hover:opacity-100 dark:hover:opacity-100 transition-opacity cursor-pointer"
              />
            </div>
          </div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
};

export default LandingPage;
