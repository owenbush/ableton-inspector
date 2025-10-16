import { useState, useRef } from 'react';
import { Music, Disc, Github, Terminal, ArrowDown } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import type { ProcessingResult, ExtractOptions } from './lib/types';

function App() {
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [showAllSamples, setShowAllSamples] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionsChange = (options: ExtractOptions) => {
    setShowAllSamples(options.showAllSamples);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
            🎵 Powered by browser technology - 100% private
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ableton Inspector
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Extract tempo, scale, and sample information from your Ableton Live 11 & 12 projects
            instantly.
          </p>

          <button
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Upload Your .als File
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How can this help you?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case 1 - Musical Analysis */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Musical Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get tempo, time signature, and musical key information instantly. Perfect for
                collaboration, archiving, and project documentation.
              </p>
            </div>

            {/* Use Case 2 - Song Structure */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Song Structure
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze arrangement markers and section lengths. See your song's structure
                with durations (e.g., "Intro: 4 bars", "Verse: 16 bars").
              </p>
            </div>

            {/* Use Case 3 - Track Organization */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎛️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Track Organization
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See all your tracks organized by type (Audio, MIDI, Return, Master).
                Perfect for understanding project complexity and structure.
              </p>
            </div>

            {/* Use Case 4 - Sample Management */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
                <Disc className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Sample Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                List all samples and identify Splice packs used. Great for organizing
                your sample library and tracking pack usage.
              </p>
            </div>

            {/* Use Case 5 - Project Documentation */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Project Documentation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate comprehensive project reports for clients, collaborators, or
                your own reference. Export as JSON for further analysis.
              </p>
            </div>

            {/* Use Case 6 - Quick Overview */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Quick Overview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get a complete project summary without opening Ableton. Perfect for
                quickly understanding any .als file's contents and structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="px-4 py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            ✅ Compatible with Ableton Live 11 & 12
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
                Live 11 Projects
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Fully tested and compatible with all Live 11 features including tempo automation,
                scale detection, and arrangement markers.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-4">🎶</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-900 dark:text-purple-100">
                Live 12 Projects
              </h3>
              <p className="text-purple-700 dark:text-purple-300">
                Complete support for the latest Live 12 features with enhanced extraction
                capabilities and improved accuracy.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              <strong>Automatic version detection</strong> - The tool automatically detects and handles
              differences between Live versions, ensuring accurate extraction regardless of when
              your project was created.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadRef} className="px-4 py-16" id="upload">
        <div className="max-w-6xl mx-auto">
          <FileUploader
            onResult={newResult => {
              setResult(newResult);
            }}
            onSuccess={scrollToResults}
            onOptionsChange={handleOptionsChange}
          />
        </div>
      </section>

      {/* Results Section */}
      {result && result.success && (
        <section ref={resultsRef} className="px-4 py-16">
          <ResultsDisplay result={result} options={{ showAllSamples }} />
        </section>
      )}

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Built with ❤️ by{' '}
                <a
                  href="https://github.com/owenbush"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Owen Bush
                </a>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Your files never leave your browser • 100% private
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/owenbush/ableton-inspector"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>

              <a
                href="https://www.npmjs.com/package/@owenbush/ableton-inspector"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
              >
                <Terminal className="w-4 h-4" />
                CLI Tool
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
