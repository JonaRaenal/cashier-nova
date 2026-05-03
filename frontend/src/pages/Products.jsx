// ============================================
// CashierNova — Products Page
// CRUD produk dengan search, filter, pagination, dan modal
// Dependencies: productService, lucide-react
// ============================================

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import productService from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import useDebounce from '../hooks/useDebounce';
import Modal from '../components/ui/Modal';
import Pagination from '../components/shared/Pagination';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category_id: '', sku: '', price: '', stock: '', image_url: '', description: '',
  });
  const [saving, setSaving] = useState(false);

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch produk
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ search: debouncedSearch, category: categoryFilter, page, limit: 10 }),
        productService.getCategories(),
      ]);
      setProducts(productsRes.data.data);
      setMeta(productsRes.data.meta);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, categoryFilter, page]);

  // Open modal untuk create/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category_id: product.category_id,
        sku: product.sku || '',
        price: product.price,
        stock: product.stock,
        image_url: product.image_url || '',
        description: product.description || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category_id: '', sku: '', price: '', stock: '', image_url: '', description: '' });
    }
    setShowModal(true);
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        toast.success('Produk berhasil diperbarui');
      } else {
        await productService.create(formData);
        toast.success('Produk berhasil ditambahkan');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      toast.success('Produk berhasil dihapus');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setDeleting(false);
    }
  };

  // Badge stok
  const StockBadge = ({ stock }) => {
    if (stock <= 0) return <span className="badge-danger">Habis</span>;
    if (stock <= 5) return <span className="badge-warning">Menipis ({stock})</span>;
    return <span className="badge-success">Aman ({stock})</span>;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Produk</h1>
          <p className="text-text-secondary mt-1">Kelola daftar produk toko Anda</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="input-field w-full sm:w-48"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
            <Package size={48} className="opacity-30 mb-3" />
            <p>Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Produk</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Kategori</th>
                  <th className="table-header">Harga</th>
                  <th className="table-header">Stok</th>
                  <th className="table-header text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-text-secondary">{product.sku || '-'}</td>
                    <td className="table-cell text-text-secondary">{product.category_name}</td>
                    <td className="table-cell font-medium">{formatCurrency(product.price)}</td>
                    <td className="table-cell"><StockBadge stock={product.stock} /></td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(product)} className="btn-ghost p-2">
                          <Edit2 size={15} className="text-text-secondary" />
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="btn-ghost p-2">
                          <Trash2 size={15} className="text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-text-secondary">
              Halaman {meta.page} dari {meta.totalPages} ({meta.total} produk)
            </p>
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* ======== MODAL CREATE/EDIT PRODUK ======== */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Nama Produk *</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Kategori *</label>
              <select
                className="input-field"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">SKU</label>
              <input
                type="text"
                className="input-field"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Harga *</label>
              <input
                type="number"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Stok</label>
              <input
                type="number"
                className="input-field"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">URL Gambar</label>
              <input
                type="url"
                className="input-field"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Preview gambar */}
          {formData.image_url && (
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80?text=Error';
                  }}
                />
              </div>
              <p className="text-xs text-text-secondary">Preview gambar produk</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Deskripsi</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : <>{editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* ======== MODAL KONFIRMASI HAPUS ======== */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus"
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-danger" />
          </div>
          <p className="text-text-primary font-medium">Hapus produk ini?</p>
          <p className="text-sm text-text-secondary mt-1">
            "{deleteTarget?.name}" akan dihapus secara permanen.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
              Batal
            </button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting ? <LoadingSpinner size="sm" /> : 'Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
