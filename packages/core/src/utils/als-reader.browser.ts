/**
 * Browser-compatible utility for reading and decompressing Ableton Live Set (.als) files.
 * Uses pako for gzip decompression instead of Node.js zlib.
 */

import pako from 'pako';

// Browser globals
declare const TextDecoder: {
  new (encoding?: string): {
    decode(input: Uint8Array): string;
  };
};

/**
 * Decompress an .als file buffer in the browser.
 *
 * @param buffer - Uint8Array or Buffer containing the .als file content
 * @returns The decompressed XML content as a string
 */
export function readAlsBuffer(buffer: Uint8Array | ArrayBuffer): string {
  try {
    // Convert ArrayBuffer to Uint8Array if needed
    const uint8Array = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;

    // Decompress using pako
    const decompressed = pako.ungzip(uint8Array);

    // Convert to string
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(decompressed);
  } catch (error) {
    throw new Error(
      `Failed to decompress .als file. It may be corrupted or not a valid Ableton Live Set file. ${error}`
    );
  }
}
