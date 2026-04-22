import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Users,
  Building2,
  Target,
  FileText,
  DollarSign,
  AlertTriangle,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const EditProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    start_date: '',
    end_date: '',
    budget: '',
    departments: [],
    members: [],
    metadata: {}
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      const [projectRes, deptRes, usersRes] = await Promise.all([
        projectAPI.getProject(projectId),
        projectAPI.getDepartments(),
        projectAPI.getUsers()
      ]);
      
      const project = projectRes.data.data;
      setFormData({
        name: project.name || '',
        code: project.code || '',
        description: project.description || '',
        status: project.status || 'Planning',
        priority: project.priority || 'Medium',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        budget: project.budget || '',
        departments: project.departments?.map(d => d.id) || [],
        members: project.members?.map(m => ({
          user_id: m.user_id,
          role: m.role,
          is_lead: m.is_lead
        })) || [],
        metadata: project.metadata || {}
      });
      
      setDepartments(deptRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load project data');
      navigate('/admin/projects');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || formData.departments.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await projectAPI.updateProject(projectId, formData);
      toast.success('Project updated successfully!');
      navigate(`/admin/projects/${projectId}`);
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg));
        });
      } else {
        toast.error('Failed to update project');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectAPI.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleDepartmentToggle = (deptId) => {
    const isSelected = formData.departments.includes(deptId);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        departments: prev.departments.filter(id => id !== deptId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, deptId]
      }));
    }
  };

  const handleMemberToggle = (userId) => {
    const isSelected = formData.members.some(member => member.user_id === userId);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter(member => member.user_id !== userId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, { user_id: userId, role: 'Member', is_lead: false }]
      }));
    }
  };

  const updateMemberRole = (userId, field, value) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map(member =>
        member.user_id === userId 
          ? { ...member, [field]: value }
          : member
      )
    }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Project</h1>
              <p className="text-slate-600 mt-1">Update project details and settings</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            Delete Project
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">Project Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="PROJECT-CODE"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Describe the project objectives and scope"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Timeline & Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">Timeline & Budget</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </motion.div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">Departments *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => handleDepartmentToggle(dept.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.departments.includes(dept.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{dept.name}</h4>
                      <p className="text-sm text-slate-500">{dept.code}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.departments.includes(dept.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {formData.departments.includes(dept.id) && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.departments.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm">Please select at least one department</span>
              </div>
            )}
          </motion.div>

          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
            </div>

            <div className="space-y-4">
              {/* Available Users */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(user => {
                  const isSelected = formData.members.some(m => m.user_id === user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleMemberToggle(user.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{user.name}</h4>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <p className="text-xs text-slate-500">{user.department?.name}</p>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Members Configuration */}
              {formData.members.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-4">Selected Team Members ({formData.members.length})</h3>
                  <div className="space-y-3">
                    {formData.members.map(member => {
                      const user = users.find(u => u.id === member.user_id);
                      return (
                        <div key={member.user_id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.department?.name}</p>
                          </div>
                          
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.user_id, 'role', e.target.value)}
                            className="px-3 py-1 text-sm rounded border border-slate-200 focus:border-blue-500 outline-none"
                          >
                            <option value="Member">Member</option>
                            <option value="Lead">Lead</option>
                            <option value="Manager">Manager</option>
                          </select>

                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={member.is_lead}
                              onChange={(e) => updateMemberRole(member.user_id, 'is_lead', e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Team Lead
                          </label>

                          <button
                            type="button"
                            onClick={() => handleMemberToggle(member.user_id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <button
              type="button"
              onClick={() => navigate(`/admin/projects/${projectId}`)}
              className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Project
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;