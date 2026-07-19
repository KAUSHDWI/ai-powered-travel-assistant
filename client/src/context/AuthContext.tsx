import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import * as authService from '../services/auth.service.js';
import type { AdminUser } from '../types/index.js';

export interface AuthContextProps {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Recover active session from stored token payload at mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.admin);
        setLoading(false);
        return true;
      } else {
        setError(response.error?.message || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || err.message || 'An error occurred during login'
      );
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
