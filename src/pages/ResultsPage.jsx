import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  BarChart3,
  Layers,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
  FileSpreadsheet,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import { useToast } from '../context/ToastContext';
import { downloadMatchingResults, downloadCandidatePairs } from '../services/api';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import ResultsTable from '../components/ResultsTable';
import MatchDetailsModal from '../components/MatchDetailsModal';

export default function ResultsPage() {
  const { results, stats, hasRun, isDemoMode, loadSampleDatasets } = useEntity();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isDownloading, setIsDownloading] = useState({ results: false, candidates: false });

  // Filtered and searched records
  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      // Filter by status
      if (activeFilter === 'matched' && item.status !== 'Matched') return false;
      if (activeFilter === 'unmatched' && item.status !== 'No Match' && item.status !== 'Unmatched') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.source1Id.toLowerCase().includes(q);
        const matchesName = item.businessName.toLowerCase().includes(q);
        const matchesMatchedIds = item.matchedEntityIds?.some((id) => id.toLowerCase().includes(q));
        return matchesId || matchesName || matchesMatchedIds;
      }
      return true;
    });
  }, [results, activeFilter, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const all = results.length;
    const matched = results.filter((r) => r.status === 'Matched').length;
    const unmatched = results.filter((r) => r.status === 'No Match' || r.status === 'Unmatched').length;
    return { all, matched, unmatched };
  }, [results]);

  // Handlers for TSV downloads
  const handleDownloadResults = async () => {
    try {
      setIsDownloading((prev) => ({ ...prev, results: true }));
      showToast('Preparing matching_results.tsv for download...', 'info');
      await downloadMatchingResults(isDemoMode);
      showToast('Downloaded matching_results.tsv successfully', 'success');
    } catch (err) {
      showToast(`Download error: ${err.message}`, 'error');
    } finally {
      setIsDownloading((prev) => ({ ...prev, results: false }));
    }
  };

  const handleDownloadCandidates = async () => {
    try {
      setIsDownloading((prev) => ({ ...prev, candidates: true }));
      showToast('Preparing candidate_pairs.tsv for download...', 'info');
      await downloadCandidatePairs(isDemoMode);
      showToast('Downloaded candidate_pairs.tsv successfully', 'success');
    } catch (err) {
      showToast(`Download error: ${err.message}`, 'error');
    } finally {
      setIsDownloading((prev) => ({ ...prev, candidates: false }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
            <span>Resolution Analytics & Exports</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resolution Results
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review resolved multi-source entity linkages, inspect similarity vectors, and export TSV files.
          </p>
        </div>

        {hasRun && isDemoMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Sample Demo Data Active</span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Source 1 Entities"
          value={hasRun ? stats.source1Count : 0}
          subtitle="Reference universe"
          icon={Layers}
          accent="brand"
        />
        <StatCard
          title="Matched Entities"
          value={hasRun ? stats.matchedCount : 0}
          subtitle={hasRun ? "Linked to S2/S3" : "Awaiting run"}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Unmatched Entities"
          value={hasRun ? stats.unmatchedCount : 0}
          subtitle={hasRun ? "No candidate meets threshold" : "Awaiting run"}
          icon={XCircle}
          accent="slate"
        />
        <StatCard
          title="Match Rate"
          value={hasRun ? stats.matchRate : "0.0%"}
          subtitle={hasRun ? "Multi-source coverage" : "Awaiting run"}
          icon={Percent}
          accent="purple"
        />
      </div>

      {/* Main Results Table Section or Empty State */}
      {hasRun && results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">
              Resolved Entity Registry
            </h3>
            <span className="text-xs text-slate-400">
              Showing {filteredResults.length} of {results.length} entities
            </span>
          </div>

          {/* Search & Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />

          {/* Results Table */}
          <ResultsTable
            results={filteredResults}
            onSelectEntity={(entity) => setSelectedEntity(entity)}
            isDemoMode={isDemoMode}
          />
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-12 text-center shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-brand-400 mb-4 shadow-inner">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            No matching results available
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Run entity resolution to see results here. You can upload custom TSV datasets or utilize the demo pipeline to simulate resolution outputs.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/matching"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Go to Entity Matching</span>
            </Link>

            {isDemoMode && (
              <button
                type="button"
                onClick={loadSampleDatasets}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Load Sample Data</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800 mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-400" />
              Export Pipeline Deliverables
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Export standard tab-separated (.tsv) data artifacts formatted for downstream business intelligence and audit logs.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700 self-start sm:self-auto">
            TSV Format
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Download matching_results.tsv */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  matching_results.tsv
                </span>
                <span className="text-[11px] text-slate-500">Output Table</span>
              </div>
              <h4 className="text-sm font-bold text-white">Download Matching Results</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Contains resolved entity clusters mapping Source 1 reference IDs to verified Source 2 and Source 3 counterparts along with confidence scores.
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleDownloadResults}
                disabled={isDownloading.results}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-brand-400" />
                <span>{isDownloading.results ? 'Exporting...' : 'Download matching_results.tsv'}</span>
              </button>
            </div>
          </div>

          {/* Download candidate_pairs.tsv */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  candidate_pairs.tsv
                </span>
                <span className="text-[11px] text-slate-500">Candidate Matrix</span>
              </div>
              <h4 className="text-sm font-bold text-white">Download Candidate Set</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-probability candidate pairings identified during the blocking and phonetic indexing stage before machine learning classification.
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleDownloadCandidates}
                disabled={isDownloading.candidates}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>{isDownloading.candidates ? 'Exporting...' : 'Download candidate_pairs.tsv'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        entity={selectedEntity}
        isOpen={Boolean(selectedEntity)}
        onClose={() => setSelectedEntity(null)}
        isDemoMode={isDemoMode}
      />
    </div>
  );
}
