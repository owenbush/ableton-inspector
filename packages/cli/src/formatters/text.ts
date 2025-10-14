/**
 * Text formatters for CLI output.
 * Pretty-prints extraction results with colors and emojis.
 */

import chalk from 'chalk';
import type { AbletonProject, Sample, Locator, Track } from '@owenbush/ableton-inspector-core';

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

      data.samples.samples.forEach((s: Sample) => {
        const marker = s.isSplice ? (color ? chalk.green('●') : '●') : color ? chalk.dim('○') : '○';
        output += `    ${marker} ${s.filename}`;

        if (s.packName) {
          output += color ? chalk.dim(` (${s.packName})`) : ` (${s.packName})`;
        }
        output += '\n';
      });
    } else if (data.samples.spliceSamples > 0) {
      output += color ? chalk.dim('\n  Splice Sample List:\n') : '\n  Splice Sample List:\n';
      const spliceSamples = data.samples.samples.filter((s: Sample) => s.isSplice);

      spliceSamples.forEach((s: Sample) => {
        output += color ? `    ${chalk.green('•')} ${s.filename}` : `    • ${s.filename}`;

        if (s.packName) {
          output += color ? chalk.dim(` (${s.packName})`) : ` (${s.packName})`;
        }
        output += '\n';
      });
    }

    if (data.samples.searchedPaths && data.samples.searchedPaths.length > 0) {
      output += color ? chalk.dim('\n  Custom Splice Paths:\n') : '\n  Custom Splice Paths:\n';
      data.samples.searchedPaths.forEach((path: string) => {
        output += `    - ${path}\n`;
      });
    }
  }

  // Locators
  if (data.locators) {
    output += color ? chalk.bold('\n📍 LOCATORS\n') : '\nLOCATORS\n';
    output += `  Total Locators: ${color ? chalk.cyan(data.locators.totalLocators) : data.locators.totalLocators}\n`;

    if (data.locators.locators.length > 0) {
      output += color ? chalk.dim('\n  Arrangement Markers:\n') : '\n  Arrangement Markers:\n';
              data.locators.locators.forEach((locator: Locator) => {
                const timeStr = formatTime(locator.time);
                const durationStr = locator.durationText ? ` (${locator.durationText})` : '';
                output += color
                  ? `    ${chalk.cyan(timeStr)} - ${chalk.bold(locator.name)}${durationStr}${locator.annotation ? chalk.dim(` (${locator.annotation})`) : ''}\n`
                  : `    ${timeStr} - ${locator.name}${durationStr}${locator.annotation ? ` (${locator.annotation})` : ''}\n`;
              });
    }
  }

  // Time Signature
  if (data.timeSignature) {
    output += color ? chalk.bold('\n🎼 TIME SIGNATURE\n') : '\nTIME SIGNATURE\n';
    const ts = data.timeSignature.initialTimeSignature;
    output += color
      ? `  Initial: ${chalk.cyan(ts.numerator + '/' + ts.denominator)}\n`
      : `  Initial: ${ts.numerator}/${ts.denominator}\n`;

    if (data.timeSignature.hasChanges) {
      output += `  Changes: ${data.timeSignature.changes.length}\n`;
      data.timeSignature.changes.forEach(change => {
        const timeStr = formatTime(change.time);
        output += color
          ? `    ${chalk.cyan(timeStr)}: ${change.numerator}/${change.denominator}\n`
          : `    ${timeStr}: ${change.numerator}/${change.denominator}\n`;
      });
    } else {
      output += color ? chalk.dim('  No time signature changes\n') : '  No time signature changes\n';
    }
  }

  // Track Types
  if (data.trackTypes) {
    output += color ? chalk.bold('\n🎛️  TRACKS\n') : '\nTRACKS\n';
    const summary = data.trackTypes.summary;
    output += `  Audio: ${color ? chalk.cyan(summary.audio) : summary.audio}\n`;
    output += `  MIDI: ${color ? chalk.cyan(summary.midi) : summary.midi}\n`;
    output += `  Return: ${color ? chalk.cyan(summary.return) : summary.return}\n`;
    output += `  Master: ${color ? chalk.cyan(summary.master) : summary.master}\n`;
    output += `  Total: ${color ? chalk.bold.cyan(summary.total) : summary.total}\n`;

    if (data.trackTypes.tracks.length > 0) {
      output += color ? chalk.dim('\n  Track List:\n') : '\n  Track List:\n';
      data.trackTypes.tracks.forEach((track: Track) => {
        const typeIcon = getTrackIcon(track.type);
        const name = track.userDefinedName || track.name;
        output += color
          ? `    ${typeIcon} ${chalk.bold(name)} (${chalk.dim(track.type)})\n`
          : `    ${typeIcon} ${name} (${track.type})\n`;
      });
    }
  }


  output += '\n';
  return output;
}

function formatTime(time: number): string {
  const bars = Math.floor(time / 4);
  const beats = Math.floor(time % 4);
  return `${bars}:${beats}`;
}

function getTrackIcon(type: string): string {
  const icons: Record<string, string> = {
    'audio': '🎵',
    'midi': '🎹',
    'return': '🔄',
    'master': '🎚️'
  };
  return icons[type] || '📀';
}

function getDeviceIcon(type: string): string {
  const icons: Record<string, string> = {
    'native': '🔧',
    'vst': '🔌',
    'au': '🍎',
    'max': '⚡',
    'unknown': '❓'
  };
  return icons[type] || '❓';
}
