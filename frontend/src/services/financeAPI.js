import API from './api';

/**
 * Finance API Service
 * Handles all API calls for the Finance module
 */

export const financeAPI = {
  // ==================== DASHBOARD ====================
  getDashboard: (period = 'month') =>
    API.get('/admin/finance/dashboard', { params: { period } }),

  // ==================== REPORTS ====================
  getProfitLoss: (period = 'month') =>
    API.get('/admin/finance/reports/profit-loss', { params: { period } }),

  getRevenue: (period = 'month') =>
    API.get('/admin/finance/reports/revenue', { params: { period } }),

  getExpense: (period = 'month') =>
    API.get('/admin/finance/reports/expense', { params: { period } }),

  exportReport: (type = 'profit-loss', period = 'month') =>
    API.get('/admin/finance/reports/export', {
      params: { type, period },
      responseType: 'blob',
    }),

  // ==================== INVOICES ====================
  getInvoices: (page = 1, filters = {}) =>
    API.get('/admin/finance/invoices', { params: { page, ...filters } }),

  getInvoice: (id) =>
    API.get(`/admin/finance/invoices/${id}`),

  createInvoice: (data) =>
    API.post('/admin/finance/invoices', data),

  updateInvoice: (id, data) =>
    API.put(`/admin/finance/invoices/${id}`, data),

  deleteInvoice: (id) =>
    API.delete(`/admin/finance/invoices/${id}`),

  addInvoiceItems: (id, items) =>
    API.post(`/admin/finance/invoices/${id}/items`, { items }),

  sendInvoice: (id) =>
    API.post(`/admin/finance/invoices/${id}/send`),

  updateInvoiceStatus: (id, status) =>
    API.patch(`/admin/finance/invoices/${id}/status`, { status }),

  recordPayment: (id, payment) =>
    API.post(`/admin/finance/invoices/${id}/pay`, payment),

  // ==================== EXPENSES ====================
  getExpenses: (page = 1, filters = {}) =>
    API.get('/admin/finance/expenses', { params: { page, ...filters } }),

  getExpense: (id) =>
    API.get(`/admin/finance/expenses/${id}`),

  getExpenseReport: (period = 'month') =>
    API.get('/admin/finance/reports/expense', { params: { period } }),

  createExpense: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return API.post('/admin/finance/expenses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateExpense: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return API.post(`/admin/finance/expenses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteExpense: (id) =>
    API.delete(`/admin/finance/expenses/${id}`),

  approveExpense: (id) =>
    API.patch(`/admin/finance/expenses/${id}/approve`),

  rejectExpense: (id, data) =>
    API.patch(`/admin/finance/expenses/${id}/reject`, data),

  getExpenseCategories: () =>
    API.get('/admin/finance/expense-categories'),

  createExpenseCategory: (data) =>
    API.post('/admin/finance/expense-categories', data),

  updateExpenseCategory: (id, data) =>
    API.put(`/admin/finance/expense-categories/${id}`, data),

  deleteExpenseCategory: (id) =>
    API.delete(`/admin/finance/expense-categories/${id}`),

  getExpenseSummaryByCategory: (month = null) => {
    const params = month ? { month } : {};
    return API.get('/admin/finance/expenses/summary/by-category', { params });
  },

  // ==================== INCOME ====================
  getIncomes: (page = 1, filters = {}) =>
    API.get('/admin/finance/incomes', { params: { page, ...filters } }),

  getIncome: (id) =>
    API.get(`/admin/finance/incomes/${id}`),

  createIncome: (data) =>
    API.post('/admin/finance/incomes', data),

  updateIncome: (id, data) =>
    API.put(`/admin/finance/incomes/${id}`, data),

  deleteIncome: (id) =>
    API.delete(`/admin/finance/incomes/${id}`),

  getIncomeSummary: (month = null, year = null) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return API.get('/admin/finance/incomes/summary', { params });
  },

  getIncomeMonthlyTrends: (months = 12) =>
    API.get('/admin/finance/incomes/trends/monthly', { params: { months } }),
};

export default financeAPI;
