import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle, Building2, MapPin, Globe, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MatchDetailsModal({ entity, isOpen, onClose, isDemoMode = true }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entity) return null;

  const nameSimPercent = entity.nameSimilarity ? Math.round(entity.nameSimilarity * 100) : null;
  const addrSimPercent = entity.addressSimilarity ? Math.round(entity.addressSimilarity * 100) : null;
  const overallConfidence = entity.matchConfidence ? Math.round(entity.matchConfidence * 100) : null;
  const isCountryMatched = entity.countryMatch === 1.0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="modal-title" className="text-base font-bold text-white">
                  Entity Match Analysis
                </h3>
                <StatusBadge status={entity.status} size="xs" />
                {isDemoMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    DEMO SIMULATION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed comparison and similarity feature vectors between reference and candidate sources
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Similarity & Confidence Metric Bar */}
          <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Similarity Feature Vectors (ML Model Input)
              </h4>
              <span className="text-[11px] text-slate-500">
                Calculated via string metric ensemble
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Overall Confidence */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Overall Confidence</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {overallConfidence !== null ? `${overallConfidence}%` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${overallConfidence || 0}%` }}
                  />
                </div>
              </div>

              {/* Name Similarity */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Name Similarity</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-brand-400">
                    {nameSimPercent !== null ? `${nameSimPercent}%` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-brand-400 rounded-full"
                    style={{ width: `${nameSimPercent || 0}%` }}
                  />
                </div>
              </div>

              {/* Address Similarity */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Address Similarity</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-purple-400">
                    {addrSimPercent !== null ? `${addrSimPercent}%` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${addrSimPercent || 0}%` }}
                  />
                </div>
              </div>

              {/* Country Match */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Country Match</span>
                <div className="mt-1 flex items-center gap-2">
                  {entity.countryMatch !== null ? (
                    isCountryMatched ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Exact Match (1.0)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Mismatch (0.0)
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">N/A</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isCountryMatched ? 'bg-emerald-400' : 'bg-slate-700'}`}
                    style={{ width: isCountryMatched ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reference Record (Source 1) */}
          <div className="p-5 rounded-xl bg-brand-950/20 border border-brand-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-brand-500/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  SOURCE 1 (REFERENCE)
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {entity.source1Id}
                </span>
              </div>
              <span className="text-[11px] text-brand-300 font-medium">
                Primary Master Entity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-400" /> Business Name
                </span>
                <p className="text-sm font-semibold text-white mt-1">
                  {entity.businessName}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" /> Address
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {entity.address}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-400" /> Country
                </span>
                <p className="text-xs font-mono font-bold text-white mt-1">
                  {entity.country}
                </p>
              </div>
            </div>
          </div>

          {/* Matched Records Comparison */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Matched Secondary Sources
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source 2 Record */}
              <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      SOURCE 2
                    </span>
                    <span className="font-mono text-xs text-slate-200">
                      {entity.matchedDetails?.source2?.id || 'No Candidate'}
                    </span>
                  </div>
                  {entity.matchedDetails?.source2 ? (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {Math.round(entity.matchedDetails.source2.similarity * 100)}% Sim
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Unmatched</span>
                  )}
                </div>

                {entity.matchedDetails?.source2 ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Business Name:</span>
                      <p className="font-semibold text-slate-100 mt-0.5">
                        {entity.matchedDetails.source2.businessName}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Address:</span>
                      <p className="text-slate-300 mt-0.5">
                        {entity.matchedDetails.source2.address}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Country:</span>
                      <p className="font-mono text-slate-200 mt-0.5">
                        {entity.matchedDetails.source2.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No matching record identified in Source 2
                  </div>
                )}
              </div>

              {/* Source 3 Record */}
              <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      SOURCE 3
                    </span>
                    <span className="font-mono text-xs text-slate-200">
                      {entity.matchedDetails?.source3?.id || 'No Candidate'}
                    </span>
                  </div>
                  {entity.matchedDetails?.source3 ? (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {Math.round(entity.matchedDetails.source3.similarity * 100)}% Sim
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Unmatched</span>
                  )}
                </div>

                {entity.matchedDetails?.source3 ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Business Name:</span>
                      <p className="font-semibold text-slate-100 mt-0.5">
                        {entity.matchedDetails.source3.businessName}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Address:</span>
                      <p className="text-slate-300 mt-0.5">
                        {entity.matchedDetails.source3.address}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">Country:</span>
                      <p className="font-mono text-slate-200 mt-0.5">
                        {entity.matchedDetails.source3.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No matching record identified in Source 3
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs text-slate-400">
          <span>
            Model endpoint: <code className="text-slate-300 font-mono">/api/match</code> (Supervised resolution layer)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors border border-slate-700"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
