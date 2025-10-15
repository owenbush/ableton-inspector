/**
 * Tests for Live 11 compatibility
 * Ensures all extractors work with older Ableton Live versions
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { Inspector } from '../../src/index.js';

describe('Live 11 Compatibility', () => {
  test('should extract all data from Fascination project (Live 11)', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Fascination.als');
    const inspector = await Inspector.fromFile(alsPath);

    // Test tempo extraction
    const tempo = inspector.extractTempo();
    assert.strictEqual(tempo.initialTempo, 93, 'Should extract tempo from Live 11 project');
    assert.ok(Array.isArray(tempo.tempoChanges), 'Should have tempoChanges array');

    // Test scale extraction
    const scale = inspector.extractScale();
    assert.ok(scale, 'Should return scale info (even if empty)');
    assert.ok(Array.isArray(scale.uniqueScales), 'Should have uniqueScales array');

    // Test samples extraction
    const samples = inspector.extractSamples();
    assert.ok(samples, 'Should return sample info');
    assert.strictEqual(samples.totalSamples, 5, 'Should extract samples from Live 11 project');
    assert.strictEqual(samples.spliceSamples, 1, 'Should identify Splice samples');

    // Test locators extraction
    const locators = inspector.extractLocators();
    assert.ok(locators, 'Should return locators info');
    assert.strictEqual(locators.totalLocators, 0, 'Should handle empty locators');
    assert.ok(Array.isArray(locators.locators), 'Should have locators array');

    // Test time signature extraction
    const timeSignature = inspector.extractTimeSignature();
    assert.ok(timeSignature, 'Should return time signature info');
    assert.strictEqual(timeSignature.initialTimeSignature.numerator, 4, 'Should extract time signature');
    assert.strictEqual(timeSignature.initialTimeSignature.denominator, 4, 'Should extract time signature');

    // Test track types extraction
    const trackTypes = inspector.extractTrackTypes();
    assert.ok(trackTypes, 'Should return track types info');
    assert.strictEqual(trackTypes.summary.total, 14, 'Should extract all tracks from Live 11 project');
    assert.strictEqual(trackTypes.summary.audio, 4, 'Should identify audio tracks');
    assert.strictEqual(trackTypes.summary.midi, 6, 'Should identify MIDI tracks');
    assert.strictEqual(trackTypes.summary.return, 3, 'Should identify return tracks');
    assert.strictEqual(trackTypes.summary.master, 1, 'Should identify master track');
  });

  test('should handle Live 11 projects without throwing errors', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Fascination.als');
    const inspector = await Inspector.fromFile(alsPath);

    // All extractors should work without throwing errors
    assert.doesNotThrow(() => inspector.extractTempo(), 'Tempo extraction should not throw');
    assert.doesNotThrow(() => inspector.extractScale(), 'Scale extraction should not throw');
    assert.doesNotThrow(() => inspector.extractSamples(), 'Samples extraction should not throw');
    assert.doesNotThrow(() => inspector.extractLocators(), 'Locators extraction should not throw');
    assert.doesNotThrow(() => inspector.extractTimeSignature(), 'Time signature extraction should not throw');
    assert.doesNotThrow(() => inspector.extractTrackTypes(), 'Track types extraction should not throw');
  });

  test('should extract complete project data from Live 11', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Fascination.als');
    const inspector = await Inspector.fromFile(alsPath);
    const project = inspector.extractAll();

    // Verify all expected data is present
    assert.ok(project.tempo, 'Should have tempo data');
    assert.ok(project.scale, 'Should have scale data');
    assert.ok(project.samples, 'Should have samples data');
    // Note: locators may be empty for some projects, that's okay
    assert.ok(project.locators, 'Should have locators data (even if empty)');
    assert.ok(project.timeSignature, 'Should have time signature data');
    assert.ok(project.trackTypes, 'Should have track types data');

    // Verify specific values match expected Live 11 project data
    assert.strictEqual(project.tempo.initialTempo, 93, 'Should have correct tempo');
    assert.strictEqual(project.samples.totalSamples, 5, 'Should have correct sample count');
    assert.strictEqual(project.trackTypes.summary.total, 14, 'Should have correct track count');
  });
});
