import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Calendar, RefreshCw, LogIn, LogOut, AlertCircle } from 'lucide-react';
import employeeAPI from '../../services/employeeAPI';
import toast from 'react-hot-toast';

export function MyAttendance() {
  const [data, setData] = useState({ records: [], summary: {}, today: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => { loadData(); }, [selectedMonth]);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await employeeAPI.myAttendance({ month: selectedMonth });
      setData(res.data?.data || { records: [], summary: {}, today: null });
    } catch (err) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await employeeAPI.checkIn();
      toast.success(res.data?.message || 'Checked in successfully');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await employeeAPI.checkOut();
      toast.success(res.data?.message || 'Checked out successfully');
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check out');
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      Present:  'bg-green-100 text-green-700',
      Absent:   'bg-red-100 text-red-700',
      Late:     'bg-yellow-100 text-yellow-700',
      Leave:    'bg-blue-100 text-blue-700',
      'Half Day': 'bg-orange-100 text-orange-700',
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading attendance...</p>
        </div>
      </div>
    );
  }

  const { records, summary, today } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
            <p className="text-slate-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium shadow-sm">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />Refresh
          </button>
        </div>

        {/* Today's Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-500" />Today's Status</h2>
          {today ? (
            <div className="flex flex-wrap gap-6 items-center">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                <span className={statusBadge(today.status)}>{today.status}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Check In</p>
                <p className="font-semibold text-slate-900">{today.check_in || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Check Out</p>
                <p className="font-semibold text-slate-900">{today.check_out || '—'}</p>
              </div>
              {today.check_in && today.check_out && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Hours</p>
                  <p className="font-semibold text-slate-900">
                    {(() => {
                      const [ih, im] = today.check_in.split(':').map(Number);
                      const [oh, om] = today.check_out.split(':').map(Number);
                      const mins = (oh * 60 + om) - (ih * 60 + im);
                      return `${Math.floor(mins / 60)}h ${mins % 60}m`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No attendance recorded yet today.</p>
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex gap-3">
            {!today && (
              <button onClick={handleCheckIn} disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-60">
                <LogIn size={16} />{actionLoading ? 'Processing...' : 'Check In'}
              </button>
            )}
            {today && !today.check_out && (
              <button onClick={handleCheckOut} disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition shadow-sm disabled:opacity-60">
                <LogOut size={16} />{actionLoading ? 'Processing...' : 'Check Out'}
              </button>
            )}
            {today && today.check_out && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-500 rounded-lg text-sm font-medium">
                <CheckCircle size={16} className="text-green-500" />Attendance complete for today
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><AlertCircle size={11} />Check-in after 09:30 AM is marked as Late.</p>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Present', value: summary.present || 0, color: 'bg-green-100 text-green-700' },
            { label: 'Absent',  value: summary.absent  || 0, color: 'bg-red-100 text-red-700' },
            { label: 'Late',    value: summary.late    || 0, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Leave',   value: summary.leave   || 0, color: 'bg-blue-100 text-blue-700' },
            { label: 'Half Day',value: summary.half_day|| 0, color: 'bg-orange-100 text-orange-700' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className={`text-xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Month picker + History */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><Calendar size={16} className="text-blue-500" />Attendance History</h2>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Date', 'Day', 'Check In', 'Check Out', 'Hours', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? records.map((r) => {
                let hrs = '—';
                if (r.check_in && r.check_out) {
                  const [ih, im] = r.check_in.split(':').map(Number);
                  const [oh, om] = r.check_out.split(':').map(Number);
                  const mins = (oh * 60 + om) - (ih * 60 + im);
                  hrs = `${Math.floor(mins / 60)}h ${mins % 60}m`;
                }
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{r.date}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                    <td className="px-5 py-3 text-slate-700">{r.check_in || '—'}</td>
                    <td className="px-5 py-3 text-slate-700">{r.check_out || '—'}</td>
                    <td className="px-5 py-3 text-slate-700">{hrs}</td>
                    <td className="px-5 py-3"><span className={statusBadge(r.status)}>{r.status}</span></td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">No records found for this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
