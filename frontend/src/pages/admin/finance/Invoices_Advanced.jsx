import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Send, Eye, DollarSign, AlertCircle, Loader } from 'lucide-react';
import financeAPI from '../../../services/financeAPI';

export function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      setError('Error deleting invoice');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Invoices
              </h1>
              <p className="text-slate-400 mt-2">Manage and track your invoices</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" /> Create Invoice
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Status Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex gap-2 flex-wrap">
          {['', 'draft', 'sent', 'paid', 'partial', 'overdue'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {status || 'All'}
            </motion.button>
          ))}
        </motion.div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Invoice' : 'Create Invoice'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                    placeholder="e.g., INV-001"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Items *</label>
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[idx].description = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-slate-700 backdrop-blur-md overflow-hidden">
          {loading && (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-10 h-10 text-blue-400" />
              </motion.div>
              <p className="text-slate-400 mt-4">Loading invoices...</p>
            </div>
          )}

          {!loading && invoices.length === 0 && (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-300 text-lg">No invoices yet</p>
              <p className="text-slate-500 mt-2">Create your first invoice to get started</p>
            </div>
          )}

          {!loading && invoices.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Invoice #</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {invoices.map((invoice, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={invoice.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">{invoice.invoice_number}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{new Date(invoice.issued_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white font-semibold">${Number(invoice.total_amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-400 transition-all">
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        {invoice.status === 'draft' && (
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleSend(invoice.id)} className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-all">
                            <Send className="w-4 h-4" />
                          </motion.button>
                        )}
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(invoice.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
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
