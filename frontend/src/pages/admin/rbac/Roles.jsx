import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit2, Trash2, X, Save, Users } from 'lucide-react';
import { rolesAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.list();
      setRoles(response.data);
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await rolesAPI.permissions();
      setPermissions(response.data);
    } catch (error) {
      toast.error('Failed to load permissions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await rolesAPI.update(editingRole.id, formData);
        toast.success('Role updated successfully');
      } else {
        await rolesAPI.create(formData);
        toast.success('Role created successfully');
      }
      fetchRoles();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      await rolesAPI.delete(id);
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions?.map(p => p.id) || [],
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleAllInModule = (modulePermissions) => {
    const modulePermIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermIds.every(id => formData.permissions.includes(id));
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(id => !modulePermIds.includes(id))
        : [...new Set([...prev.permissions, ...modulePermIds])]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Roles Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <button
          onClick={() => openModal()}
          className="glass-button px-6 py-3 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{role.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{role.users_count || 0} users</span>
                  </div>
                </div>
              </div>
              {role.slug !== 'super-admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(role)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{role.description}</p>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">Permissions: {role.permissions?.length || 0}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.slice(0, 3).map(perm => (
                  <span key={perm.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {perm.module}
                  </span>
                ))}
                {role.permissions?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingRole ? 'Edit Role' : 'Create Role'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Permissions</label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.entries(permissions).map(([module, modulePerms]) => (
                      <div key={module} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold capitalize text-gray-800 flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span>{module.replace('-', ' ')}</span>
                            <span className="text-xs text-gray-500 font-normal">({modulePerms.length})</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => toggleAllInModule(modulePerms)}
                            className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            {modulePerms.every(p => formData.permissions.includes(p.id)) ? '✓ All' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {modulePerms.map((permission) => {
                            const actionName = permission.name.split(' ')[0]; // Extract View/Create/Edit/Delete
                            const actionColors = {
                              'View': 'text-green-700 bg-green-50 border-green-200',
                              'Create': 'text-blue-700 bg-blue-50 border-blue-200',
                              'Edit': 'text-yellow-700 bg-yellow-50 border-yellow-200',
                              'Delete': 'text-red-700 bg-red-50 border-red-200',
                            };
                            const colorClass = actionColors[actionName] || 'text-gray-700 bg-white border-gray-200';
                            
                            return (
                              <label 
                                key={permission.id} 
                                className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border transition-all ${colorClass} ${formData.permissions.includes(permission.id) ? 'ring-2 ring-blue-400 font-medium' : 'hover:shadow-sm'}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.permissions.includes(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500 w-4 h-4"
                                />
                                <span className="text-sm">{actionName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button px-6 py-2 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingRole ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
