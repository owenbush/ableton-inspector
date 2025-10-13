import { motion } from 'framer-motion';
import { Download, Copy, Music, Hash, Disc, Check } from 'lucide-react';
import { useState } from 'react';
import type { ProcessingResult } from '../lib/types';

interface ResultsDisplayProps {
  result: ProcessingResult;
  options: {
    showAllSamples: boolean;
  };
}

export function ResultsDisplay({ result, options }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!result.success || !result.data) {
    return null;
  }

  const { data, meta } = result;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.file.replace('.als', '')}-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{data.file}</h2>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors text-gray-900 dark:text-white"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tempo */}
        {data.tempo && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tempo</h3>
            </div>

            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {data.tempo.initialTempo}{' '}
              <span className="text-2xl font-normal text-gray-500 dark:text-gray-400">BPM</span>
            </p>

            {data.tempo.tempoChanges.length > 1 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {data.tempo.tempoChanges.length} tempo automation points
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">No automation</p>
            )}
          </motion.div>
        )}

        {/* Scale */}
        {data.scale && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Scale</h3>
            </div>

            {data.scale.uniqueScales.length === 1 ? (
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {data.scale.uniqueScales[0].root} {data.scale.uniqueScales[0].scale}
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Multiple scales detected:
                </p>
                {Object.entries(data.scale.distribution).map(([scale, count]) => (
                  <div key={scale} className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {scale}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {count as number} occurrences
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Samples */}
        {data.samples && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Disc className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Samples</h3>
            </div>

            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {data.samples.totalSamples}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {data.samples.spliceSamples}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Splice</p>
              </div>
            </div>

            {/* Sample list */}
            {(options.showAllSamples || data.samples.spliceSamples > 0) && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {options.showAllSamples ? 'All Samples:' : 'Splice Samples:'}
                </p>
                {(options.showAllSamples
                  ? data.samples.samples
                  : data.samples.samples.filter((s: any) => s.isSplice)
                ).map((sample: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        sample.isSplice
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm truncate text-gray-900 dark:text-white">
                        {sample.filename}
                      </p>
                      {sample.packName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {sample.packName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Processing info */}
      {meta && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Processed in {meta.processingTime.toFixed(0)}ms • File size: {meta.fileSize}
          </p>
        </div>
      )}
    </motion.div>
  );
}

