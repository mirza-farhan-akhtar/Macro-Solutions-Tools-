import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, AlertCircle, Loader, TrendingUp, DollarSign } from 'lucide-react';
import financeAPI from '../../../services/financeAPI';

export function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    payment_method: 'bank_transfer',
    transaction_reference: '',
    received_at: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadIncomes();
  }, [filter]);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financeAPI.getIncomes(1, { status: filter || undefined });
      setIncomes(response.data?.data?.data || []);
    } catch (err) {
      console.error('[Income] Error:', err);
      setError(`Failed to load income records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        amount: Number(formData.amount),
      };
      
      await financeAPI.createIncome(submitData);
      setShowForm(false);
      setFormData({
        source: '',
        amount: '',
        payment_method: 'bank_transfer',
        transaction_reference: '',
        received_at: new Date().toISOString().split('T')[0],
        notes: '',
      });
      loadIncomes();
    } catch (err) {
      setError(err.response?.data?.message || `Error saving income: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this income record?')) return;
    try {
      await financeAPI.deleteIncome(id);
      loadIncomes();
    } catch (err) {
      setError('Error deleting income');
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const completedIncome = incomes.filter(i => i.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Income Tracking
              </h1>
              <p className="text-slate-400 mt-2">Record and manage all revenue streams</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" /> Record Income
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-white">${totalIncome.toFixed(2)}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Completed Transactions</p>
                <p className="text-2xl font-bold text-white">{completedIncome}</p>
              </div>
            </motion.div>
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
          {['', 'pending', 'completed', 'failed'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-green-600 text-white shadow-lg'
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
              <h2 className="text-2xl font-bold text-white mb-6">Record Income</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Source *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Service Income, Consulting, Licensing"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                  />
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
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Payment Method</label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.received_at}
                    onChange={(e) => setFormData({...formData, received_at: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">
                    Save Income
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
                <Loader className="w-10 h-10 text-green-400" />
              </motion.div>
              <p className="text-slate-400 mt-4">Loading income records...</p>
            </div>
          )}

          {!loading && incomes.length === 0 && (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-300 text-lg">No income records yet</p>
              <p className="text-slate-500 mt-2">Record your first income to get started</p>
            </div>
          )}

          {!loading && incomes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Source</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Method</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {incomes.map((income, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={income.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">{income.source}</td>
                      <td className="px-6 py-4 text-white font-semibold text-green-400">${Number(income.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm capitalize">{income.payment_method?.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{new Date(income.received_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          income.status === 'completed'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : income.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {income.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(income.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all">
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

export default Income;
