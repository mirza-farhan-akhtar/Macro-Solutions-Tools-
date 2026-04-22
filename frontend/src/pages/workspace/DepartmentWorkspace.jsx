import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderKanban, Users, FileText, Bell, ArrowRight, 
  TrendingUp, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import workspaceAPI from '../../services/workspaceAPI';

export function DepartmentWorkspace() {
  const navigate = useNavigate();
  const { departmentSlug } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (departmentSlug) {
      loadDashboard();
    }
  }, [departmentSlug]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await workspaceAPI.getDashboard(departmentSlug);
      setDashboard(res.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workspace');
      console.error('Workspace error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading workspace...</p>
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
          <p className="text-slate-600 text-center mb-6">{error}</p>
          <button
            onClick={loadDashboard}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const department = dashboard?.department || {};
  const recentProjects = dashboard?.recent_projects || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {department.name} Workspace
        </h1>
        <p className="text-slate-600">
          Welcome to your department workspace. Manage projects, team members, and collaborate efficiently.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={stats.total_projects || 0}
          subValue={`${stats.active_projects || 0} active`}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed_projects || 0}
          color="green"
        />
        <StatCard
          icon={Users}
          label="Team Members"
          value={stats.team_members || 0}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Department"
          value={department.code || 'N/A'}
          subValue={department.head?.name || 'No head assigned'}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-blue-600" />
              Recent Projects
            </h2>
            <button
              onClick={() => navigate(`/workspace/${departmentSlug}/projects`)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600">{project.code}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600">No projects yet. Create one to get started.</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions & Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <ActionButton
                icon={FolderKanban}
                label="View Projects"
                onClick={() => navigate(`/workspace/${departmentSlug}/projects`)}
              />
              <ActionButton
                icon={Users}
                label="Team Members"
                onClick={() => navigate(`/workspace/${departmentSlug}/team`)}
              />
              <ActionButton
                icon={Bell}
                label="Notifications"
                onClick={() => navigate(`/workspace/${departmentSlug}/notifications`)}
              />
            </div>
          </div>

          {/* Department Info */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Department Info</h3>
            <div className="space-y-2 text-sm text-blue-900">
              <p><strong>Department:</strong> {department.name}</p>
              <p><strong>Code:</strong> {department.code}</p>
              {department.head && (
                <p><strong>Head:</strong> {department.head.name}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, color }) {
  const colors = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    green: 'from-green-50 to-green-100 border-green-200 text-green-900',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-900',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 border shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 opacity-70" />
      </div>
      <p className="text-sm font-medium opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {subValue && <p className="text-xs opacity-60 mt-1">{subValue}</p>}
    </motion.div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-900 font-medium transition"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 ml-auto" />
    </motion.button>
  );
}

function getStatusColor(status) {
  switch(status) {
    case 'In Progress':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
