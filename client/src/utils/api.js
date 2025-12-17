import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// リクエストインターセプター（トークンを自動付与）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

// Shops API
export const shopsAPI = {
  getAll: (params) => api.get('/shops', { params }),
  getById: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  delete: (id) => api.delete(`/shops/${id}`),
  click: (id) => api.post(`/shops/${id}/click`),
  resetClicks: (id) => api.post(`/shops/${id}/reset-clicks`),
};

// Prefectures API
export const prefecturesAPI = {
  getAll: () => api.get('/prefectures'),
  getById: (id) => api.get(`/prefectures/${id}`),
  create: (data) => api.post('/prefectures', data),
  update: (id, data) => api.put(`/prefectures/${id}`, data),
  delete: (id) => api.delete(`/prefectures/${id}`),
};

// SubAreas API
export const subAreasAPI = {
  getAll: (params) => api.get('/subareas', { params }),
  getById: (id) => api.get(`/subareas/${id}`),
  create: (data) => api.post('/subareas', data),
  update: (id, data) => api.put(`/subareas/${id}`, data),
  delete: (id) => api.delete(`/subareas/${id}`),
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getClicks: (params) => api.get('/stats/clicks', { params }),
};
