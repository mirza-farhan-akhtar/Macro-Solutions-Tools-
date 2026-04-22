import apiClient from './api';

const departmentAPI = {
  // Get all departments
  getDepartments: (params = {}) => apiClient.get('/admin/hr/departments', { params }),

  // Get single department
  getDepartment: (id) => apiClient.get(`/admin/hr/departments/${id}`),

  // Create department
  createDepartment: (data) => apiClient.post('/admin/hr/departments', data),

  // Update department
  updateDepartment: (id, data) => apiClient.put(`/admin/hr/departments/${id}`, data),

  // Delete department
  deleteDepartment: (id) => apiClient.delete(`/admin/hr/departments/${id}`),

  // Assign users to department
  assignUsers: (id, userIds) => apiClient.post(`/admin/hr/departments/${id}/assign-users`, { user_ids: userIds }),

  // Remove user from department
  removeUser: (id, userId) => apiClient.post(`/admin/hr/departments/${id}/remove-user`, { user_id: userId }),

  // Get department employees
  getDepartmentEmployees: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/employees`, { params }),

  // Get department projects
  getDepartmentProjects: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/projects`, { params }),

  // Get department tasks
  getDepartmentTasks: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/tasks`, { params }),

  // Get department meetings
  getDepartmentMeetings: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/meetings`, { params }),

  // Get department analytics
  getDepartmentAnalytics: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/analytics`, { params }),

  // Get department timeline
  getDepartmentTimeline: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/timeline`, { params }),

  // Get department budget
  getDepartmentBudget: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/budget`, { params }),

  // Get incoming project requests
  getDepartmentProjectRequests: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/project-requests`, { params }),

  // Get sent project requests
  getDepartmentProjectRequestsSent: (id, params = {}) => apiClient.get(`/admin/hr/departments/${id}/project-requests-sent`, { params }),

  // Create a project in department
  createDepartmentProject: (id, data) => apiClient.post(`/admin/hr/departments/${id}/projects`, data),

  // Approve project request
  approveProjectRequest: (departmentId, requestId, data) => apiClient.post(`/admin/hr/departments/${departmentId}/project-requests/${requestId}/approve`, data),

  // Reject project request
  rejectProjectRequest: (departmentId, requestId, data) => apiClient.post(`/admin/hr/departments/${departmentId}/project-requests/${requestId}/reject`, data),

  // Send project request to another department
  sendProjectRequest: (departmentId, data) => apiClient.post(`/admin/hr/departments/${departmentId}/send-project-request`, data),

  // Create a task for a department project
  createTask: (departmentId, data) => apiClient.post(`/admin/hr/departments/${departmentId}/tasks`, data),
};

export default departmentAPI;
