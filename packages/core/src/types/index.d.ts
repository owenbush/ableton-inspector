/**
 * Type definitions for Ableton Inspector.
 */
export interface AbletonProject {
    file: string;
    tempo?: TempoInfo;
    scale?: ScaleInfo;
    samples?: SampleInfo;
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
//# sourceMappingURL=index.d.ts.map