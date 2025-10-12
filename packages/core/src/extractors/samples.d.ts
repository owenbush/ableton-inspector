/**
 * Sample extractor for Ableton Live Set files.
 * Extracts audio sample information with Splice detection support.
 */
import { SampleInfo, SampleOptions } from '../types/index.js';
/**
 * Extract sample information from parsed XML.
 *
 * @param xmlRoot - Parsed XML root object
 * @param options - Options for sample extraction (custom paths, filters)
 * @returns Sample information including counts and sample details
 */
export declare function extractSamples(xmlRoot: any, options?: SampleOptions): SampleInfo;
//# sourceMappingURL=samples.d.ts.map