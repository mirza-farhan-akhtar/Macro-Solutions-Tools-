import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Search, RefreshCw, X } from 'lucide-react';
import { usePermission } from '../../../context/PermissionContext';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

export function Attendance() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const [attendance, setAttendance] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordData, setRecordData] = useState({
    employee_id: '',
    date: new Date().toISOString().slice(0, 10),
    check_in: '',
    check_out: '',
    status: 'Present',
  });

  useEffect(() => {
    loadData();
    loadEmployees();
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await hrAPI.getAttendance({ month: selectedMonth });
      setAttendance(response.data?.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
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

  const handleRecordAttendance = async () => {
    try {
      if (!recordData.employee_id || !recordData.date) {
        toast.error('Please fill required fields');
        return;
      }

      await hrAPI.recordAttendance(recordData);
      toast.success('Attendance recorded successfully');
      setShowRecordModal(false);
      setRecordData({
        employee_id: '',
        date: new Date().toISOString().slice(0, 10),
        check_in: '',
        check_out: '',
        status: 'Present',
      });
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record attendance');
    }
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    const diffMinutes = outMinutes - inMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m`;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const filteredAttendance = attendance.filter(
    (record) => selectedEmployee === 'all' || record.employee_id === parseInt(selectedEmployee)
  );

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter((r) => r.status === 'Present').length,
    absent: filteredAttendance.filter((r) => r.status === 'Absent').length,
    late: filteredAttendance.filter((r) => r.status === 'Late').length,
  };

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Attendance Management</h1>
            <p className="text-slate-500 mt-1">Track employee attendance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {hasPermission('hr.create') && (
              <button
                onClick={() => setShowRecordModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Record Attendance
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className={inputCls}
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition border-b border-slate-100">
                      <td className="px-6 py-4 text-slate-700">{record.date}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          {record.employee?.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {record.check_in || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {record.check_out || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {calculateHours(record.check_in, record.check_out)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          record.status === 'Present' ? 'bg-green-100 text-green-700' :
                          record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Modal */}
        {showRecordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Record Attendance</h2>
                <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Employee *</label>
                  <select
                    value={recordData.employee_id}
                    onChange={(e) => setRecordData({ ...recordData, employee_id: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date *</label>
                  <input
                    type="date"
                    value={recordData.date}
                    onChange={(e) => setRecordData({ ...recordData, date: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Check In</label>
                    <input
                      type="time"
                      value={recordData.check_in}
                      onChange={(e) => setRecordData({ ...recordData, check_in: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Check Out</label>
                    <input
                      type="time"
                      value={recordData.check_out}
                      onChange={(e) => setRecordData({ ...recordData, check_out: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    value={recordData.status}
                    onChange={(e) => setRecordData({ ...recordData, status: e.target.value })}
                    className={inputCls}
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                    <option>Leave</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleRecordAttendance}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Record
                  </button>
                  <button
                    onClick={() => setShowRecordModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
