import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { Sparkles, FolderKanban, Users, CheckSquare } from 'lucide-react';

export default function AdminHome() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProjects();
      setProjects(res.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalTasks = projects.reduce((acc, p) => acc + (p.taskCount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Executive Dashboard
            </span>
            <span className="text-xs text-slate-400">• Lahore HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {currentUser?.name || 'Administrator'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
            Monitor client deliverables, review AI transcript ingestions, and coordinate cross-functional engineering pods across NovaWorks.
          </p>
        </div>

        {/* Big Primary "Create from Transcript" button */}
        <div className="shrink-0">
          <Link
            to="/admin/transcript"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 group"
          >
            <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>Create from Transcript</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{projects.length}</div>
              <div className="text-xs text-slate-500 font-medium">Active Projects</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{totalTasks}</div>
              <div className="text-xs text-slate-500 font-medium">Allocated Tasks</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">10 Specialists</div>
              <div className="text-xs text-slate-500 font-medium">Lahore Engineering Team</div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All Client Projects</h2>
            <p className="text-xs text-slate-500">Live projects active across all managers and engineering pods</p>
          </div>
          {projects.length > 0 && (
            <Link
              to="/projects"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Browse detailed list →
            </Link>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            title="Failed to load projects"
            message={error}
            onRetry={fetchProjects}
          />
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <EmptyState
            icon="sparkles"
            title="No projects yet – create them from a meeting transcript"
            description="Paste an executive client meeting transcript or sprint debrief, and our AI pipeline will extract structured projects, manager assignments, and tasks."
            actionLabel="Create from Transcript"
            actionTo="/admin/transcript"
          />
        )}

        {/* Project Cards Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
