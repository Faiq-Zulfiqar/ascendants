import React from 'react';
import { Calendar, Clock, User, CheckSquare } from 'lucide-react';
import TaskCard from './TaskCard';
import { formatDate } from '../utils/date';

export default function TaskTable({ tasks = [], emptyMessage = 'No tasks assigned yet.' }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Mobile view: Stacked Cards (visible < md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {tasks.map((task, idx) => (
          <TaskCard key={task.id || idx} task={task} />
        ))}
      </div>

      {/* Desktop & Tablet view: Table (visible >= md) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5 w-1/4">Title</th>
                <th scope="col" className="px-5 py-3.5 w-2/5">Description</th>
                <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Assigned Agent</th>
                <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Deadline</th>
                <th scope="col" className="px-5 py-3.5 text-right whitespace-nowrap">Est. Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {tasks.map((task, idx) => (
                <tr key={task.id || idx} className="hover:bg-slate-50/75 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 align-top">
                    {task.title}
                  </td>
                  <td className="px-5 py-4 text-slate-600 align-top leading-relaxed text-xs">
                    {task.description || <span className="text-slate-400 italic">No description provided</span>}
                  </td>
                  <td className="px-5 py-4 align-top whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-md">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{task.assignedAgentName || 'Assigned'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top whitespace-nowrap text-xs text-slate-700">
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(task.deadline)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-right whitespace-nowrap font-mono text-xs font-medium text-slate-800">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.estimatedHours} hrs</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with number of tasks and total hours */}
        <div className="bg-slate-50/80 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>Total Tasks: <strong className="text-slate-900">{tasks.length}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Total Estimated Workload: <strong className="text-slate-900">{totalEstimatedHours} hours</strong></span>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>Total: <strong className="text-slate-900">{tasks.length} tasks</strong></span>
        <span>Est: <strong className="text-slate-900">{totalEstimatedHours} hrs</strong></span>
      </div>
    </div>
  );
}
