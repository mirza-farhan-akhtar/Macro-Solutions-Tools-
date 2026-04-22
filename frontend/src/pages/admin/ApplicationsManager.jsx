import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Search, CheckCircle, XCircle } from 'lucide-react';
import { applicationsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function ApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.list();
      setApplications(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDownloadResume = async (resumePath) => {
    try {
      const filename = resumePath.split('/').pop();
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/admin/download/resume/${filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.error('Failed to download resume');
      }
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const handleView = (application) => {
    setSelectedApplication(application);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.career?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Applications Management</h1>

      <div className="glass-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{app.applicant_name}</div>
                      <div className="text-gray-500 text-sm">{app.applicant_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.career?.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'hired' ? 'bg-green-100 text-green-800' :
                      app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleView(app)} className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    {app.resume && (
                      <button 
                        onClick={() => handleDownloadResume(app.resume)}
                        className="text-green-600 hover:text-green-900"
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    )}
                    {app.status !== 'hired' && app.status !== 'rejected' && (
                      <>
                        <CanView permission="applications.manage">
                          <button onClick={() => handleStatusUpdate(app.id, 'shortlisted')} className="text-blue-600 hover:text-blue-900">
                            <CheckCircle className="w-4 h-4 inline" />
                          </button>
                        </CanView>
                        <CanView permission="applications.manage">
                          <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="text-red-600 hover:text-red-900">
                            <XCircle className="w-4 h-4 inline" />
                          </button>
                        </CanView>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <div className="text-gray-900">{selectedApplication.applicant_name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="text-gray-900">{selectedApplication.applicant_email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className="text-gray-900">{selectedApplication.phone || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <div className="text-gray-900">{selectedApplication.career?.title || 'N/A'}</div>
                </div>
              </div>
              {selectedApplication.cover_letter && (
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Letter</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-900 max-h-40 overflow-y-auto">
                    {selectedApplication.cover_letter}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  <label className="block text-sm font-medium mb-1">Applied Date</label>
                  <div className="text-gray-900">{new Date(selectedApplication.created_at).toLocaleString()}</div>
                </div>
                <div className="space-x-2">
                  {selectedApplication.status !== 'hired' && selectedApplication.status !== 'rejected' && (
                    <>
                      <button onClick={() => { handleStatusUpdate(selectedApplication.id, 'shortlisted'); setSelectedApplication(null); }} className="glass-button text-sm">
                        Shortlist
                      </button>
                      <button onClick={() => { handleStatusUpdate(selectedApplication.id, 'rejected'); setSelectedApplication(null); }} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
