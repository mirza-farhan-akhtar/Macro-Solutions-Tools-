import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Zap, RefreshCw } from 'lucide-react';
import crmAPI from '../../../services/crmAPI';
import toast from 'react-hot-toast';

export function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const loadReports = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await crmAPI.getDashboard();
      const data = response.data?.data || {};
      setDashboard(data);
      if (data.sales_funnel) {
        setFunnelData(data.sales_funnel);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReports(false);
    intervalRef.current = setInterval(() => loadReports(true), 60000);
    return () => clearInterval(intervalRef.current);
  }, [loadReports]);

  const handleExportCSV = () => {
    if (!dashboard) return;

    let csvContent = 'CRM Reports Export\n';
    csvContent += new Date().toLocaleDateString() + '\n\n';

    csvContent += 'Sales Metrics\n';
    csvContent += `Total Leads,${dashboard.metrics?.total_leads || 0}\n`;
    csvContent += `Qualified Leads,${dashboard.metrics?.qualified_leads || 0}\n`;
    csvContent += `Deals in Pipeline,${dashboard.metrics?.deals_in_pipeline || 0}\n`;
    csvContent += `Revenue This Month,${dashboard.metrics?.revenue_this_month || 0}\n`;
    csvContent += `Conversion Rate,${dashboard.metrics?.conversion_rate || 0}%\n`;
    csvContent += `Lost Deals,${dashboard.metrics?.lost_deals || 0}\n\n`;

    csvContent += 'Sales by Executive\n';
    csvContent += 'Executive,Revenue\n';
    if (dashboard.sales_by_executive) {
      dashboard.sales_by_executive.forEach(item => {
        csvContent += `${item.name || 'Unknown'},${item.value || 0}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-reports-${new Date().getTime()}.csv`;
    a.click();

    toast.success('Report exported');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600 mt-2">Sales performance and insights</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-semibold text-green-700">Live</span>
            </div>
            {lastUpdated && (
              <span className="text-xs text-slate-400 hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => loadReports(false)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="text-blue-600" size={20} />
              </div>
              <span className="text-sm text-slate-600">Conversion Rate</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{dashboard?.metrics?.conversion_rate || 0}%</p>
          </motion.div>

          <motion.div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <span className="text-sm text-slate-600">Revenue (Month)</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">${dashboard?.metrics?.revenue_this_month || 0}</p>
          </motion.div>

          <motion.div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <span className="text-sm text-slate-600">In Pipeline</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{dashboard?.metrics?.deals_in_pipeline || 0}</p>
          </motion.div>

          <motion.div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Users className="text-pink-600" size={20} />
              </div>
              <span className="text-sm text-slate-600">Qualified Leads</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{dashboard?.metrics?.qualified_leads || 0}</p>
          </motion.div>
        </motion.div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Sales Funnel</h2>
            {funnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No funnel data available
              </div>
            )}
          </motion.div>

          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Trend (12 Months)</h2>
            {dashboard?.revenue_trend && dashboard.revenue_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboard.revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No revenue data available
              </div>
            )}
          </motion.div>

          {/* Lead Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Lead Sources</h2>
            {dashboard?.lead_sources && dashboard.lead_sources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboard.lead_sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {[
                      '#a855f7',
                      '#ec4899',
                      '#f59e0b',
                      '#10b981',
                      '#3b82f6',
                      '#8b5cf6',
                      '#06b6d4',
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No lead source data available
              </div>
            )}
          </motion.div>

          {/* Sales by Executive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Sales by Executive</h2>
            {dashboard?.sales_by_executive && dashboard.sales_by_executive.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard.sales_by_executive}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No sales data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Recently Won Deals */}
        {dashboard?.recently_won_deals && dashboard.recently_won_deals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recently Won Deals</h2>
            <div className="space-y-2">
              {dashboard.recently_won_deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{deal.deal_name || 'Unnamed Deal'}</p>
                    <p className="text-sm text-slate-600">{deal.client?.company_name || 'Unknown Client'}</p>
                  </div>
                  <p className="font-bold text-green-600">${deal.value || 0}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
