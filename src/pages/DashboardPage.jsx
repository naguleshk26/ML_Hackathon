import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  GitMerge,
  Cpu,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileQuestion,
  Activity,
  Play
} from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import StatCard from '../components/StatCard';
import WorkflowStep from '../components/WorkflowStep';

export default function DashboardPage() {
  const { stats, files, hasRun, isDemoMode, loadSampleDatasets } = useEntity();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-navy-900 border border-slate-800 p-8 sm:p-10 shadow-elevated">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Intelligent Entity Resolution Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Resolve Business Entities with AI
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Identify matching businesses across noisy and inconsistent data sources using intelligent entity resolution.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
            >
              <span>Start New Matching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5"
            >
              <span>View Results</span>
            </Link>

            {!files.source1 && isDemoMode && (
              <button
                type="button"
                onClick={loadSampleDatasets}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Demo Load</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            System Telemetry & Datasets
          </h3>
          <span className="text-xs text-slate-500">
            {hasRun ? 'Analysis Completed' : 'Awaiting dataset ingestion'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Source 1 Records"
            value={stats.source1Count}
            subtitle={files.source1 ? files.source1.name : "Reference catalog"}
            icon={Database}
            accent="brand"
          />
          <StatCard
            title="Source 2 Records"
            value={stats.source2Count}
            subtitle={files.source2 ? files.source2.name : "Secondary source"}
            icon={Layers}
            accent="blue"
          />
          <StatCard
            title="Source 3 Records"
            value={stats.source3Count}
            subtitle={files.source3 ? files.source3.name : "Tertiary source"}
            icon={Cpu}
            accent="purple"
          />
          <StatCard
            title="Matched Entities"
            value={stats.matchedCount}
            subtitle={hasRun ? `Match rate: ${stats.matchRate}` : "Run pipeline to resolve"}
            icon={GitMerge}
            accent="emerald"
          />
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Entity Resolution Pipeline Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end data processing workflow from raw TSV registries to resolved entity clusters
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-brand-300 border border-slate-700 self-start sm:self-auto">
            6-Stage Pipeline
          </span>
        </div>

        <WorkflowStep />
      </div>

      {/* Two Column Section: How It Works & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* How Entity Resolution Works (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                How Entity Resolution Works
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              In enterprise data ecosystems, independent departments, partner feeds, and public registries register the same commercial organization with variations in naming, corporate abbreviations, street addresses, and local formatting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
                  1. Preprocessing & Normalization
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strips legal entity noise (LLC, Inc, Corp, Pvt Ltd), standardizes street abbreviations (Rd → Road, St → Street), and cleans punctuation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
                  2. Blocking & Similarity
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reduces pairwise combinations via phonetic blocking keys and calculates multi-field lexical & semantic similarity vectors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
                  3. Machine Learning Inference
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Supervised classifier evaluates similarity features to predict cluster linkages with calibrated confidence scores.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Preserves raw data integrity without relying on external third-party lookup APIs.</span>
            <Link to="/about" className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1">
              Read Technical Spec →
            </Link>
          </div>
        </div>

        {/* Recent Activity (1 col) */}
        <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                Recent Activity
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Live Log</span>
            </div>

            {hasRun ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Entity Resolution Completed
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Matched {stats.matchedCount} entities with {stats.matchRate} resolution rate.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <Database className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Datasets Staged
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Source 1, 2, and 3 loaded and normalized.
                    </p>
                  </div>
                </div>

                <Link
                  to="/results"
                  className="w-full mt-2 py-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 text-xs font-semibold border border-brand-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Inspect Resolved Entities
                </Link>
              </div>
            ) : (
              /* Polished Empty State */
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-500 mb-3">
                  <FileQuestion className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-slate-300">
                  No matching runs recorded yet
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Upload your business datasets and initiate entity resolution to view matching activity.
                </p>
                <Link
                  to="/upload"
                  className="mt-4 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>ENGINE: V1.0-STAGED</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
