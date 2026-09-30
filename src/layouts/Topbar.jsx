import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, User, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useEntity } from '../context/EntityContext';

const PAGE_META = {
  '/': {
    title: 'Dashboard',
    description: 'Overview of business entity resolution pipeline & data telemetry'
  },
  '/upload': {
    title: 'Upload Business Data',
    description: 'Upload three TSV datasets required for multi-source entity resolution'
  },
  '/matching': {
    title: 'Entity Matching Pipeline',
    description: 'Configure matching parameters, similarity algorithms & run ML inference'
  },
  '/results': {
    title: 'Resolution Results',
    description: 'Explore resolved business clusters, confidence scores & export data'
  },
  '/about': {
    title: 'About EntitySync AI',
    description: 'System architecture, technology stack & business entity resolution methodology'
  }
};

export default function Topbar({ onToggleMobile }) {
  const location = useLocation();
  const { isDemoMode, toggleDemoMode } = useEntity();
  const meta = PAGE_META[location.pathname] || {
    title: 'EntitySync AI',
    description: 'Intelligent Business Entity Resolution System'
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle + Title & Description */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {meta.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block font-medium">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Right: AI Engine status indicator + Demo mode switch + User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Mode Toggle Chip */}
        <button
          type="button"
          onClick={toggleDemoMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isDemoMode
              ? 'bg-brand-500/10 text-brand-300 border-brand-500/30 hover:bg-brand-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title="Toggle between Demo Mode and Production API mode"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden md:inline">Mode:</span>
          <span>{isDemoMode ? 'Demo' : 'Production'}</span>
        </button>

        {/* AI status: ● AI Engine Ready */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-850 border border-emerald-500/20 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wide">
            AI Engine Ready
          </span>
        </div>

        {/* User / Profile Placeholder */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
            <User className="w-4 h-4 text-brand-400" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">
              Data Scientist
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              admin@entitysync.ai
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
