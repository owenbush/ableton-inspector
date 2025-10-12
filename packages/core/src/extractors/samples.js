/**
 * Sample extractor for Ableton Live Set files.
 * Extracts audio sample information with Splice detection support.
 */
import { DEFAULT_SPLICE_PATTERNS } from '../constants/scales.js';
import { findAllElements } from '../utils/xml-parser.js';
/**
 * Extract sample information from parsed XML.
 *
 * @param xmlRoot - Parsed XML root object
 * @param options - Options for sample extraction (custom paths, filters)
 * @returns Sample information including counts and sample details
 */
export function extractSamples(xmlRoot, options = {}) {
    // Find all FileRef elements (these contain sample paths)
    const fileRefs = findAllElements(xmlRoot, 'FileRef');
    if (fileRefs.length === 0) {
        return {
            totalSamples: 0,
            spliceSamples: 0,
            samples: [],
            searchedPaths: options.splicePaths,
        };
    }
    // Parse each FileRef into a Sample object
    const samples = fileRefs
        .map(ref => parseSample(ref, options.splicePaths))
        .filter((s) => s !== null);
    // Deduplicate by full path
    const uniqueSamples = deduplicateSamples(samples);
    // Filter to Splice-only if requested
    const filteredSamples = options.spliceOnly
        ? uniqueSamples.filter(s => s.isSplice)
        : uniqueSamples;
    const spliceSamples = uniqueSamples.filter(s => s.isSplice);
    return {
        totalSamples: filteredSamples.length,
        spliceSamples: spliceSamples.length,
        samples: filteredSamples,
        searchedPaths: options.splicePaths,
    };
}
/**
 * Parse a single FileRef element into a Sample object.
 *
 * @param fileRef - The FileRef element from XML
 * @param customSplicePaths - Optional custom Splice paths to check
 * @returns Parsed Sample object or null if invalid
 */
function parseSample(fileRef, customSplicePaths) {
    const fullPath = fileRef.Path?.['@_Value'];
    const relativePath = fileRef.RelativePath?.['@_Value'] || '';
    const originalFileSize = fileRef.OriginalFileSize?.['@_Value'];
    if (!fullPath) {
        return null;
    }
    // Filter out non-audio files (devices, effects, presets, etc.)
    if (!isAudioSample(fullPath, originalFileSize)) {
        return null;
    }
    // Check if this is a Splice sample
    const isSplice = isSpliceSample(fullPath, customSplicePaths);
    return {
        filename: getFilename(fullPath),
        fullPath,
        relativePath,
        isSplice,
        packName: isSplice ? extractPackName(fullPath) : undefined,
    };
}
/**
 * Check if a FileRef is an actual audio sample (not a device, effect, or preset).
 *
 * @param path - The full path to check
 * @param originalFileSize - The original file size from XML
 * @returns True if this is likely an audio sample
 */
function isAudioSample(path, originalFileSize) {
    // Common audio file extensions
    const audioExtensions = ['.wav', '.aif', '.aiff', '.mp3', '.flac', '.ogg', '.m4a', '.aac'];
    const lowerPath = path.toLowerCase();
    // Check if it has an audio file extension
    const hasAudioExtension = audioExtensions.some(ext => lowerPath.endsWith(ext));
    // Exclude Ableton device/effect/preset paths
    const isDevicePath = lowerPath.includes('/devices/') || lowerPath.includes('\\devices\\');
    // Exclude device-specific file types
    const isDeviceFile = lowerPath.endsWith('.adv') ||
        lowerPath.endsWith('.adg') ||
        lowerPath.endsWith('.amxd') ||
        lowerPath.endsWith('.als');
    // Exclude Ableton built-in instruments/effects without extensions
    const isBuiltInDevice = !hasAudioExtension && (path === 'Tuner' || path === 'External Instrument' || isDevicePath);
    // Audio samples should have:
    // 1. An audio file extension OR non-zero file size
    // 2. Not be a device/effect path
    // 3. Not be a device preset file
    const hasValidExtension = hasAudioExtension && !isDeviceFile;
    const hasNonZeroSize = originalFileSize ? Number(originalFileSize) > 0 : false;
    return ((hasValidExtension || hasNonZeroSize) && !isDevicePath && !isBuiltInDevice && !isDeviceFile);
}
/**
 * Check if a sample path is from Splice.
 *
 * @param path - The full path to check
 * @param customPaths - Optional custom Splice paths
 * @returns True if the path is from Splice
 */
function isSpliceSample(path, customPaths) {
    // Normalize path for comparison (handle both / and \)
    const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
    // Check custom paths first if provided
    if (customPaths && customPaths.length > 0) {
        return customPaths.some(splicePath => {
            const normalizedSplicePath = splicePath.replace(/\\/g, '/').toLowerCase();
            return normalizedPath.includes(normalizedSplicePath);
        });
    }
    // Fall back to default patterns
    return DEFAULT_SPLICE_PATTERNS.some(pattern => {
        const normalizedPattern = pattern.replace(/\\/g, '/').toLowerCase();
        return normalizedPath.includes(normalizedPattern);
    });
}
/**
 * Extract the pack name from a Splice sample path.
 * Splice samples are typically structured like:
 * .../Splice/sounds/packs/PACK_NAME/category/file.wav
 *
 * @param path - The full sample path
 * @returns The pack name or undefined if not extractable
 */
function extractPackName(path) {
    const match = path.match(/packs[/\\]([^/\\]+)[/\\]/i);
    return match ? match[1] : undefined;
}
/**
 * Extract just the filename from a full path.
 *
 * @param path - The full path
 * @returns Just the filename
 */
function getFilename(path) {
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || path;
}
/**
 * Deduplicate samples by full path.
 * Same sample can appear multiple times in different clips/tracks.
 *
 * @param samples - Array of samples
 * @returns Deduplicated array of samples
 */
function deduplicateSamples(samples) {
    const seen = new Map();
    for (const sample of samples) {
        if (!seen.has(sample.fullPath)) {
            seen.set(sample.fullPath, sample);
        }
    }
    return Array.from(seen.values());
}
//# sourceMappingURL=samples.js.map