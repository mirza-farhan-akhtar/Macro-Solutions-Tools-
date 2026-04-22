import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { permissionsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function Permissions() {
  const [permissions, setPermissions] = useState({});
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    module: '',
    description: '',
  });

  useEffect(() => {
    fetchPermissions();
    fetchModules();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await permissionsAPI.list();
      setPermissions(response.data);
    } catch (error) {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await permissionsAPI.modules();
      setModules(response.data);
    } catch (error) {
      console.error('Failed to load modules');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await permissionsAPI.update(editingPermission.id, formData);
        toast.success('Permission updated successfully');
      } else {
        await permissionsAPI.create(formData);
        toast.success('Permission created successfully');
      }
      fetchPermissions();
      fetchModules();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    
    try {
      await permissionsAPI.delete(id);
      toast.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const openModal = (permission = null) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        name: permission.name,
        module: permission.module,
        description: permission.description || '',
      });
    } else {
      setEditingPermission(null);
      setFormData({
        name: '',
        module: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPermission(null);
    setFormData({ name: '', module: '', description: '' });
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
          <h1 className="text-3xl font-bold mb-2">Permissions Management</h1>
          <p className="text-gray-600">Manage system permissions</p>
        </div>
        <button
          onClick={() => openModal()}
          className="glass-button px-6 py-3 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Permission</span>
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(permissions).map(([module, modulePerms]) => (
          <motion.div
            key={module}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold capitalize mb-4 flex items-center space-x-2">
              <Key className="w-5 h-5 text-blue-600" />
              <span>{module.replace('-', ' ')} Module</span>
              <span className="text-sm font-normal text-gray-500">({modulePerms.length} permissions)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {modulePerms.map((permission) => {
                const actionName = permission.name.split(' ')[0]; // Extract View/Create/Edit/Delete
                const actionColors = {
                  'View': 'border-l-4 border-green-500 bg-green-50',
                  'Create': 'border-l-4 border-blue-500 bg-blue-50',
                  'Edit': 'border-l-4 border-yellow-500 bg-yellow-50',
                  'Delete': 'border-l-4 border-red-500 bg-red-50',
                };
                const badgeColors = {
                  'View': 'bg-green-100 text-green-700',
                  'Create': 'bg-blue-100 text-blue-700',
                  'Edit': 'bg-yellow-100 text-yellow-700',
                  'Delete': 'bg-red-100 text-red-700',
                };
                const cardClass = actionColors[actionName] || 'border-l-4 border-gray-500 bg-gray-50';
                const badgeClass = badgeColors[actionName] || 'bg-gray-100 text-gray-700';
                
                return (
                  <div
                    key={permission.id}
                    className={`border rounded-lg p-3 hover:shadow-md transition-all ${cardClass}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeClass}`}>
                            {actionName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{permission.slug}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openModal(permission)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(permission.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                    </div>
                    {permission.description && (
                      <p className="text-xs text-gray-600 mt-2">{permission.description}</p>
                    )}
                  </div>
                );
              })}
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
            className="glass-card p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingPermission ? 'Edit Permission' : 'Create Permission'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Permission Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., View Users"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Module</label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Module</option>
                    {modules.map((mod) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                    <option value="new">+ Add New Module</option>
                  </select>
                  {formData.module === 'new' && (
                    <input
                      type="text"
                      placeholder="Enter new module name"
                      onChange={(e) => setFormData({ ...formData, module: e.target.value.toLowerCase() })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Optional description"
                  />
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
                  <span>{editingPermission ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
