import { describe, expect, it, vi } from 'vitest';

import { copyToClipboard } from './copyToClipboard';

describe('copyToClipboard', () => {
  it('should copy text using clipboard API when available', async () => {
    const mockWriteText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });

    const text = 'test text';
    await copyToClipboard(text);

    expect(mockWriteText).toHaveBeenCalledWith(text);
  });

  it('should use fallback when clipboard API is not available', async () => {
    // Mock clipboard API to throw error
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject() },
    });

    const mockAppend = vi.fn();
    const mockRemove = vi.fn();
    const mockSelect = vi.fn();
    const mockFocus = vi.fn();

    const mockTextArea = {
      focus: mockFocus,
      remove: mockRemove,
      select: mockSelect,
      value: '',
    };

    vi.spyOn(document, 'createElement').mockImplementation(() => mockTextArea as any);
    vi.spyOn(document.body, 'append').mockImplementation(mockAppend);

    // Mock document.execCommand
    const execCommandSpy = vi.fn();
    document.execCommand = execCommandSpy;

    const text = 'test text';
    await copyToClipboard(text);

    expect(mockTextArea.value).toBe(text);
    expect(mockAppend).toHaveBeenCalledWith(mockTextArea);
    expect(mockFocus).toHaveBeenCalled();
    expect(mockSelect).toHaveBeenCalled();
    expect(execCommandSpy).toHaveBeenCalledWith('copy');
    expect(mockRemove).toHaveBeenCalled();
  });

  it('should handle empty string', async () => {
    const mockWriteText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });

    await copyToClipboard('');
    expect(mockWriteText).toHaveBeenCalledWith('');
  });
});
