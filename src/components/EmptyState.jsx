import React from 'react';
import { FolderKanban, CheckSquare, Users, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = 'folder',
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  actionTo,
  onAction,
}) {
  const icons = {
    folder: FolderKanban,
    tasks: CheckSquare,
    users: Users,
    search: Search,
    sparkles: Sparkles,
  };

  const IconComponent = icons[icon] || FolderKanban;

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-xs">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">{description}</p>
      
      {(actionLabel && (actionTo || onAction)) && (
        <div className="mt-6">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs transition focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Sparkles className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs transition focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
