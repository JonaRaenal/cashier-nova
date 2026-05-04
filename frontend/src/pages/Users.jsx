// ============================================
// CashierNova — Users Page
// CRUD user dengan role selector dan reset password
// Dependencies: userService, lucide-react
// ============================================

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users as UsersIcon, Shield } from 'lucide-react';
import userService from '../services/userService';
import { ROLE_LABELS } from '../constants/roles';
import formatDate from '../utils/formatDate';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'kasir' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'kasir' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...formData };
      if (editingUser && !data.password) delete data.password;
      if (editingUser) {
        await userService.update(editingUser.id, data);
        toast.success('User berhasil diperbarui');
      } else {
        await userService.create(data);
        toast.success('User berhasil ditambahkan');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.delete(deleteTarget.id);
      toast.success('User berhasil dihapus');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Pengguna</h1>
          <p className="text-text-secondary dark:text-gray-400 mt-1">Kelola akun pengguna sistem</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah User
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary dark:text-gray-500">
            <UsersIcon size={48} className="opacity-30 mb-3" /><p>Tidak ada pengguna</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Nama</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header">Dibuat</th>
                <th className="table-header text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-text-secondary">{u.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                      <Shield size={12} className="mr-1" />{ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-text-secondary">{formatDate(u.created_at)}</td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openModal(u)} className="btn-ghost p-2"><Edit2 size={15} className="text-text-secondary dark:text-gray-400" /></button>
                      <button onClick={() => setDeleteTarget(u)} className="btn-ghost p-2"><Trash2 size={15} className="text-danger" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Create/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit User' : 'Tambah User'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-400 mb-1">Nama <span className="text-danger">*</span></label>
            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-400 mb-1">Email <span className="text-danger">*</span></label>
            <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-400 mb-1">
              Password {editingUser ? '(kosongkan jika tidak diubah)' : '*'}
            </label>
            <input type="password" className="input-field" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} {...(!editingUser && { required: true })} minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-400 mb-1">Role <span className="text-danger">*</span></label>
            <select className="input-field" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required>
              <option value="kasir">Kasir</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <LoadingSpinner size="sm" /> : editingUser ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Hapus */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-danger" />
          </div>
          <p className="font-medium">Hapus user "{deleteTarget?.name}"?</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Batal</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting ? <LoadingSpinner size="sm" /> : 'Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
