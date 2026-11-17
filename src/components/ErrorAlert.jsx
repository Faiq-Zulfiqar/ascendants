import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorAlert({
  title = 'An error occurred',
  message,
  onRetry,
  className = '',
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-rose-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          {title && <h4 className="font-semibold text-sm text-rose-900">{title}</h4>}
          <p className="text-sm text-rose-700 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-rose-300 hover:bg-rose-100/50 text-rose-800 text-xs font-semibold rounded-lg transition shadow-xs shrink-0 self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      )}
    </div>
  );
}
