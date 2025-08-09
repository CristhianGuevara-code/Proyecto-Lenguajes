import axios from 'axios';
import { useAuthStore } from '../../features/stores/authStore';
import { refreshTokenAction } from '../actions/security/auth/refresh-token.action';


// Instancia principal de axios para el api de personas
export const eduRuralApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

//interceptor para agregar el token en cada petición
eduRuralApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer  ${token}`
  }

  return config;
})

// Bandera para evitar multiples refresh simultáneos. 

let isRefreshing = false;

type FiledQueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: FiledQueueItem[] = []

// procesar la cola de peticiones pendientes de refresh

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  }
  )
}

// si la respuesta es 401 (token esta expirado), intentar refrescar el token de forma automática
// si el refresh del token es exitoso, reintentar las peticiones originales con el nuevo token
// si falla, realizar el logout y rechazar la petición

eduRuralApi.interceptors.response.use(response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status == 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer' + token;
            return eduRuralApi(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const token = localStorage.getItem('token');

        if (!refreshToken || !token) throw new Error('No refresh token');

        const { status, data } = await refreshTokenAction({ token, refreshToken });

        if (status && data) {
          // actualizar tokens en el store y localStorage

          useAuthStore.getState().setTokens(data.token, data.refreshToken);

          processQueue(null, data.token);
          originalRequest.headers['Authorization'] = 'Bearer' + data.token;
          return eduRuralApi(originalRequest)
        } else {
          processQueue(error, null)
          {
            useAuthStore.getState().logout();
            return Promise.reject(error);
          }
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
)