import React from 'react';
import {
  Info,
  Layers,
  Database,
  Cpu,
  Code2,
  GitBranch,
  ShieldCheck,
  Server,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Workflow
} from 'lucide-react';

const TECH_STACK = [
  {
    name: 'React 18',
    category: 'Frontend Core',
    desc: 'Component-driven user interface with declarative state management.',
    accent: 'border-blue-500/30 bg-blue-500/10 text-blue-400'
  },
  {
    name: 'Vite',
    category: 'Build Tooling',
    desc: 'High-performance Next-gen ES modules bundler and rapid HMR dev server.',
    accent: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling & Design System',
    desc: 'Utility-first modern dark SaaS aesthetics, customized palette and responsive layouts.',
    accent: 'border-teal-500/30 bg-teal-500/10 text-teal-400'
  },
  {
    name: 'Python ML Backend',
    category: 'Backend Pipeline (Upcoming)',
    desc: 'Decoupled REST API service running entity blocking, scoring & ML inference.',
    accent: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  },
  {
    name: 'Machine Learning',
    category: 'Resolution Engine',
    desc: 'Supervised classification model trained to resolve ambiguous multi-way entity links.',
    accent: 'border-pink-500/30 bg-pink-500/10 text-pink-400'
  },
  {
    name: 'TSV Data Processing',
    category: 'Data Storage & Exchange',
    desc: 'Tab-separated value pipelines preserving comma-rich business address structures.',
    accent: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
          <Info className="w-3.5 h-3.5 text-brand-400" />
          <span>System Documentation & Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About EntitySync AI
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          EntitySync AI is an intelligent business entity resolution system designed to identify records from multiple noisy business data sources that represent the same real-world business.
        </p>
      </div>

      {/* The Problem & Solution Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-7 shadow-card">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            The Entity Resolution Challenge
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed space-y-2">
            Commercial datasets originate from heterogeneous sources: internal CRM databases, external partner feeds, public registries, and billing services. In each source, the exact same enterprise may be represented with substantial divergence:
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold">•</span>
              <span><strong>Name Variations:</strong> "ABC Technologies Pvt Ltd" vs "A.B.C. Tech Inc."</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold">•</span>
              <span><strong>Address Inconsistencies:</strong> "42 Brigade Rd, 4th Flr" vs "Brigade Road, Suite 400"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold">•</span>
              <span><strong>Locale Differences:</strong> ISO country code shifts ("IN" vs "India", "GB" vs "UK")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-400 font-bold">•</span>
              <span><strong>Missing Fields:</strong> Incomplete postal codes, truncated trade names, typos</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-7 shadow-card">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Our Solution Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            EntitySync AI resolves cross-source ambiguities in a multi-stage, privacy-preserving pipeline without reliance on external commercial search engines or proprietary third-party lookup APIs.
          </p>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">1. Offline & Local Execution</span>
              <span className="text-[11px] text-emerald-400 font-mono">Zero External API Calls</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">2. High Efficiency Blocking</span>
              <span className="text-[11px] text-brand-400 font-mono">O(N log N) Candidate Pruning</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">3. Decoupled ML Layer</span>
              <span className="text-[11px] text-purple-400 font-mono">RESTful Python Model Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Pipeline Diagram */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-4 h-4 text-brand-400" />
            Pipeline Architecture Flow
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Data progression through the entity resolution subsystem
          </p>
        </div>

        {/* Visual architecture diagram */}
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-2">
          {/* Layer 1: Sources */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/30 text-center">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">Input</span>
              <p className="text-xs font-bold text-white mt-0.5">Source 1</p>
              <p className="text-[10px] text-slate-400">Reference Catalog</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-center">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Input</span>
              <p className="text-xs font-bold text-white mt-0.5">Source 2</p>
              <p className="text-[10px] text-slate-400">Partner Records</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-center">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Input</span>
              <p className="text-xs font-bold text-white mt-0.5">Source 3</p>
              <p className="text-[10px] text-slate-400">Registry Dump</p>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Layer 2: Preprocessing */}
          <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center shadow-sm">
            <p className="text-xs font-bold text-white">Preprocessing & Normalization</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Legal suffix stripping, address parsing, casing & punctuation standardization
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Layer 3: Candidate Generation */}
          <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center shadow-sm">
            <p className="text-xs font-bold text-white">Candidate Generation & Blocking</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Phonetic indexing (Metaphone), postal prefix grouping & candidate pairs creation
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Layer 4: Similarity Features */}
          <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center shadow-sm">
            <p className="text-xs font-bold text-white">Similarity Feature Extraction</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Jaro-Winkler, Levenshtein, token containment, n-gram Cosine, and Country similarity vectors
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Layer 5: ML Matching Model */}
          <div className="w-full p-4 rounded-xl bg-gradient-to-r from-brand-900/40 via-purple-900/40 to-brand-900/40 border border-brand-500/40 text-center shadow-md">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-1">
              <Cpu className="w-3 h-3" /> ML INFERENCE LAYER
            </div>
            <p className="text-xs font-bold text-white">ML Matching Model</p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Supervised classification & entity clustering (integrated via Python backend)
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-600" />

          {/* Layer 6: Entity Resolution Results */}
          <div className="w-full p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center shadow-sm">
            <p className="text-xs font-bold text-emerald-300">Entity Resolution Results</p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Resolved multi-source entities with calibrated confidence scores & exportable TSV tables
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="rounded-3xl bg-slate-850/80 border border-slate-800 p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-400" />
            Technology Stack
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Core components and frameworks powering the frontend and model service architecture
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${tech.accent}`}>
                    {tech.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Backend Integration Note */}
      <div className="p-5 rounded-2xl bg-brand-950/20 border border-brand-500/30 flex items-start gap-4 text-xs text-slate-300 leading-relaxed">
        <Server className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white text-sm">
            Backend API & Machine Learning Integration Notice
          </h4>
          <p className="mt-1 text-slate-400">
            The frontend application is fully decoupled from the machine learning inference engine. The service layer located in <code className="text-brand-300 font-mono">src/services/api.js</code> is prepared to bind directly to the Python ML server exposing <code className="text-slate-200 font-mono">/api/upload</code>, <code className="text-slate-200 font-mono">/api/match</code>, and <code className="text-slate-200 font-mono">/api/results</code> endpoints once model training concludes.
          </p>
        </div>
      </div>
    </div>
  );
}
