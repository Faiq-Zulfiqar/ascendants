import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import TaskTable from '../components/TaskTable';
import { SkeletonDetail } from '../components/Skeleton';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate } from '../utils/date';
import {
  ArrowLeft,
  Building2,
  Calendar,
  UserCheck,
  FolderKanban,
  ShieldAlert,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, isAdmin, isManager, isAgent } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // 403 | 404 | 500
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage('');
      const res = await api.getProjectById(id);
      setProject(res.project);
    } catch (err) {
      if (err.status === 403) {
        setErrorStatus(403);
        setErrorMessage(err.message || 'Access Denied: You do not have permission to view this project.');
      } else if (err.status === 404) {
        setErrorStatus(404);
        setErrorMessage('The requested project could not be found or may have been deleted.');
      } else {
        setErrorStatus(500);
        setErrorMessage(err.message || 'Failed to load project details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetail();
    }
  }, [id]);

  // Handle 403 Access Denied View
  if (errorStatus === 403) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied (403)</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {errorMessage || 'You do not have permission to view this project. Access is restricted to assigned managers or assigned agents.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Go Back
          </button>
          <Link
            to={isAgent ? '/my-tasks' : '/projects'}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
          >
            {isAgent ? 'Go to My Tasks' : 'Return to Projects'}
          </Link>
        </div>
      </div>
    );
  }

  // Handle 404 Not Found View
  if (errorStatus === 404) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found (404)</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The project identifier "<span className="font-mono text-slate-800">{id}</span>" does not exist in the NovaWorks database.
        </p>
        <div className="mt-6">
          <Link
            to={isAgent ? '/my-tasks' : '/projects'}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAgent ? 'Back to My Tasks' : 'Back to Projects'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back button and navigation */}
      <div>
        <Link
          to={isAgent ? '/my-tasks' : '/projects'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isAgent ? 'Back to My Tasks' : 'Back to Projects'}</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && <SkeletonDetail />}

      {/* Generic Error */}
      {errorStatus && errorStatus !== 403 && errorStatus !== 404 && (
        <ErrorAlert
          title="Could not load project"
          message={errorMessage}
          onRetry={fetchProjectDetail}
        />
      )}

      {/* Main Project View */}
      {!loading && project && (
        <div className="space-y-6">
          {/* Project Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{project.client}</span>
                  </span>
                  {isAgent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
                      <Info className="w-3.5 h-3.5" />
                      Showing your assigned tasks
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {project.name}
                </h1>
              </div>

              {isAdmin && (
                <div className="shrink-0">
                  <Link
                    to="/admin/transcript"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Import More Tasks</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-sm text-slate-600 leading-relaxed max-w-4xl pt-2 border-t border-slate-100">
                {project.description}
              </p>
            )}

            {/* Project Metadata Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Project Manager
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {project.managerName || 'Assigned'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Project Deadline
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {formatDate(project.deadline)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Task Count
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {project.tasks?.length || 0} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section Header & Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isAgent ? 'Your Assigned Tasks' : 'Work Breakdown Tasks'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAgent
                    ? 'Sprint tasks assigned to your profile in this project'
                    : 'Sprint deliverables extracted and monitored for this client project'}
                </p>
              </div>
            </div>

            {/* Task Table (auto turns to stacked cards on mobile) */}
            <TaskTable
              tasks={project.tasks || []}
              emptyMessage={
                isAgent
                  ? 'You do not have any tasks assigned to you on this project.'
                  : 'No tasks have been extracted or assigned for this project yet.'
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
