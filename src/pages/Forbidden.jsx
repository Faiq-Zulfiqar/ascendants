import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import { ShieldAlert, ArrowLeft, LogOut, Home } from 'lucide-react';

export default function Forbidden() {
  const { currentUser, role, logout, getPostLoginRoute } = useAuth();
  const location = useLocation();
  const attemptedPath = location.state?.attemptedPath || '';

  const homeRoute = getPostLoginRoute(role);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
          Error 403: Forbidden
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Access Restricted
        </h1>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          You do not have the required role privileges to access this screen
          {attemptedPath && <code className="block mt-1 font-mono text-xs text-rose-700 bg-rose-50/60 p-1 rounded">{attemptedPath}</code>}.
        </p>

        {currentUser && (
          <div className="my-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="text-left">
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Current Session</span>
              <strong className="text-slate-800 text-xs">{currentUser.name}</strong>
            </div>
            <RoleBadge role={currentUser.role} size="sm" />
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <Link
            to={homeRoute}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Your Workspace</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign in as different user</span>
          </button>
        </div>
      </div>
    </div>
  );
}
