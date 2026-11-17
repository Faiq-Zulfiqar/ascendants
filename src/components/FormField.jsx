import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormField({
  label,
  id,
  error,
  hint,
  required = false,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            {label} {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          {hint && <span className="text-xs text-slate-400">{hint}</span>}
        </div>
      )}
      <div>{children}</div>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1 animate-fade-in" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
