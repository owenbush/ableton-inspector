# @owenbush/ableton-inspector-core

Core library for extracting comprehensive information from Ableton Live Set (.als) files including tempo, time signature, musical key, samples, song structure, and track organization.

## Installation

```bash
npm install @owenbush/ableton-inspector-core
```

## Usage

```typescript
import { Inspector } from '@owenbush/ableton-inspector-core';

// Load from file
const inspector = await Inspector.fromFile('project.als');

// Extract all information
const data = inspector.extractAll();

console.log(`Tempo: ${data.tempo.initialTempo} BPM`);
console.log(`Time Signature: ${data.timeSignature.initialTimeSignature.numerator}/${data.timeSignature.initialTimeSignature.denominator}`);
console.log(`Key: ${data.scale.uniqueScales[0].root} ${data.scale.uniqueScales[0].scale}`);
console.log(`Total Samples: ${data.samples.totalSamples}`);
console.log(`Splice Samples: ${data.samples.spliceSamples}`);
console.log(`Locators: ${data.locators.totalLocators}`);
console.log(`Tracks: ${data.trackTypes.summary.audio} audio, ${data.trackTypes.summary.midi} MIDI`);
```

## Extract Specific Information

```typescript
// Only tempo
const tempo = inspector.extractTempo();
console.log(`BPM: ${tempo.initialTempo}`);

// Only time signature
const timeSignature = inspector.extractTimeSignature();
console.log(`Time Signature: ${timeSignature.initialTimeSignature.numerator}/${timeSignature.initialTimeSignature.denominator}`);

// Only scale
const scale = inspector.extractScale();
console.log(`Key: ${scale.uniqueScales[0].root} ${scale.uniqueScales[0].scale}`);

// Only locators (song structure)
const locators = inspector.extractLocators();
console.log(`Locators: ${locators.totalLocators}`);
locators.locators.forEach(locator => {
  console.log(`${locator.name}: ${locator.durationText || 'end'}`);
});

// Only track types
const trackTypes = inspector.extractTrackTypes();
console.log(`Audio: ${trackTypes.summary.audio}, MIDI: ${trackTypes.summary.midi}`);

// Only samples
const samples = inspector.extractSamples({
  splicePaths: ['/path/to/splice'],
  spliceOnly: false,
});
console.log(`Total: ${samples.totalSamples}`);
```

## API Reference

### `Inspector`

#### `static async fromFile(filePath: string): Promise<Inspector>`

Create an Inspector from a file path.

```typescript
const inspector = await Inspector.fromFile('project.als');
```

#### `static fromBuffer(buffer: Buffer): Inspector`

Create an Inspector from a Buffer (useful for web uploads).

```typescript
const inspector = Inspector.fromBuffer(buffer);
```

#### `extractAll(sampleOptions?: SampleOptions): AbletonProject`

Extract all information (tempo, scale, samples).

```typescript
const data = inspector.extractAll({
  splicePaths: ['/custom/splice/path'],
  spliceOnly: false,
});
```

#### `extractTempo(): TempoInfo`

Extract only tempo information.

#### `extractScale(): ScaleInfo`

Extract only scale information.

#### `extractSamples(options?: SampleOptions): SampleInfo`

Extract only sample information.

## Type Definitions

```typescript
interface AbletonProject {
  file: string;
  tempo?: TempoInfo;
  scale?: ScaleInfo;
  samples?: SampleInfo;
}

interface TempoInfo {
  initialTempo: number;
  tempoChanges: TempoChange[];
}

interface TempoChange {
  time: number;
  bpm: number;
}

interface ScaleInfo {
  uniqueScales: Scale[];
  distribution: Record<string, number>;
}

interface Scale {
  root: string;
  scale: string;
  rootValue: number;
  scaleValue: number;
}

interface SampleInfo {
  totalSamples: number;
  spliceSamples: number;
  samples: Sample[];
  searchedPaths?: string[];
}

interface Sample {
  filename: string;
  fullPath: string;
  relativePath: string;
  isSplice: boolean;
  packName?: string;
}

interface SampleOptions {
  splicePaths?: string[];
  spliceOnly?: boolean;
}
```

## Low-Level Functions

You can also use individual extraction functions:

```typescript
import {
  readAlsFile,
  parseXml,
  extractTempo,
  extractScale,
  extractSamples,
} from '@owenbush/ableton-inspector-core';

const xmlContent = await readAlsFile('project.als');
const xmlRoot = parseXml(xmlContent);

const tempo = extractTempo(xmlRoot);
const scale = extractScale(xmlRoot);
const samples = extractSamples(xmlRoot, { spliceOnly: false });
```

## Constants

```typescript
import { NOTE_NAMES, SCALE_NAMES } from '@owenbush/ableton-inspector-core';

// NOTE_NAMES: ["C", "C#/Db", "D", "D#/Eb", ...]
// SCALE_NAMES: ["Major", "Minor", "Dorian", ...]
```

## Requirements

- Node.js >= 20

## License

MIT © Owen Bush
