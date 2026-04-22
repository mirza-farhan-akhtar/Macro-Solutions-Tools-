import apiClient from './api';

const crmAPI = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/crm/dashboard'),

  // Clients
  getClients: (params = {}) => apiClient.get('/admin/crm/clients', { params }),
  getClient: (id) => apiClient.get(`/admin/crm/clients/${id}`),
  createClient: (data) => apiClient.post('/admin/crm/clients', data),
  updateClient: (id, data) => apiClient.put(`/admin/crm/clients/${id}`, data),
  deleteClient: (id) => apiClient.delete(`/admin/crm/clients/${id}`),
  getClientContacts: (clientId) => apiClient.get(`/admin/crm/clients/${clientId}/contacts`),
  getClientDeals: (clientId) => apiClient.get(`/admin/crm/clients/${clientId}/deals`),
  getClientInvoices: (clientId) => apiClient.get(`/admin/crm/clients/${clientId}/invoices`),

  // Leads (CRM-enhanced)
  getCRMLeads: (params = {}) => apiClient.get('/admin/crm/leads', { params }),
  getCRMLead: (id) => apiClient.get(`/admin/crm/leads/${id}`),
  createLead: (data) => apiClient.post('/admin/crm/leads', data),
  updateLead: (id, data) => apiClient.put(`/admin/crm/leads/${id}`, data),
  deleteLead: (id) => apiClient.delete(`/admin/crm/leads/${id}`),
  convertLeadToClient: (id) => apiClient.put(`/admin/crm/leads/${id}/convert`),

  // Deals
  getDeals: (params = {}) => apiClient.get('/admin/crm/deals', { params }),
  getDealById: (id) => apiClient.get(`/admin/crm/deals/${id}`),
  createDeal: (data) => apiClient.post('/admin/crm/deals', data),
  updateDeal: (id, data) => apiClient.put(`/admin/crm/deals/${id}`, data),
  deleteDeal: (id) => apiClient.delete(`/admin/crm/deals/${id}`),
  getPipeline: () => apiClient.get('/admin/crm/deals/pipeline'),
  markDealWon: (id) => apiClient.put(`/admin/crm/deals/${id}/won`),
  markDealLost: (id, data) => apiClient.put(`/admin/crm/deals/${id}/lost`, data),

  // Proposals
  getProposals: (params = {}) => apiClient.get('/admin/crm/proposals', { params }),
  getProposal: (id) => apiClient.get(`/admin/crm/proposals/${id}`),
  createProposal: (data) => apiClient.post('/admin/crm/proposals', data),
  updateProposal: (id, data) => apiClient.put(`/admin/crm/proposals/${id}`, data),
  deleteProposal: (id) => apiClient.delete(`/admin/crm/proposals/${id}`),
  sendProposal: (id) => apiClient.put(`/admin/crm/proposals/${id}/send`),
  acceptProposal: (id) => apiClient.put(`/admin/crm/proposals/${id}/accept`),
  rejectProposal: (id) => apiClient.put(`/admin/crm/proposals/${id}/reject`),
  addProposalItem: (proposalId, data) => apiClient.post(`/admin/crm/proposals/${proposalId}/items`, data),

  // Users (for assignment dropdowns)
  getSalesUsers: () => apiClient.get('/admin/users/sales'),

  // Activities
  getActivities: (params = {}) => apiClient.get('/admin/crm/activities', { params }),
  getActivity: (id) => apiClient.get(`/admin/crm/activities/${id}`),
  createActivity: (data) => apiClient.post('/admin/crm/activities', data),
  updateActivity: (id, data) => apiClient.put(`/admin/crm/activities/${id}`, data),
  deleteActivity: (id) => apiClient.delete(`/admin/crm/activities/${id}`),
  completeActivity: (id) => apiClient.put(`/admin/crm/activities/${id}/complete`),
  getLeadActivities: (leadId) => apiClient.get(`/admin/crm/activities/lead/${leadId}`),
  getDealActivities: (dealId) => apiClient.get(`/admin/crm/activities/deal/${dealId}`),
  getClientActivities: (clientId) => apiClient.get(`/admin/crm/activities/client/${clientId}`),
  getOverdueActivities: () => apiClient.get('/admin/crm/activities/overdue'),
};

export default crmAPI;
