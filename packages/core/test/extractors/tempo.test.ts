/**
 * Tests for tempo extraction
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { Inspector } from '../../src/index.js';

describe('Tempo Extractor', () => {
  test('should extract tempo from Broom Bap project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Broom Bap.als');
    const inspector = await Inspector.fromFile(alsPath);
    const tempo = inspector.extractTempo();

    assert.strictEqual(tempo.initialTempo, 88, 'Initial tempo should be 88 BPM');
    assert.ok(Array.isArray(tempo.tempoChanges), 'Should have tempoChanges array');
    assert.strictEqual(tempo.tempoChanges.length, 1, 'Should have 1 tempo value');
  });

  test('should extract tempo from Techno Live Set project', async () => {
    const alsPath = join(process.cwd(), 'test/fixtures', 'Techno Live Set.als');
    const inspector = await Inspector.fromFile(alsPath);
    const tempo = inspector.extractTempo();

    assert.strictEqual(tempo.initialTempo, 124, 'Initial tempo should be 124 BPM');
    assert.ok(Array.isArray(tempo.tempoChanges), 'Should have tempoChanges array');
    assert.strictEqual(tempo.tempoChanges.length, 1, 'Should have 1 tempo value');
  });
});
