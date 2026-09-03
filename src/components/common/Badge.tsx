import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'amber' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'gray', size = 'sm' }: BadgeProps) {
  const colorMap = {
    red: 'bg-rose-600/90 text-white border-rose-500/30',
    amber: 'bg-amber-500/90 text-black font-semibold border-amber-400/30',
    blue: 'bg-sky-600/90 text-white border-sky-500/30',
    purple: 'bg-purple-600/90 text-white border-purple-500/30',
    gray: 'bg-zinc-800/90 text-zinc-300 border-zinc-700/50',
  };

  const sizeMap = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border backdrop-blur-sm shadow-sm ${colorMap[variant]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
}
