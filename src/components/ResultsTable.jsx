import React from 'react';
import StatusBadge from './StatusBadge';
import { ExternalLink, Database, Search, Sparkles } from 'lucide-react';

export default function ResultsTable({
  results = [],
  onSelectEntity,
  isDemoMode = true
}) {
  if (results.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-850/80 border border-slate-800 p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Database className="w-7 h-7" />
        </div>
        <h4 className="text-base font-semibold text-white">No entity records found</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No matching records correspond to your search criteria or the resolution pipeline has not been executed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-850/90 border border-slate-800 shadow-card overflow-hidden">
      {/* Demo Notice Banner if Demo Mode */}
      {isDemoMode && (
        <div className="px-5 py-2.5 bg-brand-500/10 border-b border-brand-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-brand-300">
            <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="font-semibold">DEMO MODE ACTIVE:</span>
            <span className="text-slate-300">Showing sample entity pairs. Production ML backend will deliver live predictions upon integration.</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
            SYNTHETIC DATA
          </span>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <th scope="col" className="py-3.5 px-4 font-semibold">Source 1 ID</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Source 1 Business</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Matched Entity IDs</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Match Confidence</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {results.map((item) => {
              const hasMatch = item.status === 'Matched';
              const confidencePercent = item.matchConfidence !== null ? Math.round(item.matchConfidence * 100) : null;

              return (
                <tr
                  key={item.source1Id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Source 1 ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-brand-400 font-bold bg-brand-500/10 px-2 py-1 rounded border border-brand-500/20 text-[11px]">
                      {item.source1Id}
                    </span>
                  </td>

                  {/* Business Name */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-100 truncate">
                      {item.businessName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.address} • <span className="font-mono text-slate-300">{item.country}</span>
                    </div>
                  </td>

                  {/* Matched IDs */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {hasMatch && item.matchedEntityIds && item.matchedEntityIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.matchedEntityIds.map((id) => (
                          <span
                            key={id}
                            className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700/80"
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">—</span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {confidencePercent !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              confidencePercent >= 90
                                ? 'bg-emerald-400'
                                : confidencePercent >= 75
                                ? 'bg-brand-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${confidencePercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-200 text-xs">
                          {confidencePercent}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => onSelectEntity(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-600 border border-brand-500/20 hover:border-brand-500 transition-all shadow-sm"
                      aria-label={`View match details for ${item.source1Id}`}
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
