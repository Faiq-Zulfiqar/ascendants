import React from 'react';
import { ShieldCheck, Briefcase, Code } from 'lucide-react';

export default function RoleBadge({ role, size = 'md', showIcon = true }) {
  if (!role) return null;

  const roleConfigs = {
    ADMIN: {
      label: 'Admin',
      bgColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: ShieldCheck,
    },
    MANAGER: {
      label: 'Manager',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: Briefcase,
    },
    AGENT: {
      label: 'Agent',
      bgColor: 'bg-sky-50 border-sky-200 text-sky-700',
      icon: Code,
    },
  };

  const config = roleConfigs[role.toUpperCase()] || {
    label: role,
    bgColor: 'bg-slate-100 border-slate-200 text-slate-700',
    icon: Code,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs select-none ${config.bgColor} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
}
