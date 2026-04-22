import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, Phone, Mail, Calendar, MessageSquare, X } from 'lucide-react';
import crmAPI from '../../../services/crmAPI';
import hrAPI from '../../../services/hrAPI';
import toast from 'react-hot-toast';

const activityTypeIcons = {
  call: <Phone size={16} />,
  email: <Mail size={16} />,
  meeting: <Calendar size={16} />,
  note: <MessageSquare size={16} />,
  task: <CheckCircle2 size={16} />,
  follow_up: <Clock size={16} />,
};

const activityTypeColors = {
  call: 'bg-purple-100 text-purple-700',
  email: 'bg-blue-100 text-blue-700',
  meeting: 'bg-green-100 text-green-700',
  note: 'bg-yellow-100 text-yellow-700',
  task: 'bg-pink-100 text-pink-700',
  follow_up: 'bg-cyan-100 text-cyan-700',
};

const ActivityModal = ({ onClose, onSave, isSaving, leads, deals, clients, users }) => {
  const [formData, setFormData] = useState({
    related_type: 'Lead',
    related_id: '',
    activity_type: 'call',
    description: '',
    scheduled_at: '',
    assigned_to: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.related_id || !formData.description.trim()) {
      toast.error('Related item and description are required');
      return;
    }
    await onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getRelatedItems = () => {
    switch (formData.related_type) {
      case 'Lead':
        return leads;
      case 'Deal':
        return deals;
      case 'Client':
        return clients;
      default:
        return [];
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative"
        >
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold text-white">New Activity</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              type="button"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Related To *</label>
                <select
                  value={formData.related_type}
                  onChange={(e) => setFormData({ ...formData, related_type: e.target.value, related_id: '' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="Lead">Lead</option>
                  <option value="Deal">Deal</option>
                  <option value="Client">Client</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{formData.related_type} *</label>
                <select
                  value={formData.related_id}
                  onChange={(e) => setFormData({ ...formData, related_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="">Select {formData.related_type}</option>
                  {Array.isArray(getRelatedItems()) && getRelatedItems().map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name || item.deal_name || item.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Type *</label>
                <select
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                  <option value="task">Task</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To</label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                >
                  <option value="">Unassigned</option>
                  {Array.isArray(users) && users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                rows="4"
                placeholder="Activity description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : 'Create Activity'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showOverdue, setShowOverdue] = useState(false);
  const [overdue, setOverdue] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadActivities();
    loadOverdue();
  }, [filterType, showOverdue]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const params = {
        incomplete: true,
        activity_type: filterType !== 'all' ? filterType : undefined,
      };
      const [activitiesRes, leadsRes, dealsRes, clientsRes, usersRes] = await Promise.all([
        crmAPI.getActivities(params),
        crmAPI.getCRMLeads({ per_page: 100 }),
        crmAPI.getPipeline().then(res => {
          const deals = [];
          Object.values(res.data?.data || {}).forEach(stage => {
            if (stage.deals) deals.push(...stage.deals);
          });
          return { data: { data: deals } };
        }),
        crmAPI.getClients({ per_page: 100 }),
        hrAPI.getEmployees({ per_page: 100 }),
      ]);
      setActivities(activitiesRes.data?.data || []);
      setLeads(leadsRes.data?.data || []);
      setDeals(dealsRes.data?.data || []);
      setClients(clientsRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const loadOverdue = async () => {
    try {
      const response = await crmAPI.getOverdueActivities();
      setOverdue(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load overdue activities:', error.response?.data || error.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await crmAPI.completeActivity(id);
      toast.success('Activity completed');
      await loadActivities();
    } catch (error) {
      toast.error('Failed to complete activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await crmAPI.deleteActivity(id);
        toast.success('Activity deleted');
        await loadActivities();
      } catch (error) {
        toast.error('Failed to delete activity');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.related_id || !formData.description.trim()) {
        throw new Error('Related item and description are required');
      }

      let scheduledAtValue = null;
      if (formData.scheduled_at) {
        try {
          scheduledAtValue = new Date(formData.scheduled_at).toISOString();
        } catch (e) {
          console.error('Invalid datetime:', formData.scheduled_at);
          throw new Error('Invalid scheduled date/time format');
        }
      }

      const activityData = {
        related_type: formData.related_type,
        related_id: parseInt(formData.related_id, 10),
        activity_type: formData.activity_type,
        description: formData.description.trim(),
        scheduled_at: scheduledAtValue,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to, 10) : null,
      };

      await crmAPI.createActivity(activityData);
      toast.success('Activity created successfully');
      setShowActivityForm(false);
      await loadActivities();
    } catch (error) {
      let errorMsg = 'Failed to create activity';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle Laravel validation errors
        const errors = error.response.data.errors;
        errorMsg = Object.values(errors).flat()[0] || 'Validation error';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.error('Error saving activity:', errorMsg, error.response?.data || error);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const displayActivities = showOverdue ? overdue : activities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Activities</h1>
            <p className="text-slate-600 mt-2">Track calls, meetings, and follow-ups</p>
          </div>
          <button
            onClick={() => setShowActivityForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <Plus size={20} />
            New Activity
          </button>
        </motion.div>

        {/* Overdue Alert */}
        {overdue.length > 0 && !showOverdue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between cursor-pointer hover:bg-red-100 transition"
            onClick={() => setShowOverdue(true)}
          >
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-900">Overdue Activities</p>
                <p className="text-sm text-red-700">{overdue.length} activities are overdue</p>
              </div>
            </div>
            <button className="text-red-600 font-semibold hover:underline">View</button>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex gap-4"
        >
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
          >
            <option value="all">All Types</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="note">Note</option>
            <option value="task">Task</option>
            <option value="follow_up">Follow-up</option>
          </select>
          <button
            onClick={() => setShowOverdue(!showOverdue)}
            className={`px-4 py-2.5 rounded-xl font-semibold transition ${
              showOverdue
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            {showOverdue ? `Overdue (${overdue.length})` : 'All Activities'}
          </button>
        </motion.div>

        {/* Activities Timeline */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full" />
            </div>
          </div>
        ) : displayActivities.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {displayActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${activityTypeColors[activity.activity_type] || 'bg-slate-100'}`}>
                    {activityTypeIcons[activity.activity_type] || <MessageSquare size={16} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 capitalize">{activity.activity_type.replace('_', ' ')}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{activity.description}</p>
                      </div>
                      {activity.isOverdue && (
                        <span className="flex-shrink-0 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded whitespace-nowrap ml-2">
                          Overdue
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                      {activity.scheduled_at && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(activity.scheduled_at).toLocaleDateString()}
                        </span>
                      )}
                      {activity.created_by && (
                        <span>By {activity.creator?.name}</span>
                      )}
                      {activity.assigned_to && (
                        <span>Assigned to {activity.assignedUser?.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {!activity.completed && (
                      <button
                        onClick={() => handleComplete(activity.id)}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                        title="Mark complete"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {showOverdue ? 'No overdue activities' : 'No activities scheduled'}
            </p>
          </div>
        )}

        {/* Activity Modal */}
        {showActivityForm && (
          <ActivityModal
            onClose={() => setShowActivityForm(false)}
            onSave={handleSave}
            isSaving={isSaving}
            leads={leads}
            deals={deals}
            clients={clients}
            users={users}
          />
        )}
      </div>
    </div>
  );
}
