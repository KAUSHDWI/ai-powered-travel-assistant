import api from './api.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import type { ApiResponse, AdminUser } from '../types/index.js';

export interface LoginResponseData {
  admin: AdminUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', {
    email,
    password,
  });

  if (response.data.success && response.data.data) {
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  return response.data;
}

export async function logout(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function getStoredUser(): AdminUser | null {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}
