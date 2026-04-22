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
        ...formData,
        amount: Number(formData.amount),
        category_id: Number(formData.category_id),
      };
      
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
      setError('Error deleting expense');
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
      pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-300 border border-green-500/30',
      rejected: 'bg-red-500/20 text-red-300 border border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20';
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Meta */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Expenses
              </h1>
              <p className="text-slate-400 mt-2">Track and manage all your business expenses</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" /> New Expense
            </motion.button>
          </div>

          {/* Summary Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
            </div>
          </motion.div>
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
          {['', 'pending', 'approved', 'rejected'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {status || 'All'}
            </motion.button>
          ))}
        </motion.div>

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
                    <label className="block text-slate-300 mb-2 font-medium">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.expense_date}
                      onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
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

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-slate-700 backdrop-blur-md overflow-hidden">
          {loading && (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-10 h-10 text-orange-400" />
              </motion.div>
              <p className="text-slate-400 mt-4">Loading expenses...</p>
            </div>
          )}

          {!loading && expenses.length === 0 && (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-300 text-lg">No expenses recorded yet</p>
              <p className="text-slate-500 mt-2">Start tracking expenses to see them here</p>
            </div>
          )}

          {!loading && expenses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Vendor</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Category</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {expenses.map((exp, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={exp.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">{exp.vendor}</td>
                      <td className="px-6 py-4 text-slate-400">{exp.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-white font-semibold">${Number(exp.amount || 0).toFixed(2)}</td>
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
