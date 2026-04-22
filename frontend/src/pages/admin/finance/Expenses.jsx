import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check, X, AlertCircle, Loader, TrendingUp } from 'lucide-react';
import financeAPI from '../../../services/financeAPI';

export function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [formData, setFormData] = useState({
    category_id: '',
    vendor: '',
    amount: '',
    payment_method: 'bank_transfer',
    expense_date: new Date().toISOString().split('T')[0],
    receipt: null,
    notes: '',
  });

  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, [filter]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financeAPI.getExpenses(1, { status: filter || undefined });
      setExpenses(response.data?.data?.data || []);
    } catch (err) {
      console.error('[Expenses] Error:', err);
      setError(`Failed to load expenses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await financeAPI.getExpenseCategories();
      setCategories(response.data?.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        category_id: Number(formData.category_id),
        vendor: formData.vendor.trim(),
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        expense_date: formData.expense_date,
        notes: formData.notes?.trim() || '',
      };
      
      if (!submitData.category_id || submitData.category_id === 0) {
        setError('Please select a category');
        return;
      }
      if (!submitData.vendor) {
        setError('Vendor name is required');
        return;
      }
      if (!submitData.amount || submitData.amount < 0.01) {
        setError('Amount must be at least 0.01');
        return;
      }
      
      await financeAPI.createExpense(submitData);
      setShowForm(false);
      setFormData({
        category_id: '',
        vendor: '',
        amount: '',
        payment_method: 'bank_transfer',
        expense_date: new Date().toISOString().split('T')[0],
        receipt: null,
        notes: '',
      });
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || `Error saving expense: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await financeAPI.deleteExpense(id);
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting expense');
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
    setSelectedIds(selectedIds.size === expenses.length && expenses.length > 0
      ? new Set()
      : new Set(expenses.map(e => e.id)));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size || !confirm(`Delete ${selectedIds.size} expense(s)?`)) return;
    try {
      await Promise.all([...selectedIds].map(id => financeAPI.deleteExpense(id)));
      setSelectedIds(new Set());
      loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting selected expenses');
    }
  };

  const handleApprove = async (id) => {
    try {
      await financeAPI.approveExpense(id);
      loadExpenses();
    } catch (err) {
      setError('Error approving expense');
    }
  };

  const handleReject = async (id) => {
    try {
      await financeAPI.rejectExpense(id, {});
      loadExpenses();
    } catch (err) {
      setError('Error rejecting expense');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/40',
      approved: 'bg-green-600/30 text-green-300 border border-green-500/40',
      rejected: 'bg-red-600/30 text-red-300 border border-red-500/40',
    };
    return colors[status] || 'bg-gray-600/30 text-gray-300';
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Meta */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Expenses
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Track and manage all your business expenses</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" /> New Expense
            </motion.button>
          </div>

          {/* Summary Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-orange-950/50 to-red-950/30 border border-orange-500/30 rounded-2xl p-6 flex items-center gap-6 backdrop-blur-xl">
            <div className="bg-orange-600/30 p-4 rounded-xl border border-orange-500/30">
              <TrendingUp className="w-8 h-8 text-orange-300" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Expenses</p>
              <p className="text-4xl font-bold text-white font-mono mt-1">${totalExpenses.toFixed(2)}</p>
            </div>
          </motion.div>
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
          {['', 'pending', 'approved', 'rejected'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
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

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Record New Expense</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Category *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Vendor *</label>
                    <input
                      type="text"
                      required
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                      placeholder="e.g., Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Amount *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Expense Date *</label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.expense_date}
                      onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Payment Method *</label>
                    <select
                      required
                      value={formData.payment_method}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium">
                    Save Expense
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium">
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">EXPENSES TABLE</h2>
          </div>
          <p className="text-gray-400">Track and manage all your business expenses with detailed information</p>
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-orange-500/30 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-orange-950/30 to-red-950/20 p-7">
          {loading && (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-10 h-10 text-orange-400" />
              </motion.div>
              <p className="text-gray-400 mt-4 font-medium">Loading expenses...</p>
            </div>
          )}

          {!loading && expenses.length === 0 && (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-orange-600/50 mx-auto mb-4" />
              <p className="text-gray-200 text-lg font-semibold">No expenses recorded yet</p>
              <p className="text-gray-400 mt-2">Start tracking expenses to see them here</p>
            </div>
          )}

          {!loading && expenses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30">
                  <tr>
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === expenses.length && expenses.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-orange-300 font-bold uppercase tracking-wider text-sm">Vendor</th>
                    <th className="px-6 py-4 text-left text-orange-300 font-bold uppercase tracking-wider text-sm">Category</th>
                    <th className="px-6 py-4 text-left text-orange-300 font-bold uppercase tracking-wider text-sm">Amount</th>
                    <th className="px-6 py-4 text-left text-orange-300 font-bold uppercase tracking-wider text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-orange-300 font-bold uppercase tracking-wider text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {expenses.map((exp, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={exp.id}
                      className={`border-l-4 transition-colors ${selectedIds.has(exp.id) ? 'border-l-orange-400 bg-orange-950/20' : 'border-l-orange-500 hover:bg-orange-950/20'}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(exp.id)}
                          onChange={() => toggleSelect(exp.id)}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-bold">{exp.vendor}</td>
                      <td className="px-6 py-4 text-gray-300 font-medium">{exp.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-orange-300 font-mono font-bold text-lg">${Number(exp.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        {exp.status === 'pending' && (
                          <>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleApprove(exp.id)} className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-all">
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleReject(exp.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all">
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(exp.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all">
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

export default Expenses;
