import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import financeAPI from '../../../services/financeAPI';
import { usePermission } from '../../../context/PermissionContext';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CreditCard, PieChart as PieIcon, Activity, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export function FinanceDashboard() {
  const navigate = useNavigate();
  const { hasPermission, loading: permLoading, isSuperAdmin } = usePermission();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadDashboardData = useCallback(async (isBackground = false) => {
    if (!mountedRef.current) return;
    try {
      if (!isSuperAdmin && !hasPermission('finance.view') && !hasPermission('finance.reports')) {
        if (!isBackground) {
          setError('You do not have permission to view the Finance Dashboard. Contact your administrator for access.');
          setLoading(false);
        }
        return;
      }

      if (!isBackground) {
        setRefreshing(true);
        setError(null);
      } else {
        setRefreshing(true);
      }

      const response = await financeAPI.getDashboard(period);

      if (!mountedRef.current) return;

      if (response.data?.data?.metrics) {
        setMetrics(response.data.data);
        setLastUpdated(new Date());
      } else if (!isBackground) {
        setError('Invalid data received from server. Check console for details.');
        console.error('Unexpected response structure:', response.data);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (!isBackground) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load dashboard data';
        setError(`Error: ${errorMsg}. Please make sure you are logged in and have proper permissions.`);
        console.error('Dashboard error:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [period, isSuperAdmin, hasPermission]);

  // Keep a ref to the latest loadDashboardData so the interval never captures a stale closure
  const loadRef = useRef(loadDashboardData);
  useEffect(() => { loadRef.current = loadDashboardData; }, [loadDashboardData]);

  // Initial load + interval — depends only on permLoading so the interval is created once
  useEffect(() => {
    if (permLoading) return;
    loadRef.current(false);

    const startInterval = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          loadRef.current(true);
        }
      }, 30000);
    };
    startInterval();

    // Reload immediately when tab becomes visible again after being hidden
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadRef.current(true);
        startInterval();
      } else {
        clearInterval(intervalRef.current);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [permLoading]);

  // Reload when period changes (interval keeps running with latest ref)
  useEffect(() => {
    if (!permLoading) {
      loadRef.current(false);
    }
  }, [period, permLoading]);

  if (loading || permLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your financial dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const m = metrics?.metrics || {};
  const invoices = metrics?.invoices || {};
  const expenses = metrics?.expenses || {};
  const payments = metrics?.payments || [];
  const monthlyTrend = metrics?.monthly_trend || [];

  const formatAmount = (val) => {
    const n = Number(val) || 0;
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_000_000_000) return `${sign}$${+(abs / 1_000_000_000).toPrecision(3)}B`;
    if (abs >= 1_000_000)     return `${sign}$${+(abs / 1_000_000).toPrecision(3)}M`;
    if (abs >= 1_000)         return `${sign}$${+(abs / 1_000).toPrecision(3)}k`;
    return `${sign}$${abs.toFixed(2)}`;
  };

  const MetricCard = ({ title, value, subtext, icon: Icon, trend, color = 'blue', onClick }) => (
    <motion.div
      whileHover={{ translateY: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      className={`rounded-2xl p-7 border border-${color}-500/30 backdrop-blur-xl hover:border-${color}-400 transition-all cursor-pointer group bg-gradient-to-br ${
        color === 'blue' ? 'from-blue-950/40 to-cyan-950/20' :
        color === 'green' ? 'from-green-950/40 to-emerald-950/20' :
        color === 'orange' ? 'from-orange-950/40 to-red-950/20' :
        'from-purple-950/40 to-pink-950/20'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">{title}</p>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 font-mono tracking-tight leading-none">
            {formatAmount(value)}
          </h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-2 text-sm font-bold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(trend)}% this {period}</span>
            </div>
          )}
          {subtext && <p className="text-xs text-gray-500 mt-2 font-medium">{subtext}</p>}
        </div>
        <div className={`bg-${color}-500/20 p-5 rounded-2xl group-hover:scale-110 transition-transform border border-${color}-500/20`}>
          <Icon className={`w-8 h-8 text-${color}-300`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 md:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">Finance Dashboard</h1>
            <p className="text-lg text-gray-300">Real-time financial metrics and insights</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-950/60 border border-green-500/40 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-semibold text-green-400">Live</span>
            </div>
            {lastUpdated && (
              <span className="text-xs text-gray-500 hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => loadDashboardData(false)}
              disabled={refreshing}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {/*Period Selector */}
            <div className="flex gap-2 bg-gray-900/80 rounded-xl p-1 border border-gray-700">
              {['week', 'month', 'quarter', 'year'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    period === p
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/60 border-l-4 border-red-500 rounded-xl p-5 mb-6 flex gap-3 backdrop-blur-sm"
        >
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-200 mb-1 text-lg">Error Loading Dashboard</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricCard
            title="Total Revenue"
            value={m.total_revenue || 0}
            icon={TrendingUp}
            color="green"
            subtext="All income sources"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <MetricCard
            title="Total Expenses"
            value={m.total_expenses || 0}
            icon={TrendingDown}
            color="orange"
            subtext="All approved expenses"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MetricCard
            title={(m.net_profit || 0) >= 0 ? 'Net Profit' : 'Net Loss'}
            value={Math.abs(m.net_profit || 0)}
            icon={(m.net_profit || 0) >= 0 ? TrendingUp : TrendingDown}
            color={(m.net_profit || 0) >= 0 ? 'green' : 'orange'}
            subtext={`${m.profit_margin || 0}% margin`}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <MetricCard
            title="Pending Invoices"
            value={invoices.pending_amount || 0}
            icon={CreditCard}
            color="purple"
            subtext={`${invoices.count || 0} invoices`}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue vs Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-blue-500/30 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-blue-950/30 to-cyan-950/20 p-7"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Revenue vs Expenses
          </h2>
          {Array.isArray(monthlyTrend) && monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94A3B8" dataKey="month" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `$${Number(value || 0).toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No trend data available
            </div>
          )}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-purple-500/30 backdrop-blur-xl overflow-hidden bg-gradient-to-br from-purple-950/30 to-pink-950/20 p-7"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-purple-400" />
            Payment Methods
          </h2>
          {Array.isArray(payments) && payments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={payments}
                  dataKey="total"
                  nameKey="payment_method"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {payments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value || 0).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No payment data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Invoice Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-950/50 to-cyan-950/30 rounded-2xl p-6 border-l-4 border-l-blue-500 border border-blue-500/30 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-300 uppercase tracking-wider">Invoice Summary</h3>
            <CreditCard className="w-6 h-6 text-blue-400/60" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-blue-500/20">
              <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Total Invoices</span>
              <span className="text-3xl font-bold text-blue-300 font-mono">{invoices.count || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-blue-500/20">
              <span className="text-gray-400 font-medium text-sm">Paid Amount</span>
              <span className="text-2xl font-bold text-green-400 font-mono">
                ${(invoices.paid_amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-sm">Pending Amount</span>
              <span className="text-2xl font-bold text-orange-400 font-mono">
                ${(invoices.pending_amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Expense Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-orange-950/50 to-red-950/30 rounded-2xl p-6 border-l-4 border-l-orange-500 border border-orange-500/30 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-orange-300 uppercase tracking-wider">Expense Summary</h3>
            <TrendingDown className="w-6 h-6 text-orange-400/60" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-orange-500/20">
              <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Total Expenses</span>
              <span className="text-3xl font-bold text-orange-300 font-mono">{expenses.count || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-orange-500/20">
              <span className="text-gray-400 font-medium text-sm">Approved Amount</span>
              <span className="text-2xl font-bold text-red-400 font-mono">
                ${(expenses.total || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium text-sm">Average Expense</span>
              <span className="text-2xl font-bold text-yellow-400 font-mono">
                ${expenses.count ? ((expenses.total || 0) / expenses.count).toLocaleString('en-US', { maximumFractionDigits: 2 }) : 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Period Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-purple-950/50 to-pink-950/30 rounded-2xl p-6 border-l-4 border-l-purple-500 border border-purple-500/30 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Period Info
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
              <span className="text-gray-300 font-medium text-sm uppercase tracking-wide">Period</span>
              <span className="text-2xl font-bold text-purple-300 font-mono">{period.toUpperCase()}</span>
            </div>
            {metrics?.date_range && (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                  <span className="text-gray-400 font-medium text-sm">From</span>
                  <span className="text-lg font-semibold text-gray-300 font-mono text-sm">{metrics.date_range.start}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">To</span>
                  <span className="text-lg font-semibold text-gray-300 font-mono text-sm">{metrics.date_range.end}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default FinanceDashboard;
