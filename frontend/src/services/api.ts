import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'https://megasocials.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    if (status === 403) {
      toast.error('You do not have permission to perform this action');
    }
    if (status === 429) {
      toast.error('Too many requests. Please wait a moment.');
    }
    if (status === 500) {
      toast.error('Server error. Please try again later.');
    }
    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      toast.error('Request timed out. Please check your connection.');
    }
    return Promise.reject(err);
  }
);

export const uploadFile = (url: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
