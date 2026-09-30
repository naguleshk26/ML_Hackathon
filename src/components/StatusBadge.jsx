import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const isMatch = status === 'Matched';
  const isNoMatch = status === 'No Match' || status === 'Unmatched';
  const isPending = status === 'Pending' || status === 'Processing';
  const isReady = status === 'Ready';

  let config = {
    bg: 'bg-slate-800/80 text-slate-300 border-slate-700',
    icon: null,
    text: status || 'Unknown'
  };

  if (isMatch) {
    config = {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-950/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      text: 'Matched'
    };
  } else if (isNoMatch) {
    config = {
      bg: 'bg-slate-800/90 text-slate-400 border-slate-700/60',
      icon: <XCircle className="w-3.5 h-3.5" />,
      text: 'No Match'
    };
  } else if (isPending) {
    config = {
      bg: 'bg-brand-500/10 text-brand-300 border-brand-500/20 animate-pulse',
      icon: <Clock className="w-3.5 h-3.5" />,
      text: status
    };
  } else if (isReady) {
    config = {
      bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      text: 'Ready'
    };
  }

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5 gap-1 font-medium'
    : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border transition-all ${config.bg} ${sizeClasses}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
}
