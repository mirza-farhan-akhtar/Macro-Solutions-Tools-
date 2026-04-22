import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Trash2, Video, Calendar, Clock, MapPin, Users, RefreshCw, Search, Link2, Check } from 'lucide-react';
import { usePermission } from '../../context/PermissionContext';
import hrAPI from '../../services/hrAPI';
import apiClient from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '',
  description: '',
  meeting_date: new Date().toISOString().split('T')[0],
  meeting_time: '10:00',
  duration: 60,
  location: '',
  meeting_link: '',
  status: 'Scheduled',
  attendee_user_ids: [],
};

function Meetings() {
  const { hasPermission } = usePermission();
  const [meetings, setMeetings]     = useState([]);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [formData, setFormData]     = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [mRes, uRes] = await Promise.allSettled([
        hrAPI.getMeetings(),
        apiClient.get('/admin/users'),
      ]);
      if (mRes.status === 'fulfilled') {
        setMeetings(mRes.value.data?.data?.data || mRes.value.data?.data || []);
      } else {
        toast.error('Failed to load meetings');
      }
      if (uRes.status === 'fulfilled') {
        setUsers(uRes.value.data?.data?.data || uRes.value.data?.data || []);
      }
      // If users fetch fails (e.g. no users.view permission), attendee list silently stays empty
    } catch (err) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => { setFormData(emptyForm); setEditing(null); };
  const openEdit  = (m) => { setEditing(m); setFormData({ ...emptyForm, ...m, attendee_user_ids: m.attendee_user_ids || [] }); setShowModal(true); };

  const handleSave = async () => {
    if (!formData.title || !formData.meeting_date || !formData.meeting_time) {
      toast.error('Title, date and time are required');
      return;
    }
    try {
      if (editing) {
        await hrAPI.updateMeeting(editing.id, formData);
        toast.success('Meeting updated');
      } else {
        await hrAPI.createMeeting(formData);
        toast.success('Meeting created');
      }
      setShowModal(false);
      resetForm();
      await loadData(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save meeting');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meeting?')) return;
    try {
      await hrAPI.deleteMeeting(id);
      toast.success('Meeting deleted');
      await loadData(true);
    } catch (err) {
      toast.error('Failed to delete meeting');
    }
  };

  const toggleAttendee = (userId) => {
    setFormData(prev => {
      const list = prev.attendee_user_ids.includes(userId)
        ? prev.attendee_user_ids.filter(id => id !== userId)
        : [...prev.attendee_user_ids, userId];
      return { ...prev, attendee_user_ids: list };
    });
  };

  const statusColor = (s) => {
    const map = { Scheduled: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-yellow-100 text-yellow-700', Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  const inputCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide';

  const filtered = meetings.filter(m =>
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || m.status === filterStatus)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading meetings...</p>
        </div>
      </div>
    );
  }

  const upcoming  = meetings.filter(m => m.status === 'Scheduled').length;
  const completed = meetings.filter(m => m.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-500 mt-1">Schedule and manage team meetings</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => loadData(true)} disabled={refreshing}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2.5 rounded-lg transition disabled:opacity-50">
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
              <Plus size={18} />New Meeting
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total',     value: meetings.length,  icon: Video,     bg: 'bg-blue-100',   text: 'text-blue-700' },
            { label: 'Upcoming',  value: upcoming,          icon: Calendar,  bg: 'bg-purple-100', text: 'text-purple-700' },
            { label: 'Completed', value: completed,         icon: Check,     bg: 'bg-green-100',  text: 'text-green-700' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">{c.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{c.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${c.bg}`}><Icon size={22} className={c.text} /></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="text" placeholder="Search meetings..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Meetings Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                    <p className="text-slate-500 text-sm">Organizer: {m.organizer?.name || 'N/A'}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(m.status)}`}>{m.status}</span>
                </div>
                {m.description && <p className="text-slate-600 text-sm mb-3 line-clamp-2">{m.description}</p>}
                <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={12} />{m.meeting_date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} />{m.meeting_time} &bull; {m.duration}min</span>
                  {m.location && <span className="flex items-center gap-1.5 col-span-2"><MapPin size={12} />{m.location}</span>}
                  {m.meeting_link && (
                    <span className="col-span-2 flex items-center gap-1.5">
                      <Link2 size={12} />
                      <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{m.meeting_link}</a>
                    </span>
                  )}
                </div>
                {(m.attendee_user_ids?.length > 0) && (
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                    <Users size={12} />{m.attendee_user_ids.length} attendee{m.attendee_user_ids.length !== 1 ? 's' : ''}
                  </p>
                )}
                <div className="flex gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition">
                    <Edit size={14} />Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition">
                    <Trash2 size={14} />Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4"><Video size={36} className="text-slate-400" /></div>
            <p className="text-slate-500">No meetings found</p>
          </div>
        )}

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">{editing ? 'Edit Meeting' : 'New Meeting'}</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="e.g., Q1 Planning" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Date *</label>
                    <input type="date" value={formData.meeting_date} onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Time *</label>
                    <input type="time" value={formData.meeting_time} onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Duration (minutes)</label>
                    <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })} className={inputCls} min="5" />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputCls}>
                      <option>Scheduled</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputCls} placeholder="Conference Room A / Remote" />
                </div>
                <div>
                  <label className={labelCls}>Meeting Link</label>
                  <input type="text" value={formData.meeting_link} onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })} className={inputCls} placeholder="https://meet.google.com/..." />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} h-20 resize-none`} placeholder="Agenda..." />
                </div>

                {/* Attendees */}
                <div>
                  <label className={labelCls}>Invite Attendees</label>
                  <div className="border border-slate-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
                    {users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
                        <input type="checkbox" checked={formData.attendee_user_ids.includes(u.id)}
                          onChange={() => toggleAttendee(u.id)}
                          className="h-4 w-4 text-blue-600 rounded border-slate-300" />
                        <span className="text-sm text-slate-700">{u.name} <span className="text-slate-400">({u.email})</span></span>
                      </label>
                    ))}
                    {users.length === 0 && <p className="text-sm text-slate-400 text-center py-2">No users found</p>}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
                    {editing ? 'Update Meeting' : 'Create Meeting'}
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition">
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

export default Meetings;
