import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  Calendar,
  Users,
  Building2,
  Target,
  CheckCircle2,
  Clock,
  DollarSign,
  MoreVertical,
  Plus,
  Filter,
  Search,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [taskFilter, setTaskFilter] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ target_department_id: '', request_message: '' });
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes, requestsRes, deptsRes] = await Promise.all([
        projectAPI.getProject(projectId),
        projectAPI.getProjectTasks(projectId),
        projectAPI.getCollaborationRequests({ project_id: projectId }),
        projectAPI.getDepartments(),
      ]);
      
      setProject(projectRes.data.data);
      setTasks(tasksRes.data?.data?.data || []);
      setCollaborationRequests(requestsRes.data?.data?.data || []);
      setDepartments(deptsRes.data?.data || []);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project details');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await projectAPI.approveRequest(requestId);
      toast.success('Collaboration request approved!');
      loadProjectData(); // Reload to update member list
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId, reason = '') => {
    try {
      await projectAPI.rejectRequest(requestId, { reason });
      toast.success('Collaboration request rejected');
      loadProjectData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.target_department_id) {
      toast.error('Please select a target department');
      return;
    }
    try {
      setRequestSubmitting(true);
      await projectAPI.sendCollaborationRequest({
        project_id: parseInt(projectId),
        target_department_id: parseInt(requestForm.target_department_id),
        request_message: requestForm.request_message || undefined,
      });
      toast.success('Collaboration request sent!');
      setShowRequestModal(false);
      setRequestForm({ target_department_id: '', request_message: '' });
      loadProjectData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send request';
      toast.error(msg);
    } finally {
      setRequestSubmitting(false);
    }
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

  const getTaskStatusColor = (status) => {
    const colors = {
      'To Do': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'In Review': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Blocked': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !taskFilter || task.status === taskFilter;
    const matchesSearch = !taskSearch || 
      task.title?.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.description?.toLowerCase().includes(taskSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'To Do').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Project not found</p>
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
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/projects')}
              className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-slate-600 font-mono">{project.code}</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority} Priority
                </span>
              </div>
            </div>
            <Link
              to={`/admin/projects/${projectId}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit3 size={16} />
              Edit Project
            </Link>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Progress</p>
                  <p className="text-2xl font-bold text-slate-900">{project.progress || 0}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Team Members</p>
                  <p className="text-2xl font-bold text-slate-900">{project.statistics?.active_members || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-1 mb-6 shadow-sm border border-slate-200"
        >
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'requests', label: 'Requests', icon: AlertCircle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === 'requests' && collaborationRequests.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {collaborationRequests.filter(r => r.status === 'Pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Description</label>
                      <p className="text-slate-900 mt-1">{project.description || 'No description available'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600">Start Date</label>
                        <p className="text-slate-900 mt-1">
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600">End Date</label>
                        <p className="text-slate-900 mt-1">
                          {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departments */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Departments</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.departments?.map(dept => (
                      <span
                        key={dept.id}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                      >
                        <span className="font-medium">{dept.name}</span>
                        <span className="text-blue-500 ml-1">({dept.code})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Statistics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
                    <p className="text-sm text-slate-600">Total Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                    <p className="text-sm text-slate-600">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
                    <p className="text-sm text-slate-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Task Filters */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    </div>
                  </div>
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="">All Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <Link
                    to={`/admin/projects/${projectId}/tasks/create`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={16} />
                    Add Task
                  </Link>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.priority && (
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {task.description || 'No description'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {task.assigned_to && (
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {task.assigned_user?.name}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {task.estimated_hours && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {task.estimated_hours}h est.
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/tasks/${task.id}/edit?projectId=${projectId}`}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <Target size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No tasks found</h3>
                  <p className="text-slate-500 mb-4">Create your first task to get started</p>
                  <Link
                    to={`/admin/projects/${projectId}/tasks/create`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={16} />
                    Add Task
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.members?.map(member => (
                  <div
                    key={member.id}
                    className="p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {member.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{member.name || 'Unknown'}</h4>
                        <p className="text-sm text-slate-600">{member.pivot?.role_in_project || 'Member'}</p>
                        {member.pivot?.is_lead && (
                          <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded mt-1">
                            Team Lead
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Collaboration Requests</h3>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  Send Request
                </button>
              </div>
              
              {collaborationRequests.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">No collaboration requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <div
                      key={request.id}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">
                            {request.user?.name} - {request.user?.department?.name}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">{request.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Requested {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            request.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-700'
                              : request.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {request.status}
                          </span>
                          
                          {request.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Send Request Modal */}
      {showRequestModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Send Collaboration Request</h2>
            <button
              onClick={() => { setShowRequestModal(false); setRequestForm({ target_department_id: '', request_message: '' }); }}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <AlertCircle size={20} className="text-slate-500" />
            </button>
          </div>
          <form onSubmit={handleSendRequest} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Department *</label>
              <select
                value={requestForm.target_department_id}
                onChange={(e) => setRequestForm(prev => ({ ...prev, target_department_id: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              >
                <option value="">Select department to collaborate with</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
              <textarea
                value={requestForm.request_message}
                onChange={(e) => setRequestForm(prev => ({ ...prev, request_message: e.target.value }))}
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="Explain the collaboration request..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowRequestModal(false); setRequestForm({ target_department_id: '', request_message: '' }); }}
                className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestSubmitting}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {requestSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )}
  </div>
  );
};

export default ProjectDetail;