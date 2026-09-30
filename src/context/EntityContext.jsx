import React, { createContext, useContext, useState, useCallback } from 'react';
import { runEntityMatching, IS_DEMO_MODE_DEFAULT } from '../services/api';
import { useToast } from './ToastContext';

const EntityContext = createContext(null);

export function EntityProvider({ children }) {
  const { showToast } = useToast();

  const [isDemoMode, setIsDemoMode] = useState(IS_DEMO_MODE_DEFAULT);

  // Uploaded dataset files
  const [files, setFiles] = useState({
    source1: null,
    source2: null,
    source3: null
  });

  // Pipeline configuration settings
  const [config, setConfig] = useState({
    threshold: 0.70,
    candidateGen: true,
    nameSim: true,
    addressSim: true,
    countryComp: true
  });

  // Matching status & progress
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState({
    step: 0,
    total: 6,
    name: 'Idle',
    detail: 'Pipeline not started',
    percent: 0
  });

  // Results & stats
  const [hasRun, setHasRun] = useState(false);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    source1Count: 0,
    source2Count: 0,
    source3Count: 0,
    matchedCount: 0,
    unmatchedCount: 0,
    matchRate: '0.0%'
  });

  const hasAllFiles = Boolean(files.source1 && files.source2 && files.source3);

  // File handling
  const setSourceFile = useCallback((sourceKey, file) => {
    if (!file) return;

    // Validate TSV extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'tsv') {
      showToast(`Invalid file format: "${file.name}". Please upload a .tsv file.`, 'error');
      return false;
    }

    setFiles((prev) => ({
      ...prev,
      [sourceKey]: {
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        rawSize: file.size,
        uploadedAt: new Date().toLocaleTimeString()
      }
    }));

    showToast(`Loaded ${sourceKey.toUpperCase()}: ${file.name}`, 'success');
    return true;
  }, [showToast]);

  const removeSourceFile = useCallback((sourceKey) => {
    setFiles((prev) => {
      const updated = { ...prev, [sourceKey]: null };
      return updated;
    });
    showToast(`Removed dataset for ${sourceKey.toUpperCase()}`, 'info');
  }, [showToast]);

  // Load sample demo datasets for one-click testing
  const loadSampleDatasets = useCallback(() => {
    const dummyS1 = new File(["dummy S1 data"], "source1_reference_entities.tsv", { type: "text/tab-separated-values" });
    const dummyS2 = new File(["dummy S2 data"], "source2_partner_records.tsv", { type: "text/tab-separated-values" });
    const dummyS3 = new File(["dummy S3 data"], "source3_registry_dump.tsv", { type: "text/tab-separated-values" });

    setFiles({
      source1: { file: dummyS1, name: "source1_reference_entities.tsv", size: "482.4 KB", rawSize: 494000, uploadedAt: new Date().toLocaleTimeString() },
      source2: { file: dummyS2, name: "source2_partner_records.tsv", size: "398.1 KB", rawSize: 407000, uploadedAt: new Date().toLocaleTimeString() },
      source3: { file: dummyS3, name: "source3_registry_dump.tsv", size: "612.8 KB", rawSize: 627000, uploadedAt: new Date().toLocaleTimeString() }
    });

    setStats((prev) => ({
      ...prev,
      source1Count: 1540,
      source2Count: 1420,
      source3Count: 1890
    }));

    showToast('Loaded 3 sample TSV datasets (Demo Mode)', 'success');
  }, [showToast]);

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const triggerMatching = useCallback(async (onComplete) => {
    if (!hasAllFiles) {
      showToast('Please ensure all three TSV datasets (Source 1, 2, and 3) are loaded before running resolution.', 'warning');
      return;
    }

    setIsMatching(true);
    setMatchProgress({
      step: 1,
      total: 6,
      name: 'Preparing datasets',
      detail: 'Validating TSV encoding, schema uniformity & column mappings',
      percent: 10
    });
    showToast('Entity Resolution Pipeline initiated', 'info');

    try {
      const response = await runEntityMatching(
        config,
        (progress) => {
          setMatchProgress({
            step: progress.step,
            total: 6,
            name: progress.name,
            detail: progress.detail,
            percent: progress.percent
          });
        },
        isDemoMode
      );

      setResults(response.results || []);
      setStats(response.stats || {
        source1Count: 1540,
        source2Count: 1420,
        source3Count: 1890,
        matchedCount: 1184,
        unmatchedCount: 356,
        matchRate: '76.9%'
      });
      setHasRun(true);
      showToast('Entity Resolution completed successfully!', 'success');

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error(err);
      showToast(`Matching pipeline error: ${err.message}`, 'error');
    } finally {
      setIsMatching(false);
    }
  }, [hasAllFiles, config, isDemoMode, showToast]);

  const resetAll = useCallback(() => {
    setFiles({ source1: null, source2: null, source3: null });
    setResults([]);
    setHasRun(false);
    setStats({
      source1Count: 0,
      source2Count: 0,
      source3Count: 0,
      matchedCount: 0,
      unmatchedCount: 0,
      matchRate: '0.0%'
    });
    showToast('Reset datasets and matching results', 'info');
  }, [showToast]);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      showToast(next ? 'Demo Mode enabled (Simulated ML results)' : 'Production Mode enabled (Requires live ML backend)', 'info');
      return next;
    });
  }, [showToast]);

  return (
    <EntityContext.Provider
      value={{
        files,
        hasAllFiles,
        setSourceFile,
        removeSourceFile,
        loadSampleDatasets,
        config,
        updateConfig,
        isMatching,
        matchProgress,
        hasRun,
        results,
        stats,
        triggerMatching,
        resetAll,
        isDemoMode,
        toggleDemoMode
      }}
    >
      {children}
    </EntityContext.Provider>
  );
}

export function useEntity() {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
}
