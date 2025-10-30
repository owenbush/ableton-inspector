/**
 * Clipboard utility functions for copying text to clipboard
 */

export interface ClipboardResult {
  success: boolean;
  error?: string;
}

/**
 * Copy text to clipboard with fallback support for older browsers
 */
export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true };
    } else {
      return { success: false, error: 'Copy command failed' };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
};

/**
 * Copy sample names as a simple text list (one per line)
 */
export const copySampleList = async (
  samples: Array<{ filename: string }>
): Promise<ClipboardResult> => {
  if (samples.length === 0) {
    return { success: false, error: 'No samples to copy' };
  }

  const sampleNames = samples.map(sample => sample.filename).join('\n');
  return await copyToClipboard(sampleNames);
};
