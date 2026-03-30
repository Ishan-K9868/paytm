import axios from 'axios';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'Something went wrong';
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    toast.error(message);
    return Promise.reject(error);
  }
);
