import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { Search, ArrowUpDown, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export default function ProjectsList() {
  const { role, isAdmin, isManager } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('earliest'); // 'earliest' | 'latest' | 'name'

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProjects();
      setProjects(res.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.client?.toLowerCase().includes(q) ||
          p.managerName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'earliest') {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortOrder === 'latest') {
      result.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (sortOrder === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [projects, searchQuery, sortOrder]);

  const pageTitle = isAdmin ? 'All Projects' : 'My Projects';
  const pageSubtitle = isAdmin
    ? 'Comprehensive directory of active client deliveries across all engineering verticals.'
    : 'Projects under your direct management and sprint leadership.';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {pageSubtitle}
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/admin/transcript"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Create from Transcript</span>
          </Link>
        )}
      </div>

      {/* Search & Sort Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, client, or manager..."
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

        {/* Sort by Deadline Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <label htmlFor="sortOrder" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
          >
            <option value="earliest">Deadline (Earliest first)</option>
            <option value="latest">Deadline (Furthest out)</option>
            <option value="name">Project Name (A - Z)</option>
          </select>
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
          title="Could not load projects"
          message={error}
          onRetry={fetchProjects}
        />
      )}

      {/* Empty State: No projects at all */}
      {!loading && !error && projects.length === 0 && (
        <EmptyState
          icon="folder"
          title={isAdmin ? 'No projects yet – create them from a meeting transcript' : 'No projects assigned'}
          description={
            isAdmin
              ? 'Get started by pasting an executive meeting transcript to auto-generate projects and tasks.'
              : 'You do not currently manage any active projects. Check with the administrator if this is unexpected.'
          }
          actionLabel={isAdmin ? 'Create from Transcript' : undefined}
          actionTo={isAdmin ? '/admin/transcript' : undefined}
        />
      )}

      {/* Empty State: Search filter no results */}
      {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && (
        <EmptyState
          icon="search"
          title="No matching projects found"
          description={`No projects matched your search for "${searchQuery}". Try a different keyword or clear filters.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      )}

      {/* Project Cards Grid */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
