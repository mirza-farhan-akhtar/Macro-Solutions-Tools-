import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { aiServicesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function AIServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    icon: '',
    status: 'published',
    sort_order: 0
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const response = await aiServicesAPI.list();
      setServices(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load AI services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await aiServicesAPI.update(editingService.id, formData);
        toast.success('AI Service updated');
      } else {
        await aiServicesAPI.create(formData);
        toast.success('AI Service created');
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || '',
      content: service.content || '',
      icon: service.icon || '',
      status: service.status,
      sort_order: service.sort_order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await aiServicesAPI.delete(id);
      toast.success('AI Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', description: '', content: '', icon: '', status: 'published', sort_order: 0 });
  };

  const filteredServices = services.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Artificial Intelligence Management</h1>
        <CanView permission="services.manage">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="glass-button">
            <Plus className="w-4 h-4 mr-2" /> Add AI Service
          </button>
        </CanView>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search artificial intelligence services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 w-full"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <motion.tr key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/30">
                  <td className="px-6 py-4 font-medium">{service.title}</td>
                  <td className="px-6 py-4 text-gray-600">{service.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{service.sort_order}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <CanView permission="services.manage">
                      <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                    </CanView>
                    <CanView permission="services.manage">
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </CanView>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit AI Service' : 'Add AI Service'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="glass-input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="glass-input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="glass-input w-full" rows="2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="glass-input w-full" rows="4" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="glass-input w-full" placeholder="Bot" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="glass-input w-full">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="glass-input w-full" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowModal(false); setEditingService(null); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="glass-button">{editingService ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
