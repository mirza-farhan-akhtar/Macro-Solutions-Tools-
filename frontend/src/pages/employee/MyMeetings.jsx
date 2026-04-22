import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, MapPin, Link2, RefreshCw } from 'lucide-react';
import employeeAPI from '../../services/employeeAPI';
import toast from 'react-hot-toast';

function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await employeeAPI.myMeetings();
      setMeetings(res.data?.data || []);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const statusColor = (s) => {
    const map = { Scheduled: 'bg-blue-100 text-blue-700', 'In Progress': 'bg-yellow-100 text-yellow-700', Completed: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

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

  const upcoming  = meetings.filter(m => m.status === 'Scheduled');
  const past      = meetings.filter(m => m.status !== 'Scheduled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Meetings</h1>
            <p className="text-slate-500 mt-1">Meetings you're invited to or organising</p>
          </div>
          <button onClick={() => loadData(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2.5 rounded-lg transition">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Upcoming */}
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />Upcoming ({upcoming.length})
        </h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4 mb-8">
            {upcoming.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                    <p className="text-slate-500 text-sm">Organized by {m.organizer?.name || 'Admin'}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(m.status)}`}>{m.status}</span>
                </div>
                {m.description && <p className="text-slate-600 text-sm my-2 line-clamp-2">{m.description}</p>}
                <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1.5"><Calendar size={12} />{m.meeting_date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} />{m.meeting_time} &bull; {m.duration}min</span>
                  {m.location && <span className="flex items-center gap-1.5 col-span-2"><MapPin size={12} />{m.location}</span>}
                  {m.meeting_link && (
                    <span className="col-span-2 flex items-center gap-1.5">
                      <Link2 size={12} />
                      <a href={m.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate">{m.meeting_link}</a>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center mb-8">
            <Video size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No upcoming meetings</p>
          </div>
        )}

        {/* Past / Completed */}
        {past.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-slate-500" />Past Meetings ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between opacity-75">
                  <div>
                    <p className="font-semibold text-slate-700">{m.title}</p>
                    <p className="text-xs text-slate-500">{m.meeting_date} at {m.meeting_time}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(m.status)}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default MyMeetings;
