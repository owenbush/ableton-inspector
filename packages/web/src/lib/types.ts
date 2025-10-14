import type { AbletonProject } from '@owenbush/ableton-inspector-core';

export interface ExtractOptions {
  tempo: boolean;
  scale: boolean;
  samples: boolean;
  locators: boolean;
  timeSignature: boolean;
  trackTypes: boolean;
  spliceOnly: boolean;
  showAllSamples: boolean;
  customSplicePaths?: string[];
}

export interface ProcessingResult {
  success: boolean;
  data?: AbletonProject;
  error?: string;
  meta?: {
    processingTime: number;
    fileSize: string;
  };
}
