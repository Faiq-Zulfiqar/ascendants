import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../api';
import Spinner from '../components/Spinner';
import RoleBadge from '../components/RoleBadge';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function Login() {
  const { login, currentUser, isAuthenticated, getPostLoginRoute } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoAccountsOpen, setDemoAccountsOpen] = useState(true);

  // If already authenticated, redirect to role home
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dest = location.state?.from?.pathname || getPostLoginRoute(currentUser.role);
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentUser, getPostLoginRoute, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo123!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            NovaWorks <span className="text-indigo-600 font-bold">CRM</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium tracking-wide uppercase">
            NovaWorks Technologies • Lahore, Pakistan
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your projects and tasks
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-sm">
          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Work Email
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@novaworks.example"
                  disabled={loading}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Password
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-xs transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>

          {/* Collapsible Demo Accounts Box */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDemoAccountsOpen(!demoAccountsOpen)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              aria-expanded={demoAccountsOpen}
            >
              <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <KeyRound className="w-3.5 h-3.5" />
                Demo accounts (Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-900">Demo123!</code>)
              </span>
              {demoAccountsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {demoAccountsOpen && (
              <div className="mt-3 space-y-2.5 text-xs animate-fade-in bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                
                {/* Admin */}
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Administrator
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin@novaworks.example')}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left bg-white hover:bg-indigo-50 border border-slate-200/80 transition"
                  >
                    <div className="truncate">
                      <span className="font-semibold text-slate-800">admin@novaworks.example</span>
                      <span className="text-[11px] text-slate-500 block">Zeeshan Arshad</span>
                    </div>
                    <RoleBadge role="ADMIN" size="sm" />
                  </button>
                </div>

                {/* Managers */}
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Project Managers
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {DEMO_USERS.filter((u) => u.role === 'MANAGER').map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleFillDemo(u.email)}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg text-left bg-white hover:bg-emerald-50 border border-slate-200/80 transition text-xs"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-slate-800">{u.email}</span>
                          <span className="text-[11px] text-slate-500 block">{u.name}</span>
                        </div>
                        <RoleBadge role="MANAGER" size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Agents */}
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Agents (Engineers)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {DEMO_USERS.filter((u) => u.role === 'AGENT').map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleFillDemo(u.email)}
                        className="p-1.5 rounded-lg text-left bg-white hover:bg-sky-50 border border-slate-200/80 transition text-[11px] truncate"
                        title={`${u.name} (${u.email})`}
                      >
                        <span className="font-semibold text-slate-800 truncate block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{u.email.split('@')[0]}@</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-400 italic text-center">
                  Click any account above to auto-fill credentials.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lahore Pakistan footer notice */}
        <p className="mt-6 text-center text-xs text-slate-400">
          NovaWorks Technologies (Pvt) Ltd • Gulberg III, Lahore, Pakistan
        </p>
      </div>
    </div>
  );
}
