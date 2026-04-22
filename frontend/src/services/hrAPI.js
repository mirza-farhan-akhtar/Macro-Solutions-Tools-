import apiClient from './api';

const hrAPI = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/hr/dashboard'),

  // Employees
  getEmployees: (params = {}) => apiClient.get('/admin/hr/employees', { params }),
  getEmployee: (id) => apiClient.get(`/admin/hr/employees/${id}`),
  createEmployee: (data) => apiClient.post('/admin/hr/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/admin/hr/employees/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`/admin/hr/employees/${id}`),

  // Attendance
  getAttendance: (params = {}) => apiClient.get('/admin/hr/attendance', { params }),
  recordAttendance: (data) => apiClient.post('/admin/hr/attendance', data),
  updateAttendance: (id, data) => apiClient.put(`/admin/hr/attendance/${id}`, data),
  getMonthlyAttendance: (employeeId, month) => 
    apiClient.get(`/admin/hr/attendance/${employeeId}/${month}`),

  // Leave Requests
  getLeaveRequests: (params = {}) => apiClient.get('/admin/hr/leaves', { params }),
  requestLeave: (data) => apiClient.post('/admin/hr/leaves', data),
  approveLeave: (id, data) => apiClient.put(`/admin/hr/leaves/${id}/approve`, data),
  rejectLeave: (id, data) => apiClient.put(`/admin/hr/leaves/${id}/reject`, data),
  getLeaveBalance: (employeeId) => apiClient.get(`/admin/hr/leaves/${employeeId}/balance`),

  // Performance Reviews
  getReviews: (params = {}) => apiClient.get('/admin/hr/performance-reviews', { params }),
  createReview: (data) => apiClient.post('/admin/hr/performance-reviews', data),
  updateReview: (id, data) => apiClient.put(`/admin/hr/performance-reviews/${id}`, data),
  getDepartmentStats: (department) => apiClient.get(`/admin/hr/performance-reviews/department/${department}`),

  // Interviews
  getInterviews: (params = {}) => apiClient.get('/admin/hr/interviews', { params }),
  scheduleInterview: (data) => apiClient.post('/admin/hr/interviews', data),
  updateInterview: (id, data) => apiClient.put(`/admin/hr/interviews/${id}`, data),
  completeInterview: (id, data) => apiClient.put(`/admin/hr/interviews/${id}/complete`, data),

  // Recruitment
  getJobPosts: (params = {}) => apiClient.get('/admin/hr/recruitment/jobs', { params }),
  createJobPost: (data) => apiClient.post('/admin/hr/recruitment/jobs', data),
  updateJobPost: (id, data) => apiClient.put(`/admin/hr/recruitment/jobs/${id}`, data),
  deleteJobPost: (id) => apiClient.delete(`/admin/hr/recruitment/jobs/${id}`),
  getApplications: (params = {}) => apiClient.get('/admin/hr/recruitment/applications', { params }),
  updateApplicationStatus: (id, data) => apiClient.put(`/admin/hr/recruitment/applications/${id}/status`, data),
  hireApplicant: (id, data) => apiClient.post(`/admin/hr/recruitment/applications/${id}/hire`, data),
  getRecruitmentStats: () => apiClient.get('/admin/hr/recruitment/stats'),

  // Departments
  getDepartments: () => apiClient.get('/admin/hr/departments'),
  createDepartment: (data) => apiClient.post('/admin/hr/departments', data),
  updateDepartment: (id, data) => apiClient.put(`/admin/hr/departments/${id}`, data),
  deleteDepartment: (id) => apiClient.delete(`/admin/hr/departments/${id}`),

  // Leave Quotas (per-employee override)
  getLeaveQuotaAll: (year) => apiClient.get('/admin/hr/leave-quotas/all', { params: { year } }),
  getEmployeeLeaveQuota: (employeeId, year) =>
    apiClient.get('/admin/hr/leave-quotas', { params: { employee_id: employeeId, year } }),
  setLeaveQuota: (employeeId, year, quotas) =>
    apiClient.post('/admin/hr/leave-quotas', { employee_id: employeeId, year, quotas }),
  resetLeaveQuota: (employeeId, year) =>
    apiClient.delete('/admin/hr/leave-quotas', { data: { employee_id: employeeId, year } }),

  // Meetings (admin panel)
  getMeetings: (params = {}) => apiClient.get('/admin/hr/meetings', { params }),
  createMeeting: (data) => apiClient.post('/admin/hr/meetings', data),
  updateMeeting: (id, data) => apiClient.put(`/admin/hr/meetings/${id}`, data),
  deleteMeeting: (id) => apiClient.delete(`/admin/hr/meetings/${id}`),
};

export default hrAPI;
