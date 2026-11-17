import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import TranscriptCreate from './pages/TranscriptCreate';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import MyTasks from './pages/MyTasks';
import TeamDirectory from './pages/TeamDirectory';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

// App Layout with Sticky Navbar and Max-width Container
function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-4 text-center text-xs text-slate-400">
        NovaWorks Technologies (Pvt) Ltd • Lahore, Pakistan • Project Manager CRM
      </footer>
    </div>
  );
}

// Root index redirector
function RootRedirect() {
  const { currentUser, loading, getPostLoginRoute } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Navigate to={getPostLoginRoute(currentUser.role)} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authenticated Layout */}
          <Route element={<AppLayout />}>
            {/* ADMIN ONLY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/transcript" element={<TranscriptCreate />} />
            </Route>

            {/* ADMIN & MANAGER ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
              <Route path="/projects" element={<ProjectsList />} />
            </Route>

            {/* ADMIN, MANAGER & AGENT ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGENT']} />}>
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/team" element={<TeamDirectory />} />
            </Route>

            {/* AGENT ONLY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
              <Route path="/my-tasks" element={<MyTasks />} />
            </Route>

            {/* Access Denied and 404 */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
