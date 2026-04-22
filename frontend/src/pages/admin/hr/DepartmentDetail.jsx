import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import departmentAPI from '../../../services/departmentAPI';

export function DepartmentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartmentDetail();
  }, [slug]);

  const loadDepartmentDetail = async () => {
    try {
      setLoading(true);
      let dept = {
        id: slug,
        name: `Department ${slug}`,
        description: '',
        code: '',
        status: 'active',
        head: null,
        parent: null,
        createdAt: new Date().toISOString()
      };
      let emps = [];
      
      // Fetch department with stats using the proper API service
      let apiStats = null;
      try {
        const response = await departmentAPI.getDepartment(slug);
        // Extract department data from axios response - API returns { data: { ... }, stats: { ... } }
        const deptPayload = response.data?.data || response.data;
        apiStats = response.data?.stats; // Extract stats from API
        if (deptPayload && typeof deptPayload === 'object' && deptPayload.name) {
          dept = {
            id: deptPayload.id || slug,
            name: deptPayload.name,
            description: deptPayload.description || '',
            code: deptPayload.code || '',
            status: deptPayload.status || 'Active',
            head: deptPayload.head || null,
            parent: deptPayload.parent || null,
            createdAt: deptPayload.created_at || new Date().toISOString()
          };
          // Also extract employees from department object
          emps = Array.isArray(deptPayload.employees) ? deptPayload.employees : [];
        }
        console.log('Department data loaded:', dept.name);
      } catch (error) {
        console.warn('Department API failed:', error.message);
      }
      
      setDepartment(dept);
      setEmployees(emps);
      
      // Set stats - use actual stats from API if available, otherwise calculate from data
      setStats(
        apiStats ? {
          total_employees: apiStats.total_employees || emps.length,
          active_employees: apiStats.active_employees || emps.filter(e => e.status === 'active' || e.status === 'Active').length,
          total_projects: apiStats.total_projects || 0,
          completed_tasks: apiStats.completed_tasks || 0,
          pending_tasks: apiStats.pending_tasks || 0,
          total_tasks: apiStats.total_tasks || 0
        } : {
          total_employees: emps.length,
          active_employees: emps.filter(e => e.status === 'active' || e.status === 'Active').length,
          total_projects: 0,
          completed_tasks: 0,
          pending_tasks: 0,
          total_tasks: 0
        }
      );
    } catch (error) {
      console.error('Error loading department:', error);
      // Still set fallback data so page renders
      setDepartment({
        id: slug,
        name: `Department ${slug}`,
        description: '',
        code: '',
        status: 'active',
        head: null,
        parent: null,
        createdAt: new Date().toISOString()
      });
      setEmployees([]);
      setStats({
        total_employees: 0,
        active_employees: 0,
        total_projects: 0,
        completed_tasks: 0,
        pending_tasks: 0,
        total_tasks: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!department) return null;

  const statCards = [
    { icon: Users, label: 'Total Employees', value: stats?.total_employees || 0, color: 'bg-blue-100 text-blue-700' },
    { icon: Users, label: 'Active Employees', value: stats?.active_employees || 0, color: 'bg-green-100 text-green-700' },
    { icon: Briefcase, label: 'Active Projects', value: stats?.total_projects || 0, color: 'bg-purple-100 text-purple-700' },
    { icon: TrendingUp, label: 'Total Tasks', value: stats?.total_tasks || 0, color: 'bg-orange-100 text-orange-700' },
    { icon: CheckCircle2, label: 'Completed Tasks', value: stats?.completed_tasks || 0, color: 'bg-green-100 text-green-700' },
    { icon: Clock, label: 'Pending Tasks', value: stats?.pending_tasks || 0, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin/hr/departments')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Departments
          </button>
          
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{department.name}</h1>
                <p className="text-slate-600">{department.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Department Code</p>
                <p className="text-2xl font-bold font-mono text-blue-600">{department.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Department Head</p>
                <p className="text-lg font-semibold text-slate-900">{department.head?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  department.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {department.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Parent Department</p>
                <p className="text-lg font-semibold text-slate-900">{department.parent?.name || 'None'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Employees Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Department Employees ({employees.length})</h2>

            {employees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Name</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Designation</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Employment Type</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Email</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((emp, idx) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">{emp.name}</td>
                        <td className="px-6 py-4 text-slate-600">{emp.designation || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {emp.employment_type || 'Full-time'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs">{emp.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            emp.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {emp.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">No employees assigned to this department yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DepartmentDetail;
