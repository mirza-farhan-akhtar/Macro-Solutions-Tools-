import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Briefcase, Mail, DollarSign, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { usePermission } from '../../context/PermissionContext';
import departmentAPI from '../../services/departmentAPI';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, isSuperAdmin, hasRole, roles, loading: permLoading } = usePermission();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check user's roles - extract role slugs
  const userRoleSlugs = Array.isArray(roles) ? roles.map(r => typeof r === 'object' ? r.slug : r) : [];
  const isFinanceOnly = userRoleSlugs.includes('finance-manager') && !hasPermission('users.view') && !hasPermission('services.view');

  useEffect(() => {
    // Wait for permissions to load
    if (permLoading) {
      return;
    }
    
    // If user only has Finance role (no admin/general permissions), redirect ONLY if at main dashboard
    // Don't redirect if already at a specific finance page to avoid loop
    if (isFinanceOnly && location.pathname === '/admin') {
      navigate('/admin/finance/dashboard', { replace: true });
      return;
    }
    
    fetchDashboardData();
  }, [permLoading, location.pathname]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartsRes, activityRes, deptRes] = await Promise.all([
        dashboardAPI.stats(),
        dashboardAPI.charts(),
        dashboardAPI.activity(),
        departmentAPI.getDepartments({ per_page: 100 })
      ]);

      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setActivity(activityRes.data);
      setDepartments(deptRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }

  // Define metric cards with role-based visibility
  const allMetricCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      change: stats?.users?.change || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      visibleFor: ['super-admin', 'admin'], // Only admins see total users
    },
    {
      title: 'Active Services',
      value: stats?.services?.total || 0,
      change: stats?.services?.change || 0,
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      visibleFor: ['super-admin', 'admin', 'content-manager'], // Admin and content managers
    },
    {
      title: 'Leads This Month',
      value: stats?.leads?.total || 0,
      change: stats?.leads?.change || 0,
      icon: Mail,
      color: 'from-green-500 to-teal-500',
      visibleFor: ['super-admin', 'admin', 'sales-manager'], // Admin and sales
    },
    {
      title: 'Revenue',
      value: `£${(stats?.revenue?.total || 0).toLocaleString()}`,
      change: stats?.revenue?.change || 0,
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      visibleFor: ['super-admin', 'admin', 'finance-manager', 'accountant'], // Finance roles
    },
  ];

  // Filter metric cards based on user role or permissions
  // For super admin: show all
  // For other users: show cards visible for their roles, or if they have the permission
  // Fallback: show all cards if user has admin dashboard permissions explicitly
  const metricCards = isSuperAdmin 
    ? allMetricCards 
    : allMetricCards.filter(card => {
        // Check if card is visible for user's roles
        const visibleForRole = card.visibleFor && card.visibleFor.some(role => userRoleSlugs.includes(role));
        // Fallback: show card if user has any relevant permission
        const visibleByPermission = hasPermission('dashboard.view') || hasPermission('admin.view') || visibleForRole;
        return visibleByPermission;
      });

  const leadsChartData = charts?.labels?.map((label, index) => ({
    name: label,
    leads: charts.leads[index],
  })) || [];

  const revenueChartData = charts?.labels?.map((label, index) => ({
    name: label,
    income: charts.revenue.income[index],
    expense: charts.revenue.expense[index],
  })) || [];

  const blogViewsData = charts?.labels?.map((label, index) => ({
    name: label,
    views: charts.blogViews[index],
  })) || [];

  const applicationsData = charts?.labels?.map((label, index) => ({
    name: label,
    applications: charts.applications[index],
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Show message if user has no visible metrics - but this is now a fallback only */}
      {metricCards.length === 0 && !isSuperAdmin && (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-600 mb-4">
            Dashboard metrics are being customized for your role. 
          </p>
          <p className="text-sm text-gray-500 mb-4">
            You have {roles?.length || 0} role{(roles?.length || 0) !== 1 ? 's' : ''}: {roles?.map(r => r.name).join(', ')}
          </p>
          {isFinanceOnly && (
            <p className="text-sm text-gray-500 mt-4">
              👉 As a Finance Manager, you can access the <button onClick={() => navigate('/admin/finance/dashboard')} className="text-[var(--primary)] hover:underline font-semibold">Finance Dashboard</button> to view financial metrics.
            </p>
          )}
        </div>
      )}

      {/* Metric Cards */}
      {metricCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  card.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{card.value}</h3>
              <p className="text-gray-600 text-sm">{card.title}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Department Overview */}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Chart - Show for admin, sales-manager, or if they have leads.view permission */}
        {(isSuperAdmin || hasPermission('leads.view') || userRoleSlugs.includes('sales-manager') || userRoleSlugs.includes('admin')) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Leads Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line type="monotone" dataKey="leads" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Revenue Chart - Show for admin, finance-manager, or if they have finance permission */}
        {(isSuperAdmin || hasPermission('leads.view') || userRoleSlugs.includes('finance-manager') || userRoleSlugs.includes('accountant') || userRoleSlugs.includes('admin')) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Blog Views Chart - Show for content managers or those with view permission */}
        {(isSuperAdmin || hasPermission('blogs.view') || userRoleSlugs.includes('content-manager') || userRoleSlugs.includes('admin')) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Blog Traffic</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={blogViewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#06B6D4" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Applications Chart - Show for all admins */}
        {(isSuperAdmin || hasPermission('applications.view') || userRoleSlugs.includes('admin')) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="applications" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Recent Activity */}
      {activity && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Leads - Show for sales/CRM users */}
          {(isSuperAdmin || hasPermission('leads.view') || userRoleSlugs.includes('sales-manager') || userRoleSlugs.includes('admin')) && activity.leads && activity.leads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Latest Leads</h2>
              <div className="space-y-3">
                {activity.leads.map((lead) => (
                  <div key={lead.id} className="glass-table-row p-3 rounded-lg">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Applications - Show for all admins */}
          {(isSuperAdmin || hasPermission('applications.view') || userRoleSlugs.includes('admin')) && activity.applications && activity.applications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
              <div className="space-y-3">
                {activity.applications.map((app) => (
                  <div key={app.id} className="glass-table-row p-3 rounded-lg">
                    <p className="font-medium">{app.applicant_name}</p>
                    <p className="text-sm text-gray-600 truncate">{app.applicant_email}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 inline-block mt-1">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Latest Blog Posts - Show for content managers */}
          {(isSuperAdmin || hasPermission('blogs.view') || userRoleSlugs.includes('content-manager') || userRoleSlugs.includes('admin')) && activity.blogs && activity.blogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Latest Blog Posts</h2>
              <div className="space-y-3">
                {activity.blogs.map((blog) => (
                  <div key={blog.id} className="glass-table-row p-3 rounded-lg">
                    <p className="font-medium line-clamp-1">{blog.title}</p>
                    <p className="text-sm text-gray-600">{blog.views} views</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 inline-block mt-1">
                      {blog.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
