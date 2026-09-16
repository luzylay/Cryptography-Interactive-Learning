import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'sky' | 'rose' | 'purple' | 'cyan' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  sky: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'amber',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const colorStyle = variantStyles[variant] || variantStyles.amber;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono rounded-md border font-semibold ${sizeStyles} ${colorStyle} ${className}`}
    >
      {children}
    </span>
  );
};
