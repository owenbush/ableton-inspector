import { getNestedValue } from '../utils/xml-parser.js';

export interface Locator {
  id: number;
  time: number;
  name: string;
  annotation: string;
  isSongStart: boolean;
  duration?: number; // Duration in bars to the next locator
  durationText?: string; // Human-readable duration (e.g., "4 bars")
}

export interface LocatorsData {
  locators: Locator[];
  totalLocators: number;
}

export function extractLocators(xmlRoot: any): LocatorsData {
  const locators: Locator[] = [];

  // Find the Locators section
  const locatorsSection = getNestedValue(xmlRoot, 'Ableton.LiveSet.Locators.Locators');

  if (!locatorsSection) {
    return {
      locators: [],
      totalLocators: 0,
    };
  }

  // The locators are in a Locator array
  const locatorArray = locatorsSection.Locator;
  if (!locatorArray) {
    return {
      locators: [],
      totalLocators: 0,
    };
  }

  const locatorList = Array.isArray(locatorArray) ? locatorArray : [locatorArray];

  for (const locator of locatorList) {
    if (locator && typeof locator === 'object') {
      const id = locator['@_Id'];
      const time = locator.Time?.['@_Value'];
      const name = locator.Name?.['@_Value'];
      const annotation = locator.Annotation?.['@_Value'];
      const isSongStart = locator.IsSongStart?.['@_Value'];

      if (id !== undefined && time !== undefined && name !== undefined) {
        locators.push({
          id: Number(id),
          time: Number(time),
          name: String(name),
          annotation: String(annotation || ''),
          isSongStart: Boolean(isSongStart),
        });
      }
    }
  }

  // Sort by time
  locators.sort((a, b) => a.time - b.time);

  // Calculate durations between consecutive locators
  for (let i = 0; i < locators.length; i++) {
    const currentLocator = locators[i];
    const nextLocator = locators[i + 1];

    if (nextLocator) {
      // Calculate duration to next locator
      const duration = nextLocator.time - currentLocator.time;
      currentLocator.duration = duration;
      currentLocator.durationText = formatDuration(duration);
    }
    // Last locator doesn't have a duration (no next locator)
  }

  return {
    locators,
    totalLocators: locators.length,
  };
}

function formatDuration(duration: number): string {
  const bars = Math.floor(duration / 4);
  const beats = Math.round((duration % 4) * 100) / 100; // Round to 2 decimal places

  if (beats === 0) {
    return `${bars} bar${bars !== 1 ? 's' : ''}`;
  } else {
    return `${bars}.${beats} bars`;
  }
}
