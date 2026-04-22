import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Mail, Phone, Calendar, MapPin, DollarSign, Search, RefreshCw, ChevronDown, X } from 'lucide-react';
import { usePermission } from '../../../context/PermissionContext';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

export function Employees() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
    employment_type: 'Full-time',
    salary: '',
    status: 'Active',
    emergency_contact: '',
    address: '',
    bank_account: '',
    pan_number: '',
    work_start_time: '09:00',
    work_end_time: '18:00',
  });

  const [departments, setDepartments] = useState([]);
  const designations = ['Manager', 'Senior', 'Junior', 'Intern', 'Executive', 'Specialist'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated'];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setRefreshing(true);
      const [empRes, deptRes] = await Promise.all([
        hrAPI.getEmployees(),
        hrAPI.getDepartments(),
      ]);
      setEmployees(empRes.data?.data?.data || []);
      setDepartments(deptRes.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveEmployee = async () => {
    try {
      if (!formData.full_name || !formData.email || !formData.department) {
        toast.error('Please fill required fields');
        return;
      }

      if (editingEmployee) {
        await hrAPI.updateEmployee(editingEmployee.id, formData);
        toast.success('Employee updated successfully');
      } else {
        await hrAPI.createEmployee(formData);
        toast.success('Employee created successfully');
      }
      setShowModal(false);
      resetForm();
      await loadEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleDeleteEmployee = async (empId) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await hrAPI.deleteEmployee(empId);
        toast.success('Employee deleted successfully');
        await loadEmployees();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const editEmployee = (emp) => {
    setFormData(emp);
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      joining_date: '',
      employment_type: 'Full-time',
      salary: '',
      status: 'Active',
      emergency_contact: '',
      address: '',
      bank_account: '',
      pan_number: '',
      work_start_time: '09:00',
      work_end_time: '18:00',
    });
    setEditingEmployee(null);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading employees...</p>
        </div>
      </div>
    );
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDept === 'all' || emp.department === filterDept) &&
    (filterStatus === 'all' || emp.status === filterStatus)
  );

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const statusBadge = (status) => {
    const map = { Active: 'bg-green-100 text-green-700', Inactive: 'bg-slate-100 text-slate-600', 'On Leave': 'bg-yellow-100 text-yellow-700', Terminated: 'bg-red-100 text-red-700' };
    return `${map[status] || 'bg-slate-100 text-slate-600'} px-2.5 py-0.5 rounded-full text-xs font-semibold`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Employee Management</h1>
            <p className="text-slate-500 mt-1">Manage your workforce</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadEmployees}
              disabled={refreshing}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {hasPermission('hr.create') && (
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => <option key={dept.id || dept.name} value={dept.name}>{dept.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="text-sm text-slate-500 mb-4">{filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</p>

        {/* Employee List */}
        <div className="space-y-3">
          {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <button
                onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-slate-900">{emp.full_name}</h3>
                  <p className="text-sm text-slate-500">{emp.designation} • {emp.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge(emp.status)}>{emp.status}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === emp.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {expandedId === emp.id && (
                <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />{emp.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone</p>
                      <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                        <Phone className="w-3.5 h-3.5 text-blue-500" />{emp.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Joining Date</p>
                      <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />{emp.joining_date || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Employment Type</p>
                      <p className="text-slate-700 text-sm">{emp.employment_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Salary</p>
                      <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                        <DollarSign className="w-3.5 h-3.5 text-green-500" />&#8377;{emp.salary || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Address</p>
                      <p className="text-slate-700 flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />{emp.address?.substring(0, 25) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {emp.emergency_contact && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Emergency Contact</p>
                      <p className="text-slate-700 text-sm">{emp.emergency_contact}</p>
                    </div>
                  )}
                  {(hasPermission('hr.edit') || hasPermission('hr.delete')) && (
                    <div className="flex gap-2 pt-3 border-t border-slate-200">
                      {hasPermission('hr.edit') && (
                        <button
                          onClick={() => editEmployee(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                      {hasPermission('hr.delete') && (
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No employees found</p>
            </div>
          )}
        </div>

        {/* Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={inputCls} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputCls} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputCls} placeholder="9876543210" />
                  </div>
                  <div>
                    <label className={labelCls}>Joining Date</label>
                    <input type="date" value={formData.joining_date} onChange={(e) => setFormData({...formData, joining_date: e.target.value})} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Department *</label>
                    <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className={inputCls}>
                      <option value="">Select Department</option>
                      {departments.map((d) => <option key={d.id || d.name} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Designation</label>
                    <select value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className={inputCls}>
                      <option value="">Select Designation</option>
                      {designations.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Employment Type</label>
                    <select value={formData.employment_type} onChange={(e) => setFormData({...formData, employment_type: e.target.value})} className={inputCls}>
                      <option>Full-time</option><option>Part-time</option><option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Salary</label>
                    <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className={inputCls} placeholder="50000" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputCls}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={inputCls} placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Emergency Contact</label>
                    <input type="text" value={formData.emergency_contact} onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} className={inputCls} placeholder="Contact number" />
                  </div>
                  <div>
                    <label className={labelCls}>PAN</label>
                    <input type="text" value={formData.pan_number} onChange={(e) => setFormData({...formData, pan_number: e.target.value})} className={inputCls} placeholder="PAN number" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Work Schedule</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Start Time (late if after this)</label>
                      <input type="time" value={formData.work_start_time} onChange={(e) => setFormData({...formData, work_start_time: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">End Time</label>
                      <input type="time" value={formData.work_end_time} onChange={(e) => setFormData({...formData, work_end_time: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={handleSaveEmployee} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    {editingEmployee ? 'Update' : 'Add Employee'}
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">
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

export default Employees;
