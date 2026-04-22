import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Send, Eye, DollarSign, AlertCircle, Loader, ChevronDown } from 'lucide-react';
import financeAPI from '../../../services/financeAPI';
export function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [formData, setFormData] = useState({
    invoice_number: `INV-${Date.now()}`,
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unit_price: 0 }],
  });

  useEffect(() => {
    loadInvoices();
  }, [filter]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financeAPI.getInvoices(1, { status: filter || undefined });
      setInvoices(response.data?.data?.data || []);
    } catch (err) {
      console.error('[Invoices] Error:', err);
      setError(`Failed to load invoices: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        issued_date: new Date().toISOString().split('T')[0],
        items: formData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };
      
      if (editingId) {
        await financeAPI.updateInvoice(editingId, submitData);
      } else {
        await financeAPI.createInvoice(submitData);
      }
      
      setShowForm(false);
      setFormData({
        invoice_number: `INV-${Date.now()}`,
        due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0 }],
      });
      loadInvoices();
    } catch (err) {
      setError(err.response?.data?.message || `Error saving invoice: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    try {
      await financeAPI.deleteInvoice(id);
      loadInvoices();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting invoice');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === invoices.length && invoices.length > 0
      ? new Set()
      : new Set(invoices.map(i => i.id)));
  };

  const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await financeAPI.updateInvoiceStatus(id, newStatus);
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size || !confirm(`Delete ${selectedIds.size} invoice(s)?`)) return;
    try {
      await Promise.all([...selectedIds].map(id => financeAPI.deleteInvoice(id)));
      setSelectedIds(new Set());
      loadInvoices();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting selected invoices');
    }
  };

  const handleSend = async (id) => {
    try {
      await financeAPI.sendInvoice(id);
      loadInvoices();
    } catch (err) {
      setError('Error sending invoice');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500 text-gray-100',
      sent: 'bg-blue-500 text-blue-100',
      paid: 'bg-green-500 text-green-100',
      partial: 'bg-yellow-500 text-yellow-100',
      overdue: 'bg-red-500 text-red-100',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Invoices
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Manage and track your invoices</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" /> Create Invoice
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-950/60 border-l-4 border-red-500 rounded-xl p-5 text-red-300 flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Status Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex gap-2 flex-wrap">
          {['', 'draft', 'sent', 'paid', 'partial', 'overdue'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {status || 'All'}
            </motion.button>
          ))}
        </motion.div>

        {/* Bulk Delete Bar */}
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-4 p-4 bg-red-950/40 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <span className="text-red-300 font-bold">{selectedIds.size} selected</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected
            </motion.button>
            <button onClick={() => setSelectedIds(new Set())} className="text-gray-400 hover:text-gray-200 text-sm font-medium">
              Clear
            </button>
          </motion.div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 max-w-2xl w-full border border-blue-500/30 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">{editingId ? 'Edit Invoice' : 'Create Invoice'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm uppercase tracking-wide">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                    className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="e.g., INV-001"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm uppercase tracking-wide">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-3 font-bold text-sm uppercase tracking-wide">Items *</label>
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-3 mb-4 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].description = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].quantity = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unit_price}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].unit_price = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, items: [...formData.items, {description: '', quantity: 1, unit_price: 0}]})}
                    className="text-blue-400 text-sm hover:text-blue-300 mt-2"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                    {editingId ? 'Update' : 'Create'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium">
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-500/20 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-blue-950/20 to-cyan-950/10">
          {loading && (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-10 h-10 text-blue-400" />
              </motion.div>
              <p className="text-gray-300 mt-4 font-medium">Loading invoices...</p>
            </div>
          )}

          {!loading && invoices.length === 0 && (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-200 text-lg font-semibold">No invoices yet</p>
              <p className="text-gray-400 mt-2">Create your first invoice to get started</p>
            </div>
          )}

          {!loading && invoices.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600/30 to-cyan-600/20 border-b border-blue-500/30">
                  <tr>
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === invoices.length && invoices.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-gray-200 font-bold text-sm uppercase tracking-wide">Invoice #</th>
                    <th className="px-6 py-4 text-left text-gray-200 font-bold text-sm uppercase tracking-wide">Date</th>
                    <th className="px-6 py-4 text-left text-gray-200 font-bold text-sm uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-4 text-left text-gray-200 font-bold text-sm uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-gray-200 font-bold text-sm uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {invoices.map((invoice, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={invoice.id}
                      className={`hover:bg-blue-600/20 transition-all border-l-4 ${selectedIds.has(invoice.id) ? 'border-l-blue-400 bg-blue-600/10' : 'border-l-transparent hover:border-l-blue-500'}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(invoice.id)}
                          onChange={() => toggleSelect(invoice.id)}
                          className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-bold text-sm">{invoice.invoice_number}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm font-medium">{new Date(invoice.issued_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white font-bold text-lg font-mono">${Number(invoice.total_amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={invoice.status}
                            onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                            className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-bold cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white/20 ${getStatusColor(invoice.status)}`}
                            style={{ background: 'transparent' }}
                          >
                            {INVOICE_STATUSES.map(s => (
                              <option key={s} value={s} className="bg-gray-900 text-white font-normal">
                                {s.toUpperCase()}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
                        </div>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button whileHover={{ scale: 1.15 }} className="p-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-blue-300 transition-all border border-blue-500/30">
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        {invoice.status === 'draft' && (
                          <motion.button whileHover={{ scale: 1.15 }} onClick={() => handleSend(invoice.id)} className="p-2 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-green-300 transition-all border border-green-500/30">
                            <Send className="w-5 h-5" />
                          </motion.button>
                        )}
                        <motion.button whileHover={{ scale: 1.15 }} onClick={() => handleDelete(invoice.id)} className="p-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-red-300 transition-all border border-red-500/30">
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Invoices;
