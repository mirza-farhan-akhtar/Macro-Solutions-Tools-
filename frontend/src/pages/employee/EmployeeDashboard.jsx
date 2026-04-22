import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Video, User, CheckCircle, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import employeeAPI from '../../services/employeeAPI';
import toast from 'react-hot-toast';

function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [checking, setChecking] = useState(false);

  const loadDashboard = async () => {
    try {
      const res = await employeeAPI.dashboard();
      setData(res.data?.data);
    } catch {
      // silently fail if linked employee doesn't exist yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      await employeeAPI.checkIn();
      toast.success('Checked in successfully!');
      loadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    try {
      await employeeAPI.checkOut();
      toast.success('Checked out successfully!');
      loadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally {
      setChecking(false);
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initials = (name) => name ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '?';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const today    = data?.today_attendance;
  const employee = data?.employee;
  const checkedIn   = today && today.check_in;
  const checkedOut  = today && today.check_out;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
              {initials(user?.name || '')}
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">{getGreeting()},</p>
              <h1 className="text-3xl font-bold">{user?.name || 'Employee'}</h1>
              <p className="text-blue-200 text-sm mt-0.5">
                {employee?.designation || user?.role || 'Employee'}{employee?.department ? ` · ${employee.department}` : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions: Check In / Out */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />Today's Attendance
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {!checkedIn ? (
              <button onClick={handleCheckIn} disabled={checking}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50">
                <LogIn size={18} />Check In
              </button>
            ) : !checkedOut ? (
              <>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={18} />Checked in at {today.check_in}
                </div>
                <button onClick={handleCheckOut} disabled={checking}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50">
                  <LogOut size={18} />Check Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle size={18} className="text-green-600" />
                <span className="font-medium">Checked in: {today.check_in}</span>
                <span className="text-slate-400">—</span>
                <CheckCircle size={18} className="text-orange-500" />
                <span className="font-medium">Checked out: {today.check_out}</span>
              </div>
            )}
            {today && (
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                today.status === 'Present' ? 'bg-green-100 text-green-700' :
                today.status === 'Late'    ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-600'}`}>{today.status}</span>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Present This Month',  value: data?.present_this_month  ?? '—', icon: CheckCircle, bg: 'bg-green-100',  text: 'text-green-700',  prefix: '', suffix: ' days' },
            { label: 'Pending Leave Reqs',  value: data?.pending_leaves      ?? '—', icon: AlertCircle, bg: 'bg-yellow-100', text: 'text-yellow-700', prefix: '', suffix: '' },
            { label: 'Meetings (next 7d)',  value: data?.upcoming_meetings   ?? '—', icon: Video,       bg: 'bg-blue-100',   text: 'text-blue-700',   prefix: '', suffix: '' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">{c.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{c.prefix}{c.value}{c.suffix}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${c.bg}`}><Icon size={22} className={c.text} /></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Profile Card */}
        {employee && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" />My Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Employee ID',      value: employee.employee_id },
                { label: 'Department',       value: employee.department },
                { label: 'Designation',      value: employee.designation },
                { label: 'Employment Type',  value: employee.employment_type },
                { label: 'Joining Date',     value: employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : '—' },
                { label: 'Status',           value: employee.status },
              ].map((f, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{f.label}</p>
                  <p className="text-slate-900 font-medium text-sm">{f.value || '—'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
