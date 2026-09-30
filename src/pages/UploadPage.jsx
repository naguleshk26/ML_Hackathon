import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, CheckCircle2, AlertCircle, Sparkles, Database, FileSpreadsheet } from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import UploadCard from '../components/UploadCard';

export default function UploadPage() {
  const navigate = useNavigate();
  const { files, hasAllFiles, setSourceFile, removeSourceFile, loadSampleDatasets, isDemoMode } = useEntity();

  const loadedCount = [files.source1, files.source2, files.source3].filter(Boolean).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5 text-brand-400" />
            <span>Dataset Ingestion Stage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Upload Business Data
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload the three TSV datasets required for entity resolution.
          </p>
        </div>

        {/* Status pill & Quick demo load */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-700/80 text-xs font-medium text-slate-300">
            <span>Status:</span>
            <span className={`font-bold font-mono ${loadedCount === 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {loadedCount} / 3 Datasets Staged
            </span>
          </div>

          {isDemoMode && (
            <button
              type="button"
              onClick={loadSampleDatasets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 transition-all shadow-sm"
              title="Quickly fill cards with demo TSV datasets"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Load Demo Datasets</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Source 1 */}
        <UploadCard
          sourceKey="source1"
          title="Reference Business Records"
          subtitle="Source 1 (Golden Reference)"
          description="Primary ground truth business registry containing authoritative business IDs, legal entities, and registered physical addresses."
          fileInfo={files.source1}
          onFileSelect={setSourceFile}
          onFileRemove={removeSourceFile}
          required={true}
        />

        {/* Source 2 */}
        <UploadCard
          sourceKey="source2"
          title="Business Records – Source 2"
          subtitle="Secondary Partner Feed"
          description="Partner dataset with potential naming variances, missing suite/unit numbers, and localized company suffix abbreviations."
          fileInfo={files.source2}
          onFileSelect={setSourceFile}
          onFileRemove={removeSourceFile}
          required={true}
        />

        {/* Source 3 */}
        <UploadCard
          sourceKey="source3"
          title="Business Records – Source 3"
          subtitle="Tertiary Public Registry"
          description="Public web registry dump with high noise, abbreviated trade styles, country code variances, and unstructured address strings."
          fileInfo={files.source3}
          onFileSelect={setSourceFile}
          onFileRemove={removeSourceFile}
          required={true}
        />
      </div>

      {/* Info Card: Why TSV? */}
      <div className="rounded-2xl bg-slate-850/80 border border-slate-800 p-5 shadow-card flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Why TSV (Tab-Separated Values)?
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Tab-separated files preserve commas inside business addresses and ID lists. Standard CSV files frequently corrupt multi-part street lines such as <span className="font-mono text-slate-200">"Suite 400, Building B, 100 Main St"</span> unless heavily escaped. TSV ensures flawless tabular ingestion across all three sources.
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-card">
        <div className="flex items-center gap-3">
          {hasAllFiles ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>All 3 datasets validated and ready for matching pipeline</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Please upload all three .tsv datasets before continuing</span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!hasAllFiles}
          onClick={() => navigate('/matching')}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            hasAllFiles
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/25 cursor-pointer hover:-translate-y-0.5'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
          aria-label="Continue to Entity Matching"
        >
          <span>Continue to Entity Matching</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
