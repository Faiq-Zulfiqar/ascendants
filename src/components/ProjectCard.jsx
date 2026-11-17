import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UserCheck, CheckSquare, ArrowRight, Building2 } from 'lucide-react';
import { formatDate } from '../utils/date';

export default function ProjectCard({ project }) {
  if (!project) return null;

  const taskCount = project.taskCount !== undefined ? project.taskCount : (project.tasks?.length || 0);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Client & Status header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-lg">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{project.client}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Project Name */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-2">
          {project.name}
        </h3>

        {/* Description snippet if available */}
        {project.description && (
          <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
        {/* Manager & Deadline metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Manager</span>
              <span className="font-medium text-slate-700 truncate block">{project.managerName || 'Assigned'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Deadline</span>
              <span className="font-medium text-slate-700 truncate block">{formatDate(project.deadline)}</span>
            </div>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/projects/${project.id}`}
          className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100 transition group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent"
        >
          <span>View details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
