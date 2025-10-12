/**
 * Ableton Inspector Core Library
 *
 * Extract tempo, scale, and sample information from Ableton Live Set files.
 *
 * @packageDocumentation
 */
export * from './types/index.js';
export * from './constants/scales.js';
export { readAlsFile, readAlsBuffer } from './utils/als-reader.js';
export { parseXml, findAllElements, getNestedValue } from './utils/xml-parser.js';
export { extractTempo } from './extractors/tempo.js';
export { extractScale } from './extractors/scale.js';
export { extractSamples } from './extractors/samples.js';
import type { AbletonProject, SampleOptions } from './types/index.js';
export declare class Inspector {
    private xmlRoot;
    /**
     * Create an Inspector instance from XML content.
     *
     * @param xmlContent - The XML content string
     */
    constructor(xmlContent: string);
    /**
     * Create an Inspector from a file path.
     *
     * @param filePath - Path to the .als file
     * @returns Promise resolving to Inspector instance
     */
    static fromFile(filePath: string): Promise<Inspector>;
    /**
     * Create an Inspector from a Buffer (for web uploads).
     *
     * @param buffer - Buffer containing the .als file
     * @returns Inspector instance
     */
    static fromBuffer(buffer: Buffer): Inspector;
    /**
     * Extract all information (tempo, scale, samples).
     *
     * @param sampleOptions - Options for sample extraction
     * @returns Complete project information
     */
    extractAll(sampleOptions?: SampleOptions): AbletonProject;
    /**
     * Extract only tempo information.
     */
    extractTempo(): import("./types/index.js").TempoInfo;
    /**
     * Extract only scale information.
     */
    extractScale(): import("./types/index.js").ScaleInfo;
    /**
     * Extract only sample information.
     *
     * @param options - Options for sample extraction
     */
    extractSamples(options?: SampleOptions): import("./types/index.js").SampleInfo;
}
//# sourceMappingURL=index.d.ts.map