import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Calendar, Users, Clock, Plus, MoreVertical } from 'lucide-react';
import departmentAPI from '../../../services/departmentAPI';
import toast from 'react-hot-toast';

export function DepartmentMeetings() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      setMeetings([]);
      let dept = null;
      let apiStats = null;
      
      try {
        const response = await departmentAPI.getDepartment(slug);
        const deptPayload = response.data?.data || response.data;
        apiStats = response.data?.stats;
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

      // Fetch meetings for this department from API
      try {
        const response = await departmentAPI.getDepartmentMeetings(slug);
        const meetingData = response.data?.data || response.data;
        const meetingsList = Array.isArray(meetingData) ? meetingData : [];
        setMeetings(meetingsList);
      } catch (error) {
        console.warn('Meetings API failed:', error.message);
        setMeetings([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDepartment({ id: slug, name: `Department ${slug}` });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-white/60 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{department?.name} - Meetings</h1>
                <p className="text-gray-600 mt-1">Schedule and manage department meetings</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </motion.button>
          </div>
        </motion.div>

        {/* Meetings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {meetings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No meetings scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Meeting Details */}
                  <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(meeting.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time} ({meeting.duration} minutes)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{Array.isArray(meeting.attendees) ? meeting.attendees.length : 1} attendee(s)</span>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Attendees:</p>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees?.map((attendee, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Join Button */}
                  {meeting.meetingLink && meeting.status === 'scheduled' && (
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DepartmentMeetings;
