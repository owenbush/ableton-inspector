/**
 * Tests for sample extraction
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { Inspector } from '../../src/index.js';

describe('Sample Extractor', () => {
  test('should extract samples from Broom Bap project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    assert.ok(samples, 'Should return sample info');
    assert.strictEqual(samples.totalSamples, 23, 'Should have 23 total samples');
    assert.strictEqual(samples.spliceSamples, 11, 'Should have 11 Splice samples');
    assert.ok(Array.isArray(samples.samples), 'Should have samples array');
  });

  test('should extract samples from Techno Live Set project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Techno Live Set.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    assert.ok(samples, 'Should return sample info');
    assert.strictEqual(samples.totalSamples, 6, 'Should have 6 total samples');
    assert.strictEqual(samples.spliceSamples, 0, 'Should have 0 Splice samples');
    assert.ok(Array.isArray(samples.samples), 'Should have samples array');
  });

  test('should filter audio samples and exclude devices', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Techno Live Set.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    // All samples should have audio file extensions
    const allHaveAudioExtension = samples.samples.every(s => {
      const ext = s.filename.toLowerCase().split('.').pop();
      return ['wav', 'aif', 'aiff', 'mp3', 'flac', 'ogg', 'm4a', 'aac'].includes(ext || '');
    });

    assert.ok(allHaveAudioExtension, 'All samples should have audio file extensions');

    // None should be device files
    const noneAreDevices = samples.samples.every(s => {
      const lower = s.filename.toLowerCase();
      return !lower.endsWith('.adv') && !lower.endsWith('.adg') && !lower.endsWith('.amxd');
    });

    assert.ok(noneAreDevices, 'Should not include device files');
  });

  test('should identify Splice samples correctly', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    const spliceSamples = samples.samples.filter(s => s.isSplice);
    assert.strictEqual(spliceSamples.length, 11, 'Should identify 11 Splice samples');

    // All Splice samples should have pack names
    const allHavePackNames = spliceSamples.every(s => s.packName && s.packName.length > 0);
    assert.ok(allHavePackNames, 'All Splice samples should have pack names');
  });

  test('should deduplicate samples', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    // Check for unique paths
    const paths = samples.samples.map(s => s.fullPath);
    const uniquePaths = new Set(paths);

    assert.strictEqual(
      paths.length,
      uniquePaths.size,
      'All sample paths should be unique (no duplicates)'
    );
  });

  test('should support splice-only filter', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples({ spliceOnly: true });

    assert.strictEqual(samples.totalSamples, 11, 'Should only have Splice samples');
    assert.strictEqual(samples.spliceSamples, 11, 'All should be Splice samples');

    // All returned samples should be marked as Splice
    const allAreSplice = samples.samples.every(s => s.isSplice);
    assert.ok(allAreSplice, 'All returned samples should be Splice samples');
  });

  test('should extract samples from Fascination project (Live 11)', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Fascination.als');
    const inspector = await Inspector.fromFile(alsPath);
    const samples = inspector.extractSamples();

    assert.ok(samples, 'Should return sample info');
    assert.strictEqual(samples.totalSamples, 5, 'Should have 5 total samples');
    assert.strictEqual(samples.spliceSamples, 1, 'Should have 1 Splice sample');
    assert.ok(Array.isArray(samples.samples), 'Should have samples array');

    // Check that the Splice sample is correctly identified
    const spliceSamples = samples.samples.filter(s => s.isSplice);
    assert.strictEqual(spliceSamples.length, 1, 'Should have exactly 1 Splice sample');
    assert.ok(spliceSamples[0].packName, 'Splice sample should have a pack name');
  });
});
