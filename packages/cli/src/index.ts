#!/usr/bin/env node

/**
 * Ableton Inspector CLI
 * Command-line tool to extract information from Ableton Live Set files.
 */

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from 'fs/promises';
import { Inspector } from '@owenbush/ableton-inspector-core';
import type { SampleOptions, AbletonProject } from '@owenbush/ableton-inspector-core';
import { loadConfig } from './config.js';
import { formatResults } from './formatters/text.js';

interface CLIOptions {
  tempo?: boolean;
  scale?: boolean;
  samples?: boolean;
  spliceOnly?: boolean;
  showAllSamples?: boolean;
  splicePath?: string;
  splicePaths?: string;
  config?: string;
  json?: boolean;
  output?: string;
  color?: boolean;
  verbose?: boolean;
  quiet?: boolean;
}

async function main() {
  program
    .name('ableton-inspector')
    .description('Extract information from Ableton Live Set files')
    .version('1.0.0')
    .argument('<file>', '.als file to inspect')

    // What to extract
    .option('--tempo', 'Extract tempo information')
    .option('--scale', 'Extract scale information')
    .option('--samples', 'Extract sample information')
    .option('--all', 'Extract all information (default)')

    // Sample options
    .option('--splice-only', 'Only show Splice samples')
    .option('--show-all-samples', 'Show complete list of all samples in output')
    .option('--splice-path <path>', 'Custom Splice folder location')
    .option('--splice-paths <paths>', 'Multiple Splice paths (comma-separated)')
    .option('--config <file>', 'Load configuration from file')

    // Output options
    .option('--json', 'Output as JSON')
    .option('-o, --output <file>', 'Write output to file')
    .option('--no-color', 'Disable colored output')
    .option('--verbose', 'Verbose output')
    .option('--quiet', 'Minimal output')

    .action(async (file: string, options: CLIOptions) => {
      try {
        await inspect(file, options);
      } catch (error) {
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
      }
    });

  program.parse();
}

async function inspect(file: string, options: CLIOptions) {
  // Load configuration
  const config = await loadConfig(options.config);

  // Merge CLI options with config
  const splicePaths: string[] = [
    ...(options.splicePath ? [options.splicePath] : []),
    ...(options.splicePaths ? options.splicePaths.split(',').map(p => p.trim()) : []),
    ...(config?.samplePaths?.splice || []),
  ];

  // Determine what to extract
  const extractAll = !options.tempo && !options.scale && !options.samples;
  const shouldExtractTempo = extractAll || options.tempo;
  const shouldExtractScale = extractAll || options.scale;
  const shouldExtractSamples = extractAll || options.samples;

  // Create spinner (unless quiet mode)
  const spinner = options.quiet ? null : ora('Loading project...').start();

  try {
    // Load and parse file
    if (spinner) spinner.text = 'Reading .als file...';
    const inspector = await Inspector.fromFile(file);

    if (spinner) spinner.text = 'Extracting data...';

    // Build result object
    const result: AbletonProject = {
      file,
    };

    // Extract requested data
    if (shouldExtractTempo) {
      result.tempo = inspector.extractTempo();
    }

    if (shouldExtractScale) {
      result.scale = inspector.extractScale();
    }

    if (shouldExtractSamples) {
      const sampleOptions: SampleOptions = {
        splicePaths: splicePaths.length > 0 ? splicePaths : undefined,
        spliceOnly: options.spliceOnly || false,
      };
      result.samples = inspector.extractSamples(sampleOptions);
    }

    if (spinner) spinner.succeed('Extraction complete');

    // Output results
    if (options.json) {
      const jsonOutput = JSON.stringify(result, null, 2);

      if (options.output) {
        await writeFile(options.output, jsonOutput, 'utf-8');
        console.log(chalk.green(`✓ Saved to ${options.output}`));
      } else {
        console.log(jsonOutput);
      }
    } else {
      // Text output
      const textOutput = formatResults(result, {
        colorize: options.color !== false,
        showAllSamples: options.showAllSamples || false,
      });

      if (options.output) {
        await writeFile(options.output, textOutput, 'utf-8');
        console.log(chalk.green(`✓ Saved to ${options.output}`));
      } else {
        console.log(textOutput);
      }
    }
  } catch (error) {
    if (spinner) spinner.fail('Error processing file');
    throw error;
  }
}

main();
