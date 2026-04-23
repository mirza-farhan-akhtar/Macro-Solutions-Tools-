import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Clock, XCircle, Plus, X } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import projectAPI from '../../../services/projectAPI';
import toast from 'react-hot-toast';

export function DepartmentProjectRequests() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');

  // Send request modal state
  const [showSendModal, setShowSendModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [sendForm, setSendForm] = useState({ project_id: '', target_department_id: '', request_message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      let dept = null;

      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        if (deptPayload && typeof deptPayload === 'object' && deptPayload.name) {
          dept = { id: deptPayload.id || slug, name: deptPayload.name };
        }
      } catch (e) {
        console.warn('Department API failed:', e.message);
      }
      if (!dept) dept = { id: slug, name: `Department ${slug}` };
      setDepartment(dept);

      // Fetch incoming + sent requests and project/dept lists in parallel
      const [incomingRes, sentRes, projectsRes, deptsRes] = await Promise.allSettled([
        departmentAPI.getDepartmentProjectRequests(slug),
        departmentAPI.getDepartmentProjectRequestsSent(slug),
        departmentAPI.getDepartmentProjects(slug),
        departmentAPI.getDepartments(),
      ]);
      if (incomingRes.status === 'fulfilled') {
        const d = incomingRes.value?.data?.data || incomingRes.value?.data || [];
        setRequests(Array.isArray(d) ? d : []);
      }
      if (sentRes.status === 'fulfilled') {
        const d = sentRes.value?.data?.data || sentRes.value?.data || [];
        setSentRequests(Array.isArray(d) ? d : []);
      }
      if (projectsRes.status === 'fulfilled') {
        const d = projectsRes.value?.data?.data || projectsRes.value?.data || [];
        setProjects(Array.isArray(d) ? d : []);
      }
      if (deptsRes.status === 'fulfilled') {
        const d = deptsRes.value?.data?.data || deptsRes.value?.data || [];
        setAllDepartments(Array.isArray(d) ? d : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load project requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (s === 'rejected') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusBg = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'bg-green-50';
    if (s === 'rejected') return 'bg-red-50';
    return 'bg-yellow-50';
  };

  const handleApprove = async (requestId) => {
    try {
      await projectAPI.approveRequest(requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
      toast.success('Request approved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await projectAPI.rejectRequest(requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
      toast.success('Request rejected');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!sendForm.project_id) return toast.error('Please select a project');
    if (!sendForm.target_department_id) return toast.error('Please select a target department');
    try {
      setSubmitting(true);
      await projectAPI.sendCollaborationRequest({
        project_id: parseInt(sendForm.project_id),
        target_department_id: parseInt(sendForm.target_department_id),
        request_message: sendForm.request_message || null,
      });
      toast.success('Collaboration request sent!');
      setShowSendModal(false);
      setSendForm({ project_id: '', target_department_id: '', request_message: '' });
      // Refresh sent requests
      try {
        const res = await departmentAPI.getDepartmentProjectRequestsSent(slug);
        const d = res?.data?.data || res?.data || [];
        setSentRequests(Array.isArray(d) ? d : []);
        setActiveTab('sent');
      } catch (_) {}
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const renderRequestCard = (request, isSent = false) => (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${getStatusBg(request.status)} rounded-xl border border-gray-200 p-6 hover:shadow-md transition`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getStatusIcon(request.status)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">{request.project?.name || 'â€”'}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              (request.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' :
              (request.status || '').toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{request.status || 'Pending'}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {isSent
              ? <>To: <span className="font-medium">{request.targetDepartment?.name || 'â€”'}</span></>
              : <>From: <span className="font-medium">{request.requestingDepartment?.name || 'â€”'}</span></>}
          </p>
          {request.request_message && (
            <p className="text-sm text-gray-700 bg-white/70 rounded-lg px-3 py-2 mb-2">{request.request_message}</p>
          )}
          <p className="text-xs text-gray-400">{new Date(request.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Approve/Reject for incoming pending requests */}
      {!isSent && (request.status || '').toLowerCase() === 'pending' && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-300">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleApprove(request.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleReject(request.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </motion.button>
        </div>
      )}
    </motion.div>
  );

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
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/60 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Project Requests</h1>
                <p className="text-gray-600 mt-1">Manage cross-department project assignments</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Send Request
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'incoming', label: `Incoming (${requests.length})` }, { key: 'sent', label: `Sent (${sentRequests.length})` }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {activeTab === 'incoming' && (
            requests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No incoming project requests</p>
              </div>
            ) : (
              <div className="space-y-4">{requests.map(r => renderRequestCard(r, false))}</div>
            )
          )}
          {activeTab === 'sent' && (
            sentRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sent requests yet. Click "Send Request" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">{sentRequests.map(r => renderRequestCard(r, true))}</div>
            )
          )}
        </motion.div>
      </div>

      {/* Send Request Modal */}
      {showSendModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSendModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Send Collaboration Request</h2>
              <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSendRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                <select
                  value={sendForm.project_id}
                  onChange={e => setSendForm(p => ({ ...p, project_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Department *</label>
                <select
                  value={sendForm.target_department_id}
                  onChange={e => setSendForm(p => ({ ...p, target_department_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a department</option>
                  {allDepartments.filter(d => String(d.id) !== String(department?.id)).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  value={sendForm.request_message}
                  onChange={e => setSendForm(p => ({ ...p, request_message: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Explain why you need this department's help..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Request'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default DepartmentProjectRequests;
