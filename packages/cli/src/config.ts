/**
 * Configuration file loader using cosmiconfig.
 */

import { cosmiconfig } from 'cosmiconfig';

export interface Config {
  samplePaths?: {
    splice?: string[];
    custom?: string[];
  };
  output?: {
    format?: 'text' | 'json';
    colorize?: boolean;
    verbose?: boolean;
  };
  defaults?: {
    extractTempo?: boolean;
    extractScale?: boolean;
    extractSamples?: boolean;
  };
}

/**
 * Load configuration from file system.
 * Searches for config files in standard locations.
 *
 * @param configPath - Optional explicit config file path
 * @returns Configuration object or null if not found
 */
export async function loadConfig(configPath?: string): Promise<Config | null> {
  const explorer = cosmiconfig('abletoninspector');

  try {
    const result = configPath ? await explorer.load(configPath) : await explorer.search();

    return result?.config || null;
  } catch (error) {
    // Config file not found or invalid - that's okay
    return null;
  }
}
