import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE + '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Convert a backend-relative storage path like "/storage/services/foo.jpg"
 * to a fully-qualified URL using the backend origin.
 * URLs that are already absolute (http/https) are returned unchanged.
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return API_BASE + path;
  return path;
}

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData, let axios handle it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 Unauthorized (not network errors or other failures)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  stats: () => api.get('/admin/dashboard/stats'),
  charts: () => api.get('/admin/dashboard/charts'),
  activity: () => api.get('/admin/dashboard/activity'),
  notifications: () => api.get('/admin/dashboard/notifications'),
};

// ==================== USERS ====================
export const usersAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  list: (params) => api.get('/admin/users', { params }),
  get: (id) => api.get(`/admin/users/${id}`),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
  syncRoles: (id, roles) => api.post(`/admin/users/${id}/roles`, { roles }),
};

// ==================== RBAC ====================
export const rolesAPI = {
  list: () => api.get('/admin/roles'),
  get: (id) => api.get(`/admin/roles/${id}`),
  create: (data) => api.post('/admin/roles', data),
  update: (id, data) => api.put(`/admin/roles/${id}`, data),
  delete: (id) => api.delete(`/admin/roles/${id}`),
  permissions: () => api.get('/admin/roles/permissions/all'),
};

export const permissionsAPI = {
  list: () => api.get('/admin/permissions'),
  get: (id) => api.get(`/admin/permissions/${id}`),
  create: (data) => api.post('/admin/permissions', data),
  update: (id, data) => api.put(`/admin/permissions/${id}`, data),
  delete: (id) => api.delete(`/admin/permissions/${id}`),
  modules: () => api.get('/admin/permissions/modules/all'),
};

// ==================== SERVICES ====================
export const servicesAPI = {
  list: (params) => api.get('/admin/services', { params }),
  get: (id) => api.get(`/admin/services/${id}`),
  create: (data) => {
    if (data instanceof FormData) return api.post('/admin/services', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return api.post('/admin/services', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) { data.append('_method', 'PUT'); return api.post(`/admin/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
    return api.post(`/admin/services/${id}`, { ...data, _method: 'PUT' });
  },
  delete: (id) => api.delete(`/admin/services/${id}`),
  categories: () => api.get('/admin/service-categories'),
};

// ==================== AI SERVICES ====================
export const aiServicesAPI = {
  list: (params) => api.get('/admin/ai-services', { params }),
  get: (id) => api.get(`/admin/ai-services/${id}`),
  create: (data) => api.post('/admin/ai-services', data),
  update: (id, data) => api.put(`/admin/ai-services/${id}`, data),
  delete: (id) => api.delete(`/admin/ai-services/${id}`),
};

// ==================== BLOGS ====================
export const blogsAPI = {
  list: (params) => api.get('/admin/blogs', { params }),
  get: (id) => api.get(`/admin/blogs/${id}`),
  create: (data) => api.post('/admin/blogs', data),
  update: (id, data) => api.put(`/admin/blogs/${id}`, data),
  delete: (id) => api.delete(`/admin/blogs/${id}`),
};

// ==================== FAQS ====================
export const faqsAPI = {
  list: (params) => api.get('/admin/faqs', { params }),
  get: (id) => api.get(`/admin/faqs/${id}`),
  create: (data) => api.post('/admin/faqs', data),
  update: (id, data) => api.put(`/admin/faqs/${id}`, data),
  delete: (id) => api.delete(`/admin/faqs/${id}`),
};

// ==================== TEAM ====================
export const teamAPI = {
  list: (params) => api.get('/admin/team', { params }),
  get: (id) => api.get(`/admin/team/${id}`),
  create: (data) => api.post('/admin/team', data),
  update: (id, data) => api.put(`/admin/team/${id}`, data),
  delete: (id) => api.delete(`/admin/team/${id}`),
};

// ==================== CAREERS ====================
export const careersAPI = {
  list: (params) => api.get('/admin/careers', { params }),
  get: (id) => api.get(`/admin/careers/${id}`),
  create: (data) => api.post('/admin/careers', data),
  update: (id, data) => api.put(`/admin/careers/${id}`, data),
  delete: (id) => api.delete(`/admin/careers/${id}`),
};

// ==================== JOB APPLICATIONS ====================
export const applicationsAPI = {
  list: (params) => api.get('/admin/applications', { params }),
  get: (id) => api.get(`/admin/applications/${id}`),
  update: (id, data) => api.put(`/admin/applications/${id}`, data),
  updateStatus: (id, status) => api.put(`/admin/applications/${id}`, { status }),
  delete: (id) => api.delete(`/admin/applications/${id}`),
};

// ==================== LEADS ====================
export const leadsAPI = {
  list: (params) => api.get('/admin/leads', { params }),
  get: (id) => api.get(`/admin/leads/${id}`),
  create: (data) => api.post('/admin/leads', data),
  update: (id, data) => api.put(`/admin/leads/${id}`, data),
  delete: (id) => api.delete(`/admin/leads/${id}`),
};

// ==================== APPOINTMENTS ====================
export const appointmentsAPI = {
  list: (params) => api.get('/admin/appointments', { params }),
  get: (id) => api.get(`/admin/appointments/${id}`),
  create: (data) => api.post('/admin/appointments', data),
  update: (id, data) => api.put(`/admin/appointments/${id}`, data),
  delete: (id) => api.delete(`/admin/appointments/${id}`),
};

// ==================== CMS PAGES ====================
export const pagesAPI = {
  list: (params) => api.get('/admin/pages', { params }),
  get: (id) => api.get(`/admin/pages/${id}`),
  create: (data) => api.post('/admin/pages', data),
  update: (id, data) => api.put(`/admin/pages/${id}`, data),
  delete: (id) => api.delete(`/admin/pages/${id}`),
};

// ==================== SETTINGS ====================
export const settingsAPI = {
  list: () => api.get('/admin/settings'),
  get: () => api.get('/admin/settings'),
  update: (data) => api.post('/admin/settings', data),
  updateBulk: (data) => api.post('/admin/settings/bulk', data),
};

// ==================== PUBLIC APIs ====================
export const publicAPI = {
  home: () => api.get('/public/home'),
  about: () => api.get('/public/about'),
  services: () => api.get('/public/services'),
  serviceDetail: (slug) => api.get(`/public/services/${slug}`),
  aiServices: () => api.get('/public/ai-services'),
  blogs: (params) => api.get('/public/blogs', { params }),
  blogDetail: (slug) => api.get(`/public/blogs/${slug}`),
  faqs: () => api.get('/public/faqs'),
  team: () => api.get('/public/team'),
  careers: () => api.get('/public/careers'),
  careerDetail: (slug) => api.get(`/public/careers/${slug}`),
  contact: (data) => api.post('/public/contact', data),
  apply: (data) => api.post('/public/apply', data),
  appointment: (data) => api.post('/public/appointment', data),
  page: (slug) => api.get(`/public/pages/${slug}`),
  settings: () => api.get('/public/settings'),
  search: (query) => api.get('/public/search', { params: { q: query } }),
  clientLogos: () => api.get('/public/client-logos'),
};

// ==================== CLIENT LOGOS (ADMIN) ====================
export const clientLogosAPI = {
  list: (params) => api.get('/admin/client-logos', { params }),
  get: (id) => api.get(`/admin/client-logos/${id}`),
  create: (data) => api.post('/admin/client-logos', data),
  update: (id, data) => {
    const formData = data instanceof FormData ? data : (() => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      fd.append('_method', 'PUT');
      return fd;
    })();
    return api.post(`/admin/client-logos/${id}`, formData);
  },
  delete: (id) => api.delete(`/admin/client-logos/${id}`),
  reorder: (items) => api.post('/admin/client-logos-reorder', { items }),
};

// ==================== CHAT (PUBLIC) ====================
export const chatAPI = {
  startSession:   (data)   => api.post('/public/chat/session', data),
  sendMessage:    (data)   => api.post('/public/chat/message', data),
  requestHuman:   (data)   => api.post('/public/chat/human-request', data),
  getMessages:    (token)  => api.get(`/public/chat/messages/${token}`),
};

// ==================== CHAT (ADMIN) ====================
export const adminChatAPI = {
  getSessions:   (params)       => api.get('/admin/chat/sessions', { params }),
  getStats:      ()              => api.get('/admin/chat/sessions/stats'),
  getSession:    (id)            => api.get(`/admin/chat/sessions/${id}`),
  reply:         (id, data)      => api.post(`/admin/chat/sessions/${id}/reply`, data),
  updateStatus:  (id, data)      => api.patch(`/admin/chat/sessions/${id}/status`, data),
  deleteSession: (id)            => api.delete(`/admin/chat/sessions/${id}`),
};

export default api;
