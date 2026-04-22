import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { blogsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    status: 'published'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.list();
      setBlogs(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {...formData, tags: formData.tags.split(',').map(t => t.trim())};
      if (editingBlog) {
        await blogsAPI.update(editingBlog.id, submitData);
        toast.success('Blog updated successfully');
      } else {
        await blogsAPI.create(submitData);
        toast.success('Blog created successfully');
      }
      setShowModal(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      status: blog.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await blogsAPI.delete(id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', tags: '', meta_title: '', meta_description: '', status: 'published' });
  };;

  const filteredBlogs = blogs.filter(blog => blog.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blogs Management</h1>
        <CanView permission="blogs.manage">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="glass-button"><Plus className="w-4 h-4 mr-2" /> Add Blog</button>
        </CanView>
      </div>
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="glass-input pl-10 w-full" />
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Views</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <motion.tr key={blog.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/30">
                  <td className="px-6 py-4 font-medium">{blog.title}</td>
                  <td className="px-6 py-4 text-gray-600">{blog.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{blog.views || 0}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <CanView permission="blogs.manage">
                      <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4 inline" /></button>
                    </CanView>
                    <CanView permission="blogs.manage">
                      <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /></button>
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
            <h2 className="text-2xl font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
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
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="glass-input w-full" rows="2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="glass-input w-full" rows="4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="glass-input w-full">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags <span className="text-gray-400 font-normal">(comma separated — used for SEO keywords)</span></label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="glass-input w-full" placeholder="tag1, tag2, tag3" />
              </div>

              {/* SEO Section */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">🔍 SEO (Search Engine Optimisation)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                      <span className="text-gray-400 font-normal ml-1">(leave blank to use the post title)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      className="glass-input w-full"
                      placeholder={formData.title || 'e.g. How We Built a Real-Time Dashboard | MACRO Blog'}
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-400 mt-1">{(formData.meta_title || formData.title || '').length}/60 characters recommended</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      className="glass-input w-full"
                      rows="3"
                      placeholder="A clear, compelling description of this post for search engines (150–160 characters)"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-400 mt-1">{formData.meta_description.length}/160 characters recommended</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowModal(false); setEditingBlog(null); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="glass-button">{editingBlog ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
