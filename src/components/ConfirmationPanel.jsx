import React from 'react';
import { CheckCircle2, ArrowRight, FolderKanban, CheckSquare, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConfirmationPanel({
  title = 'Projects Created Successfully',
  summary = 'The meeting transcript was processed and structured into actionable projects and tasks.',
  projects = [],
  taskCount = 0,
  onReset,
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-2">
            AI Extraction Complete
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{summary}</p>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 my-6 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{projects.length}</div>
            <div className="text-xs text-slate-500 font-medium">Projects Created</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{taskCount}</div>
            <div className="text-xs text-slate-500 font-medium">Tasks Assigned</div>
          </div>
        </div>
      </div>

      {/* Summary List */}
      <div className="space-y-3 mb-8">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Created Projects & Leads
        </h4>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {projects.map((p, i) => (
            <div key={p.id || i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
              <div className="min-w-0">
                <h5 className="font-semibold text-slate-900 text-sm">{p.name}</h5>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="text-slate-700 font-medium">{p.client}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-indigo-700">
                    <UserCheck className="w-3.5 h-3.5" />
                    Manager: {p.managerName || 'Assigned'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  {p.tasks?.length || 0} tasks
                </span>
                {p.id && (
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          >
            Process Another Transcript
          </button>
        )}
        <Link
          to="/projects"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-xs transition"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
