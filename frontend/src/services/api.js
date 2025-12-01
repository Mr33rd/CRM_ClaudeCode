import axios from 'axios';

// API Base URL - connects to your Express backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============== AUTHENTICATION API ==============
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (data) =>
    api.post('/auth/register', data),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),
};

// ============== STUDENT API ==============
export const studentAPI = {
  getAll: (params) =>
    api.get('/students', { params }),

  getById: (id) =>
    api.get(`/students/${id}`),

  getProgress: (id) =>
    api.get(`/students/${id}/progress`),

  getAttendance: (id) =>
    api.get(`/students/${id}/attendance`),

  update: (id, data) =>
    api.put(`/students/${id}`, data),
};

// ============== BELT PROGRESSION API ==============
export const beltAPI = {
  getProgressions: (studentId) =>
    api.get(`/belts/student/${studentId}`),

  awardBelt: (studentId, data) =>
    api.post(`/belts/award/${studentId}`, data),

  getCurriculum: (beltLevel) =>
    api.get(`/belts/curriculum/${beltLevel}`),
};

// ============== ASSESSMENT API ==============
export const assessmentAPI = {
  create: (data) =>
    api.post('/assessments', data),

  getByStudent: (studentId, params) =>
    api.get(`/assessments/student/${studentId}`, { params }),

  update: (id, data) =>
    api.put(`/assessments/${id}`, data),

  getStats: (studentId) =>
    api.get(`/assessments/student/${studentId}/stats`),
};

// ============== PAYMENT API ==============
export const paymentAPI = {
  getStudentPayments: (studentId) =>
    api.get(`/payments/student/${studentId}`),

  recordPayment: (id, data) =>
    api.put(`/payments/${id}/record`, data),

  updateStatus: (id, data) =>
    api.put(`/payments/${id}/status`, data),

  getAll: (params) =>
    api.get('/payments', { params }),

  getOverdue: () =>
    api.get('/payments/overdue'),
};

// ============== SESSION API ==============
export const sessionAPI = {
  create: (data) =>
    api.post('/sessions', data),

  getAll: (params) =>
    api.get('/sessions', { params }),

  getUpcoming: (limit) =>
    api.get('/sessions/upcoming', { params: { limit } }),

  getById: (id) =>
    api.get(`/sessions/${id}`),

  update: (id, data) =>
    api.put(`/sessions/${id}`, data),

  delete: (id) =>
    api.delete(`/sessions/${id}`),
};

// ============== ATTENDANCE API ==============
export const attendanceAPI = {
  record: (data) =>
    api.post('/attendance', data),

  bulkRecord: (data) =>
    api.post('/attendance/bulk', data),

  update: (id, data) =>
    api.put(`/attendance/${id}`, data),

  getBySession: (sessionId) =>
    api.get(`/attendance/session/${sessionId}`),
};

// ============== GRADUATION API ==============
export const graduationAPI = {
  getStatus: (studentId) =>
    api.get(`/graduation/student/${studentId}`),

  selectFirearm: (studentId, data) =>
    api.post(`/graduation/student/${studentId}/select-firearm`, data),

  processGraduation: (studentId, data) =>
    api.post(`/graduation/student/${studentId}/process`, data),

  updateFirearmDelivery: (studentId, data) =>
    api.put(`/graduation/student/${studentId}/firearm-delivery`, data),

  getAllGraduates: () =>
    api.get('/graduation/graduates'),
};

// ============== DASHBOARD API ==============
export const dashboardAPI = {
  getAdmin: () =>
    api.get('/dashboard/admin'),

  getInstructor: () =>
    api.get('/dashboard/instructor'),

  getStudent: () =>
    api.get('/dashboard/student'),
};

export default api;
