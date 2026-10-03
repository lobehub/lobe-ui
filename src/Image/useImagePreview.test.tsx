import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';

import { useImagePreview } from './useImagePreview';
import { openPreview } from './viewer/registry';

vi.mock('./viewer/registry', () => ({
  openPreview: vi.fn(),
  usePreviewSession: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const Harness = ({ src }: { src?: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const { open, outlet } = useImagePreview(imgRef, { src });
  return (
    <>
      <img alt="doc" ref={imgRef} src="https://example.com/thumb.png" />
      <button type="button" onClick={open}>
        zoom
      </button>
      {outlet}
    </>
  );
};

describe('useImagePreview', () => {
  it('opens the viewer anchored to the referenced img with resolved defaults', () => {
    render(<Harness src="https://example.com/full.png" />);
    fireEvent.click(screen.getByText('zoom'));

    expect(openPreview).toHaveBeenCalledTimes(1);
    const [entry, entries] = (openPreview as any).mock.calls[0];
    expect(entry.element).toBe(screen.getByAltText('doc'));
    expect(entry.src).toBe('https://example.com/thumb.png');
    expect(entry.previewSrc).toBe('https://example.com/full.png');
    expect(entry.options.defaultZoom).toBe('auto');
    expect(entry.options.maxScale).toBeGreaterThan(0);
    expect(entries).toBeUndefined();
  });

  it('does nothing when the ref has no element yet', () => {
    const NoImg = () => {
      const imgRef = useRef<HTMLImageElement>(null);
      const { open } = useImagePreview(imgRef);
      return (
        <button type="button" onClick={open}>
          zoom
        </button>
      );
    };
    render(<NoImg />);
    fireEvent.click(screen.getByText('zoom'));

    expect(openPreview).not.toHaveBeenCalled();
  });
});
