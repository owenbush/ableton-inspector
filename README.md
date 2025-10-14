# Ableton Inspector

Extract comprehensive information from Ableton Live Set (.als) files including tempo, time signature, musical key, samples, song structure, and track organization.

[![npm version](https://img.shields.io/npm/v/@owenbush/ableton-inspector.svg)](https://www.npmjs.com/package/@owenbush/ableton-inspector)
[![CI](https://github.com/owenbush/ableton-inspector/workflows/CI/badge.svg)](https://github.com/owenbush/ableton-inspector/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Try It Online

Visit the **[web app](https://ableton-inspector.online)** to analyze your .als files directly in your browser - no installation required! Your files are processed locally and never leave your device.

> **Note**: The web app is deployed automatically when a new release is published. For the latest development version, use the CLI tool.

### 🎨 Rich Social Media Sharing

The web app includes optimized Open Graph and Twitter Card metadata for beautiful social media previews when sharing links. Perfect for showcasing your Ableton projects on social platforms!

## Features

- 🎵 **Tempo Extraction** - Get BPM and tempo automation changes
- 🎼 **Time Signature** - Extract time signature information and changes
- 🎹 **Scale Detection** - Extract key and scale information
- 🔊 **Sample Analysis** - List all samples with Splice detection
- 📍 **Song Structure** - Analyze arrangement markers with section durations
- 🎛️ **Track Organization** - See all tracks by type (Audio, MIDI, Return, Master)
- 🎨 **Pretty Output** - Beautiful colored terminal output
- 📦 **JSON Export** - Export data in JSON format
- 🔧 **Custom Splice Paths** - Support for custom Splice folder locations
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux

## Quick Start

### Using npx (no installation required)

```bash
npx @owenbush/ableton-inspector "My Project.als"
```

### Install globally

```bash
npm install -g @owenbush/ableton-inspector
ableton-inspector "My Project.als"
```

## Usage Examples

### Extract all information

```bash
ableton-inspector "My Project.als"
```

Output:

```
📁 My Project.als
============================================================

🎵 TEMPO
  Initial Tempo: 88 BPM
  No tempo automation

🎼 TIME SIGNATURE
  Initial: 4/4
  No time signature changes

🎹 SCALE
  Key: B Minor

🔊 SAMPLES
  Total Samples: 285
  Splice Samples: 175

  Splice Sample List:
    • sample1.wav (Pack Name)
    • sample2.wav (Pack Name)
    ...

📍 LOCATORS
  Total Locators: 5

  Arrangement Markers:
    0:0 - Intro (4 bars)
    4:0 - Verse (16 bars)
    20:0 - Chorus (8 bars)
    28:0 - Bridge (8 bars)
    36:0 - Outro

🎛️ TRACKS
  Audio: 8
  MIDI: 4
  Return: 2
  Master: 1
  Total: 15

  Track List:
    🎵 Lead Vocal (audio)
    🎵 Bass (audio)
    🎹 Piano (midi)
    🔄 Reverb (return)
    🎚️ Master (master)
    ...
```

### Extract specific information

```bash
# Only tempo
ableton-inspector "project.als" --tempo

# Only scale
ableton-inspector "project.als" --scale

# Song structure with locators
ableton-inspector "project.als" --locators

# Track organization
ableton-inspector "project.als" --track-types

# Time signature
ableton-inspector "project.als" --time-signature

# Multiple options
ableton-inspector "project.als" --tempo --locators --track-types
```

### JSON output

```bash
# Print JSON to console
ableton-inspector "project.als" --json

# Save to file
ableton-inspector "project.als" --json --output results.json
```

### Sample extraction with custom Splice path

```bash
# Single custom path
ableton-inspector "project.als" --samples \
  --splice-path "/Volumes/External/Splice/sounds/packs"

# Multiple paths
ableton-inspector "project.als" --samples \
  --splice-paths "/path1/Splice,/path2/Splice,/path3/Splice"

# Show only Splice samples (default behavior)
ableton-inspector "project.als" --samples

# Show all samples (both Splice and non-Splice)
ableton-inspector "project.als" --samples --show-all-samples
```

### Sample Display Options

The `--samples` option has two display modes:

- **Default** (no flags): Shows only Splice samples with pack names
- **`--show-all-samples`**: Show all samples with markers (● for Splice, ○ for others)

## Configuration File

Create `.abletoninspectorrc.json` in your project directory or home folder:

```json
{
  "samplePaths": {
    "splice": [
      "/Volumes/Music SSD/Music/Plugins/Splice/sounds/packs",
      "C:\\Users\\YourName\\Documents\\Splice\\sounds\\packs"
    ]
  },
  "output": {
    "format": "text",
    "colorize": true
  }
}
```

The tool will automatically find and use this configuration.

## CLI Options

```
Usage: ableton-inspector <file.als> [options]

Arguments:
  file                    .als file to inspect

Options:
  -V, --version           Output version number
  -h, --help              Display help

What to extract:
  --tempo                 Extract tempo information
  --time-signature        Extract time signature information
  --scale                 Extract scale information
  --samples               Extract sample information
  --locators              Extract arrangement markers (locators)
  --track-types           Extract track types and information
  --all                   Extract everything (default)

Sample options:
  --splice-only           Only show Splice samples
  --show-all-samples      Show complete list of all samples in output
  --splice-path <path>    Custom Splice folder location
  --splice-paths <paths>  Multiple paths (comma-separated)
  --config <file>         Load configuration from file

Output options:
  --json                  Output as JSON
  -o, --output <file>     Write output to file
  --no-color              Disable colored output
  --verbose               Verbose output
  --quiet                 Minimal output
```

## Packages

This is a monorepo containing:

- **[@owenbush/ableton-inspector](./packages/cli)** - CLI tool (this package)
- **[@owenbush/ableton-inspector-core](./packages/core)** - Core extraction library

## Programmatic Usage

If you want to use the core library in your own Node.js application:

```typescript
import { Inspector } from '@owenbush/ableton-inspector-core';

// From file
const inspector = await Inspector.fromFile('project.als');
const data = inspector.extractAll();

console.log(`Tempo: ${data.tempo.initialTempo} BPM`);
console.log(`Time Signature: ${data.timeSignature.initialTimeSignature.numerator}/${data.timeSignature.initialTimeSignature.denominator}`);
console.log(`Key: ${data.scale.uniqueScales[0].root} ${data.scale.uniqueScales[0].scale}`);
console.log(`Samples: ${data.samples.totalSamples}`);
console.log(`Locators: ${data.locators.totalLocators}`);
console.log(`Tracks: ${data.trackTypes.summary.audio} audio, ${data.trackTypes.summary.midi} MIDI`);
```

See the [core package README](./packages/core/README.md) for more details.

## How It Works

Ableton Live Set files (.als) are gzipped XML files. Ableton Inspector:

1. Decompresses the .als file to extract the XML
2. Parses the XML structure
3. Extracts specific information:
   - **Tempo**: From `MainTrack > AutomationEnvelopes` (tempo envelope with PointeeId=8)
   - **Time Signature**: From `TimeSignature` elements and `RemoteableTimeSignature` data
   - **Scale**: From `ScaleInformation` elements throughout the project
   - **Samples**: From `FileRef` elements with `Path` attributes
   - **Locators**: From `Locators > Locator` elements with time and name data
   - **Track Types**: From `AudioTrack`, `MidiTrack`, `ReturnTrack`, and `PreHearTrack` elements
4. Detects Splice samples by matching path patterns
5. Calculates section durations between consecutive locators
6. Formats and outputs the results

## Requirements

- Node.js >= 20

## Development

This project is a monorepo containing three packages:

- **[@owenbush/ableton-inspector-core](./packages/core/)** - Core extraction library (Node.js + Browser)
- **[@owenbush/ableton-inspector](./packages/cli/)** - Command-line tool
- **[@owenbush/ableton-inspector-web](./packages/web/)** - Web application

### Setup

```bash
# Clone the repository
git clone https://github.com/owenbush/ableton-inspector.git
cd ableton-inspector

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Run CLI in dev mode
npm run dev --workspace=@owenbush/ableton-inspector

# Run web app in dev mode
npm run dev --workspace=@owenbush/ableton-inspector-web
```

### Project Structure

```
ableton-inspector/
├── packages/
│   ├── core/        # Shared extraction logic
│   ├── cli/         # Command-line interface
│   └── web/         # Web application
├── .github/
│   └── workflows/   # CI/CD pipelines
└── examples/        # Configuration examples
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Owen Bush](https://github.com/owenbush)

## Author

**Owen Bush**

- Email: owen@obush.co.uk
- GitHub: [@owenbush](https://github.com/owenbush)

## Acknowledgments

- Built with TypeScript and Commander.js (CLI)
- React, Vite, and Tailwind CSS (Web)
- XML parsing by fast-xml-parser
- Beautiful terminal output with Chalk and Ora
- Browser decompression with pako

## Related Projects

- [Ableton Live](https://www.ableton.com/) - The amazing DAW this tool is built for
- [Splice](https://splice.com/) - Sample marketplace and sound library

## Roadmap

- [x] Web interface
- [x] Browser-based processing
- [ ] Batch processing of multiple files
- [ ] Track information extraction
- [ ] MIDI clip analysis
- [ ] Plugin list extraction
- [ ] Project comparison tool

---

**Made with ❤️ for the Ableton community**
