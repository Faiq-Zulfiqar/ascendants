import React from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/date';

export default function TaskCard({ task, showProject = false }) {
  if (!task) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      {showProject && task.projectName && (
        <div className="pb-2 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-700 truncate">{task.projectName}</span>
          {task.projectManagerName && (
            <span className="text-slate-500 text-[11px]">PM: {task.projectManagerName}</span>
          )}
        </div>
      )}

      <div>
        <h4 className="font-semibold text-slate-900 text-sm">{task.title}</h4>
        {task.description && (
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{task.description}</p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{task.assignedAgentName || 'Assigned'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{formatDate(task.deadline)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.estimatedHours} hrs estimated</span>
        </span>
      </div>
    </div>
  );
}
