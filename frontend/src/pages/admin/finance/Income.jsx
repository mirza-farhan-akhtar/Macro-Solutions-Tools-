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
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    payment_method: 'bank_transfer',
    transaction_reference: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        source: formData.source?.trim() || '',
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        transaction_reference: formData.transaction_reference?.trim() || '',
        received_at: formData.received_at,
        notes: formData.notes?.trim() || '',
      };
      
      if (!submitData.source) {
        setError('Income source is required');
        return;
      }
      if (!submitData.amount || submitData.amount < 0.01) {
        setError('Amount must be at least 0.01');
        return;
      }
      if (!submitData.transaction_reference) {
        setError('Transaction reference is required');
        return;
      }
      
      await financeAPI.createIncome(submitData);
      setShowForm(false);
      setFormData({
        source: '',
        amount: '',
        payment_method: 'bank_transfer',
        transaction_reference: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      setError(err.response?.data?.message || 'Error deleting income');
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
    setSelectedIds(selectedIds.size === incomes.length && incomes.length > 0
      ? new Set()
      : new Set(incomes.map(i => i.id)));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size || !confirm(`Delete ${selectedIds.size} income record(s)?`)) return;
    try {
      await Promise.all([...selectedIds].map(id => financeAPI.deleteIncome(id)));
      setSelectedIds(new Set());
      loadIncomes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting selected income records');
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const completedIncome = incomes.filter(i => i.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Income Tracking
              </h1>
              <p className="text-gray-300 mt-2 text-lg">Record and manage all revenue streams</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" /> Record Income
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-xl">
              <div className="bg-green-600/30 p-4 rounded-xl border border-green-500/30">
                <DollarSign className="w-8 h-8 text-green-300" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Total Income</p>
                <p className="text-4xl font-bold text-white font-mono">${totalIncome.toFixed(2)}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-xl">
              <div className="bg-emerald-600/30 p-4 rounded-xl border border-emerald-500/30">
                <TrendingUp className="w-8 h-8 text-emerald-300" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">Completed Transactions</p>
                <p className="text-4xl font-bold text-white font-mono">{completedIncome}</p>
              </div>
            </motion.div>
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
          {['', 'pending', 'completed', 'failed'].map(status => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Received Date *</label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.received_at}
                      onChange={(e) => setFormData({...formData, received_at: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">Transaction Reference *</label>
                    <input
                      type="text"
                      required
                      value={formData.transaction_reference}
                      onChange={(e) => setFormData({...formData, transaction_reference: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                      placeholder="Auto-generated"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none"
                    placeholder="Optional notes"
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

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">INCOME RECORDS</h2>
          </div>
          <p className="text-gray-400">View all incoming revenue streams and payment sources</p>
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-green-500/30 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-green-950/30 to-emerald-950/20 p-7">
          {loading && (
            <div className="p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-10 h-10 text-green-400" />
              </motion.div>
              <p className="text-gray-400 mt-4 font-medium">Loading income records...</p>
            </div>
          )}

          {!loading && incomes.length === 0 && (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-green-600/50 mx-auto mb-4" />
              <p className="text-gray-200 text-lg font-semibold">No income records yet</p>
              <p className="text-gray-400 mt-2">Record your first income to get started</p>
            </div>
          )}

          {!loading && incomes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30">
                  <tr>
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === incomes.length && incomes.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Source</th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Amount</th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Method</th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Date</th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-green-300 font-bold uppercase tracking-wider text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {incomes.map((income, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={income.id}
                      className={`border-l-4 transition-colors ${selectedIds.has(income.id) ? 'border-l-green-400 bg-green-950/20' : 'border-l-green-500 hover:bg-green-950/20'}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(income.id)}
                          onChange={() => toggleSelect(income.id)}
                          className="w-4 h-4 accent-green-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-bold">{income.source}</td>
                      <td className="px-6 py-4 text-green-300 font-mono font-bold text-lg">${Number(income.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm capitalize font-medium">{income.payment_method?.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm font-medium">{new Date(income.received_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase letter-spacing ${
                          income.status === 'completed'
                            ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                            : income.status === 'pending'
                            ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                            : 'bg-red-500/30 text-red-300 border border-red-500/50'
                        }`}>
                          {income.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(income.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all border border-red-500/30 hover:border-red-500/60">
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
