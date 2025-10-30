import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, copySampleList } from '../clipboard';

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

// Mock document.execCommand
const mockExecCommand = vi.fn();
Object.defineProperty(document, 'execCommand', {
  value: mockExecCommand,
  writable: true,
});

describe('clipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should copy text using modern clipboard API', async () => {
      mockWriteText.mockResolvedValue(undefined);

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard API errors', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard access denied'));

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Clipboard access denied');
    });

    it('should fallback to execCommand when clipboard API fails', async () => {
      // Mock clipboard API not available
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      mockExecCommand.mockReturnValue(true);

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(true);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });

    it('should handle execCommand failure', async () => {
      // Mock clipboard API not available
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      mockExecCommand.mockReturnValue(false);

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Copy command failed');
    });
  });

  describe('copySampleList', () => {
    it('should copy sample filenames as newline-separated text', async () => {
      mockWriteText.mockResolvedValue(undefined);

      const samples = [
        { filename: 'kick.wav' },
        { filename: 'snare.wav' },
        { filename: 'hihat.wav' }
      ];

      const result = await copySampleList(samples);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('kick.wav\nsnare.wav\nhihat.wav');
    });

    it('should handle empty sample list', async () => {
      const result = await copySampleList([]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No samples to copy');
    });

    it('should handle single sample', async () => {
      mockWriteText.mockResolvedValue(undefined);

      const samples = [{ filename: 'single.wav' }];

      const result = await copySampleList(samples);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('single.wav');
    });

    it('should propagate clipboard errors', async () => {
      mockWriteText.mockRejectedValue(new Error('Permission denied'));

      const samples = [{ filename: 'test.wav' }];

      const result = await copySampleList(samples);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });
});



