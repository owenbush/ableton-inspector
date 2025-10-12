/**
 * Scale extractor for Ableton Live Set files.
 * Extracts key and scale information.
 */

import { ScaleInfo, Scale } from '../types/index.js';
import { NOTE_NAMES, SCALE_NAMES } from '../constants/scales.js';
import { findAllElements } from '../utils/xml-parser.js';

/**
 * Extract scale information from parsed XML.
 *
 * @param xmlRoot - Parsed XML root object
 * @returns Scale information including unique scales and distribution
 */
export function extractScale(xmlRoot: any): ScaleInfo {
  // Find all ScaleInformation elements
  const scaleElements = findAllElements(xmlRoot, 'ScaleInformation');

  if (scaleElements.length === 0) {
    return {
      uniqueScales: [],
      distribution: {},
    };
  }

  // Parse each scale element
  const scales = scaleElements.map(parseScaleElement).filter((s): s is Scale => s !== null);

  // Get unique scales and distribution
  const uniqueScales = getUniqueScales(scales);
  const distribution = getScaleDistribution(scales);

  return {
    uniqueScales,
    distribution,
  };
}

/**
 * Parse a single ScaleInformation element.
 *
 * @param element - The ScaleInformation element
 * @returns Parsed Scale object or null if invalid
 */
function parseScaleElement(element: any): Scale | null {
  const rootValue = parseInt(element.Root?.['@_Value'] ?? '-1', 10);
  const scaleValue = parseInt(element.Name?.['@_Value'] ?? '-1', 10);

  if (rootValue < 0 || rootValue >= NOTE_NAMES.length) {
    return null;
  }

  if (scaleValue < 0 || scaleValue >= SCALE_NAMES.length) {
    return null;
  }

  return {
    root: NOTE_NAMES[rootValue],
    scale: SCALE_NAMES[scaleValue],
    rootValue,
    scaleValue,
  };
}

/**
 * Get unique scale configurations from the list.
 *
 * @param scales - Array of scale objects
 * @returns Array of unique scales
 */
function getUniqueScales(scales: Scale[]): Scale[] {
  const seen = new Set<string>();
  const unique: Scale[] = [];

  for (const scale of scales) {
    const key = `${scale.rootValue}-${scale.scaleValue}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(scale);
    }
  }

  return unique;
}

/**
 * Get the distribution (count) of each scale.
 *
 * @param scales - Array of scale objects
 * @returns Object mapping scale names to occurrence counts
 */
function getScaleDistribution(scales: Scale[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  for (const scale of scales) {
    const scaleName = `${scale.root} ${scale.scale}`;
    distribution[scaleName] = (distribution[scaleName] || 0) + 1;
  }

  return distribution;
}
