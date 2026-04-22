import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, RefreshCw, CheckCircle, XCircle, Clock, X, AlertCircle } from 'lucide-react';
import employeeAPI from '../../services/employeeAPI';
import toast from 'react-hot-toast';

const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm';
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave'];

export function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [leavesRes, balanceRes] = await Promise.all([
        employeeAPI.myLeaves(),
        employeeAPI.leaveBalance(),
      ]);
      setLeaves(leavesRes.data?.data || []);
      setBalance(balanceRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await employeeAPI.applyLeave(formData);
      toast.success('Leave request submitted. Pending HR approval.');
      setShowModal(false);
      setFormData({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const map = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };
    return `px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`;
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Approved') return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'Rejected') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-yellow-500" />;
  };

  // Calculate days between dates
  const countDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start), e = new Date(end);
    return Math.floor((e - s) / 86400000) + 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading leave data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Leaves</h1>
            <p className="text-slate-500 mt-1">Apply for leave and track your leave balance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium shadow-sm">
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />Refresh
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm text-sm">
              <Plus size={15} />Apply for Leave
            </button>
          </div>
        </div>

        {/* Leave Balance Cards */}
        {balance.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Leave Balance — {new Date().getFullYear()}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {balance.map((b) => {
                const pct = Math.round((b.remaining / b.quota) * 100);
                return (
                  <div key={b.leave_type} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2 leading-tight">{b.leave_type}</p>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-2xl font-bold text-slate-900">{b.remaining}</span>
                      <span className="text-xs text-slate-400">/ {b.quota} days</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{b.used} used</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leave History */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><Calendar size={16} className="text-blue-500" />Leave History</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {leaves.length > 0 ? leaves.map((leave) => (
              <motion.div key={leave.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="px-5 py-4 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <StatusIcon status={leave.status} />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{leave.leave_type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {leave.start_date} → {leave.end_date}
                        <span className="ml-2 font-medium text-slate-700">({leave.total_days} day{leave.total_days !== 1 ? 's' : ''})</span>
                      </p>
                      {leave.reason && <p className="text-xs text-slate-400 mt-1 italic">"{leave.reason}"</p>}
                      {leave.approval_notes && (
                        <p className="text-xs mt-1 text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                          HR note: {leave.approval_notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={statusBadge(leave.status)}>{leave.status}</span>
                </div>
              </motion.div>
            )) : (
              <div className="px-5 py-12 text-center text-slate-400">
                <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                <p>No leave requests yet. Apply for your first leave.</p>
              </div>
            )}
          </div>
        </div>

        {/* Apply Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Apply for Leave</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Leave Type *</label>
                  <select value={formData.leave_type} onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })} className={inputCls}>
                    {LEAVE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {/* Show balance for selected type */}
                  {(() => {
                    const b = balance.find((b) => b.leave_type === formData.leave_type);
                    if (!b) return null;
                    return (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${b.remaining === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        <AlertCircle size={11} />{b.remaining} days remaining of {b.quota}
                      </p>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Start Date *</label>
                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputCls} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date *</label>
                    <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className={inputCls} min={formData.start_date || new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                {formData.start_date && formData.end_date && (
                  <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <Calendar size={11} />{countDays(formData.start_date, formData.end_date)} day(s) requested
                  </p>
                )}
                <div>
                  <label className={labelCls}>Reason *</label>
                  <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className={`${inputCls} h-20 resize-none`} placeholder="Please provide a reason for your leave..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition">
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

export default MyLeaves;
