/**
 * Google Analytics tracking utilities.
 * Uses Google Tag Manager's dataLayer to send events.
 */

// Declare window.dataLayer for TypeScript.
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Send a custom event to Google Analytics via GTM dataLayer.
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if it doesn't exist.
  window.dataLayer = window.dataLayer || [];

  // Push event to dataLayer.
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });

  // Log in development for debugging.
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, eventParams);
  }
}

/**
 * Track when a user uploads/selects an .als file.
 */
export function trackFileUpload(fileSize: number): void {
  trackEvent('file_upload', {
    file_size_mb: (fileSize / 1024 / 1024).toFixed(2),
    file_type: 'als',
  });
}

/**
 * Track when a user analyzes their file.
 */
export function trackFileAnalysis(params: {
  fileSize: number;
  processingTime: number;
  extractTempo: boolean;
  extractScale: boolean;
  extractSamples: boolean;
  extractLocators: boolean;
  extractTimeSignature: boolean;
  extractTrackTypes: boolean;
  spliceOnly: boolean;
  showAllSamples: boolean;
  hasCustomPaths: boolean;
}): void {
  trackEvent('file_analysis', {
    // File metadata (no sensitive data).
    file_size_mb: (params.fileSize / 1024 / 1024).toFixed(2),
    processing_time_ms: Math.round(params.processingTime),

    // Options selected.
    extract_tempo: params.extractTempo,
    extract_scale: params.extractScale,
    extract_samples: params.extractSamples,
    extract_locators: params.extractLocators,
    extract_time_signature: params.extractTimeSignature,
    extract_track_types: params.extractTrackTypes,
    splice_only: params.spliceOnly,
    show_all_samples: params.showAllSamples,
    has_custom_paths: params.hasCustomPaths,
  });
}

/**
 * Track analysis errors.
 */
export function trackAnalysisError(errorMessage: string, fileSize?: number): void {
  trackEvent('analysis_error', {
    error_message: errorMessage,
    file_size_mb: fileSize ? (fileSize / 1024 / 1024).toFixed(2) : undefined,
  });
}
