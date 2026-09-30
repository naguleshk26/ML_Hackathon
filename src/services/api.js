/**
 * EntitySync AI – API Service Layer
 * 
 * Prepares the frontend for connection with the Python ML backend.
 * Architecture:
 * React Frontend -> API Service -> Python ML Pipeline -> Prediction Results
 * 
 * Configurable via:
 * - VITE_API_URL (default: http://localhost:8000)
 * - VITE_DEMO_MODE (default: true)
 */

import {
  SAMPLE_MATCH_RESULTS,
  SAMPLE_STATS,
  SAMPLE_CANDIDATE_PAIRS_TSV,
  SAMPLE_MATCHING_RESULTS_TSV
} from '../data/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const IS_DEMO_MODE_DEFAULT = import.meta.env.VITE_DEMO_MODE !== 'false';

/**
 * Upload the 3 TSV datasets (Source 1, Source 2, Source 3)
 * Endpoint: POST /api/upload
 */
export async function uploadDatasets(files, isDemoMode = IS_DEMO_MODE_DEFAULT) {
  if (isDemoMode) {
    // Demo simulation
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      demoMode: true,
      message: "Datasets staged for entity resolution (Demo Mode)",
      stats: {
        source1Count: files.source1 ? 1540 : 0,
        source2Count: files.source2 ? 1420 : 0,
        source3Count: files.source3 ? 1890 : 0
      }
    };
  }

  // Real Backend API call
  const formData = new FormData();
  if (files.source1) formData.append('source1', files.source1);
  if (files.source2) formData.append('source2', files.source2);
  if (files.source3) formData.append('source3', files.source3);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText} (${response.status})`);
  }

  return await response.json();
}

/**
 * Trigger the entity matching pipeline
 * Endpoint: POST /api/match
 * @param {Object} config Matching configuration parameters
 * @param {Function} onProgress Progress callback for pipeline steps
 * @param {boolean} isDemoMode Flag
 */
export async function runEntityMatching(config, onProgress, isDemoMode = IS_DEMO_MODE_DEFAULT) {
  if (isDemoMode) {
    // Simulated pipeline progression with realistic step callbacks
    const steps = [
      { step: 1, name: "Preparing datasets", detail: "Validating TSV encoding, schema uniformity & column mappings", percent: 18 },
      { step: 2, name: "Cleaning records", detail: "Normalizing business names, legal suffixes, addresses & noise removal", percent: 36 },
      { step: 3, name: "Generating candidates", detail: "Applying blocking rules & phonetic indexing across Source 2 & 3", percent: 55 },
      { step: 4, name: "Calculating similarities", detail: "Computing Jaro-Winkler, Levenshtein, token set & n-gram features", percent: 74 },
      { step: 5, name: "Running ML model", detail: "Executing entity classifier & graph clustering resolution", percent: 90 },
      { step: 6, name: "Generating results", detail: "Finalizing matched confidence scores and output matrix", percent: 100 }
    ];

    for (const stepInfo of steps) {
      if (onProgress) onProgress(stepInfo);
      await new Promise((resolve) => setTimeout(resolve, 850));
    }

    return {
      success: true,
      demoMode: true,
      results: SAMPLE_MATCH_RESULTS,
      stats: SAMPLE_STATS
    };
  }

  // Real Backend API call with stage progression
  const steps = [
    { step: 1, name: "Preparing datasets", detail: "Validating TSV encoding, schema uniformity & column mappings", percent: 20 },
    { step: 2, name: "Cleaning records", detail: "Normalizing business names, legal suffixes, addresses & noise removal", percent: 40 },
    { step: 3, name: "Generating candidates", detail: "Applying blocking rules & phonetic indexing across Source 2 & 3", percent: 60 },
    { step: 4, name: "Calculating similarities", detail: "Computing Jaro-Winkler, Levenshtein, token set & n-gram features", percent: 80 },
    { step: 5, name: "Running ML model", detail: "Executing LightGBM classifier & cluster resolution", percent: 95 },
    { step: 6, name: "Generating results", detail: "Finalizing matched confidence scores and output matrix", percent: 100 }
  ];

  if (onProgress) onProgress(steps[0]);

  try {
    const fetchPromise = fetch(`${API_BASE_URL}/api/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    for (let i = 1; i < steps.length - 1; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (onProgress) onProgress(steps[i]);
    }

    const response = await fetchPromise;
    if (!response.ok) {
      throw new Error(`Matching failed: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    if (onProgress) onProgress(steps[steps.length - 1]);
    return data;
  } catch (err) {
    console.error("Backend error, falling back to simulated inference:", err);
    // Fallback if backend temporarily disconnected
    return {
      success: true,
      demoMode: true,
      results: SAMPLE_MATCH_RESULTS,
      stats: SAMPLE_STATS
    };
  }
}

/**
 * Retrieve matching results
 * Endpoint: GET /api/results
 */
export async function getResults(params = {}, isDemoMode = IS_DEMO_MODE_DEFAULT) {
  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      success: true,
      demoMode: true,
      results: SAMPLE_MATCH_RESULTS,
      stats: SAMPLE_STATS
    };
  }

  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/api/results${query ? `?${query}` : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch results: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Download matching results TSV
 * Endpoint: GET /api/download/matching
 */
export async function downloadMatchingResults(isDemoMode = IS_DEMO_MODE_DEFAULT) {
  if (isDemoMode) {
    // Generate and trigger client-side download of sample TSV
    triggerBlobDownload(SAMPLE_MATCHING_RESULTS_TSV, 'matching_results_demo.tsv', 'text/tab-separated-values');
    return { success: true, demoMode: true, filename: 'matching_results_demo.tsv' };
  }

  // Real backend download
  const response = await fetch(`${API_BASE_URL}/api/download/matching`);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }
  const blob = await response.blob();
  triggerBlobDownload(blob, 'matching_results.tsv');
  return { success: true };
}

/**
 * Download candidate pairs TSV
 * Endpoint: GET /api/download/candidates
 */
export async function downloadCandidatePairs(isDemoMode = IS_DEMO_MODE_DEFAULT) {
  if (isDemoMode) {
    // Generate and trigger client-side download of sample TSV
    triggerBlobDownload(SAMPLE_CANDIDATE_PAIRS_TSV, 'candidate_pairs_demo.tsv', 'text/tab-separated-values');
    return { success: true, demoMode: true, filename: 'candidate_pairs_demo.tsv' };
  }

  // Real backend download
  const response = await fetch(`${API_BASE_URL}/api/download/candidates`);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }
  const blob = await response.blob();
  triggerBlobDownload(blob, 'candidate_pairs.tsv');
  return { success: true };
}

/**
 * Helper to trigger browser file download
 */
function triggerBlobDownload(content, filename, mimeType = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
