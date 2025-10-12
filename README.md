# Ableton Inspector

Extract tempo, scale, and sample information from Ableton Live Set (.als) files.

[![npm version](https://img.shields.io/npm/v/@owenbush/ableton-inspector.svg)](https://www.npmjs.com/package/@owenbush/ableton-inspector)
[![CI](https://github.com/owenbush/ableton-inspector/workflows/CI/badge.svg)](https://github.com/owenbush/ableton-inspector/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎵 **Tempo Extraction** - Get BPM and tempo automation changes
- 🎹 **Scale Detection** - Extract key and scale information
- 🔊 **Sample Analysis** - List all samples with Splice detection
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

🎹 SCALE
  Key: B Minor

🔊 SAMPLES
  Total Samples: 285
  Splice Samples: 175

  Splice Sample List:
    • sample1.wav (Pack Name)
    • sample2.wav (Pack Name)
    ...
```

### Extract specific information

```bash
# Only tempo
ableton-inspector "project.als" --tempo

# Only scale
ableton-inspector "project.als" --scale

# Tempo and scale
ableton-inspector "project.als" --tempo --scale
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

# Only show Splice samples
ableton-inspector "project.als" --samples --splice-only

# Show complete list of all samples (both Splice and non-Splice)
ableton-inspector "project.als" --samples --show-all-samples
```

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
  --scale                 Extract scale information
  --samples               Extract sample information
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
console.log(`Key: ${data.scale.uniqueScales[0].root} ${data.scale.uniqueScales[0].scale}`);
console.log(`Samples: ${data.samples.totalSamples}`);
```

See the [core package README](./packages/core/README.md) for more details.

## How It Works

Ableton Live Set files (.als) are gzipped XML files. Ableton Inspector:

1. Decompresses the .als file to extract the XML
2. Parses the XML structure
3. Extracts specific information:
   - **Tempo**: From `MainTrack > AutomationEnvelopes` (tempo envelope with PointeeId=8)
   - **Scale**: From `ScaleInformation` elements throughout the project
   - **Samples**: From `FileRef` elements with `Path` attributes
4. Detects Splice samples by matching path patterns
5. Formats and outputs the results

## Requirements

- Node.js >= 20

## Development

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

- Built with TypeScript and Commander.js
- XML parsing by fast-xml-parser
- Beautiful terminal output with Chalk and Ora

## Related Projects

- [Ableton Live](https://www.ableton.com/) - The amazing DAW this tool is built for
- [Splice](https://splice.com/) - Sample marketplace and sound library

## Roadmap

- [ ] Batch processing of multiple files
- [ ] Track information extraction
- [ ] MIDI clip analysis
- [ ] Plugin list extraction
- [ ] Web interface
- [ ] Project comparison tool

---

**Made with ❤️ for the Ableton community**
