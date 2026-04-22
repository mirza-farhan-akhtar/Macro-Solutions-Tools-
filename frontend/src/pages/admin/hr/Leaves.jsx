import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock, Plus, Search, RefreshCw, X, Settings, Save } from 'lucide-react';
import { usePermission } from '../../../context/PermissionContext';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

export function Leaves() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'quotas'
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Quota management state
  const [quotaEmployee, setQuotaEmployee] = useState(null);
  const [quotaData, setQuotaData] = useState([]);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [savingQuota, setSavingQuota] = useState(false);
  const [quotaYear, setQuotaYear] = useState(new Date().getFullYear());
  const [allQuotas, setAllQuotas] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'Sick Leave',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave'];
  const statuses = ['Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  useEffect(() => {
    if (activeTab === 'quotas') loadAllQuotas();
  }, [activeTab, quotaYear]);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const response = await hrAPI.getLeaveRequests();
      setLeaves(response.data?.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await hrAPI.getEmployees();
      setEmployees(response.data?.data?.data || []);
    } catch (err) {
      console.error('Failed to load employees');
    }
  };

  const loadAllQuotas = async () => {
    try {
      const res = await hrAPI.getLeaveQuotaAll(quotaYear);
      setAllQuotas(res.data?.data || []);
    } catch {
      // ignore
    }
  };

  const openQuotaModal = async (emp) => {
    setQuotaEmployee(emp);
    try {
      const res = await hrAPI.getEmployeeLeaveQuota(emp.id, quotaYear);
      setQuotaData(res.data?.data || []);
    } catch {
      setQuotaData(leaveTypes.map(t => ({ leave_type: t, quota: 0, is_custom: false })));
    }
    setShowQuotaModal(true);
  };

  const handleSaveQuota = async () => {
    setSavingQuota(true);
    try {
      await hrAPI.setLeaveQuota(quotaEmployee.id, quotaYear, quotaData.map(q => ({ leave_type: q.leave_type, quota: q.quota })));
      toast.success('Leave quotas saved');
      setShowQuotaModal(false);
      loadAllQuotas();
    } catch {
      toast.error('Failed to save quotas');
    } finally {
      setSavingQuota(false);
    }
  };

  const handleResetQuota = async () => {
    if (!window.confirm('Reset to default quotas?')) return;
    try {
      await hrAPI.resetLeaveQuota(quotaEmployee.id, quotaYear);
      toast.success('Quotas reset to defaults');
      setShowQuotaModal(false);
      loadAllQuotas();
    } catch {
      toast.error('Failed to reset quotas');
    }
  };

  const handleSubmitLeave = async () => {
    try {
      if (!formData.employee_id || !formData.start_date || !formData.end_date) {
        toast.error('Please fill required fields');
        return;
      }

      await hrAPI.requestLeave(formData);
      toast.success('Leave request submitted successfully');
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await hrAPI.approveLeave(leaveId, { approval_notes: approvalNotes });
      toast.success('Leave approved successfully');
      setSelectedLeave(null);
      setApprovalNotes('');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve leave');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await hrAPI.rejectLeave(leaveId, { approval_notes: approvalNotes });
      toast.success('Leave rejected successfully');
      setSelectedLeave(null);
      setApprovalNotes('');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject leave');
    }
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      leave_type: 'Sick Leave',
      start_date: '',
      end_date: '',
      reason: '',
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  const filteredLeaves = leaves.filter(
    (leave) =>
      (filterStatus === 'all' || leave.status === filterStatus) &&
      leave.employee?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const statusBadge = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Leave Management</h1>
            <p className="text-slate-500 mt-1">Manage employee leave requests and quotas</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {hasPermission('hr.create') && activeTab === 'requests' && (
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Request Leave
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'requests', label: 'Leave Requests', icon: Calendar },
            { id: 'quotas', label: 'Leave Quotas', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-lg border-b-2 transition ${active ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                <Icon size={16} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Leave Requests Tab ──────────────────────────────────────────────── */}
        {activeTab === 'requests' && (<>

        {/* Pending Banner */}
        {pendingLeaves.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
            <div>
              <p className="text-yellow-800 font-semibold">{pendingLeaves.length} Pending Approval{pendingLeaves.length !== 1 ? 's' : ''}</p>
              <p className="text-yellow-700 text-sm">Leave requests are waiting for your review</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Leave List */}
        <div className="space-y-4">
          {filteredLeaves.length > 0 ? filteredLeaves.map((leave) => (
            <div key={leave.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{leave.employee?.full_name}</h3>
                  <p className="text-sm text-slate-500">{leave.leave_type}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(leave.status)}`}>
                  {leave.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start Date</p>
                  <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />{leave.start_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">End Date</p>
                  <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />{leave.end_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Days</p>
                  <p className="text-slate-900 font-semibold">{leave.total_days || calculateDays(leave.start_date, leave.end_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Reason</p>
                  <p className="text-slate-700 text-sm">{leave.reason?.substring(0, 30) || 'N/A'}</p>
                </div>
              </div>
              {leave.approval_notes && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Approval Notes</p>
                  <p className="text-slate-700 text-sm">{leave.approval_notes}</p>
                </div>
              )}
              {leave.status === 'Pending' && hasPermission('hr.leave') && (
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedLeave(leave)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => setSelectedLeave(leave)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          )) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No leave requests found</p>
            </div>
          )}
        </div>

        </>) /* end requests tab */}

        {/* ── Leave Quotas Tab ────────────────────────────────────────────────── */}
        {activeTab === 'quotas' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm">Override default leave quotas per employee. Defaults: Sick 12 / Casual 15 / Annual 21 / Maternity 90 / Paternity 15 days.</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Year:</span>
                <select value={quotaYear} onChange={(e) => setQuotaYear(Number(e.target.value))}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-md border border-slate-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
                    {leaveTypes.map(t => (
                      <th key={t} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">{t.replace(' Leave', '')}</th>
                    ))}
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(allQuotas.length > 0 ? allQuotas : employees.map(e => ({ id: e.id, employee_id: e.employee_id, full_name: e.full_name, department: e.department, quotas: [] }))).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{row.full_name}</p>
                        <p className="text-xs text-slate-400">{row.employee_id}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.department || '—'}</td>
                      {(row.quotas || leaveTypes.map(t => ({ leave_type: t, quota: '—', is_custom: false }))).map((q) => (
                        <td key={q.leave_type} className="px-3 py-3 text-center">
                          <span className={`text-sm font-semibold ${q.is_custom ? 'text-blue-600' : 'text-slate-500'}`}>{q.quota}</span>
                          {q.is_custom && <span className="block text-xs text-blue-400">custom</span>}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button onClick={() => openQuotaModal(row)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition">
                          <Settings size={12} />Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Request Leave</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Employee *</label>
                  <select value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} className={inputCls}>
                    <option value="">Select Employee</option>
                    {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Leave Type</label>
                  <select value={formData.leave_type} onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })} className={inputCls}>
                    {leaveTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Start Date *</label>
                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date *</label>
                    <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className={inputCls} />
                  </div>
                </div>
                {formData.start_date && formData.end_date && (
                  <p className="text-blue-600 text-sm font-medium">
                    Duration: {calculateDays(formData.start_date, formData.end_date)} days
                  </p>
                )}
                <div>
                  <label className={labelCls}>Reason</label>
                  <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className={`${inputCls} h-24 resize-none`} placeholder="Reason for leave..." />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={handleSubmitLeave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    Submit
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {selectedLeave && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Review Leave Request</h2>
                <button onClick={() => { setSelectedLeave(null); setApprovalNotes(''); }} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6 space-y-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Employee</p>
                  <p className="text-slate-900 font-semibold">{selectedLeave.employee?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Leave Type</p>
                  <p className="text-slate-700">{selectedLeave.leave_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="text-slate-700">{selectedLeave.start_date} to {selectedLeave.end_date}</p>
                </div>
              </div>
              {selectedLeave.status === 'Pending' && (
                <div className="mb-6">
                  <label className={labelCls}>Approval Notes</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className={`${inputCls} h-20 resize-none`}
                    placeholder="Optional notes..."
                  />
                </div>
              )}
              <div className="flex gap-2">
                {selectedLeave.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApproveLeave(selectedLeave.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
                      Approve
                    </button>
                    <button onClick={() => handleRejectLeave(selectedLeave.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition">
                      Reject
                    </button>
                  </>
                )}
                <button onClick={() => { setSelectedLeave(null); setApprovalNotes(''); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quota Edit Modal */}
        {showQuotaModal && quotaEmployee && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Leave Quotas — {quotaEmployee.full_name}</h2>
                  <p className="text-slate-500 text-sm">{quotaYear} · Blue = custom override</p>
                </div>
                <button onClick={() => setShowQuotaModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400"><X size={20} /></button>
              </div>
              <div className="space-y-3 mb-6">
                {quotaData.map((q, idx) => (
                  <div key={q.leave_type} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 flex-1">{q.leave_type}</label>
                    <input type="number" min="0" max="365"
                      value={q.quota}
                      onChange={(e) => {
                        const updated = [...quotaData];
                        updated[idx] = { ...q, quota: parseInt(e.target.value) || 0, is_custom: true };
                        setQuotaData(updated);
                      }}
                      className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
                    <span className="ml-2 text-xs text-slate-400 w-8">days</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveQuota} disabled={savingQuota}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50">
                  <Save size={16} />{savingQuota ? 'Saving...' : 'Save Quotas'}
                </button>
                <button onClick={handleResetQuota}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition">
                  Reset
                </button>
                <button onClick={() => setShowQuotaModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaves;
