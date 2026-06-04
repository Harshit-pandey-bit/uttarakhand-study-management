'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';
import { UserProfile, UserRole } from '@/types/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive the role from user_metadata
  const role: UserRole | null = user?.user_metadata?.role ?? null;

  // Check auth on mount by calling the backend /auth/profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.getProfile();
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const loginResponse = await apiClient.login({ email, password });

      if (loginResponse.error || !loginResponse.data) {
        console.error('Login error:', loginResponse.error);
        return false;
      }

      // Use user data directly from login response
      if (loginResponse.data.user) {
        setUser(loginResponse.data.user);
        return true;
      }

      // Fallback: try profile endpoint
      const profileResponse = await apiClient.getProfile();
      if (profileResponse.data?.user) {
        setUser(profileResponse.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.getProfile();
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
