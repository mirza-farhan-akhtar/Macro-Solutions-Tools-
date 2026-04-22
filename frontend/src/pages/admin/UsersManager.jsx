import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI, rolesAPI } from '../../services/api';
import { Search, Plus, Edit2, Trash2, X, Eye, EyeOff, UserCheck, UserX, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';
import { usePermission } from '../../context/PermissionContext';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user', // Basic role field (admin or user)
    roles: [], // RBAC roles
    password: '',
    password_confirmation: ''
  });
  const { hasPermission } = usePermission();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [searchTerm, roleFilter]);

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.list();
      setAvailableRoles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      const response = await usersAPI.getAll(params);
      setUsers(response.data.data || response.data || []); // Handle paginated response
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      if (editingUser) {
        // Update user basic info
        const userData = { name: formData.name, email: formData.email, phone: formData.phone, role: formData.role };
        await usersAPI.update(editingUser.id, userData);
        
        // Sync roles
        if (hasPermission('roles.edit')) {
          await usersAPI.syncRoles(editingUser.id, formData.roles);
        }
        
        toast.success('User updated successfully');
      } else {
        // Create user - include role field
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        };
        const newUser = await usersAPI.create(userData);
        
        // Assign RBAC roles if any selected
        if (newUser.data?.id && formData.roles.length > 0) {
          await usersAPI.syncRoles(newUser.data.id, formData.roles);
        }
        
        toast.success('User created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'user',
        roles: user.roles ? user.roles.map(r => r.id) : [],
        password: '',
        password_confirmation: ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phon: 'user',
      rolee: '',
      roles: [],
      password: '',
      password_confirmation: ''
    });
  };

  const getRoleBadgeClass = (roleName) => {
    const colorMap = {
      'super-admin': 'bg-red-100 text-red-700',
      'admin': 'bg-purple-100 text-purple-700',
      'finance-manager': 'bg-green-100 text-green-700',
      'hr-manager': 'bg-blue-100 text-blue-700',
      'crm-manager': 'bg-yellow-100 text-yellow-700',
      'content-manager': 'bg-pink-100 text-pink-700',
      'viewer': 'bg-gray-100 text-gray-700'
    };
    return colorMap[roleName] || 'bg-blue-100 text-blue-700';
  };

  if (loading && users.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Users Management</h1>
        <div className="glass-card p-8">
          <div className="skeleton-glass h-8 w-full mb-4"></div>
          <div className="skeleton-glass h-8 w-full mb-4"></div>
          <div className="skeleton-glass h-8 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <CanView permission="users.create">
          <button onClick={() => openModal()} className="glass-button flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </CanView>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input md:w-48"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Phone</th>
                <th className="text-left p-4 font-semibold">User Type</th>
                <th className="text-left p-4 font-semibold">RBAC Roles</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="glass-table-row">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone || '-'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span key={role.id} className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(role.slug)}`}>
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <CanView permission="users.edit">
                        <button onClick={() => openModal(user)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                      </CanView>
                      <CanView permission="users.delete">
                        <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </CanView>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <UserX className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No users found. Click "Add User" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-modal-overlay"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="glass-card p-6 w-full max-w-md pointer-events-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{editingUser ? 'Edit User' : 'Add User'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="glass-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="glass-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="glass-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">User Type *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      required
                      className="glass-input w-full"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>RBAC Roles (Optional)</span>
                      </div>
                    </label>
                    <div className="glass-card p-3 max-h-48 overflow-y-auto space-y-2">
                      {availableRoles.map((role) => (
                        <label key={role.id} className="flex items-start gap-3 p-2 hover:bg-white/30 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.roles.includes(role.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, roles: [...formData.roles, role.id]});
                              } else {
                                setFormData({...formData, roles: formData.roles.filter(id => id !== role.id)});
                              }
                            }}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{role.name}</div>
                            {role.description && (
                              <div className="text-xs text-gray-500">{role.description}</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  {!editingUser && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required={!editingUser}
                            className="glass-input w-full pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                          required={!editingUser}
                          className="glass-input w-full"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="glass-button flex-1">
                      {editingUser ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="glass-card px-6 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
