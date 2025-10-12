/**
 * Musical constants for scale and note mappings.
 * Based on Ableton Live's scale system.
 */
// MIDI note mapping (0-11) matching Ableton's display.
export const NOTE_NAMES = [
    'C', // 0
    'C#/Db', // 1
    'D', // 2
    'D#/Eb', // 3
    'E', // 4
    'F', // 5
    'F#/Gb', // 6
    'G', // 7
    'G#/Ab', // 8
    'A', // 9
    'A#/Bb', // 10
    'B', // 11
];
// Scale types in Ableton Live (exact order from Ableton Live 12).
export const SCALE_NAMES = [
    'Major', // 0
    'Minor', // 1
    'Dorian', // 2
    'Mixolydian', // 3
    'Lydian', // 4
    'Phrygian', // 5
    'Locrian', // 6
    'Whole Tone', // 7
    'Half-whole Dim.', // 8
    'Whole-half Dim.', // 9
    'Minor Blues', // 10
    'Minor Pentatonic', // 11
    'Major Pentatonic', // 12
    'Harmonic Minor', // 13
    'Harmonic Major', // 14
    'Dorian #4', // 15
    'Phrygian Dominant', // 16
    'Melodic Minor', // 17
    'Lydian Augmented', // 18
    'Lydian Dominant', // 19
    'Super Locrian', // 20
    '8-Tone Spanish', // 21
    'Bhairav', // 22
    'Hungarian Minor', // 23
    'Hirajoshi', // 24
    'In-Sen', // 25
    'Iwato', // 26
    'Kumoi', // 27
    'Pelog Selisir', // 28
    'Pelog Tembung', // 29
    'Messiaen 3', // 30
    'Messiaen 4', // 31
    'Messiaen 5', // 32
    'Messiaen 6', // 33
    'Messiaen 7', // 34
];
// Default Splice path patterns for different operating systems.
export const DEFAULT_SPLICE_PATTERNS = [
    '/splice/sounds/packs/',
    '/splice/plugins/',
    '\\splice\\sounds\\packs\\',
    '\\splice\\plugins\\',
];
//# sourceMappingURL=scales.js.map