import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts = { all: 0, matched: 0, unmatched: 0 }
}) {
  const filterOptions = [
    { id: 'all', label: 'All Entities', count: counts.all },
    { id: 'matched', label: 'Matched', count: counts.matched },
    { id: 'unmatched', label: 'Unmatched', count: counts.unmatched },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-850/80 border border-slate-800 shadow-card">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entity ID or business name..."
          className="w-full pl-10 pr-9 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
          aria-label="Search entities"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800 self-start sm:self-auto overflow-x-auto">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange(opt.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? 'bg-brand-700/60 text-brand-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
