import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Spinner size="lg" className="text-indigo-600 mb-4" />
        <p className="text-sm font-medium text-slate-600">Verifying session with NovaWorks backend...</p>
      </div>
    );
  }

  // Not logged in -> redirect to /login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, enforce role membership
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/forbidden" state={{ attemptedPath: location.pathname }} replace />;
    }
  }

  return children ? children : <Outlet />;
}
