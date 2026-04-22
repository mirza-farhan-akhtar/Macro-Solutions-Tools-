import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, FileText, Target, Settings, Briefcase, Clock, FolderKanban, CheckCircle2 } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import toast from 'react-hot-toast';

export function DepartmentTimeline() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setEvents([]);
      let dept = null;
      
      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        if (deptPayload && typeof deptPayload === 'object' && deptPayload.name) {
          dept = {
            id: deptPayload.id || slug,
            name: deptPayload.name,
            description: deptPayload.description || ''
          };
        }
      } catch (error) {
        console.warn('Department API failed:', error.message);
      }
      
      if (!dept) {
        dept = { id: slug, name: `Department ${slug}`, description: '' };
      }
      setDepartment(dept);

      // Fetch timeline from API
      try {
        const response = await departmentAPI.getDepartmentTimeline(slug);
        const timelineData = response.data?.data || [];
        setEvents(Array.isArray(timelineData) ? timelineData : []);
      } catch (error) {
        console.warn('Timeline API failed:', error.message);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartment({ id: slug, name: `Department ${slug}` });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All Events' },
    { value: 'project_start', label: 'Projects Started' },
    { value: 'project_end', label: 'Projects Ended' }
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  const getEventColor = (type) => {
    switch(type) {
      case 'project_start': return 'bg-blue-50 border-blue-200';
      case 'project_end': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'project_start': return 'text-blue-600';
      case 'project_end': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'project_start': return FolderKanban;
      case 'project_end': return CheckCircle2;
      default: return Clock;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/60 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Timeline</h1>
              <p className="text-gray-600 mt-1">Track all department activities and changes</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events found for this filter</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-100 to-transparent" />

              {/* Timeline events */}
              <div className="space-y-6">
                {filteredEvents.map((event, idx) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-1 top-6 w-14 h-14 rounded-full ${getEventColor(event.type)} flex items-center justify-center border-2 border-white shadow-md`}>
                        <Icon className={`w-7 h-7 ${getIconColor(event.type)}`} />
                      </div>

                      {/* Event card */}
                      <div className="ml-32 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
                          <User className="w-4 h-4" />
                          <span>by <span className="font-medium text-gray-700">{event.user}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{timelineEvents.length}</p>
              <p className="text-sm text-gray-600 mt-2">Total Events</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{timelineEvents.filter(e => e.type === 'member_added').length}</p>
              <p className="text-sm text-gray-600 mt-2">Members Added</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{timelineEvents.filter(e => e.type.includes('project')).length}</p>
              <p className="text-sm text-gray-600 mt-2">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">{timelineEvents.filter(e => e.type === 'budget_updated').length}</p>
              <p className="text-sm text-gray-600 mt-2">Budget Updates</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DepartmentTimeline;
