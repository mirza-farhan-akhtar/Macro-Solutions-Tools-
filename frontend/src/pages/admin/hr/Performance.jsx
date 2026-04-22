import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Star, TrendingUp, BarChart3, Search, RefreshCw, ChevronDown, X } from 'lucide-react';
import { usePermission } from '../../../context/PermissionContext';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

export function Performance() {
  const { hasPermission, isSuperAdmin } = usePermission();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterDept, setFilterDept] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deptStats, setDeptStats] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: '',
    review_period: new Date().toISOString().slice(0, 7),
    rating: 5,
    reviewer_id: '', // Will be filled by auth user on backend
    comments: '',
    strengths: '',
    areas_for_improvement: '',
    status: 'Draft',
  });

  const ratings = [1, 2, 3, 4, 5];
  const statuses = ['Draft', 'Submitted', 'Reviewed', 'Acknowledged'];

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const response = await hrAPI.getReviews();
      setReviews(response.data?.data?.data || []);

      // Extract unique departments from reviews
      const depts = [...new Set(response.data?.data?.data?.map((r) => r.employee?.department))].filter(Boolean);
      setDepartments(depts);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load reviews');
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

  const loadDeptStats = async (dept) => {
    try {
      const response = await hrAPI.getDepartmentStats(dept);
      setDeptStats(response.data?.data);
    } catch (err) {
      console.error('Failed to load dept stats');
    }
  };

  const handleSaveReview = async () => {
    try {
      if (!formData.employee_id || !formData.review_period) {
        toast.error('Please fill required fields');
        return;
      }

      if (editingReview) {
        await hrAPI.updateReview(editingReview.id, formData);
        toast.success('Review updated successfully');
      } else {
        await hrAPI.createReview(formData);
        toast.success('Review created successfully');
      }
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save review');
    }
  };

  const editReview = (review) => {
    setFormData({
      employee_id: review.employee_id,
      review_period: review.review_period,
      rating: review.rating,
      reviewer_id: review.reviewer_id,
      comments: review.comments,
      strengths: review.strengths,
      areas_for_improvement: review.areas_for_improvement,
      status: review.status,
    });
    setEditingReview(review);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      review_period: new Date().toISOString().slice(0, 7),
      rating: 5,
      reviewer_id: '',
      comments: '',
      strengths: '',
      areas_for_improvement: '',
      status: 'Draft',
    });
    setEditingReview(null);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading performance reviews...</p>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(
    (review) =>
      (filterDept === 'all' || review.employee?.department === filterDept) &&
      review.employee?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const reviewStatusBadge = (status) => {
    if (status === 'Reviewed') return 'bg-green-100 text-green-700';
    if (status === 'Submitted') return 'bg-blue-100 text-blue-700';
    if (status === 'Acknowledged') return 'bg-purple-100 text-purple-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Performance Reviews</h1>
            <p className="text-slate-500 mt-1">Manage employee performance evaluations</p>
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
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Review
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{avgRating}/5</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Reviewed</p>
                <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.status === 'Reviewed').length}</p>
              </div>
            </div>
          </div>
        </div>

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
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              if (e.target.value !== 'all') loadDeptStats(e.target.value);
            }}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        {/* Department Stats */}
        {deptStats && filterDept !== 'all' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-blue-900 font-semibold">{filterDept} Department</p>
              <p className="text-blue-700 text-sm">
                Avg Rating: <span className="font-semibold">{deptStats.average_rating || '—'}/5</span> •
                Total Reviews: <span className="font-semibold">{deptStats.total_reviews}</span>
              </p>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.length > 0 ? filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <button
                onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-slate-900">{review.employee?.full_name}</h3>
                  <p className="text-sm text-slate-500">
                    {review.review_period} • {review.employee?.designation} • {review.employee?.department}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${reviewStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === review.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {expandedId === review.id && (
                <div className="border-t border-slate-100 p-5 bg-slate-50 space-y-3">
                  {review.comments && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Comments</p>
                      <p className="text-slate-700 text-sm">{review.comments}</p>
                    </div>
                  )}
                  {review.strengths && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Strengths</p>
                      <p className="text-slate-700 text-sm">{review.strengths}</p>
                    </div>
                  )}
                  {review.areas_for_improvement && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Areas for Improvement</p>
                      <p className="text-slate-700 text-sm">{review.areas_for_improvement}</p>
                    </div>
                  )}
                  {hasPermission('hr.edit') && (
                    <div className="pt-3 border-t border-slate-200">
                      <button
                        onClick={() => editReview(review)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No performance reviews found</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingReview ? 'Edit Review' : 'New Performance Review'}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Employee *</label>
                    <select value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} className={inputCls}>
                      <option value="">Select Employee</option>
                      {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Review Period *</label>
                    <input type="month" value={formData.review_period} onChange={(e) => setFormData({...formData, review_period: e.target.value})} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Rating (1-5)</label>
                    <div className="flex gap-2 mt-1">
                      {ratings.map((r) => (
                        <button
                          key={r}
                          onClick={() => setFormData({...formData, rating: r})}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition border ${
                            formData.rating === r
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                              : 'bg-white text-slate-500 border-slate-300 hover:border-yellow-400'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 inline mr-0.5" />{r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputCls}>
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Comments</label>
                  <textarea value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})} className={`${inputCls} h-20 resize-none`} placeholder="Overall comments..." />
                </div>
                <div>
                  <label className={labelCls}>Strengths</label>
                  <textarea value={formData.strengths} onChange={(e) => setFormData({...formData, strengths: e.target.value})} className={`${inputCls} h-20 resize-none`} placeholder="Key strengths..." />
                </div>
                <div>
                  <label className={labelCls}>Areas for Improvement</label>
                  <textarea value={formData.areas_for_improvement} onChange={(e) => setFormData({...formData, areas_for_improvement: e.target.value})} className={`${inputCls} h-20 resize-none`} placeholder="Areas to improve..." />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={handleSaveReview} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    {editingReview ? 'Update' : 'Create'}
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

export default Performance;
