import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { teamAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function TeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    joining_date: '',
    birthday: '',
    bio: '',
    avatar: '',
    email: '',
    phone: '',
    salary: '',
    employee_id: '',
    employment_type: 'full-time',
    experience_level: '',
    skills: [],
    education: '',
    achievements: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    github: '',
    portfolio_url: '',
    status: 'active',
    sort_order: 0
  });

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    try {
      const response = await teamAPI.list();
      setTeam(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        skills: Array.isArray(formData.skills) 
          ? formData.skills 
          : formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      if (editingMember) {
        await teamAPI.update(editingMember.id, submitData);
        toast.success('Team member updated');
      } else {
        await teamAPI.create(submitData);
        toast.success('Team member created');
      }
      setShowModal(false);
      setEditingMember(null);
      resetForm();
      fetchTeam();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      department: member.department || '',
      joining_date: member.joining_date || '',
      birthday: member.birthday || '',
      bio: member.bio || '',
      avatar: member.avatar || '',
      email: member.email || '',
      phone: member.phone || '',
      salary: member.salary || '',
      employee_id: member.employee_id || '',
      employment_type: member.employment_type || 'full-time',
      experience_level: member.experience_level || '',
      skills: Array.isArray(member.skills) ? member.skills : [],
      education: member.education || '',
      achievements: member.achievements || '',
      emergency_contact_name: member.emergency_contact_name || '',
      emergency_contact_phone: member.emergency_contact_phone || '',
      address: member.address || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      instagram: member.instagram || '',
      github: member.github || '',
      portfolio_url: member.portfolio_url || '',
      status: member.status || 'active',
      sort_order: member.sort_order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await teamAPI.delete(id);
      toast.success('Team member deleted');
      fetchTeam();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      joining_date: '',
      birthday: '',
      bio: '',
      avatar: '',
      email: '',
      phone: '',
      salary: '',
      employee_id: '',
      employment_type: 'full-time',
      experience_level: '',
      skills: [],
      education: '',
      achievements: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      address: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      github: '',
      portfolio_url: '',
      status: 'active',
      sort_order: 0
    });
  };

  const filteredTeam = team.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <CanView permission="cms.manage">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="glass-button">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </button>
        </CanView>
      </div>

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search team..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeam.map((member) => (
                <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/30">
                  <td className="px-6 py-4 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-600">{member.position}</td>
                  <td className="px-6 py-4 text-gray-600">{member.department || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{member.email || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <CanView permission="cms.manage">
                      <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                    </CanView>
                    <CanView permission="cms.manage">
                      <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900">
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
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => { setShowModal(false); setEditingMember(null); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="glass-input w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Birthday</label>
                    <input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="glass-input w-full" />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position *</label>
                    <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="glass-input w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Joining Date</label>
                    <input type="date" value={formData.joining_date} onChange={(e) => setFormData({...formData, joining_date: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee ID</label>
                    <input type="text" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Employment Type</label>
                    <select value={formData.employment_type} onChange={(e) => setFormData({...formData, employment_type: e.target.value})} className="glass-input w-full">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <input type="text" value={formData.experience_level} onChange={(e) => setFormData({...formData, experience_level: e.target.value})} placeholder="e.g., Senior, Junior, Entry-level" className="glass-input w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Education</label>
                    <input type="text" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} placeholder="e.g., Bachelor of Science in Computer Science" className="glass-input w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                    <input 
                      type="text" 
                      value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills} 
                      onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                      placeholder="e.g., React, Node.js, Python" 
                      className="glass-input w-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Compensation & Benefits */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Compensation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Salary</label>
                    <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="glass-input w-full" placeholder="0.00" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Avatar URL</label>
                    <input type="url" value={formData.avatar} onChange={(e) => setFormData({...formData, avatar: e.target.value})} className="glass-input w-full" placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">About</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="glass-input w-full" rows="3" placeholder="Brief description about the team member" />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Achievements</label>
                  <textarea value={formData.achievements} onChange={(e) => setFormData({...formData, achievements: e.target.value})} className="glass-input w-full" rows="2" placeholder="Notable achievements and accomplishments" />
                </div>
              </div>

              {/* Social Links & Emergency Contact */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Social & Emergency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="glass-input w-full" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="glass-input w-full" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input type="text" value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} className="glass-input w-full" placeholder="@username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <input type="text" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="glass-input w-full" placeholder="@username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                    <input type="url" value={formData.portfolio_url} onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})} className="glass-input w-full" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Name</label>
                    <input type="text" value={formData.emergency_contact_name} onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Phone</label>
                    <input type="tel" value={formData.emergency_contact_phone} onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} className="glass-input w-full" />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="glass-input w-full">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="glass-input w-full" />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => { setShowModal(false); setEditingMember(null); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="glass-button">{editingMember ? 'Update Member' : 'Create Member'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
