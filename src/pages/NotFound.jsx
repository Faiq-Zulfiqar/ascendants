import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  const { currentUser, role, getPostLoginRoute } = useAuth();
  const homeRoute = currentUser ? getPostLoginRoute(role) : '/login';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
          Error 404
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          The requested URL does not match any route in NovaWorks Project Manager CRM.
        </p>

        <div className="mt-6">
          <Link
            to={homeRoute}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>{currentUser ? 'Return to Workspace' : 'Go to Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
