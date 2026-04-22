import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus, Search, Calendar, Users, MoreVertical, X } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import toast from 'react-hot-toast';

export function DepartmentProjects() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    start_date: '',
    end_date: '',
    budget: '',
    assigned_employees: [],
    request_to_departments: []
  });

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setProjects([]);
      let dept = null;
      let apiStats = null;
      
      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        apiStats = response.data?.stats;
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

      // Fetch employees for this department
      try {
        const empResponse = await departmentAPI.getDepartmentEmployees(slug);
        const empData = empResponse.data?.data || [];
        setEmployees(Array.isArray(empData) ? empData : []);
      } catch (error) {
        console.warn('Employees API failed:', error.message);
        setEmployees([]);
      }

      // Fetch all departments for request options
      try {
        const deptResponse = await departmentAPI.getDepartments();
        const deptData = deptResponse.data?.data || [];
        // Filter out current department
        const otherDepts = Array.isArray(deptData) ? deptData.filter(d => d.slug !== slug) : [];
        setDepartments(otherDepts);
      } catch (error) {
        console.warn('Departments API failed:', error.message);
        setDepartments([]);
      }

      // Fetch projects for this department from API
      try {
        const response = await departmentAPI.getDepartmentProjects(slug);
        const projectData = response.data?.data || response.data;
        const projectsList = Array.isArray(projectData) ? projectData : [];
        setProjects(projectsList);
      } catch (error) {
        console.warn('Projects API failed:', error.message);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartment({ id: slug, name: `Department ${slug}` });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'Planning',
      priority: 'Medium',
      start_date: '',
      end_date: '',
      budget: '',
      assigned_employees: [],
      request_to_departments: []
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'request_to_departments') {
        const deptId = parseInt(value);
        setFormData(prev => ({
          ...prev,
          request_to_departments: checked
            ? [...prev.request_to_departments, deptId]
            : prev.request_to_departments.filter(id => id !== deptId)
        }));
      } else {
        const employeeId = parseInt(value);
        setFormData(prev => ({
          ...prev,
          assigned_employees: checked
            ? [...prev.assigned_employees, employeeId]
            : prev.assigned_employees.filter(id => id !== employeeId)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await departmentAPI.createDepartmentProject(slug, formData);
      if (response.data?.data) {
        const newProject = response.data.data;
        toast.success('Project created successfully!');
        
        // Send requests to selected departments
        if (formData.request_to_departments.length > 0) {
          const requestPromises = formData.request_to_departments.map(deptId =>
            departmentAPI.sendProjectRequest(currentDept.id, {
              project_id: newProject.id,
              target_department_id: deptId
            }).catch(err => {
              console.error(`Failed to send request to department ${deptId}:`, err);
              toast.warning(`Could not send request to one department`);
            })
          );
          await Promise.all(requestPromises);
        }
        
        setProjects([...projects, newProject]);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-white/60 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Projects</h1>
                <p className="text-gray-600 mt-1">Manage department projects</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FolderPlus className="w-4 h-4" />
              New Project
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        {project.project_type === 'participating' && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                            Participating
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'}
                        {' to '}
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Create Project Modal */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                {/* Project Name and Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., PROJ-001"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Project description"
                  />
                </div>

                {/* Status, Priority, Budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Start and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Assign Employees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employees</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {employees.length === 0 ? (
                      <p className="text-gray-500 text-sm">No employees in this department</p>
                    ) : (
                      <div className="space-y-2">
                        {employees.map((emp) => (
                          <label key={emp.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              value={emp.id}
                              checked={formData.assigned_employees.includes(emp.id)}
                              onChange={handleFormChange}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{emp.name || emp.email}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Request to Departments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send Requests to Departments</label>
                  <p className="text-xs text-gray-500 mb-3">Select departments to request their involvement in this project</p>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {departments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No other departments available</p>
                    ) : (
                      <div className="space-y-2">
                        {departments.map((dept) => (
                          <label key={dept.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="request_to_departments"
                              value={dept.id}
                              checked={formData.request_to_departments.includes(dept.id)}
                              onChange={handleFormChange}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">{dept.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Project'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DepartmentProjects;
