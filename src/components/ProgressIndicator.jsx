import React from 'react';
import { Loader2, CheckCircle2, Clock, Cpu } from 'lucide-react';

const PIPELINE_STAGES = [
  { step: 1, name: "Preparing datasets", detail: "Validating TSV encoding, schema uniformity & column mappings" },
  { step: 2, name: "Cleaning records", detail: "Normalizing business names, legal suffixes & address strings" },
  { step: 3, name: "Generating candidates", detail: "Applying blocking rules & phonetic indexing across Source 2 & 3" },
  { step: 4, name: "Calculating similarities", detail: "Computing Jaro-Winkler, Levenshtein & token similarity features" },
  { step: 5, name: "Running ML model", detail: "Executing entity classifier & graph clustering resolution" },
  { step: 6, name: "Generating results", detail: "Finalizing matched confidence scores and output matrix" }
];

export default function ProgressIndicator({ currentStep = 1, currentDetail = '', percent = 0, isComplete = false }) {
  return (
    <div className="rounded-2xl bg-slate-850/95 border border-brand-500/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Progress header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              {isComplete ? 'Resolution Pipeline Finished' : 'Processing Entity Resolution Pipeline'}
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {percent}%
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isComplete ? 'All datasets matched and ready for inspection' : (currentDetail || 'Simulating ML inference engine')}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 font-medium">
            Stage {Math.min(currentStep, 6)} of 6
          </span>
        </div>
      </div>

      {/* Percentage Bar */}
      <div className="mt-6">
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Pipeline Steps List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PIPELINE_STAGES.map((stage) => {
          const isDone = isComplete || currentStep > stage.step;
          const isCurrent = !isComplete && currentStep === stage.step;
          const isUpcoming = !isComplete && currentStep < stage.step;

          return (
            <div
              key={stage.step}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500/40 shadow-sm shadow-brand-500/10 ring-1 ring-brand-500/30'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/20 text-slate-300'
                  : 'bg-slate-900/30 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold truncate ${
                      isCurrent ? 'text-brand-300' : isDone ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {stage.name}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 font-bold ml-1">
                      0{stage.step}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {stage.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
