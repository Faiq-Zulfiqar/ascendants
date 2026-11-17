import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  FolderKanban,
  CheckSquare,
  Users,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, role, isAdmin, isManager, isAgent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  // Determine navigation links based on role
  // Admin: Dashboard, Projects, Create from Transcript, Team
  // Manager: My Projects, Team
  // Agent: My Tasks, Team
  const navItems = [];

  if (isAdmin) {
    navItems.push(
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/projects', label: 'Projects', icon: FolderKanban },
      { to: '/admin/transcript', label: 'Create from Transcript', icon: Sparkles, highlight: true },
      { to: '/team', label: 'Team', icon: Users }
    );
  } else if (isManager) {
    navItems.push(
      { to: '/projects', label: 'My Projects', icon: FolderKanban },
      { to: '/team', label: 'Team', icon: Users }
    );
  } else if (isAgent) {
    navItems.push(
      { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
      { to: '/team', label: 'Team', icon: Users }
    );
  }

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              to={isAdmin ? '/admin' : isManager ? '/projects' : '/my-tasks'}
              className="flex items-center gap-3 group focus-visible:rounded-lg"
              aria-label="NovaWorks CRM Home"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                  NovaWorks <span className="text-indigo-600 font-semibold text-xs sm:text-sm">CRM</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none">
                  Lahore, PK
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin' || item.to === '/projects'}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        item.highlight && !isActive
                          ? 'text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/70 border border-indigo-100'
                          : isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right: User Badge & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-[170px]">
                  {currentUser.email}
                </div>
              </div>
              <RoleBadge role={currentUser.role} size="md" />
            </div>

            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition"
              title="Sign out of NovaWorks CRM"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <RoleBadge role={currentUser.role} size="sm" showIcon={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-4 shadow-lg animate-fade-in">
          {/* User profile row in mobile drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-800 text-sm">{currentUser.name}</div>
              <div className="text-xs text-slate-400">{currentUser.email}</div>
            </div>
            <RoleBadge role={currentUser.role} size="sm" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/projects'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                closeMobile();
                logout();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout ({currentUser.name})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
