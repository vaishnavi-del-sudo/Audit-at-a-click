[200~import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const recordsAPI = {
  getRecords: (associationId: number) =>
    api.get(`/records?associationId=${associationId}`),
  createRecord: (data: any) => api.post('/records', data),
  updateRecord: (recordId: number, data: any) =>
    api.put(`/records/${recordId}`, data),
  deleteRecord: (recordId: number) => api.delete(`/records/${recordId}`),
};

export const auditAPI = {
  getAnomalies: (associationId: number, status?: string) =>
    api.get(`/anomalies?associationId=${associationId}${status ? `&status=${status}` : ''}`),
  runAudit: (associationId: number) => api.post('/audits/run', { associationId }),
  getAuditHistory: (associationId: number) =>
    api.get(`/audits/history?associationId=${associationId}`),
  updateAnomalyStatus: (anomalyId: number, status: string) =>
    api.put(`/anomalies/${anomalyId}`, { status }),
};

export default api;
