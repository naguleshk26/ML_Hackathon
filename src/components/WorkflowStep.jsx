import React from 'react';
import { Database, Filter, Layers, Cpu, CheckCircle2, SlidersHorizontal, ArrowRight, ArrowDown } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: 1,
    name: 'DATA SOURCES',
    label: 'Source 1, 2 & 3',
    desc: 'Ingests independent, heterogeneous TSV business registries with noisy names, addresses, and formats.',
    icon: Database,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
  },
  {
    step: 2,
    name: 'DATA CLEANING',
    label: 'Standardization',
    desc: 'Normalizes entity strings, legal suffixes (Pvt Ltd, Inc, GmbH), punctuations, and postal formats.',
    icon: Filter,
    color: 'from-indigo-500/20 to-brand-500/20 text-indigo-400 border-indigo-500/30'
  },
  {
    step: 3,
    name: 'CANDIDATE GENERATION',
    label: 'Blocking & Indexing',
    desc: 'Prunes O(N²) search space using multi-attribute blocking rules and locality-sensitive indexing.',
    icon: Layers,
    color: 'from-brand-500/20 to-purple-500/20 text-brand-400 border-brand-500/30'
  },
  {
    step: 4,
    name: 'SIMILARITY ANALYSIS',
    label: 'Feature Extraction',
    desc: 'Computes deep lexical, phonetic (Soundex), token overlap (Jaccard), and address n-gram distance vectors.',
    icon: SlidersHorizontal,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
  },
  {
    step: 5,
    name: 'ML MATCHING',
    label: 'Model Inference',
    desc: 'Evaluates candidate pairs with supervised classifier & graph clustering to resolve ambiguous multi-way entities.',
    icon: Cpu,
    color: 'from-pink-500/20 to-rose-500/20 text-rose-400 border-rose-500/30'
  },
  {
    step: 6,
    name: 'RESULTS',
    label: 'Resolved Clusters',
    desc: 'Outputs resolved entity mappings, confidence scores, and clean exportable TSV tables.',
    icon: CheckCircle2,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  }
];

export default function WorkflowStep() {
  return (
    <div className="w-full">
      {/* Desktop / Large Screen Grid Flow */}
      <div className="hidden lg:grid grid-cols-6 gap-3 relative">
        {WORKFLOW_STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="flex flex-col relative group">
              {/* Card */}
              <div className="h-full p-4 rounded-xl bg-slate-850/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-card hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} border shadow-inner`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      0{item.step}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-medium text-brand-400 mt-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Connecting arrow for items except last */}
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden xl:flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tablet / Mobile Linear Flow */}
      <div className="lg:hidden flex flex-col gap-3">
        {WORKFLOW_STEPS.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.step}>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.color} border shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      Step 0{item.step}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-brand-400 mt-0.5">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="flex justify-center -my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
