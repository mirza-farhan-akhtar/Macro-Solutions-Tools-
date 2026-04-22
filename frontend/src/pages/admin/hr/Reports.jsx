import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Download, TrendingUp, Users, Briefcase, DollarSign,
  Calendar, RefreshCw, AlertCircle,
} from 'lucide-react';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

export function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const [dashRes, statsRes] = await Promise.all([
        hrAPI.getDashboard(),
        hrAPI.getRecruitmentStats(),
      ]);
      setReports({
        dashboard: dashRes.data?.data,
        recruitment: statsRes.data?.data,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load reports';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) { toast.error('No data to export'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const reportTypes = [
    { id: 'overview',    title: 'HR Overview',     icon: TrendingUp, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   description: 'General HR metrics and trends' },
    { id: 'recruitment', title: 'Recruitment',     icon: Briefcase,  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',  description: 'Hiring pipeline and statistics' },
    { id: 'payroll',     title: 'Payroll Summary', icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',   description: 'Salary and compensation data' },
    { id: 'attendance',  title: 'Attendance',      icon: Calendar,   color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200',  description: 'Attendance and leave analysis' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading HR reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md border-l-4 border-red-500">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Error</h2>
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button onClick={loadReports} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dash = reports?.dashboard;
  const rec  = reports?.recruitment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">HR Reports & Analytics</h1>
            <p className="text-slate-500 mt-1">Comprehensive human resources analytics and insights</p>
          </div>
          <button
            onClick={loadReports}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Report Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const active = selectedReport === report.id;
            return (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedReport(report.id)}
                className={`rounded-xl p-5 text-left border-2 transition shadow-sm hover:shadow-md ${
                  active ? `${report.bg} ${report.border}` : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit mb-3 ${active ? report.bg : 'bg-slate-100'}`}>
                  <Icon size={20} className={active ? report.color : 'text-slate-500'} />
                </div>
                <h3 className={`font-semibold text-sm ${active ? report.color : 'text-slate-700'}`}>{report.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* ── Overview Panel ── */}
        {selectedReport === 'overview' && dash && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Employees',    value: dash.metrics?.total_employees,    icon: Users,      bg: 'bg-blue-100',   text: 'text-blue-700' },
                { label: 'Active Employees',   value: dash.metrics?.active_employees,   icon: TrendingUp, bg: 'bg-green-100',  text: 'text-green-700' },
                { label: 'Open Positions',     value: dash.metrics?.open_positions,     icon: Briefcase,  bg: 'bg-purple-100', text: 'text-purple-700' },
                { label: 'Pending Interviews', value: dash.metrics?.pending_interviews, icon: Calendar,   bg: 'bg-orange-100', text: 'text-orange-700' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{card.value ?? 0}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.bg}`}><Icon size={22} className={card.text} /></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Hiring Trend (6 Months)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dash.charts?.hiring_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: 13 }} />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={dash.charts?.department_distribution || []} cx="50%" cy="48%" outerRadius={90}
                      dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {(dash.charts?.department_distribution || []).map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => exportToCSV([
                  { Metric: 'Total Employees',      Value: dash.metrics?.total_employees ?? 0 },
                  { Metric: 'Active Employees',     Value: dash.metrics?.active_employees ?? 0 },
                  { Metric: 'Open Positions',       Value: dash.metrics?.open_positions ?? 0 },
                  { Metric: 'Applications (Month)', Value: dash.metrics?.applications_this_month ?? 0 },
                  { Metric: 'Pending Interviews',   Value: dash.metrics?.pending_interviews ?? 0 },
                  { Metric: 'Approved Leaves',      Value: dash.metrics?.approved_leaves ?? 0 },
                ], 'HR_Overview_Report.csv')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <Download size={18} />Export Overview Report
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Recruitment Panel ── */}
        {selectedReport === 'recruitment' && rec && (
          <motion.div key="recruitment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Open Jobs',          value: rec.open_jobs ?? 0,           icon: Briefcase,  bg: 'bg-blue-100',   text: 'text-blue-700' },
                { label: 'Total Applications', value: rec.total_applications ?? 0,  icon: Users,      bg: 'bg-purple-100', text: 'text-purple-700' },
                { label: 'Conversion Rate',    value: rec.total_applications ? `${((rec.hired_count / rec.total_applications) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, bg: 'bg-green-100', text: 'text-green-700' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.bg}`}><Icon size={22} className={card.text} /></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recruitment Pipeline</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { stage: 'Applied',     count: rec.applied_count ?? 0 },
                  { stage: 'Shortlisted', count: rec.shortlisted_count ?? 0 },
                  { stage: 'Interview',   count: rec.interview_count ?? 0 },
                  { stage: 'Hired',       count: rec.hired_count ?? 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: 13 }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => exportToCSV([
                  { Metric: 'Open Jobs',          Count: rec.open_jobs ?? 0 },
                  { Metric: 'Total Applications', Count: rec.total_applications ?? 0 },
                  { Metric: 'Applied',            Count: rec.applied_count ?? 0 },
                  { Metric: 'Shortlisted',        Count: rec.shortlisted_count ?? 0 },
                  { Metric: 'Interview',          Count: rec.interview_count ?? 0 },
                  { Metric: 'Hired',              Count: rec.hired_count ?? 0 },
                ], 'Recruitment_Report.csv')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <Download size={18} />Export Recruitment Report
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Payroll Placeholder ── */}
        {selectedReport === 'payroll' && (
          <motion.div key="payroll" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 border border-slate-200 text-center">
            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <DollarSign size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Payroll Module</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Integration with the Finance module for salary and compensation data is coming soon.</p>
          </motion.div>
        )}

        {/* ── Attendance Placeholder ── */}
        {selectedReport === 'attendance' && (
          <motion.div key="attendance" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 border border-slate-200 text-center">
            <div className="p-4 bg-orange-100 rounded-full w-fit mx-auto mb-4">
              <Calendar size={40} className="text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Attendance Analysis</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Detailed attendance patterns and leave statistics report is coming soon.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default Reports;
