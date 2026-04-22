import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Users, Clock, Target, AlertCircle } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import toast from 'react-hot-toast';

export function DepartmentAnalytics() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setAnalytics(null);
      let dept = null;
      
      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        if (deptPayload && typeof deptPayload === 'object' && deptPayload.name) {
          dept = {
            id: deptPayload.id || slug,
            name: deptPayload.name,
            description: deptPayload.description || ''
          };
        }
      } catch (error) {
        console.warn('Department API failed:', error.message);
      }
      
      if (!dept) {
        dept = { id: slug, name: `Department ${slug}`, description: '' };
      }
      setDepartment(dept);

      // Fetch analytics from API
      try {
        const response = await departmentAPI.getDepartmentAnalytics(slug);
        const analyticsData = response.data?.data || {};
        setAnalytics(analyticsData);
      } catch (error) {
        console.warn('Analytics API failed:', error.message);
        setAnalytics({});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartment({ id: slug, name: `Department ${slug}` });
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Employees', value: analytics?.total_employees || 0, icon: Users, change: analytics?.active_employees ? `+${analytics.active_employees} active` : '', positive: true },
    { label: 'Total Projects', value: analytics?.total_projects || 0, icon: Target, change: analytics?.completed_projects ? `${analytics.completed_projects} completed` : '', positive: true },
    { label: 'Completed Tasks', value: analytics?.completed_tasks || 0, icon: TrendingUp, change: analytics?.total_tasks ? `of ${analytics.total_tasks}` : '', positive: true },
    { label: 'Total Meetings', value: analytics?.total_meetings || 0, icon: Clock, change: '+', positive: true }
  ];

  const budgetMetrics = [
    { label: 'Total Budget', value: `$${(analytics?.project_budget_total || 0).toLocaleString()}` },
    { label: 'Amount Spent', value: `$${(analytics?.project_spent || 0).toLocaleString()}` },
    { label: 'Remaining', value: `$${((analytics?.project_budget_total || 0) - (analytics?.project_spent || 0)).toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/60 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Comprehensive department performance metrics</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <p className={`text-sm mt-2 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.positive ? '↑' : '↓'} {metric.change}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Monthly Trends
            </h3>
            <div className="space-y-6">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{data.projects} projects</span>
                      <span>{data.tasks} tasks</span>
                    </div>
                  </div>
                  <div className="flex gap-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(data.projects / 12) * 100}%` }}
                      className="bg-blue-500 rounded-full"
                    />
                    <div
                      style={{ width: `${(data.tasks / 61) * 100}%` }}
                      className="bg-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Department Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Productivity Comparison
            </h3>
            <div className="space-y-4">
              {departmentComparison.map((dept, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{dept.productivity}%</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.productivity}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                      className={`h-full rounded-full ${
                        dept.productivity >= 90 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm">Total Headcount</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-500 mt-1">100% capacity</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-xs text-gray-500 mt-1">$390K of $500K</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-600 text-sm">Project Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-gray-500 mt-1">12 of 12 on-track</p>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">High Workload Detected</p>
              <p className="text-sm text-amber-800 mt-1">The team is currently handling 25% more tasks than optimal capacity. Consider resource allocation review.</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Budget Status</p>
              <p className="text-sm text-blue-800 mt-1">At current spending pace, you will utilize remaining budget by end of Q2. Plan for additional allocations.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DepartmentAnalytics;
