import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';

export default function UploadCard({
  sourceKey,
  title,
  subtitle,
  description,
  fileInfo,
  onFileSelect,
  onFileRemove,
  required = true
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file) => {
    setDropError('');
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'tsv') {
      setDropError('Only .tsv files are supported. Please select a valid tab-separated file.');
      return;
    }

    onFileSelect(sourceKey, file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className={`flex flex-col rounded-2xl bg-slate-850/90 border transition-all duration-200 overflow-hidden shadow-card ${
      fileInfo 
        ? 'border-emerald-500/30 bg-slate-850/95 ring-1 ring-emerald-500/20' 
        : isDragging 
          ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/30' 
          : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {sourceKey.toUpperCase()}
            </span>
            <h3 className="font-semibold text-white text-base">{title}</h3>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        {fileInfo ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            Required (.tsv)
          </span>
        )}
      </div>

      {/* Body / Dropzone */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {fileInfo ? (
          <div className="flex flex-col items-center p-6 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>

            <p className="text-sm font-semibold text-slate-100 text-center break-all max-w-full">
              {fileInfo.name}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span>{fileInfo.size}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Valid TSV</span>
              <span>•</span>
              <span>{fileInfo.uploadedAt || 'Ready'}</span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => onFileRemove(sourceKey)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                aria-label={`Remove file ${fileInfo.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove File
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-brand-400 bg-brand-500/10 scale-[0.99]'
                : 'border-slate-700/80 hover:border-brand-500/60 hover:bg-slate-800/40'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            aria-label={`Upload .tsv file for ${title}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept=".tsv"
              className="hidden"
            />

            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>

            <p className="text-sm font-semibold text-slate-200 text-center">
              Drag & drop your <span className="text-brand-400 font-mono">.tsv</span> file here
            </p>
            <p className="text-xs text-slate-400 mt-1 text-center">
              or <span className="text-brand-400 font-medium underline underline-offset-2">browse computer</span>
            </p>

            <span className="mt-4 px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-800/60 rounded-full border border-slate-700/60">
              Only Tab-Separated Values (.tsv)
            </span>
          </div>
        )}

        {dropError && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{dropError}</span>
          </div>
        )}

        {description && !fileInfo && (
          <p className="mt-3 text-xs text-slate-500 text-center leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
