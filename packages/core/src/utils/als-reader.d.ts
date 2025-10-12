/**
 * Utility for reading and decompressing Ableton Live Set (.als) files.
 * .als files are gzipped XML files.
 */
/**
 * Read an .als file and return its decompressed XML content.
 * Also supports reading already decompressed .xml files.
 *
 * @param filePath - Path to the .als or .xml file
 * @returns Promise resolving to the XML content as a string
 */
export declare function readAlsFile(filePath: string): Promise<string>;
/**
 * Synchronous version of readAlsFile for Buffer input.
 * Useful for web applications where file is already in memory.
 *
 * @param buffer - Buffer containing the .als file content
 * @returns The decompressed XML content as a string
 */
export declare function readAlsBuffer(buffer: Buffer): string;
//# sourceMappingURL=als-reader.d.ts.map