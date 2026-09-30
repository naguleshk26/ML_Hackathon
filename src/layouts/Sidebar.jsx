import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Cpu,
  BarChart3,
  Info,
  Layers,
  Sparkles,
  Server,
  X
} from 'lucide-react';
import { useEntity } from '../context/EntityContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Upload Data', path: '/upload', icon: UploadCloud },
  { name: 'Entity Matching', path: '/matching', icon: Cpu },
  { name: 'Results', path: '/results', icon: BarChart3 },
  { name: 'About', path: '/about', icon: Info },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { hasAllFiles, hasRun, isDemoMode } = useEntity();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d131f] border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">
                  EntitySync
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                Business Entity Resolution
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span className="flex-1">{item.name}</span>

                    {/* Small badges for status */}
                    {item.path === '/upload' && hasAllFiles && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                    {item.path === '/results' && hasRun && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Ready
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mx-4 mb-3 p-3 rounded-xl bg-slate-850/90 border border-brand-500/30">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Synthetic dataset & simulated ML inference for evaluation.
            </p>
          </div>
        )}

        {/* AI Matching Engine Status at Bottom */}
        <div className="p-4 border-t border-slate-800/90 bg-slate-900/60">
          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping opacity-75" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  AI Matching Engine
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  Status: Ready
                </div>
              </div>
            </div>
            <Server className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </aside>
    </>
  );
}
