import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate } from '../utils/date';
import {
  CheckSquare,
  Clock,
  Calendar,
  Building2,
  UserCheck,
  FolderKanban,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function MyTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyTasks();
      setTasks(res.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  // Group tasks by project
  const groupedProjects = useMemo(() => {
    const groups = {};
    tasks.forEach((task) => {
      const pId = task.projectId || 'unassigned';
      if (!groups[pId]) {
        groups[pId] = {
          projectId: pId,
          projectName: task.projectName || 'Project Deliverable',
          projectClient: task.projectClient || 'NovaWorks Client',
          projectManagerName: task.projectManagerName || 'Assigned Manager',
          projectDeadline: task.projectDeadline || null,
          tasks: [],
        };
      }
      groups[pId].tasks.push(task);
    });
    return Object.values(groups);
  }, [tasks]);

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
              Agent Workspace
            </span>
            <span className="text-xs text-slate-400">• {currentUser?.specialization}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
            Welcome, {currentUser?.name}. Below are the engineering work items and sprint commitments assigned to you across projects.
          </p>
        </div>

        {/* Workload metric summary */}
        {!loading && !error && tasks.length > 0 && (
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0">
            <div>
              <div className="text-2xl font-bold text-slate-900">{tasks.length}</div>
              <div className="text-xs text-slate-500 font-medium">Assigned Tasks</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-2xl font-bold text-indigo-600">{totalEstimatedHours}h</div>
              <div className="text-xs text-slate-500 font-medium">Est. Workload</div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          title="Could not load tasks"
          message={error}
          onRetry={fetchMyTasks}
        />
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <EmptyState
          icon="tasks"
          title="No tasks assigned to you"
          description="You currently have no open tasks assigned to your engineering profile. When project managers ingest meeting notes or assign sprint work, your tasks will appear here."
        />
      )}

      {/* Grouped by Project */}
      {!loading && !error && groupedProjects.length > 0 && (
        <div className="space-y-8">
          {groupedProjects.map((group) => {
            const groupTotalHours = group.tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

            return (
              <div
                key={group.projectId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Project Header Group Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {group.projectClient}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        PM: {group.projectManagerName}
                      </span>
                      {group.projectDeadline && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Target: {formatDate(group.projectDeadline)}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {group.projectName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'} ({groupTotalHours} hrs)
                    </span>
                    <Link
                      to={`/projects/${group.projectId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition bg-indigo-50/60 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-100"
                    >
                      <span>Project Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Tasks List inside this Project */}
                <div className="divide-y divide-slate-100 p-4 sm:p-6 space-y-4 sm:space-y-0">
                  {group.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/50 sm:p-3 rounded-xl transition"
                    >
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {task.title}
                          </h4>
                        </div>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-6">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Task metadata (deadline + hours) */}
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-6 sm:pl-0 text-xs">
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: <strong>{formatDate(task.deadline)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-indigo-700 bg-indigo-50/80 px-2.5 py-1.5 rounded-lg border border-indigo-100 font-mono font-medium">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{task.estimatedHours} hrs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
