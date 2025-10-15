/**
 * Tempo extractor for Ableton Live Set files.
 * Extracts initial tempo and tempo automation changes.
 */

import { TempoInfo, TempoChange } from '../types/index.js';
import { getNestedValue } from '../utils/xml-parser.js';

/**
 * Extract tempo information from parsed XML.
 *
 * @param xmlRoot - Parsed XML root object
 * @returns Tempo information including initial tempo and changes
 */
export function extractTempo(xmlRoot: any): TempoInfo {
  // Navigate to MainTrack > AutomationEnvelopes
  // Try different paths for different Ableton versions
  let mainTrack = getNestedValue(xmlRoot, 'Ableton.LiveSet.MainTrack');

  // Fallback for older Ableton versions (Live 11 and earlier)
  if (!mainTrack) {
    mainTrack = getNestedValue(xmlRoot, 'Ableton.LiveSet.MasterTrack');
  }

  // Another fallback - look for any track with automation envelopes
  if (!mainTrack) {
    const tracks = getNestedValue(xmlRoot, 'Ableton.LiveSet.Tracks');
    if (tracks) {
      // Look through all tracks to find one with automation envelopes
      const trackTypes = ['AudioTrack', 'MidiTrack', 'ReturnTrack'];
      for (const trackType of trackTypes) {
        const trackArray = getNestedValue(tracks, trackType);
        if (trackArray) {
          const tracksList = Array.isArray(trackArray) ? trackArray : [trackArray];
          for (const track of tracksList) {
            if (getNestedValue(track, 'AutomationEnvelopes')) {
              mainTrack = track;
              break;
            }
          }
          if (mainTrack) break;
        }
      }
    }
  }

  if (!mainTrack) {
    // Return default tempo instead of throwing error for older files
    return {
      initialTempo: 120,
      tempoChanges: [],
    };
  }

  const envelopes = getNestedValue(mainTrack, 'AutomationEnvelopes.Envelopes.AutomationEnvelope');

  if (!envelopes) {
    return {
      initialTempo: 120, // Default tempo
      tempoChanges: [],
    };
  }

  // Find the tempo envelope (PointeeId === 8)
  const envelopeArray = Array.isArray(envelopes) ? envelopes : [envelopes];
  const tempoEnvelope = envelopeArray.find(
    e => getNestedValue(e, 'EnvelopeTarget.PointeeId.@_Value') === 8
  );

  if (!tempoEnvelope) {
    return {
      initialTempo: 120,
      tempoChanges: [],
    };
  }

  // Extract FloatEvents (tempo changes)
  const events = getNestedValue(tempoEnvelope, 'Automation.Events.FloatEvent');

  if (!events) {
    return {
      initialTempo: 120,
      tempoChanges: [],
    };
  }

  const eventArray = Array.isArray(events) ? events : [events];
  const tempoChanges = parseTempoChanges(eventArray);
  const initialTempo = findInitialTempo(tempoChanges);

  return {
    initialTempo,
    tempoChanges,
  };
}

/**
 * Find the initial tempo from tempo changes.
 * Initial tempo is marked with time = -63072000.
 *
 * @param changes - Array of tempo changes
 * @returns The initial tempo BPM
 */
function findInitialTempo(changes: TempoChange[]): number {
  const initial = changes.find(c => c.time === -63072000);
  return initial ? initial.bpm : 120;
}

/**
 * Parse FloatEvent elements into TempoChange objects.
 *
 * @param events - Array of FloatEvent objects
 * @returns Array of parsed tempo changes
 */
function parseTempoChanges(events: any[]): TempoChange[] {
  return events.map(e => ({
    time: parseFloat(e['@_Time'] || '0'),
    bpm: Math.round(parseFloat(e['@_Value'] || '120') * 100) / 100, // Round to 2 decimal places
  }));
}
