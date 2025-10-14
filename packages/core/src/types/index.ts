/**
 * Type definitions for Ableton Inspector.
 */

export interface AbletonProject {
  file: string;
  tempo?: TempoInfo;
  scale?: ScaleInfo;
  samples?: SampleInfo;
  locators?: LocatorsData;
  timeSignature?: TimeSignatureData;
  trackTypes?: TrackTypesData;
}

export interface TempoInfo {
  initialTempo: number;
  tempoChanges: TempoChange[];
}

export interface TempoChange {
  time: number;
  bpm: number;
}

export interface ScaleInfo {
  uniqueScales: Scale[];
  distribution: Record<string, number>;
}

export interface Scale {
  root: string;
  scale: string;
  rootValue: number;
  scaleValue: number;
}

export interface SampleInfo {
  totalSamples: number;
  spliceSamples: number;
  samples: Sample[];
  searchedPaths?: string[];
}

export interface Sample {
  filename: string;
  fullPath: string;
  relativePath: string;
  isSplice: boolean;
  packName?: string;
}

export interface SampleOptions {
  splicePaths?: string[];
  spliceOnly?: boolean;
}

// New data types for additional extractors
export interface LocatorsData {
  locators: Locator[];
  totalLocators: number;
}

export interface Locator {
  id: number;
  time: number;
  name: string;
  annotation: string;
  isSongStart: boolean;
  duration?: number; // Duration in bars to the next locator
  durationText?: string; // Human-readable duration (e.g., "4 bars")
}

export interface TimeSignatureData {
  initialTimeSignature: {
    numerator: number;
    denominator: number;
  };
  changes: TimeSignatureChange[];
  hasChanges: boolean;
}

export interface TimeSignatureChange {
  time: number;
  numerator: number;
  denominator: number;
}

export interface TrackTypesData {
  tracks: Track[];
  summary: {
    audio: number;
    midi: number;
    return: number;
    master: number;
    total: number;
  };
}

export interface Track {
  id: number;
  type: 'audio' | 'midi' | 'return' | 'master';
  name: string;
  userDefinedName: string;
  color: number;
  annotation: string;
}
