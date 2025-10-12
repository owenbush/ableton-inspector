/**
 * Utility for reading and decompressing Ableton Live Set (.als) files.
 * .als files are gzipped XML files.
 */
import { gunzip, gunzipSync } from 'zlib';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
const gunzipAsync = promisify(gunzip);
/**
 * Read an .als file and return its decompressed XML content.
 * Also supports reading already decompressed .xml files.
 *
 * @param filePath - Path to the .als or .xml file
 * @returns Promise resolving to the XML content as a string
 */
export async function readAlsFile(filePath) {
    const buffer = await readFile(filePath);
    // If it's an .als file, decompress it
    if (filePath.endsWith('.als')) {
        try {
            const decompressed = await gunzipAsync(buffer);
            return decompressed.toString('utf-8');
        }
        catch (error) {
            throw new Error(`Failed to decompress .als file. It may be corrupted or not a valid Ableton Live Set file. ${error}`);
        }
    }
    // Already XML, return as-is
    return buffer.toString('utf-8');
}
/**
 * Synchronous version of readAlsFile for Buffer input.
 * Useful for web applications where file is already in memory.
 *
 * @param buffer - Buffer containing the .als file content
 * @returns The decompressed XML content as a string
 */
export function readAlsBuffer(buffer) {
    try {
        const decompressed = gunzipSync(buffer);
        return decompressed.toString('utf-8');
    }
    catch (error) {
        throw new Error(`Failed to decompress .als buffer. It may be corrupted or not a valid Ableton Live Set file. ${error}`);
    }
}
//# sourceMappingURL=als-reader.js.map