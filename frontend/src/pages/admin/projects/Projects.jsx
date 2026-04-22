import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Target,
  TrendingUp
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter, departmentFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsRes, deptRes] = await Promise.all([
        projectAPI.getProjects({ 
          search: searchTerm,
          status: statusFilter,
          priority: priorityFilter,
          department_id: departmentFilter,
          per_page: 50 
        }),
        projectAPI.getDepartments()
      ]);
      
      setProjects(projectsRes.data?.data?.data || []);
      setDepartments(deptRes.data?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load projects data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-700 border border-blue-200',
      'In Progress': 'bg-green-100 text-green-700 border border-green-200',
      'On Hold': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      'Completed': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      'Cancelled': 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-gray-500',
      'Medium': 'text-blue-500',
      'High': 'text-orange-500',
      'Critical': 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-400';
    if (progress >= 60) return 'bg-blue-400';
    if (progress >= 40) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <FolderKanban className="text-blue-600" />
              Project Management
            </h1>
            <p className="text-slate-600 mt-2">Manage projects, tasks, and team collaboration</p>
          </div>
          <Link
            to="/admin/projects/create"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Project
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-600 font-mono">{project.code}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {project.description || 'No description available'}
              </p>

              {/* Status and Progress */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-slate-600">{project.progress || 0}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">{project.statistics?.active_members || 0} Members</p>
                </div>
                <div className="text-center">
                  <Target className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">{project.statistics?.total_tasks || 0} Tasks</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">{project.statistics?.completed_tasks || 0} Done</p>
                </div>
              </div>

              {/* Departments */}
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                  {project.departments?.slice(0, 2).map(dept => (
                    <span key={dept.id} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      {dept.code}
                    </span>
                  ))}
                  {project.departments?.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{project.departments.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Due Date */}
              {project.end_date && (
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(project.end_date).toLocaleDateString()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="flex-1 text-center py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
                >
                  View Details
                </Link>
                <Link
                  to={`/admin/projects/${project.id}/edit`}
                  className="flex-1 text-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Edit
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FolderKanban size={64} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No projects found</h3>
            <p className="text-slate-500 mb-6">Create your first project to get started</p>
            <Link
              to="/admin/projects/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Plus size={20} />
              Create Project
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;