/**
 * Browser entry point for Ableton Inspector Core Library
 *
 * This version uses browser-compatible APIs (pako instead of zlib)
 * and is designed to be bundled for web applications.
 */

// Export types
export * from './types/index.js';

// Export constants
export * from './constants/scales.js';

// Export utilities (browser-compatible version)
export { readAlsBuffer } from './utils/als-reader.browser.js';
export { parseXml, findAllElements, getNestedValue } from './utils/xml-parser.js';

// Export extractors
export { extractTempo } from './extractors/tempo.js';
export { extractScale } from './extractors/scale.js';
export { extractSamples } from './extractors/samples.js';

// Inspector class for browser
import { readAlsBuffer } from './utils/als-reader.browser.js';
import { parseXml } from './utils/xml-parser.js';
import { extractTempo } from './extractors/tempo.js';
import { extractScale } from './extractors/scale.js';
import { extractSamples } from './extractors/samples.js';
import type { AbletonProject, SampleOptions } from './types/index.js';

/**
 * Main Inspector class for convenient usage in the browser.
 * Provides a high-level API for extracting information from .als files.
 */
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
   * Create an Inspector from a File object or ArrayBuffer (browser environment).
   *
   * @param fileOrBuffer - File object or ArrayBuffer containing the .als file
   * @returns Promise resolving to Inspector instance
   */
  static async fromFile(fileOrBuffer: File | ArrayBuffer): Promise<Inspector> {
    let buffer: ArrayBuffer;

    if (fileOrBuffer instanceof File) {
      buffer = await fileOrBuffer.arrayBuffer();
    } else {
      buffer = fileOrBuffer;
    }

    const xmlContent = readAlsBuffer(buffer);
    return new Inspector(xmlContent);
  }

  /**
   * Create an Inspector from a Buffer or Uint8Array.
   *
   * @param buffer - Buffer or Uint8Array containing the .als file
   * @returns Inspector instance
   */
  static fromBuffer(buffer: Uint8Array | ArrayBuffer): Inspector {
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
      file: 'unknown', // Will be set by application
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
}

