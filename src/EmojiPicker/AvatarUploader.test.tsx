import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/Toast';
import { __resetToastHostRegistryForTests } from '@/Toast/hostGuard';
import { __resetToastStateForTests } from '@/Toast/imperative';

import AvatarUploader from './AvatarUploader';

const dropFile = (file: File) => {
  fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } });
};

beforeEach(() => {
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
  __resetToastHostRegistryForTests();
  __resetToastStateForTests();
});

describe('AvatarUploader', () => {
  it('rejects unsupported file types with an error toast', async () => {
    render(<AvatarUploader texts={{ fileTypeError: 'bad type' }} onChange={vi.fn()} />);

    dropFile(new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' }));

    expect(await screen.findByText('bad type')).toBeTruthy();
  });

  it('reads supported images without an error toast', async () => {
    const error = vi.spyOn(toast, 'error');
    const readAsDataURL = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(() => {});
    render(<AvatarUploader texts={{ fileTypeError: 'bad type' }} onChange={vi.fn()} />);

    const file = new File(['png'], 'a.png', { type: 'image/png' });
    dropFile(file);

    await vi.waitFor(() => expect(readAsDataURL).toHaveBeenCalledWith(file));
    expect(error).not.toHaveBeenCalled();
  });
});
