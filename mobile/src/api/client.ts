/**
 * GBICH'APP — Axios Client with JWT & Error Interceptors.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

// In browser / PWA context, relative URL "/api/v1" automatically uses the reverse proxy!
const getDefaultBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return '/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

export const apiClient = axios.create({
  baseURL: getDefaultBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Injects Bearer JWT Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401 Unauthorized & Network Offline
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      // Future refresh token flow hook
      console.warn('[API] Session expirée (401). Réinitialisation de la session.');
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
