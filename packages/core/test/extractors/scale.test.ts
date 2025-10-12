/**
 * Tests for scale extraction
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { Inspector } from '../../src/index.js';

describe('Scale Extractor', () => {
  test('should extract scale from Broom Bap project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const scale = inspector.extractScale();

    assert.ok(scale, 'Should return scale info');
    assert.ok(Array.isArray(scale.uniqueScales), 'Should have uniqueScales array');
    assert.strictEqual(scale.uniqueScales.length, 2, 'Should have 2 unique scales');

    // Check for B Minor and C Major
    const scales = scale.uniqueScales.map(s => `${s.root} ${s.scale}`);
    assert.ok(scales.includes('B Minor'), 'Should include B Minor');
    assert.ok(scales.includes('C Major'), 'Should include C Major');

    // Check distribution
    assert.ok(scale.distribution, 'Should have distribution');
    assert.ok(scale.distribution['B Minor'] > 0, 'B Minor should have occurrences');
    assert.ok(scale.distribution['C Major'] > 0, 'C Major should have occurrences');
  });

  test('should extract scale from Techno Live Set project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Techno Live Set.als');
    const inspector = await Inspector.fromFile(alsPath);
    const scale = inspector.extractScale();

    assert.ok(scale, 'Should return scale info');
    assert.ok(Array.isArray(scale.uniqueScales), 'Should have uniqueScales array');
    assert.strictEqual(scale.uniqueScales.length, 1, 'Should have 1 unique scale');

    // Check for C Major
    const scaleInfo = scale.uniqueScales[0];
    assert.strictEqual(scaleInfo.root, 'C', 'Root should be C');
    assert.strictEqual(scaleInfo.scale, 'Major', 'Scale should be Major');
  });
});
