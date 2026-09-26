import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderGlow?: 'none' | 'amber' | 'emerald' | 'sky' | 'rose' | 'purple' | 'cyan';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  borderGlow = 'none',
}) => {
  const glowStyles = {
    none: 'border-slate-800',
    amber: 'border-amber-500/30 shadow-amber-500/5',
    emerald: 'border-emerald-500/30 shadow-emerald-500/5',
    sky: 'border-sky-500/30 shadow-sky-500/5',
    rose: 'border-rose-500/30 shadow-rose-500/5',
    purple: 'border-purple-500/30 shadow-purple-500/5',
    cyan: 'border-cyan-500/30 shadow-cyan-500/5',
  }[borderGlow];

  const hoverStyle = hoverEffect
    ? 'hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200'
    : '';

  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-md rounded-2xl border p-4 sm:p-5 shadow-lg ${glowStyles} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};
