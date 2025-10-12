/**
 * Text formatters for CLI output.
 * Pretty-prints extraction results with colors and emojis.
 */

import chalk from 'chalk';
import type { AbletonProject } from '@owenbush/ableton-inspector-core';

export function formatResults(
  data: AbletonProject,
  options: { colorize?: boolean; showAllSamples?: boolean } = {}
): string {
  const color = options.colorize !== false;
  const showAll = options.showAllSamples || false;
  let output = '';

  // Header
  output += color ? chalk.bold.cyan(`\n📁 ${data.file}\n`) : `\n${data.file}\n`;
  output += '='.repeat(60) + '\n';

  // Tempo
  if (data.tempo) {
    output += color ? chalk.bold('\n🎵 TEMPO\n') : '\nTEMPO\n';
    output += color
      ? `  Initial Tempo: ${chalk.cyan(data.tempo.initialTempo + ' BPM')}\n`
      : `  Initial Tempo: ${data.tempo.initialTempo} BPM\n`;

    if (data.tempo.tempoChanges.length > 1) {
      output += `  Tempo Changes: ${data.tempo.tempoChanges.length}\n`;
    } else {
      output += color ? chalk.dim('  No tempo automation\n') : '  No tempo automation\n';
    }
  }

  // Scale
  if (data.scale) {
    output += color ? chalk.bold('\n🎹 SCALE\n') : '\nSCALE\n';

    if (data.scale.uniqueScales.length === 0) {
      output += color
        ? chalk.dim('  No scale information found\n')
        : '  No scale information found\n';
    } else if (data.scale.uniqueScales.length === 1) {
      const scale = data.scale.uniqueScales[0];
      output += color
        ? `  Key: ${chalk.cyan(scale.root + ' ' + scale.scale)}\n`
        : `  Key: ${scale.root} ${scale.scale}\n`;
    } else {
      output += `  Multiple Scales (${data.scale.uniqueScales.length}):\n`;
      for (const [scaleName, count] of Object.entries(data.scale.distribution)) {
        output += color
          ? `    ${chalk.cyan(scaleName)}: ${count} occurrences\n`
          : `    ${scaleName}: ${count} occurrences\n`;
      }
    }
  }

  // Samples
  if (data.samples) {
    output += color ? chalk.bold('\n🔊 SAMPLES\n') : '\nSAMPLES\n';
    output += `  Total Samples: ${color ? chalk.cyan(data.samples.totalSamples) : data.samples.totalSamples}\n`;
    output += `  Splice Samples: ${color ? chalk.cyan(data.samples.spliceSamples) : data.samples.spliceSamples}\n`;

    if (showAll && data.samples.samples.length > 0) {
      output += color ? chalk.dim('\n  All Samples:\n') : '\n  All Samples:\n';

      data.samples.samples.forEach(s => {
        const marker = s.isSplice ? (color ? chalk.green('●') : '●') : color ? chalk.dim('○') : '○';
        output += `    ${marker} ${s.filename}`;

        if (s.packName) {
          output += color ? chalk.dim(` (${s.packName})`) : ` (${s.packName})`;
        }
        output += '\n';
      });
    } else if (data.samples.spliceSamples > 0) {
      output += color ? chalk.dim('\n  Splice Sample List:\n') : '\n  Splice Sample List:\n';
      const spliceSamples = data.samples.samples.filter(s => s.isSplice);

      spliceSamples.forEach(s => {
        output += color ? `    ${chalk.green('•')} ${s.filename}` : `    • ${s.filename}`;

        if (s.packName) {
          output += color ? chalk.dim(` (${s.packName})`) : ` (${s.packName})`;
        }
        output += '\n';
      });
    }

    if (data.samples.searchedPaths && data.samples.searchedPaths.length > 0) {
      output += color ? chalk.dim('\n  Custom Splice Paths:\n') : '\n  Custom Splice Paths:\n';
      data.samples.searchedPaths.forEach(path => {
        output += `    - ${path}\n`;
      });
    }
  }

  output += '\n';
  return output;
}
