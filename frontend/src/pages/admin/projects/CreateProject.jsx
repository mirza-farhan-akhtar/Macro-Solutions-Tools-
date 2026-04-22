import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    department_ids: [],
    member_assignments: [],
    metadata: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deptRes, usersRes] = await Promise.all([
        projectAPI.getDepartments(),
        projectAPI.getUsers()
      ]);
      
      setDepartments(deptRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load form data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || formData.department_ids.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate and sanitize member assignments
    const validRoles = ['Project Manager', 'Team Lead', 'Developer', 'Designer', 'Analyst', 'QA Engineer', 'DevOps Engineer', 'Consultant', 'Other'];
    const sanitizedMemberAssignments = formData.member_assignments.map(assignment => ({
      ...assignment,
      role_in_project: validRoles.includes(assignment.role_in_project) ? assignment.role_in_project : 'Developer'
    }));
    
    const sanitizedFormData = {
      ...formData,
      primary_department_id: formData.department_ids[0] ?? null,
      member_assignments: sanitizedMemberAssignments
    };

    try {
      setLoading(true);
      console.log('Form data being sent:', sanitizedFormData);
      console.log('Member assignments:', sanitizedFormData.member_assignments);
      await projectAPI.createProject(sanitizedFormData);
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      console.log('Error response:', error.response?.data);
      
      if (error.response?.data?.data) {
        const errors = error.response.data.data;
        Object.keys(errors).forEach(key => {
          const errorMessages = errors[key];
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach(msg => toast.error(msg));
          } else if (typeof errorMessages === 'string') {
            toast.error(errorMessages);
          } else {
            toast.error(`${key}: ${errorMessages}`);
          }
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create project');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentToggle = (deptId) => {
    const isSelected = formData.department_ids.includes(deptId);
    if (isSelected) {
      // Also remove members who only belong to this department (if no other dept selected)
      const remainingDeptIds = formData.department_ids.filter(id => id !== deptId);
      const filteredMembers = remainingDeptIds.length > 0
        ? formData.member_assignments.filter(m => {
            const u = users.find(u => u.id === m.user_id);
            return u && remainingDeptIds.some(id => Number(id) === Number(u.department_id));
          })
        : [];
      setFormData(prev => ({
        ...prev,
        department_ids: remainingDeptIds,
        member_assignments: filteredMembers,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        department_ids: [...prev.department_ids, deptId],
      }));
    }
  };

  const handleMemberToggle = (userId) => {
    const isSelected = formData.member_assignments.some(member => member.user_id === userId);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        member_assignments: prev.member_assignments.filter(member => member.user_id !== userId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        member_assignments: [...prev.member_assignments, { user_id: userId, role_in_project: 'Developer', is_lead: false }]
      }));
    }
  };

  const updateMemberRole = (userId, field, value) => {
    setFormData(prev => ({
      ...prev,
      member_assignments: prev.member_assignments.map(member =>
        member.user_id === userId 
          ? { ...member, [field]: value }
          : member
      )
    }));
  };

  const generateCode = () => {
    const name = formData.name.trim();
    if (!name) return;
    
    const code = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 6) + '-' + Date.now().toString().slice(-4);
    
    setFormData(prev => ({ ...prev, code }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/admin/projects')}
            className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
            <p className="text-slate-600 mt-1">Set up a new project with departments and team members</p>
          </div>
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
                  onBlur={generateCode}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                    placeholder="AUTO-GENERATED"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition"
                  >
                    Auto
                  </button>
                </div>
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
                    formData.department_ids.includes(dept.id)
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
                      formData.department_ids.includes(dept.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    }`}>
                      {formData.department_ids.includes(dept.id) && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.department_ids.length === 0 && (
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
              {/* Available Users — filtered by selected departments */}
              {formData.department_ids.length === 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
                  Select at least one department above to see available members.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users
                  .filter(u =>
                    formData.department_ids.length === 0
                      ? false
                      : formData.department_ids.some(id => Number(id) === Number(u.department_id))
                  )
                  .map(user => {
                  const isSelected = formData.member_assignments.some(m => m.user_id === user.id);
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
              {formData.member_assignments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-4">Selected Team Members ({formData.member_assignments.length})</h3>
                  <div className="space-y-3">
                    {formData.member_assignments.map(member => {
                      const user = users.find(u => u.id === member.user_id);
                      return (
                        <div key={member.user_id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.department?.name}</p>
                          </div>
                          
                          <select
                            value={member.role_in_project}
                            onChange={(e) => updateMemberRole(member.user_id, 'role_in_project', e.target.value)}
                            className="px-3 py-1 text-sm rounded border border-slate-200 focus:border-blue-500 outline-none"
                          >
                            <option value="Developer">Developer</option>
                            <option value="Team Lead">Team Lead</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Designer">Designer</option>
                            <option value="Analyst">Analyst</option>
                            <option value="QA Engineer">QA Engineer</option>
                            <option value="DevOps Engineer">DevOps Engineer</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Other">Other</option>
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
              onClick={() => navigate('/admin/projects')}
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
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Project
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;