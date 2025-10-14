import { getNestedValue } from '../utils/xml-parser.js';

export interface TimeSignatureChange {
  time: number;
  numerator: number;
  denominator: number;
}

export interface TimeSignatureData {
  initialTimeSignature: {
    numerator: number;
    denominator: number;
  };
  changes: TimeSignatureChange[];
  hasChanges: boolean;
}

export function extractTimeSignature(xmlRoot: any): TimeSignatureData {
  const changes: TimeSignatureChange[] = [];

  // Find all TimeSignature sections in the XML
  const timeSignatureSections = getNestedValue(xmlRoot, 'Ableton.LiveSet.Tracks');

  if (!timeSignatureSections) {
    return {
      initialTimeSignature: { numerator: 4, denominator: 4 },
      changes: [],
      hasChanges: false,
    };
  }

  // Search through all tracks for time signature information
  const searchForTimeSignatures = (obj: any, path: string = '') => {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => searchForTimeSignatures(item, `${path}[${index}]`));
    } else {
      // Check if this object has TimeSignature
      if (obj.TimeSignature) {
        const timeSignature = obj.TimeSignature;
        const timeSignatures = timeSignature.TimeSignatures;

        if (timeSignatures) {
          const signatureArray = Array.isArray(timeSignatures) ? timeSignatures : [timeSignatures];

          for (const sig of signatureArray) {
            if (sig && sig.Numerator && sig.Denominator) {
              const time = Number(sig.Time?.['@_Value'] || 0);
              const numerator = Number(sig.Numerator?.['@_Value'] || 4);
              const denominator = Number(sig.Denominator?.['@_Value'] || 4);

              // Only add if it's different from 4/4 or at a non-zero time
              if (numerator !== 4 || denominator !== 4 || time > 0) {
                changes.push({
                  time,
                  numerator,
                  denominator,
                });
              }
            }
          }
        }
      }

      // Recursively search nested objects
      Object.keys(obj).forEach(key => {
        if (key !== 'TimeSignature' && typeof obj[key] === 'object') {
          searchForTimeSignatures(obj[key], `${path}.${key}`);
        }
      });
    }
  };

  searchForTimeSignatures(timeSignatureSections);

  // Remove duplicates and sort by time
  const uniqueChanges = changes
    .filter(
      (change, index, self) =>
        index ===
        self.findIndex(
          c =>
            c.time === change.time &&
            c.numerator === change.numerator &&
            c.denominator === change.denominator
        )
    )
    .sort((a, b) => a.time - b.time);

  // Get initial time signature (first one or default to 4/4)
  const initialTimeSignature =
    uniqueChanges.length > 0 && uniqueChanges[0].time === 0
      ? { numerator: uniqueChanges[0].numerator, denominator: uniqueChanges[0].denominator }
      : { numerator: 4, denominator: 4 };

  return {
    initialTimeSignature,
    changes: uniqueChanges,
    hasChanges: uniqueChanges.length > 0,
  };
}
