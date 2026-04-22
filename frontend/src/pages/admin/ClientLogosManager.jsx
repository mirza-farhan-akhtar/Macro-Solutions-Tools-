import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Image, Globe, Star, Eye, EyeOff, Search, Upload, X, Check, Building2, Loader2 } from 'lucide-react';
import { clientLogosAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  logo_url: '',
  website_url: '',
  industry: '',
  description: '',
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

export default function ClientLogosManager() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      setLoading(true);
      const res = await clientLogosAPI.list({ search, per_page: 50 });
      setLogos(res.data?.data?.data || res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load client logos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadLogos();
  };

  const openCreate = () => {
    setEditingLogo(null);
    setForm(EMPTY_FORM);
    setLogoFile(null);
    setLogoPreview(null);
    setShowModal(true);
  };

  const openEdit = (logo) => {
    setEditingLogo(logo);
    setForm({
      name: logo.name || '',
      logo_url: logo.logo_url || '',
      website_url: logo.website_url || '',
      industry: logo.industry || '',
      description: logo.description || '',
      is_featured: logo.is_featured || false,
      is_active: logo.is_active !== false,
      sort_order: logo.sort_order || 0,
    });
    setLogoFile(null);
    setLogoPreview(logo.logo_full_url || null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, logo_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Client name is required');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      const boolFields = ['is_featured', 'is_active'];
      Object.entries(form).forEach(([k, v]) => {
        if (boolFields.includes(k)) {
          fd.append(k, v ? '1' : '0');
        } else if (v !== null && v !== undefined && v !== '') {
          fd.append(k, v);
        }
      });
      if (logoFile) fd.append('logo', logoFile);

      if (editingLogo) {
        fd.append('_method', 'PUT');
        await clientLogosAPI.update(editingLogo.id, fd);
        toast.success('Client logo updated!');
      } else {
        await clientLogosAPI.create(fd);
        toast.success('Client logo added!');
      }
      setShowModal(false);
      loadLogos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.name?.[0] || 'Failed to save';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (logo) => {
    try {
      await clientLogosAPI.delete(logo.id);
      toast.success('Deleted successfully');
      setDeleteConfirm(null);
      loadLogos();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (logo) => {
    try {
      const fd = new FormData();
      fd.append('name', logo.name);
      fd.append('is_active', !logo.is_active ? '1' : '0');
      fd.append('_method', 'PUT');
      await clientLogosAPI.update(logo.id, fd);
      setLogos(prev => prev.map(l => l.id === logo.id ? { ...l, is_active: !l.is_active } : l));
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Logos</h1>
          <p className="text-slate-500 text-sm mt-1">Manage client/partner logos shown on the website</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Add Client Logo
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or industry..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Search</button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : logos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No client logos yet</h3>
          <p className="text-slate-400 text-sm mb-4">Add your first client logo to display it on the website</p>
          <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Add Client Logo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col items-center gap-3 relative group transition ${!logo.is_active ? 'opacity-50' : ''}`}
            >
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {logo.is_featured && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              {/* Logo Image */}
              <div className="w-20 h-16 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                {logo.logo_full_url ? (
                  <img src={logo.logo_full_url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="text-center">
                <p className="font-semibold text-slate-800 text-sm leading-tight">{logo.name}</p>
                {logo.industry && <p className="text-xs text-slate-400 mt-0.5">{logo.industry}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition absolute bottom-3 right-3">
                <button onClick={() => toggleActive(logo)} title={logo.is_active ? 'Deactivate' : 'Activate'}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  {logo.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(logo)} title="Edit"
                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteConfirm(logo)} title="Delete"
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingLogo ? 'Edit Client Logo' : 'Add Client Logo'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 transition">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Logo Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="max-h-24 max-w-full object-contain rounded" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400" />
                        <p className="text-sm text-slate-500">Click to upload logo (PNG, SVG, JPG)</p>
                        <p className="text-xs text-slate-400">Max 2MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                {/* OR URL */}
                {!logoFile && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Or Logo URL <span className="text-slate-400 text-xs">(if not uploading)</span>
                    </label>
                    <input
                      type="url"
                      value={form.logo_url}
                      onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={form.website_url}
                    onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))}
                    placeholder="https://acmecorp.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                    placeholder="e.g. Finance, Healthcare, Tech"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    min={0}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                      className="w-4 h-4 rounded text-yellow-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Featured</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingLogo ? 'Update' : 'Add Logo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Client Logo?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition text-sm">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition text-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
