import React from 'react';

export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="h-5 bg-slate-200 rounded w-2/3" />
        <div className="h-6 bg-slate-100 rounded-full w-16" />
      </div>
      <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="h-3.5 bg-slate-100 rounded w-4/5" />
        <div className="h-3.5 bg-slate-100 rounded w-3/5" />
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-2/5" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4 items-center">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-2/5" />
            <div className="h-4 bg-slate-100 rounded w-1/6" />
            <div className="h-4 bg-slate-100 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
      <SkeletonTable rows={4} />
    </div>
  );
}
