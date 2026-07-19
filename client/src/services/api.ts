import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants.js';

const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard against infinite loops or non-auth errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          // Request a new token pair using the refresh endpoint
          const response = await axios.post(
            `${import.meta.env['VITE_API_URL'] || '/api/v1'}/auth/refresh`,
            { refreshToken }
          );

          if (response.data?.success) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
              response.data.data.tokens;

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newAccessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token invalid/expired: log out user
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = '/login?expired=true';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
