import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'brand' }) {
  const accentGradients = {
    brand: 'from-brand-500/20 via-brand-500/5 to-transparent border-brand-500/20 text-brand-400',
    emerald: 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 via-purple-500/5 to-transparent border-purple-500/20 text-purple-400',
    blue: 'from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/20 text-blue-400',
    slate: 'from-slate-700/20 via-slate-700/5 to-transparent border-slate-700/40 text-slate-400',
  };

  const selectedAccent = accentGradients[accent] || accentGradients.brand;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-850/80 border border-slate-800 p-5 shadow-card hover:border-slate-700 transition-all duration-200 group">
      {/* Subtle background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${selectedAccent} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity pointer-events-none`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 group-hover:scale-105 group-hover:border-slate-600 transition-all shadow-sm">
            <Icon className="w-5 h-5 text-brand-400" />
          </div>
        )}
      </div>
    </div>
  );
}
