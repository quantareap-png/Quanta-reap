/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, getStoredToken, setStoredToken } from '../api/quanta-api';

export interface User {
  id: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  phone?: string;
  email?: string;
  timezone: string;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
  role: 'platform_admin' | 'business_owner' | 'business_manager' | 'business_staff';
  membershipId: string;
}

interface AuthContextType {
  user: User | null;
  currentBusiness: Business | null;
  businesses: Business[];
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; businessName: string; businessType: string }) => Promise<void>;
  logout: () => Promise<void>;
  switchBusiness: (businessId: string) => Promise<void>;
  refreshMe: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refreshMe = useCallback(async () => {
    const currentStoredToken = getStoredToken();
    if (!currentStoredToken) {
      setUser(null);
      setCurrentBusiness(null);
      setBusinesses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getMe();
      if (res.success) {
        setUser(res.user);
        setBusinesses(res.businesses || []);
        setCurrentBusiness(res.currentBusiness || null);
        setError(null);
      }
    } catch (_err: unknown) {
      // Stale or expired token; cleanly reset session state without warning
      setStoredToken(null);
      setToken(null);
      setUser(null);
      setCurrentBusiness(null);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setBusinesses(res.businesses || []);
      setCurrentBusiness(res.currentBusiness || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessType: string;
  }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.register(data);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setBusinesses([res.business]);
      setCurrentBusiness(res.business);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      setStoredToken(null);
      setToken(null);
      setUser(null);
      setCurrentBusiness(null);
      setBusinesses([]);
    }
  };

  const switchBusiness = async (businessId: string) => {
    setLoading(true);
    try {
      const res = await api.switchBusiness(businessId);
      if (res.success) {
        setCurrentBusiness(res.currentBusiness);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to switch business';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentBusiness,
        businesses,
        token,
        loading,
        error,
        login,
        register,
        logout,
        switchBusiness,
        refreshMe,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
