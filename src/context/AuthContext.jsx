import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setApiErrorHandlers } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to determine destination route after login
  const getPostLoginRoute = useCallback((role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'MANAGER':
        return '/projects';
      case 'AGENT':
        return '/my-tasks';
      default:
        return '/login';
    }
  }, []);

  // Fetch current user from backend on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getMe();
      setCurrentUser(res.user);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Configure global API interceptors
    setApiErrorHandlers({
      onUnauthorized: () => {
        setCurrentUser(null);
        navigate('/login', { replace: true });
      },
      onForbidden: () => {
        navigate('/forbidden', { replace: true });
      },
    });

    checkAuth();
  }, [checkAuth, navigate]);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      const res = await api.login(email, password);
      // The user and role always come directly from the backend response
      setCurrentUser(res.user);
      const destination = getPostLoginRoute(res.user.role);
      navigate(destination, { replace: true });
      return res.user;
    },
    [getPostLoginRoute, navigate]
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setCurrentUser(null);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const value = {
    currentUser,
    loading,
    role: currentUser?.role || null,
    isAdmin: currentUser?.role === 'ADMIN',
    isManager: currentUser?.role === 'MANAGER',
    isAgent: currentUser?.role === 'AGENT',
    isAuthenticated: !!currentUser,
    login,
    logout,
    checkAuth,
    getPostLoginRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
