/**
 * Tempo extractor for Ableton Live Set files.
 * Extracts initial tempo and tempo automation changes.
 */
import { getNestedValue } from '../utils/xml-parser.js';
/**
 * Extract tempo information from parsed XML.
 *
 * @param xmlRoot - Parsed XML root object
 * @returns Tempo information including initial tempo and changes
 */
export function extractTempo(xmlRoot) {
    // Navigate to MainTrack > AutomationEnvelopes
    const mainTrack = getNestedValue(xmlRoot, 'Ableton.LiveSet.MainTrack');
    if (!mainTrack) {
        throw new Error('No MainTrack found in the Ableton Live Set');
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
    const tempoEnvelope = envelopeArray.find(e => getNestedValue(e, 'EnvelopeTarget.PointeeId.@_Value') === 8);
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
function findInitialTempo(changes) {
    const initial = changes.find(c => c.time === -63072000);
    return initial ? initial.bpm : 120;
}
/**
 * Parse FloatEvent elements into TempoChange objects.
 *
 * @param events - Array of FloatEvent objects
 * @returns Array of parsed tempo changes
 */
function parseTempoChanges(events) {
    return events.map(e => ({
        time: parseFloat(e['@_Time'] || '0'),
        bpm: parseFloat(e['@_Value'] || '120'),
    }));
}
//# sourceMappingURL=tempo.js.map