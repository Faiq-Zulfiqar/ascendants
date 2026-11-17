import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import RoleBadge from '../components/RoleBadge';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { Search, Users, Mail, Sparkles, Code, Briefcase } from 'lucide-react';

export default function TeamDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'ADMIN' | 'MANAGER' | 'AGENT'

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search and role
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (roleFilter !== 'ALL') {
      list = list.filter((u) => u.role === roleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.specialization?.toLowerCase().includes(q) ||
          (u.skills && u.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [users, roleFilter, searchQuery]);

  // Generate avatar initials
  const getInitials = (name) => {
    if (!name) return 'NW';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Color generator for avatar initials
  const getAvatarBg = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-600 text-white';
      case 'MANAGER':
        return 'bg-emerald-600 text-white';
      case 'AGENT':
        return 'bg-sky-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Engineering Team Directory</span>
          <Users className="w-6 h-6 text-indigo-600" />
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          NovaWorks Technologies Lahore engineering specialists, delivery managers, and leadership.
        </p>
      </div>

      {/* Search and Role Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, specialization, or skill (e.g. 'React', 'Go', 'Scrum')..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50/60 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Role Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'ADMIN', label: 'Admin' },
            { id: 'MANAGER', label: 'Managers' },
            { id: 'AGENT', label: 'Agents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                roleFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          title="Could not load team directory"
          message={error}
          onRetry={fetchUsers}
        />
      )}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && (
        <EmptyState
          icon="users"
          title="No team members found"
          description={`No team members matched the current filters: "${searchQuery || roleFilter}".`}
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setRoleFilter('ALL');
          }}
        />
      )}

      {/* Team Cards Grid */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name, Role Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm tracking-wider shadow-xs shrink-0 ${getAvatarBg(
                        user.role
                      )}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <RoleBadge role={user.role} size="sm" />
                </div>

                {/* Specialization */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Specialization
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    {user.specialization}
                  </p>
                </div>

                {/* Skills as Chips */}
                {user.skills && user.skills.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Core Skills & Tech
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Location info */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>NovaWorks Lahore</span>
                <span className="font-mono text-[10px] uppercase">{user.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
