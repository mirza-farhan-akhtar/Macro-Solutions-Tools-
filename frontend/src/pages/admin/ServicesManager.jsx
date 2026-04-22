import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Upload, X, Image } from 'lucide-react';
import { servicesAPI, getImageUrl } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const imageInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    icon: '',
    image: '',
    status: 'published',
    sort_order: 0,
    features: [],
    benefits: [],
    process_steps: [],
    technologies: []
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.list();
      setServices(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load services');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = formData;
      if (imageFile) {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else if (v !== null && v !== undefined) fd.append(k, v);
        });
        fd.append('image', imageFile);
        payload = fd;
      }
      if (editingService) {
        await servicesAPI.update(editingService.id, payload);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.create(payload);
        toast.success('Service created successfully');
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
      excerpt: service.excerpt || '',
      content: service.content || '',
      icon: service.icon || '',
      image: service.image || '',
      status: service.status,
      sort_order: service.sort_order || 0,
      features: service.features || [],
      benefits: service.benefits || [],
      process_steps: service.process_steps || [],
      technologies: service.technologies || []
    });
    setImageFile(null);
    setImagePreview(getImageUrl(service.image) || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      icon: '',
      image: '',
      status: 'published',
      sort_order: 0,
      features: [],
      benefits: [],
      process_steps: [],
      technologies: []
    });
    setImageFile(null);
    setImagePreview('');
  };

  const filteredServices = services.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <CanView permission="services.manage">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="glass-button">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </button>
        </CanView>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Image</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                      {service.image ? (
                        <img src={getImageUrl(service.image)} alt={service.title} className="w-12 h-9 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Image className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{service.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{service.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{service.sort_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
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
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="glass-input w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="glass-input w-full" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="glass-input w-full" rows="2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="glass-input w-full" rows="4" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="glass-input w-full" placeholder="Code, Smartphone, etc." />
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
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Service Image</h3>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }} />
                <div className="flex gap-4 items-start">
                  {imagePreview ? (
                    <div className="relative flex-shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-36 h-24 object-cover rounded-xl border border-gray-200 shadow" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setFormData({...formData, image: ''}); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-36 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 flex-shrink-0">
                      <Image className="w-6 h-6" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <button type="button" onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors">
                      <Upload className="w-4 h-4" /> {imagePreview ? 'Change Image' : 'Upload Image'}
                    </button>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 4 MB · Recommended 1200×800px</p>
                    <div>
                      <input type="text" value={formData.image} onChange={(e) => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); setImageFile(null); }}
                        className="glass-input w-full text-sm" placeholder="Or paste an image URL…" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Service Details</h3>
                
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">Features (What's Included)</label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="glass-input flex-1"
                          placeholder="Feature description"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formData.features.filter((_, i) => i !== index);
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, features: [...formData.features, '']})}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium mb-2">Benefits</label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...formData.benefits];
                            newBenefits[index] = e.target.value;
                            setFormData({...formData, benefits: newBenefits});
                          }}
                          className="glass-input flex-1"
                          placeholder="Benefit description"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = formData.benefits.filter((_, i) => i !== index);
                            setFormData({...formData, benefits: newBenefits});
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, benefits: [...formData.benefits, '']})}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      + Add Benefit
                    </button>
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <label className="block text-sm font-medium mb-2">Process Steps</label>
                  <div className="space-y-2">
                    {formData.process_steps.map((step, index) => (
                      <div key={index} className="space-y-2 p-4 border border-gray-200 rounded">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={step.title || ''}
                            onChange={(e) => {
                              const newSteps = [...formData.process_steps];
                              newSteps[index] = { ...step, title: e.target.value };
                              setFormData({...formData, process_steps: newSteps});
                            }}
                            className="glass-input flex-1"
                            placeholder="Step title"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = formData.process_steps.filter((_, i) => i !== index);
                              setFormData({...formData, process_steps: newSteps});
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          value={step.description || ''}
                          onChange={(e) => {
                            const newSteps = [...formData.process_steps];
                            newSteps[index] = { ...step, description: e.target.value };
                            setFormData({...formData, process_steps: newSteps});
                          }}
                          className="glass-input w-full"
                          rows="2"
                          placeholder="Step description"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, process_steps: [...formData.process_steps, { title: '', description: '' }]})}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium mb-2">Technologies</label>
                  <div className="space-y-2">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => {
                            const newTech = [...formData.technologies];
                            newTech[index] = e.target.value;
                            setFormData({...formData, technologies: newTech});
                          }}
                          className="glass-input flex-1"
                          placeholder="Technology name (e.g., React, Node.js)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newTech = formData.technologies.filter((_, i) => i !== index);
                            setFormData({...formData, technologies: newTech});
                          }}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, technologies: [...formData.technologies, '']})}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      + Add Technology
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); setEditingService(null); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="glass-button">{editingService ? 'Update Service' : 'Create Service'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

