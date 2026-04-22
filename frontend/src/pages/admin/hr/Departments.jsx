import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, X, Code, Building2, Eye } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import { usersAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const DepartmentModal = ({ department, onClose, onSave, isSaving, users, allDepartments }) => {
  const [formData, setFormData] = useState(department || {
    name: '',
    code: '',
    description: '',
    head_id: '',
    parent_id: '',
    status: 'Active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Department name and code are required');
      return;
    }
    await onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold text-white">{department ? 'Edit Department' : 'New Department'}</h2>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition" type="button">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="e.g., Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  placeholder="e.g., ENG"
                  maxLength="20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                rows="3"
                placeholder="Department description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department Head</label>
                <select
                  value={formData.head_id}
                  onChange={(e) => setFormData({ ...formData, head_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                >
                  <option value="">Select a head</option>
                  {Array.isArray(users) ? users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  )) : null}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Parent Department</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                >
                  <option value="">None (Root Department)</option>
                  {Array.isArray(allDepartments) ? allDepartments.filter(d => (!department || d.id !== department.id)).map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  )) : null}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Department'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
  );
};

export function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptRes, usersRes] = await Promise.all([
        departmentAPI.getDepartments({ per_page: 100 }),
        usersAPI.getAll({ per_page: 500 }),
      ]);
      setDepartments(deptRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      if (editingDept) {
        await departmentAPI.updateDepartment(editingDept.id, formData);
        toast.success('Department updated successfully');
      } else {
        await departmentAPI.createDepartment(formData);
        toast.success('Department created successfully');
      }
      setShowModal(false);
      setEditingDept(null);
      await loadData();
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(error.response?.data?.message || 'Failed to save department');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.deleteDepartment(id);
        toast.success('Department deleted successfully');
        await loadData();
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error(error.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Departments', value: departments.length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Active', value: departments.filter(d => d.status === 'Active').length, color: 'bg-green-100 text-green-700' },
    { label: 'Inactive', value: departments.filter(d => d.status === 'Inactive').length, color: 'bg-slate-100 text-slate-700' },
  ];

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
            <h1 className="text-4xl font-bold text-slate-900">Departments</h1>
            <p className="text-slate-600 mt-2">Manage organization departments and structure</p>
          </div>
          <button
            onClick={() => { setEditingDept(null); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Department
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Building2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDepartments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredDepartments.map((dept) => (
              <motion.div
                key={dept.id}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{dept.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Code size={14} className="text-slate-500" />
                      <span className="text-sm text-slate-600 font-mono">{dept.code}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    dept.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {dept.status}
                  </span>
                </div>

                {dept.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{dept.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Head</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{dept.head?.name || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Employees</p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">{dept.employees?.length || 0}</p>
                  </div>
                </div>

                {dept.parent && (
                  <p className="text-xs text-slate-500 mb-4">
                    Parent: {dept.parent.name}
                  </p>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/admin/hr/departments/${dept.slug || dept.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 font-medium transition"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => { setEditingDept(dept); setShowModal(true); }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No departments found</h3>
            <p className="text-slate-500 mb-6">Create your first department to get started</p>
            <button
              onClick={() => { setEditingDept(null); setShowModal(true); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Plus size={20} />
              Create Department
            </button>
          </motion.div>
        )}

        {/* Modal */}
        {showModal && (
          <DepartmentModal
            department={editingDept}
            onClose={() => { setShowModal(false); setEditingDept(null); }}
            onSave={handleSave}
            isSaving={isSaving}
            users={users}
            allDepartments={departments}
          />
        )}
      </div>
    </div>
  );
}

export default Departments;
