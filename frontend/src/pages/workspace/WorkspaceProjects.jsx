import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Search, Filter, ChevronRight, AlertCircle } from 'lucide-react';
import workspaceAPI from '../../services/workspaceAPI';

export function WorkspaceProjects() {
  const navigate = useNavigate();
  const { departmentSlug } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (departmentSlug) {
      loadProjects();
    }
  }, [departmentSlug, search, statusFilter, page]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setProjects([]);
      const res = await workspaceAPI.getProjects(departmentSlug, {
        search,
        status: statusFilter || undefined,
        page,
        per_page: 15
      });
      setProjects(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Department Projects</h1>
          <p className="text-slate-600">Manage all projects for your department workspace</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
              <button
                onClick={loadProjects}
                className="text-red-700 hover:underline text-sm mt-2"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/admin/projects/${project.id}`)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FolderKanban className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {project.name}
                      </h3>
                      {project.project_type === 'participating' && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                          Participating
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{project.code}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Created by: {project.creator?.name || 'Unknown'}</span>
                      {project.primaryDepartment && (
                        <span>Department: {project.primaryDepartment.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FolderKanban className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-slate-600">
              {search || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Your department has no projects yet'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
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
    case 'Planning':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function getPriorityColor(priority) {
  switch(priority) {
    case 'Critical':
      return 'bg-red-100 text-red-700';
    case 'High':
      return 'bg-orange-100 text-orange-700';
    case 'Medium':
      return 'bg-blue-100 text-blue-700';
    case 'Low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
