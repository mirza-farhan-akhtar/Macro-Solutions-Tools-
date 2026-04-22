import apiClient from './api';

const employeeAPI = {
  // Profile
  me: () => apiClient.get('/employee/me'),

  // Attendance
  myAttendance: (params = {}) => apiClient.get('/employee/attendance', { params }),
  checkIn: () => apiClient.post('/employee/attendance/check-in'),
  checkOut: () => apiClient.put('/employee/attendance/check-out'),

  // Leaves
  myLeaves: () => apiClient.get('/employee/leaves'),
  applyLeave: (data) => apiClient.post('/employee/leaves', data),
  leaveBalance: () => apiClient.get('/employee/leaves/balance'),

  // Meetings
  myMeetings: () => apiClient.get('/employee/meetings'),

  // Dashboard
  dashboard: () => apiClient.get('/employee/dashboard'),
};

export default employeeAPI;
