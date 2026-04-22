import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Briefcase, Target, AlertCircle, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import crmAPI from '../../../services/crmAPI';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MetricCard = ({ icon: Icon, label, value, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300 blur-xl" style={{
      background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`
    }} />
    
    <div className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          {trend && <p className={`text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>}
        </div>
        <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  </motion.div>
);

export function CRMDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const loadDashboard = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await crmAPI.getDashboard();
      setDashboardData(response.data?.data || {});
      setLastUpdated(new Date());
    } catch (error) {
      toast.error('Failed to load CRM dashboard');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(false);
    intervalRef.current = setInterval(() => loadDashboard(true), 30000);
    return () => clearInterval(intervalRef.current);
  }, [loadDashboard]);

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-600 rounded-full" />
      </div>
    </div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-12 text-slate-500">No data available</div>;
  }

  const { metrics = {}, sales_funnel = [], revenue_trend = [], lead_sources = [], recent_activities = [], upcoming_follow_ups = [], recently_won_deals = [] } = dashboardData;

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">CRM Dashboard</h1>
              <p className="text-slate-600">Overview of sales performance and pipeline</p>
            </div>
            <div className="flex items-center gap-3">
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
                onClick={() => loadDashboard(false)}
                disabled={refreshing || loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          <MetricCard
            icon={Users}
            label="Total Leads"
            value={metrics.total_leads || 0}
            color="#8b5cf6"
          />
          <MetricCard
            icon={Target}
            label="Qualified Leads"
            value={metrics.qualified_leads || 0}
            color="#ec4899"
          />
          <MetricCard
            icon={Briefcase}
            label="Deals in Pipeline"
            value={metrics.deals_in_pipeline || 0}
            color="#06b6d4"
          />
          <MetricCard
            icon={TrendingUp}
            label="Revenue This Month"
            value={`$${(metrics.revenue_this_month || 0).toLocaleString()}`}
            color="#10b981"
          />
          <MetricCard
            icon={BarChart3}
            label="Conversion Rate"
            value={`${metrics.conversion_rate || 0}%`}
            color="#f59e0b"
          />
          <MetricCard
            icon={AlertCircle}
            label="Lost Deals"
            value={metrics.lost_deals || 0}
            color="#ef4444"
          />
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Sales Funnel */}
          {sales_funnel.length > 0 && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Sales Funnel</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sales_funnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Revenue Trend */}
          {revenue_trend.length > 0 && (
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Bottom Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Lead Sources */}
          {lead_sources.length > 0 && (
            <div className="lg:col-span-1 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Lead Sources</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={lead_sources}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {lead_sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activities</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recent_activities.length > 0 ? recent_activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Calendar size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-500">{activity.activity_type}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500 text-center py-4">No recent activities</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
