import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, Clock, TrendingUp, RefreshCw, AlertCircle, Building2 } from 'lucide-react';
import hrAPI from '../../../services/hrAPI';
import departmentAPI from '../../../services/departmentAPI';

export function HRDashboard() {
  const [data, setData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [hrRes, deptRes] = await Promise.all([
        hrAPI.getDashboard(),
        departmentAPI.getDepartments({ per_page: 100 })
      ]);
      setData(hrRes.data?.data);
      setDepartments(deptRes.data?.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load dashboard';
      setError(msg);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md border-l-4 border-red-500"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Error</h2>
          <p className="text-slate-600 text-center">{error}</p>
          <button
            onClick={loadData}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const metricsList = [
    { label: 'Total Employees', value: metrics.total_employees || 0, icon: Users, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active', value: metrics.active_employees || 0, icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    { label: 'Open Positions', value: metrics.open_positions || 0, icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
    { label: 'Applications', value: metrics.applications_this_month || 0, icon: FileText, color: 'bg-orange-100 text-orange-700' },
  ];

  const hiringTrend = data?.charts?.hiring_trend || [];
  const deptData = data?.charts?.department_distribution || [];
  const attendanceData = data?.charts?.attendance_summary || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">HR Dashboard</h1>
            <p className="text-slate-600 mt-2">Company HR metrics and analytics</p>
          </div>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsList.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Department Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Building2 size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Department Overview</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">{departments.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{dept.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      dept.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {dept.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{dept.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Code: <span className="font-mono font-semibold">{dept.code}</span></span>
                    <span className="text-blue-600 font-medium">{dept.employees?.length || 0} Employees</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hiring Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Hiring Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F1F5F9' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">By Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Attendance (This Month)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="status" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#F1F5F9' }} />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Interviews Scheduled</span>
                <span className="text-2xl font-bold text-blue-600">{metrics.pending_interviews || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Approved Leaves</span>
                <span className="text-2xl font-bold text-green-600">{metrics.approved_leaves || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Open Positions</span>
                <span className="text-2xl font-bold text-purple-600">{metrics.open_positions || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
