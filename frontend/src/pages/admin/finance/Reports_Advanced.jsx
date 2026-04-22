import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Loader, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import financeAPI from '../../../services/financeAPI';

export function Reports() {
  const [pnlData, setPnlData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pnl, revenue, expense] = await Promise.all([
        financeAPI.getProfitLoss(period),
        financeAPI.getRevenue(period),
        financeAPI.getExpense(period),
      ]);
      setPnlData(pnl.data?.data);
      setRevenueData(revenue.data?.data);
      setExpenseData(expense.data?.data);
    } catch (err) {
      console.error('[Reports] Error:', err);
      setError(`Failed to load reports: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await financeAPI.exportReport(type, period);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${period}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Error exporting report');
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Financial Reports
              </h1>
              <p className="text-slate-400 mt-2">Comprehensive financial analysis and insights</p>
            </div>
          </div>

          {/* Period & Export Controls */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-2">
              {['week', 'month', 'quarter', 'year'].map(p => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    period === p
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {p}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              {[
                { label: 'P&L', type: 'profit-loss' },
                { label: 'Revenue', type: 'revenue' },
                { label: 'Expenses', type: 'expense' },
              ].map(({ label, type }) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleExport(type)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg"
                >
                  <Download className="w-4 h-4" /> {label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <motion.button whileHover={{ scale: 1.02 }} onClick={loadReports} className="mt-3 px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium">
                Retry
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
                <Loader className="w-12 h-12 text-purple-400" />
              </motion.div>
              <p className="text-slate-400 mt-4">Generating reports...</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {/* P&L Summary */}
            {pnlData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-slate-700 backdrop-blur-md p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="text-purple-400" /> Profit & Loss Statement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Total Income</p>
                    <p className="text-2xl font-bold text-green-400">${(pnlData.income?.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-400">${(pnlData.expense?.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Gross Profit</p>
                    <p className="text-2xl font-bold text-blue-400">${(pnlData.summary?.gross_profit || 0).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Revenue Breakdown */}
            {revenueData?.by_payment_method && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl border border-slate-700 backdrop-blur-md p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <LineChartIcon className="text-green-400" /> Revenue Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={revenueData.by_payment_method} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: $${value}`} outerRadius={100} fill="#8884d8" dataKey="total">
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Monthly Trends */}
            {expenseData?.monthly_trend && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl border border-slate-700 backdrop-blur-md p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Monthly Trends</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={expenseData.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="total" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
