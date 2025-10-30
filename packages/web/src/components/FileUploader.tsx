import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle, CheckCircle, Settings, Plus, X } from 'lucide-react';
// Import from browser entry point
import { Inspector } from '@owenbush/ableton-inspector-core/browser';
import type { AbletonProject } from '@owenbush/ableton-inspector-core';
import type { ExtractOptions, ProcessingResult } from '../lib/types';
import { trackFileUpload, trackFileAnalysis, trackAnalysisError } from '../lib/analytics';

interface FileUploaderProps {
  onResult: (result: ProcessingResult) => void;
  onSuccess?: () => void; // Callback for successful upload
  onOptionsChange?: (options: ExtractOptions) => void; // Callback for options change
}

export function FileUploader({ onResult, onSuccess, onOptionsChange }: FileUploaderProps) {
  const [options, setOptions] = useState<ExtractOptions>({
    tempo: true,
    scale: true,
    samples: true,
    locators: true,
    timeSignature: true,
    trackTypes: true,
    spliceOnly: false, // Default: show Splice samples only (recommended)
    showAllSamples: false, // Default: don't show all samples
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPaths, setCustomPaths] = useState<string[]>(['']);

  // Update options when custom paths change
  useEffect(() => {
    const validPaths = customPaths.filter(path => path.trim() !== '');
    onOptionsChange?.({
      ...options,
      customSplicePaths: validPaths.length > 0 ? validPaths : undefined,
    });
  }, [options, customPaths, onOptionsChange]);

  // Notify parent of options changes
  useEffect(() => {
    onOptionsChange?.(options);
  }, [options, onOptionsChange]);

  const addCustomPath = () => {
    setCustomPaths([...customPaths, '']);
  };

  const removeCustomPath = (index: number) => {
    if (customPaths.length > 1) {
      setCustomPaths(customPaths.filter((_, i) => i !== index));
    }
  };

  const updateCustomPath = (index: number, value: string) => {
    const newPaths = [...customPaths];
    newPaths[index] = value;
    setCustomPaths(newPaths);
  };

  const processFile = useCallback(async () => {
    if (!selectedFile) return;

    const startTime = performance.now();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Process in browser (all client-side!)
      // Pass the File object directly, Inspector.fromFile handles it
      const inspector = await Inspector.fromFile(selectedFile);

      // Extract based on options
      const result: AbletonProject = { file: selectedFile.name };

      if (options.tempo) {
        result.tempo = inspector.extractTempo();
      }

      if (options.scale) {
        result.scale = inspector.extractScale();
      }

      if (options.samples) {
        result.samples = inspector.extractSamples({
          spliceOnly: options.spliceOnly,
          splicePaths: options.customSplicePaths,
        });
      }

      if (options.locators) {
        result.locators = inspector.extractLocators();
      }

      if (options.timeSignature) {
        result.timeSignature = inspector.extractTimeSignature();
      }

      if (options.trackTypes) {
        result.trackTypes = inspector.extractTrackTypes();
      }


      const processingTime = performance.now() - startTime;

      onResult({
        success: true,
        data: result,
        meta: {
          processingTime,
          fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        },
      });

      // Track successful analysis.
      trackFileAnalysis({
        fileSize: selectedFile.size,
        processingTime,
        extractTempo: options.tempo,
        extractScale: options.scale,
        extractSamples: options.samples,
        extractLocators: options.locators,
        extractTimeSignature: options.timeSignature,
        extractTrackTypes: options.trackTypes,
        spliceOnly: options.spliceOnly,
        showAllSamples: options.showAllSamples,
        hasCustomPaths: Boolean(options.customSplicePaths?.length),
      });

      // Show success state and trigger callback
      setSuccess(true);
      onSuccess?.();

      // Auto-hide success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);

      // Track analysis error.
      trackAnalysisError(errorMessage, selectedFile.size);

      onResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedFile, options, onResult, onSuccess]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setError(null);
        setSuccess(false);

        // Track file upload/selection.
        trackFileUpload(file.size);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/octet-stream': ['.als'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: loading,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900'
          }
          ${loading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {loading ? (
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
        ) : success ? (
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
        ) : selectedFile ? (
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        ) : (
          <Upload
            className={`w-16 h-16 mx-auto mb-4 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
        )}

        <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {loading
            ? 'Processing...'
            : success
            ? 'Success! Check results below ↓'
            : selectedFile
            ? `Ready to inspect: ${selectedFile.name}`
            : isDragActive
            ? 'Drop here!'
            : 'Drop your .als file here'
          }
        </p>

        <p className="text-gray-500 dark:text-gray-400">or click to browse • Max 50MB</p>
      </div>

      {/* Options checkboxes */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <p className="font-medium mb-4 text-gray-900 dark:text-white">What to extract:</p>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.tempo}
              onChange={e => setOptions({ ...options, tempo: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Tempo</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.scale}
              onChange={e => setOptions({ ...options, scale: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Scale</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.samples}
              onChange={e => setOptions({ ...options, samples: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Samples</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.locators}
              onChange={e => setOptions({ ...options, locators: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Locators</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.timeSignature}
              onChange={e => setOptions({ ...options, timeSignature: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Time Signature</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.trackTypes}
              onChange={e => setOptions({ ...options, trackTypes: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">Track Types</span>
          </label>


          {/* Sample Display Options */}
          {options.samples && (
            <div className="col-span-2 space-y-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sample Display Options:
              </p>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sampleDisplay"
                    checked={!options.showAllSamples}
                    onChange={() => setOptions({
                      ...options,
                      spliceOnly: false,
                      showAllSamples: false
                    })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">
                    Show Splice samples only (recommended)
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sampleDisplay"
                    checked={options.showAllSamples}
                    onChange={() => setOptions({
                      ...options,
                      spliceOnly: false,
                      showAllSamples: true
                    })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 dark:text-white">
                    Show all samples (Splice + others)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Advanced Settings</span>
          </div>
          <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showAdvanced && (
          <div className="px-4 pb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Splice Sample Paths
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Add custom paths where your Splice samples are stored. Leave empty to use default detection.
              </p>

              <div className="space-y-2">
                {customPaths.map((path, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={path}
                      onChange={(e) => updateCustomPath(index, e.target.value)}
                      placeholder="e.g., /Users/username/Music/Splice/sounds/packs"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {customPaths.length > 1 && (
                      <button
                        onClick={() => removeCustomPath(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addCustomPath}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add another path
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Button */}
      {selectedFile && (
        <div className="flex justify-center gap-4">
          <button
            onClick={processFile}
            disabled={loading}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all transform
              ${loading
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }
            `}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              '🔍 Inspect File'
            )}
          </button>

          <button
            onClick={() => {
              setSelectedFile(null);
              setError(null);
              setSuccess(false);
            }}
            disabled={loading}
            className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">Error</p>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy notice */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>🔒 Your file is processed in your browser and never leaves your device</p>
      </div>
    </div>
  );
}

