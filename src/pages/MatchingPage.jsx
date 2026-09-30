import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
  Sliders,
  Sparkles,
  FileText,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import ProgressIndicator from '../components/ProgressIndicator';

const MATCHING_PIPELINE_STAGES = [
  {
    step: 1,
    title: 'Data Preprocessing',
    desc: 'Normalizes character encodings, strips legal noise, and parses multi-part address tokens.',
    icon: Filter,
  },
  {
    step: 2,
    title: 'Candidate Generation',
    desc: 'Applies blocking keys (phonetic + postal) to generate high-probability entity candidate pairs.',
    icon: Layers,
  },
  {
    step: 3,
    title: 'Similarity Feature Extraction',
    desc: 'Calculates string distance vectors including Jaro-Winkler, Levenshtein, and n-gram overlap.',
    icon: Sliders,
  },
  {
    step: 4,
    title: 'ML Matching',
    desc: 'Evaluates feature vectors with supervised ensemble classifier to compute match probabilities.',
    icon: Cpu,
  },
  {
    step: 5,
    title: 'Result Generation',
    desc: 'Applies threshold gating and transitive graph resolution to cluster multi-source entities.',
    icon: CheckCircle2,
  },
];

export default function MatchingPage() {
  const navigate = useNavigate();
  const {
    files,
    hasAllFiles,
    config,
    updateConfig,
    isMatching,
    matchProgress,
    hasRun,
    triggerMatching,
    isDemoMode,
    loadSampleDatasets
  } = useEntity();

  const handleRun = () => {
    triggerMatching(() => {
      // Optional callback on completion
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-brand-400" />
            <span>Resolution Execution Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Entity Matching Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure matching parameters, similarity algorithms, and execute the resolution pipeline.
          </p>
        </div>

        {hasRun && (
          <button
            type="button"
            onClick={() => navigate('/results')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md self-start sm:self-auto"
          >
            <span>View Latest Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dataset Readiness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Source 1 */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              files.source1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Source 1</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                {files.source1 ? files.source1.name : 'Dataset missing'}
              </p>
            </div>
          </div>
          {files.source1 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">Missing</span>
          )}
        </div>

        {/* Source 2 */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              files.source2 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Source 2</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                {files.source2 ? files.source2.name : 'Dataset missing'}
              </p>
            </div>
          </div>
          {files.source2 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">Missing</span>
          )}
        </div>

        {/* Source 3 */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              files.source3 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Source 3</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                {files.source3 ? files.source3.name : 'Dataset missing'}
              </p>
            </div>
          </div>
          {files.source3 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">Missing</span>
          )}
        </div>
      </div>

      {/* Warning / Demo prompt if datasets missing */}
      {!hasAllFiles && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>One or more required TSV source datasets are missing. Upload files or load demo sample datasets to test the pipeline.</span>
          </div>
          {isDemoMode && (
            <button
              type="button"
              onClick={loadSampleDatasets}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold text-amber-100 transition-colors whitespace-nowrap self-start sm:self-auto border border-amber-500/40"
            >
              Load Demo Datasets
            </button>
          )}
        </div>
      )}

      {/* Matching Pipeline Visual */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <h3 className="text-base font-bold text-white tracking-tight">
            Matching Pipeline Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Five sequential execution phases executed by the resolution model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MATCHING_PIPELINE_STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      Step {stage.step}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Matching Progress Display */}
      {isMatching && (
        <ProgressIndicator
          currentStep={matchProgress.step}
          currentDetail={matchProgress.detail}
          percent={matchProgress.percent}
          isComplete={false}
        />
      )}

      {/* Configuration Section & Trigger Action */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-400" />
              Pipeline Configuration Parameters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Frontend controls for similarity weights, blocking, and classification threshold
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-mono bg-slate-900 text-slate-400 border border-slate-700">
            Parameters Staged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Matching Threshold */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="threshold-slider" className="text-xs font-bold text-slate-200">
                  Matching Threshold
                </label>
                <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {Number(config.threshold).toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Minimum aggregate probability required to declare an entity link.
              </p>
            </div>

            <div className="mt-4">
              <input
                id="threshold-slider"
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={config.threshold}
                onChange={(e) => updateConfig('threshold', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0.50 (Recall)</span>
                <span>0.70 (Balanced)</span>
                <span>0.95 (Precision)</span>
              </div>
            </div>
          </div>

          {/* Candidate Generation Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[200px]">
              <span className="text-xs font-bold text-slate-200">Candidate Generation</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Phonetic & postal blocking rules to prevent brute-force O(N²) comparisons.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig('candidateGen', !config.candidateGen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.candidateGen
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.candidateGen ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Name Similarity Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[200px]">
              <span className="text-xs font-bold text-slate-200">Name Similarity</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Jaro-Winkler, Levenshtein, & token sort similarity on legal business names.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig('nameSim', !config.nameSim)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.nameSim
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.nameSim ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Address Similarity Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[200px]">
              <span className="text-xs font-bold text-slate-200">Address Similarity</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Token set & n-gram street string similarity with abbreviation expansion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig('addressSim', !config.addressSim)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.addressSim
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.addressSim ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Country Comparison Toggle */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="max-w-[200px]">
              <span className="text-xs font-bold text-slate-200">Country Comparison</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                ISO-3166 alpha code standardization & country level consistency gating.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateConfig('countryComp', !config.countryComp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.countryComp
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.countryComp ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Architecture Readiness info */}
          <div className="p-4 rounded-xl bg-brand-950/20 border border-brand-500/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-400" /> ML Backend Ready
              </span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                When production backend is connected, configuration payload is posted directly to <code className="text-brand-300">/api/match</code>.
              </p>
            </div>
            <span className="text-[10px] font-mono text-brand-400 mt-2">
              POST /api/match
            </span>
          </div>
        </div>

        {/* Execution Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {isMatching ? (
              <span className="text-brand-400 animate-pulse font-medium">
                Pipeline is executing... please wait
              </span>
            ) : hasRun ? (
              <span className="text-emerald-400 font-medium">
                Last execution completed. Click again to re-run pipeline with current parameters.
              </span>
            ) : (
              <span>Ready to initiate entity resolution across loaded datasets</span>
            )}
          </div>

          <button
            type="button"
            disabled={!hasAllFiles || isMatching}
            onClick={handleRun}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isMatching
                ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700'
                : hasAllFiles
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 hover:shadow-brand-600/50 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            <Play className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
            <span>{isMatching ? 'Resolving Entities...' : 'Run Entity Resolution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
