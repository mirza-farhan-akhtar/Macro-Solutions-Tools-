import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import workspaceAPI from '../../services/workspaceAPI';

export function WorkspaceNotifications() {
  const { departmentSlug } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (departmentSlug) {
      loadNotifications();
    }
  }, [departmentSlug, page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setNotifications([]);
      const res = await workspaceAPI.getNotifications(departmentSlug, {
        page,
        per_page: 20
      });
      setNotifications(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
      console.error('Notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-600">Collaboration requests and department updates</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
              <button
                onClick={loadNotifications}
                className="text-red-700 hover:underline text-sm mt-2"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition border-l-4 border-yellow-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">
                        Collaboration Request
                        {notif.status === 'Pending' && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {notif.requestingDepartment?.name} has requested team member assignment for <strong>{notif.project?.name}</strong>
                      </p>
                    </div>
                  </div>
                  <X className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Project</p>
                    <p className="font-semibold text-slate-900">{notif.project?.code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">From Department</p>
                    <p className="font-semibold text-slate-900">{notif.requestingDepartment?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Status</p>
                    <p className={`font-semibold ${notif.status === 'Pending' ? 'text-yellow-600' : notif.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                      {notif.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide">Created</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {notif.status === 'Pending' && (
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                      Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Notifications</h3>
            <p className="text-slate-600">You're all caught up! No pending notifications.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
