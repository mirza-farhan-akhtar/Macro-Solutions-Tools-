import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Briefcase, Users, MessageSquare, Check, Search, RefreshCw, X, Shield } from 'lucide-react';
import { usePermission } from '../../../context/PermissionContext';
import hrAPI from '../../../services/hrAPI';
import apiClient from '../../../services/api';
import toast from 'react-hot-toast';

export function Recruitment() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const [view, setView] = useState('jobs'); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireTarget, setHireTarget] = useState(null);
  const [hireForm, setHireForm] = useState({
    full_name: '', email: '', phone: '', department: '',
    designation: '', joining_date: '', employment_type: 'Full-time', salary: '', role_id: '', temp_password: 'password',
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    employment_type: 'Full-time',
    salary_min: '',
    salary_max: '',
    required_experience: '',
    hiring_status: 'Open',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const canViewRoles = isSuperAdmin || hasPermission('roles.view');
      const requests = [
        hrAPI.getJobPosts(),
        hrAPI.getApplications(),
        hrAPI.getDepartments(),
      ];
      if (canViewRoles) requests.push(apiClient.get('/admin/roles'));

      const [jobsRes, appsRes, deptsRes, rolesRes] = await Promise.allSettled(requests);
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data?.data?.data || []);
      if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data?.data?.data || []);
      if (deptsRes.status === 'fulfilled') setDepartments(deptsRes.value.data?.data || []);
      if (rolesRes && rolesRes.status === 'fulfilled') {
        const d = rolesRes.value.data;
        setRoles(d?.data?.data || d?.data || (Array.isArray(d) ? d : []));
      }
      if (jobsRes.status === 'rejected' && appsRes.status === 'rejected') {
        toast.error('Failed to load recruitment data');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load recruitment data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (!formData.title || !formData.department) {
        toast.error('Please fill required fields');
        return;
      }

      if (editingJob) {
        await hrAPI.updateJobPost(editingJob.id, formData);
        toast.success('Job updated successfully');
      } else {
        await hrAPI.createJobPost(formData);
        toast.success('Job created successfully');
      }
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await hrAPI.deleteJobPost(jobId);
        toast.success('Job deleted successfully');
        await loadData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await hrAPI.updateApplicationStatus(appId, { application_status: newStatus });
      toast.success('Application status updated');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openHireModal = (app) => {
    setHireTarget(app);
    setHireForm({
      full_name: app.applicant_name || '',
      email: app.applicant_email || app.email || '',
      phone: app.phone || '',
      department: app.career?.department || '',
      designation: '',
      joining_date: new Date().toISOString().split('T')[0],
      employment_type: 'Full-time',
      salary: '',
      role_id: '',
      temp_password: 'password',
    });
    setShowHireModal(true);
  };

  const handleConfirmHire = async () => {
    try {
      await hrAPI.hireApplicant(hireTarget.id, hireForm);
      toast.success('Applicant hired and employee record created');
      setShowHireModal(false);
      setHireTarget(null);
      await loadData();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0];
        toast.error(Array.isArray(first) ? first[0] : first);
      } else {
        toast.error(err.response?.data?.message || 'Failed to hire applicant');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      employment_type: 'Full-time',
      salary_min: '',
      salary_max: '',
      required_experience: '',
      hiring_status: 'Open',
    });
    setEditingJob(null);
  };

  const editJob = (job) => {
    setFormData(job);
    setEditingJob(job);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading recruitment data...</p>
        </div>
      </div>
    );
  }

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || job.hiring_status === filterStatus)
  );

  const filteredApps = applications.filter((app) =>
    app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || app.application_status === filterStatus)
  );

  const statusBadge = (status) => {
    const map = {
      Open: 'bg-green-100 text-green-700',
      Closed: 'bg-red-100 text-red-700',
      Applied: 'bg-blue-100 text-blue-700',
      Shortlisted: 'bg-purple-100 text-purple-700',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-700',
      Hired: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`;
  };

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Recruitment Management</h1>
            <p className="text-slate-500 mt-1">Manage job postings and applications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2.5 rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
            {hasPermission('hr.create') && view === 'jobs' && (
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus size={18} />New Job
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Jobs',        value: jobs.length,                            icon: Briefcase, bg: 'bg-blue-100',   text: 'text-blue-700' },
            { label: 'Open Positions',    value: jobs.filter(j => j.hiring_status === 'Open').length,  icon: Users,     bg: 'bg-green-100',  text: 'text-green-700' },
            { label: 'Applications',      value: applications.length,                    icon: MessageSquare, bg: 'bg-purple-100', text: 'text-purple-700' },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bg}`}><Icon size={22} className={card.text} /></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-0">
          {[{id:'jobs', label:'Job Postings', count: jobs.length, icon: Briefcase}, {id:'applications', label:'Applications', count: applications.length, icon: Users}].map(tab => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button key={tab.id} onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-lg border-b-2 transition ${active ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                <Icon size={16} />{tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
            <option value="all">All Status</option>
            {view === 'jobs' ? (
              <><option value="Open">Open</option><option value="Closed">Closed</option></>
            ) : (
              <><option value="Applied">Applied</option><option value="Shortlisted">Shortlisted</option><option value="Interview Scheduled">Interview</option><option value="Rejected">Rejected</option><option value="Hired">Hired</option></>
            )}
          </select>
        </div>

        {/* Jobs Grid */}
        {view === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <p className="text-slate-500 text-sm">{job.department}</p>
                  </div>
                  <span className={statusBadge(job.hiring_status)}>{job.hiring_status}</span>
                </div>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                <div className="flex gap-4 text-xs text-slate-500 mb-4 border-t border-slate-100 pt-3">
                  <span className="flex items-center gap-1"><Briefcase size={12} />{job.employment_type}</span>
                  <span>â‚¹{job.salary_min || 'N/A'} â€“ â‚¹{job.salary_max || 'N/A'}</span>
                </div>
                {hasPermission('hr.edit') && (
                  <div className="flex gap-2 border-t border-slate-100 pt-3">
                    <button onClick={() => editJob(job)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition">
                      <Edit size={14} />Edit
                    </button>
                    {hasPermission('hr.delete') && (
                      <button onClick={() => handleDeleteJob(job.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition">
                        <Trash2 size={14} />Delete
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-3"><Briefcase size={36} className="text-slate-400" /></div>
                <p className="text-slate-500">No job postings found</p>
              </div>
            )}
          </div>
        )}

        {/* Applications List */}
        {view === 'applications' && (
          <div className="space-y-4">
            {filteredApps.length > 0 ? filteredApps.map((app) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{app.applicant_name}</h3>
                    <p className="text-slate-500 text-sm">{app.career?.title} &bull; {app.career?.department}</p>
                    <p className="text-slate-500 text-sm">{app.email}</p>
                  </div>
                  <span className={statusBadge(app.application_status)}>{app.application_status}</span>
                </div>
                {app.internal_notes && (
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-2">
                    <MessageSquare size={13} />{app.internal_notes}
                  </p>
                )}
                {hasPermission('hr.recruitment') && app.application_status !== 'Hired' && app.application_status !== 'Rejected' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                    {app.application_status !== 'Shortlisted' && (
                      <button onClick={() => handleUpdateAppStatus(app.id, 'Shortlisted')} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-xs font-medium transition">Shortlist</button>
                    )}
                    {app.application_status !== 'Interview Scheduled' && (
                      <button onClick={() => handleUpdateAppStatus(app.id, 'Interview Scheduled')} className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg text-xs font-medium transition">Interview</button>
                    )}
                    {['Interview Scheduled', 'Shortlisted'].includes(app.application_status) && (
                      <button onClick={() => openHireModal(app)} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-medium transition">
                        <Check size={12} />Hire
                      </button>
                    )}
                    <button onClick={() => handleUpdateAppStatus(app.id, 'Rejected')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition">Reject</button>
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-3"><Users size={36} className="text-slate-400" /></div>
                <p className="text-slate-500">No applications found</p>
              </div>
            )}
          </div>
        )}

        {/* Job Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">{editingJob ? 'Edit Job' : 'New Job Posting'}</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Job Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="e.g., Senior Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Department *</label>
                    <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={inputCls}>
                      <option value="">Select Department</option>
                      {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Employment Type</label>
                    <select value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} className={inputCls}>
                      <option>Full-time</option><option>Part-time</option><option>Contract</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Min Salary</label>
                    <input type="number" value={formData.salary_min} onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })} className={inputCls} placeholder="30000" />
                  </div>
                  <div>
                    <label className={labelCls}>Max Salary</label>
                    <input type="number" value={formData.salary_max} onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })} className={inputCls} placeholder="60000" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} h-20 resize-none`} placeholder="Job description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveJob} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Hire Applicant Modal */}
        {showHireModal && hireTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Hire Applicant</h2>
                <button onClick={() => { setShowHireModal(false); setHireTarget(null); }} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-5">Creating an employee record for <span className="font-semibold text-slate-700">{hireTarget.applicant_name}</span>. Please confirm or fill in the details below.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input type="text" value={hireForm.full_name} onChange={(e) => setHireForm({ ...hireForm, full_name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" value={hireForm.email} onChange={(e) => setHireForm({ ...hireForm, email: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone *</label>
                    <input type="text" value={hireForm.phone} onChange={(e) => setHireForm({ ...hireForm, phone: e.target.value })} className={inputCls} placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <label className={labelCls}>Department *</label>
                    <select value={hireForm.department} onChange={(e) => setHireForm({ ...hireForm, department: e.target.value })} className={inputCls}>
                      <option value="">Select Department</option>
                      {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Designation *</label>
                    <input type="text" value={hireForm.designation} onChange={(e) => setHireForm({ ...hireForm, designation: e.target.value })} className={inputCls} placeholder="e.g., Software Engineer" />
                  </div>
                  <div>
                    <label className={labelCls}>Joining Date *</label>
                    <input type="date" value={hireForm.joining_date} onChange={(e) => setHireForm({ ...hireForm, joining_date: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Employment Type *</label>
                    <select value={hireForm.employment_type} onChange={(e) => setHireForm({ ...hireForm, employment_type: e.target.value })} className={inputCls}>
                      <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Temporary</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Salary</label>
                    <input type="number" value={hireForm.salary} onChange={(e) => setHireForm({ ...hireForm, salary: e.target.value })} className={inputCls} placeholder="50000" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}><Shield size={12} className="inline mr-1" />Assign Role (creates login account)</label>
                  <select value={hireForm.role_id} onChange={(e) => setHireForm({ ...hireForm, role_id: e.target.value })} className={inputCls}>
                    <option value="">— No role (don't create login) —</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                {hireForm.role_id && (
                  <div>
                    <label className={labelCls}>Temporary Password</label>
                    <input type="text" value={hireForm.temp_password}
                      onChange={(e) => setHireForm({ ...hireForm, temp_password: e.target.value })}
                      className={inputCls} placeholder="e.g., Welcome@123" />
                    <p className="text-xs text-slate-400 mt-1">Login: <span className="font-semibold text-slate-600">{hireForm.email || 'employee email'}</span> / <span className="font-semibold text-slate-600">{hireForm.temp_password || 'password'}</span> — ask employee to change it.</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleConfirmHire} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition">
                    Confirm Hire
                  </button>
                  <button onClick={() => { setShowHireModal(false); setHireTarget(null); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recruitment;