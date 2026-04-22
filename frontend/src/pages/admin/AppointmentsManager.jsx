import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Calendar, Clock } from 'lucide-react';
import { appointmentsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CanView } from '../../components/PermissionGuard';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.list();
      setAppointments(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await appointmentsAPI.update(editingAppointment.id, formData);
        toast.success('Appointment updated');
      } else {
        await appointmentsAPI.create(formData);
        toast.success('Appointment created');
      }
      setShowModal(false);
      setEditingAppointment(null);
      resetForm();
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone || '',
      service: appointment.service,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      notes: appointment.notes || '',
      status: appointment.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await appointmentsAPI.delete(id);
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({ client_name: '', client_email: '', client_phone: '', service: '', appointment_date: '', appointment_time: '', notes: '', status: 'scheduled' });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments Management</h1>
        <CanView permission="crm.manage">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="glass-button">
            <Plus className="w-4 h-4 mr-2" /> Add Appointment
          </button>
        </CanView>
      </div>

      <div className="glass-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pl-10 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input"
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <motion.tr key={appointment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{appointment.client_name}</div>
                      <div className="text-gray-500 text-sm">{appointment.client_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appointment.service}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 text-gray-400 ml-2" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'rescheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <CanView permission="crm.manage">
                      <button onClick={() => handleEdit(appointment)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                    </CanView>
                    <CanView permission="crm.manage">
                      <button onClick={() => handleDelete(appointment.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </CanView>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input type="text" value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})} className="glass-input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Email</label>
                  <input type="email" value={formData.client_email} onChange={(e) => setFormData({...formData, client_email: e.target.value})} className="glass-input w-full" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Phone</label>
                  <input type="text" value={formData.client_phone} onChange={(e) => setFormData({...formData, client_phone: e.target.value})} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service</label>
                  <input type="text" value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} className="glass-input w-full" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={formData.appointment_date} onChange={(e) => setFormData({...formData, appointment_date: e.target.value})} className="glass-input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input type="time" value={formData.appointment_time} onChange={(e) => setFormData({...formData, appointment_time: e.target.value})} className="glass-input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="glass-input w-full">
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="glass-input w-full" rows="3" />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowModal(false); setEditingAppointment(null); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="glass-button">{editingAppointment ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
