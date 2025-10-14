/**
 * Ableton Inspector Core Library
 *
 * Extract tempo, scale, and sample information from Ableton Live Set files.
 *
 * @packageDocumentation
 */

// Export types
export * from './types/index.js';

// Export constants
export * from './constants/scales.js';

// Export utilities
export { readAlsFile, readAlsBuffer } from './utils/als-reader.js';
export { parseXml, findAllElements, getNestedValue } from './utils/xml-parser.js';

// Export extractors
export { extractTempo } from './extractors/tempo.js';
export { extractScale } from './extractors/scale.js';
export { extractSamples } from './extractors/samples.js';
export { extractLocators } from './extractors/locators.js';
export { extractTimeSignature } from './extractors/time-signature.js';
export { extractTrackTypes } from './extractors/track-types.js';

/**
 * Main Inspector class for convenient usage.
 * Provides a high-level API for extracting information from .als files.
 */
import { readAlsFile, readAlsBuffer } from './utils/als-reader.js';
import { parseXml } from './utils/xml-parser.js';
import { extractTempo } from './extractors/tempo.js';
import { extractScale } from './extractors/scale.js';
import { extractSamples } from './extractors/samples.js';
import { extractLocators } from './extractors/locators.js';
import { extractTimeSignature } from './extractors/time-signature.js';
import { extractTrackTypes } from './extractors/track-types.js';
import type { AbletonProject, SampleOptions } from './types/index.js';

export class Inspector {
  private xmlRoot: any;

  /**
   * Create an Inspector instance from XML content.
   *
   * @param xmlContent - The XML content string
   */
  constructor(xmlContent: string) {
    this.xmlRoot = parseXml(xmlContent);
  }

  /**
   * Create an Inspector from a file path.
   *
   * @param filePath - Path to the .als file
   * @returns Promise resolving to Inspector instance
   */
  static async fromFile(filePath: string): Promise<Inspector> {
    const xmlContent = await readAlsFile(filePath);
    return new Inspector(xmlContent);
  }

  /**
   * Create an Inspector from a Buffer (for web uploads).
   *
   * @param buffer - Buffer containing the .als file
   * @returns Inspector instance
   */
  static fromBuffer(buffer: Buffer): Inspector {
    const xmlContent = readAlsBuffer(buffer);
    return new Inspector(xmlContent);
  }

  /**
   * Extract all information (tempo, scale, samples).
   *
   * @param sampleOptions - Options for sample extraction
   * @returns Complete project information
   */
  extractAll(sampleOptions?: SampleOptions): AbletonProject {
    return {
      file: 'unknown', // Will be set by CLI
      tempo: this.extractTempo(),
      scale: this.extractScale(),
      samples: this.extractSamples(sampleOptions),
    };
  }

  /**
   * Extract only tempo information.
   */
  extractTempo() {
    return extractTempo(this.xmlRoot);
  }

  /**
   * Extract only scale information.
   */
  extractScale() {
    return extractScale(this.xmlRoot);
  }

  /**
   * Extract only sample information.
   *
   * @param options - Options for sample extraction
   */
  extractSamples(options?: SampleOptions) {
    return extractSamples(this.xmlRoot, options);
  }

  /**
   * Extract locators (arrangement markers).
   */
  extractLocators() {
    return extractLocators(this.xmlRoot);
  }

  /**
   * Extract time signature information.
   */
  extractTimeSignature() {
    return extractTimeSignature(this.xmlRoot);
  }

  /**
   * Extract track types and information.
   */
  extractTrackTypes() {
    return extractTrackTypes(this.xmlRoot);
  }

}
