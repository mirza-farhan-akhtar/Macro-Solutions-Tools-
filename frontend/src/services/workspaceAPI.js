import apiClient from './api';

const workspaceAPI = {
  // Department Workspace endpoints - all require departmentSlug
  getDashboard: (departmentSlug) => apiClient.get(`/workspace/${departmentSlug}/dashboard`),
  
  getProjects: (departmentSlug, params = {}) => apiClient.get(`/workspace/${departmentSlug}/projects`, { params }),
  
  getTeamMembers: (departmentSlug, params = {}) => apiClient.get(`/workspace/${departmentSlug}/team-members`, { params }),
  
  getNotifications: (departmentSlug, params = {}) => apiClient.get(`/workspace/${departmentSlug}/notifications`, { params }),
};

export default workspaceAPI;
