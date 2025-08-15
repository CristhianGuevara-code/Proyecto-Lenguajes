import axios from 'axios';
import { useAuthStore } from '../../features/stores/authStore';
import { refreshTokenAction } from '../actions/security/auth/refresh-token.action';

// '/api' para que pase por el proxy de Vite
export const eduRuralApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// token en cada request
eduRuralApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Refresh token ---
let isRefreshing = false;

type FiledQueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: FiledQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = []; // limpiar cola
}

eduRuralApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return eduRuralApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const token = localStorage.getItem('token');
        if (!refreshToken || !token) throw new Error('No refresh token');

        const { status, data } = await refreshTokenAction({ token, refreshToken });

        if (status && data) {
          useAuthStore.getState().setTokens(data.token, data.refreshToken);
          processQueue(null, data.token);

          originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
          return eduRuralApi(originalRequest);
        } else {
          processQueue(error, null);
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
