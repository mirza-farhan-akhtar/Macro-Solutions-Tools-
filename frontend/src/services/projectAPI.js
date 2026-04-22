import apiClient from './api';

const projectAPI = {
  // Projects
  getProjects: (params = {}) => apiClient.get('/admin/projects', { params }),
  getProject: (id) => apiClient.get(`/admin/projects/${id}`),
  createProject: (data) => apiClient.post('/admin/projects', data),
  updateProject: (id, data) => apiClient.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/admin/projects/${id}`),
  
  // Project Members
  assignMember: (projectId, data) => apiClient.post(`/admin/projects/${projectId}/members`, data),
  removeMember: (projectId, memberId) => apiClient.delete(`/admin/projects/${projectId}/members/${memberId}`),
  
  // Project Data
  getDepartments: () => apiClient.get('/admin/projects/data/departments'),
  getUsers: () => apiClient.get('/admin/projects/data/users'),
  
  // Tasks
  getTasks: (params = {}) => apiClient.get('/admin/tasks', { params }),
  getProjectTasks: (projectId, params = {}) => apiClient.get('/admin/tasks', { params: { ...params, project_id: projectId } }),
  getTask: (id) => apiClient.get(`/admin/tasks/${id}`),
  createTask: (data) => apiClient.post('/admin/tasks', data),
  updateTask: (id, data) => apiClient.put(`/admin/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/admin/tasks/${id}`),
  completeTask: (id) => apiClient.patch(`/admin/tasks/${id}/complete`),
  
  // Collaboration Requests
  sendCollaborationRequest: (data) => apiClient.post('/admin/collaboration-requests', data),
  getCollaborationRequests: (params = {}) => apiClient.get('/admin/collaboration-requests', { params }),
  getPendingRequests: () => apiClient.get('/admin/collaboration-requests/pending'),
  getRequestStats: () => apiClient.get('/admin/collaboration-requests/stats'),
  getCollaborationRequest: (id) => apiClient.get(`/admin/collaboration-requests/${id}`),
  approveRequest: (id, data = {}) => apiClient.patch(`/admin/collaboration-requests/${id}/approve`, data),
  rejectRequest: (id, data) => apiClient.patch(`/admin/collaboration-requests/${id}/reject`, data),
  cancelRequest: (id) => apiClient.patch(`/admin/collaboration-requests/${id}/cancel`),
  
  // Dashboard Statistics
  getDashboardStats: () => apiClient.get('/admin/tasks/dashboard/stats'),
};

export default projectAPI;