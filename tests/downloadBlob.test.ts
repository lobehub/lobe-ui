import { describe, expect, it, vi } from 'vitest';

import { downloadBlob } from '../src/utils/downloadBlob';

describe('downloadBlob', () => {
  it('should create and click download link', async () => {
    const mockAppendChild = vi.fn();
    const mockClick = vi.fn();

    const mockLink = {
      click: mockClick,
      download: '',
      href: '',
      remove: vi.fn(),
      style: {
        display: '',
      },
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    vi.spyOn(document.body, 'append').mockImplementation(mockAppendChild);

    const blobUrl = 'blob:test';
    const fileName = 'test.txt';

    await downloadBlob(blobUrl, fileName);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe(blobUrl);
    expect(mockLink.download).toBe(fileName);
    expect(mockLink.style.display).toBe('none');
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
    expect(mockClick).toHaveBeenCalled();
    expect(mockLink.remove).toHaveBeenCalled();
  });

  it('should reject on error', async () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(downloadBlob('blob:test', 'test.txt')).rejects.toThrow('Test error');
  });
});
